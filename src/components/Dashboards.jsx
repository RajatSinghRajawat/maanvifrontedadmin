import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Box, TextField, Button as MuiButton } from '@mui/material';
import {
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiMail,
  FiTarget,
  FiCalendar,
  FiShield,
  FiCheckSquare,
} from 'react-icons/fi';
import { api } from '../services/api';

const Dashboards = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [enquiryStats, setEnquiryStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [employeesRes, attendanceRes, enquiryStatsRes] = await Promise.all([
          api.getEmployees({ status: 'Active', limit: 1 }),
          api.getAttendanceStats(),
          api.getEnquiryStats(),
        ]);

        setEmployeeCount(
          employeesRes.total || employeesRes.count || employeesRes.data?.length || 0
        );
        setAttendanceStats(attendanceRes.data || null);
        setEnquiryStats(enquiryStatsRes.data || null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const attendanceRate = attendanceStats?.presentPercentage
      ? `${attendanceStats.presentPercentage}%`
      : '0%';
    const newEnquiries = enquiryStats?.new ?? 0;
    const totalEnquiries = enquiryStats?.total ?? 0;
    const resolvedEnquiries = enquiryStats?.resolved || 0;
    const pendingEnquiries = totalEnquiries - resolvedEnquiries;

    return [
      {
        label: 'Active Employees',
        value: String(employeeCount || 0),
        change: '+12 this week',
        icon: <FiUsers />,
      },
      {
        label: 'Attendance Rate',
        value: attendanceRate,
        change: 'On track',
        icon: <FiClock />,
      },
      {
        label: 'New Enquiries',
        value: String(newEnquiries),
        change: pendingEnquiries > 0 ? `${pendingEnquiries} pending` : 'Up to date',
        icon: <FiMail />,
      },
      {
        label: 'Tasks Completed',
        value: String(resolvedEnquiries),
        change: totalEnquiries ? 'Resolved enquiries' : '+18% vs last week',
        icon: <FiCheckSquare />,
      },
    ];
  }, [employeeCount, attendanceStats, enquiryStats]);

  const highlights = [
    { title: 'Hiring Pipeline', description: '6 candidates in final round', icon: <FiTrendingUp /> },
    { title: 'Training', description: 'Leadership cohort starts Monday', icon: <FiTarget /> },
    { title: 'Security', description: 'Access reviews due in 2 days', icon: <FiShield /> },
    { title: 'Calendar', description: '3 events scheduled today', icon: <FiCalendar /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Overview</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-500">Real-time snapshot of HR, attendance and enquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition"
          >
            New Announcement
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 text-xl">{item.icon}</div>
              <span className="text-xs font-semibold text-green-600">{item.change}</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 p-4 border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">People</p>
              <h3 className="text-lg font-semibold">Team health pulse</h3>
            </div>
            <span className="text-sm text-green-600 font-semibold">Healthy</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Presence</p>
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{
                    width: `${attendanceStats?.presentPercentage || 0}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {attendanceStats?.presentPercentage
                  ? `${attendanceStats.presentPercentage}% checked in`
                  : 'No data yet'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">SLA on enquiries</p>
                <span className="text-xs text-gray-500">This week</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${
                      enquiryStats && enquiryStats.total
                        ? Math.min(
                            100,
                            Math.round(((enquiryStats.resolved || 0) / enquiryStats.total) * 100)
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {enquiryStats && enquiryStats.total
                  ? `${Math.round(((enquiryStats.resolved || 0) / enquiryStats.total) * 100)}% resolved`
                  : 'No enquiries yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming today</h3>
            <span className="text-sm text-indigo-600 font-semibold cursor-pointer">View all</span>
          </div>
          <div className="space-y-3">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className="p-2 rounded-lg bg-white text-indigo-600 text-lg border border-gray-200">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-500">
          Loading dashboard...
        </div>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
          }}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Broadcast</p>
              <h3 className="text-xl font-semibold text-gray-900">New announcement</h3>
              <p className="text-sm text-gray-600">Share an update with your team.</p>
            </div>
            <TextField fullWidth label="Headline" size="small" />
            <TextField fullWidth label="Audience" size="small" defaultValue="All teams" />
            <TextField
              fullWidth
              label="Message"
              size="small"
              multiline
              minRows={3}
              placeholder="Write a concise update..."
            />
            <div className="flex justify-end gap-2">
              <MuiButton variant="outlined" onClick={() => setOpenModal(false)}>
                Cancel
              </MuiButton>
              <MuiButton variant="contained" onClick={() => setOpenModal(false)}>
                Send
              </MuiButton>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboards;

