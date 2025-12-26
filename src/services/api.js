const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }

  if (!res.ok) {
    const message = data?.error || data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
};

export const api = {
  // Admin APIs
  login: (payload) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCurrentAdmin: () => request('/admin/me'),
  
  // Employee APIs
  getEmployees: (params = {}) => request(`/employees${buildQuery(params)}`),
  getEmployeeMonthAttendance: (employeeId, month, year) =>
    request(`/attendance/employee/${employeeId}/month${buildQuery({ month, year })}`),
  setAttendance: (payload) =>
    request('/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteAttendance: (attendanceId) =>
    request(`/attendance/${attendanceId}`, {
      method: 'DELETE',
    }),
  getAttendanceStats: (params = {}) => request(`/attendance/stats/overview${buildQuery(params)}`),
  getEnquiries: (params = {}) => request(`/enquiries${buildQuery(params)}`),
  getEnquiryStats: (params = {}) => request(`/enquiries/stats/overview${buildQuery(params)}`),
  createEmployee: (payload) =>
    request('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default api;

