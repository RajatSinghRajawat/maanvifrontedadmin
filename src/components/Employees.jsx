import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiUser, FiMail } from 'react-icons/fi';
import { api } from '../services/api';
import { toast } from '../utils/toast';

const statusColors = {
  Active: 'bg-emerald-50 text-emerald-700',
  Probation: 'bg-amber-50 text-amber-700',
  Notice: 'bg-rose-50 text-rose-700',
  Inactive: 'bg-gray-100 text-gray-700',
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    phone: '',
    department: '',
    joiningDate: '',
    address: '',
  });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getEmployees({ search, status, limit: 100 });
      setEmployees(res.data || []);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch employees';
      setError(errorMessage);
      toast.error('Failed to load employees', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.role) {
      const errorMsg = 'Name, email, and role are required';
      setError(errorMsg);
      toast.warning('Validation Error', errorMsg);
      return;
    }
    setCreating(true);
    setError('');
    try {
      await api.createEmployee({
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        phone: form.phone || undefined,
        department: form.department || undefined,
        joiningDate: form.joiningDate || undefined,
        address: form.address || undefined,
      });
      toast.success('Employee created successfully', `${form.name} has been added to the system`);
      setShowCreateModal(false);
      setForm({
        name: '',
        email: '',
        role: '',
        status: 'Active',
        phone: '',
        department: '',
        joiningDate: '',
        address: '',
      });
      await fetchEmployees();
    } catch (err) {
      const errorMessage = err.message || 'Failed to create employee';
      setError(errorMessage);
      toast.error('Failed to create employee', errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">People</p>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Track roles, statuses and reach out instantly.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          <FiPlus />
          Add employee
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, role"
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All status</option>
          <option value="Active">Active</option>
          <option value="Probation">Probation</option>
          <option value="Notice">Notice</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={fetchEmployees}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold text-gray-600 px-4 py-3 uppercase tracking-wide">
          <span>Name</span>
          <span>Role</span>
          <span>Email</span>
          <span className="text-right">Status</span>
        </div>
        <div className="divide-y divide-gray-100">
          {loading && <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>}
          {!loading && employees.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">No employees found</div>
          )}
          {!loading &&
            employees.map((emp) => (
              <div key={emp._id || emp.email} className="grid grid-cols-4 items-center px-4 py-3 text-sm">
                <div className="flex items-center gap-3 font-semibold text-gray-900">
                  <span className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                    <FiUser />
                  </span>
                  {emp.name}
                </div>
                <span className="text-gray-700">{emp.role}</span>
                <span className="flex items-center gap-2 text-gray-600">
                  <FiMail className="text-indigo-500" />
                  {emp.email}
                </span>
                <span className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[emp.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {emp.status}
                  </span>
                </span>
              </div>
            ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Employee</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 font-semibold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="Role"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone (optional)"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                placeholder="Department (optional)"
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm((p) => ({ ...p, joiningDate: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Address (optional)"
                rows={2}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="Notice">Notice</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
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

export default Employees;

