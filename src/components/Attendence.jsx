import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiRefreshCcw, FiChevronLeft, FiChevronRight, FiCalendar, FiUser } from 'react-icons/fi';
import { api } from '../services/api';

const defaultStats = { present: 0, absent: 0, late: 0, wfh: 0, total: 0 };

const Attendence = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState({});
  const [monthStats, setMonthStats] = useState(defaultStats);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [addForm, setAddForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    location: '',
    notes: '',
  });

  const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    setError('');
    try {
      const res = await api.getEmployees({ limit: 200 });
      const list = res.data || [];
      setEmployees(list);
      if (!selectedEmployee && list[0]?._id) {
        setSelectedEmployee(list[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEmployees(false);
    }
  }, [selectedEmployee]);

  const fetchMonthAttendance = useCallback(async () => {
    if (!selectedEmployee) return;
    setLoadingAttendance(true);
    setError('');
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
      const res = await api.getEmployeeMonthAttendance(selectedEmployee, month, year);
      const map = {};
      (res.data || []).forEach((record) => {
        const date = new Date(record.date);
        map[dayKey(date)] = { status: record.status, id: record._id, location: record.location };
      });
      setAttendanceMap(map);
      setMonthStats(res.stats || defaultStats);
    } catch (err) {
      setError(err.message);
      setAttendanceMap({});
      setMonthStats(defaultStats);
    } finally {
      setLoadingAttendance(false);
    }
  }, [selectedEmployee, currentDate]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchMonthAttendance();
  }, [fetchMonthAttendance]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentDate]);

  const getAttendanceForDay = (date) => {
    if (!date) return null;
    return attendanceMap[dayKey(date)] || null;
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleDayClick = (date) => {
    if (!date || !selectedEmployee) return;
    setSelectedDay(date);
    setShowStatusModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Late':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'WFH':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleStatusSelect = async (status) => {
    if (!selectedDay || !selectedEmployee) return;
    setSaving(true);
    setError('');
    try {
      await api.setAttendance({
        employee: selectedEmployee,
        date: selectedDay.toISOString(),
        status,
      });
      await fetchMonthAttendance();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAttendance = async () => {
    if (!selectedEmployee || !addForm.date) {
      setError('Employee and date are required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      await api.setAttendance({
        employee: selectedEmployee,
        date: new Date(addForm.date).toISOString(),
        status: addForm.status,
        location: addForm.location || undefined,
        notes: addForm.notes || undefined,
      });
      await fetchMonthAttendance();
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleClearAttendance = async () => {
    if (!selectedDay || !selectedEmployee) {
      setShowStatusModal(false);
      return;
    }
    const key = dayKey(selectedDay);
    const record = attendanceMap[key];
    setSaving(true);
    setError('');
    try {
      if (record?.id) {
        await api.deleteAttendance(record.id);
      }
      await fetchMonthAttendance();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedEmployeeName = employees.find((e) => e._id === selectedEmployee)?.name || 'Employee';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Presence</p>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Set and view employee attendance for all months.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Add attendance
          </button>
          <button
            onClick={fetchMonthAttendance}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            <FiRefreshCcw />
            Refresh
          </button>
          {loadingEmployees || loadingAttendance ? <span className="text-gray-500">Loading...</span> : null}
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}

      {/* Employee and Month Selector */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FiUser className="inline mr-2" />
            Select Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loadingEmployees}
          >
            {employees.length === 0 && <option value="">No employees found</option>}
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} - {emp.role}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FiCalendar className="inline mr-2" />
            Select Month
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <FiChevronLeft />
            </button>
            <span className="flex-1 text-center font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">Present</p>
          <p className="text-3xl font-bold text-emerald-600">{monthStats.present}</p>
          <p className="text-sm text-gray-500">out of {monthStats.total} days</p>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">Absent</p>
          <p className="text-3xl font-bold text-rose-600">{monthStats.absent}</p>
          <p className="text-sm text-gray-500">Marked absent</p>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">Late</p>
          <p className="text-3xl font-bold text-amber-600">{monthStats.late}</p>
          <p className="text-sm text-gray-500">Late arrivals</p>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">WFH</p>
          <p className="text-3xl font-bold text-indigo-600">{monthStats.wfh}</p>
          <p className="text-sm text-gray-500">Work from home</p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {selectedEmployeeName}'s Attendance - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dayNames.map((day) => (
                <div key={day} className="p-3 text-center text-[11px] font-semibold text-gray-600 uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {daysInMonth.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="p-3 min-h-[74px] bg-gray-50"></div>;
                }

                const attendance = getAttendanceForDay(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isPast = date < new Date() && !isToday;

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => handleDayClick(date)}
                    className={`p-3 min-h-[74px] cursor-pointer hover:bg-gray-50 transition relative ${
                      isToday ? 'bg-indigo-50 border-2 border-indigo-300' : ''
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </div>
                    {attendance && (
                      <div className={`mt-1 px-2 py-1 rounded text-[11px] font-semibold border ${getStatusColor(attendance.status)}`}>
                        {attendance.status}
                      </div>
                    )}
                    {!attendance && isPast && (
                      <div className="mt-1 px-2 py-1 rounded text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        Not marked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Status Selection Modal */}
      {showStatusModal && selectedDay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Attendance</h3>
            <p className="text-sm text-gray-600 mb-6">
              {selectedDay.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {['Present', 'Absent', 'Late', 'WFH'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  disabled={saving}
                  className={`px-4 py-3 rounded-lg font-semibold transition border-2 ${getStatusColor(status)} hover:scale-105 disabled:opacity-60`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleClearAttendance}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
              >
                Clear
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Attendance</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 font-semibold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={addForm.date}
                onChange={(e) => setAddForm((p) => ({ ...p, date: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={addForm.status}
                onChange={(e) => setAddForm((p) => ({ ...p, status: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="WFH">WFH</option>
              </select>
              <input
                value={addForm.location}
                onChange={(e) => setAddForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Location (optional)"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={addForm.notes}
                onChange={(e) => setAddForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Notes (optional)"
                rows={3}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAttendance}
                disabled={creating}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {creating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendence;

