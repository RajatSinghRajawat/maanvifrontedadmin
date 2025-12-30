const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://maanvibackend.onrender.com';

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
    request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCurrentAdmin: () => request('/api/admin/me'),
  
  // Employee APIs
  getEmployees: (params = {}) => request(`/api/employees${buildQuery(params)}`),
  getEmployeeMonthAttendance: (employeeId, month, year) =>
    request(`/api/attendance/employee/${employeeId}/month${buildQuery({ month, year })}`),
  setAttendance: (payload) =>
    request('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteAttendance: (attendanceId) =>
    request(`/api/attendance/${attendanceId}`, {
      method: 'DELETE',
    }),
  getAttendanceStats: (params = {}) => request(`/api/attendance/stats/overview${buildQuery(params)}`),
  getEnquiries: (params = {}) => request(`/api/enquiries${buildQuery(params)}`),
  getEnquiryStats: (params = {}) => request(`/api/enquiries/stats/overview${buildQuery(params)}`),
  createEmployee: (payload) =>
    request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default api;

