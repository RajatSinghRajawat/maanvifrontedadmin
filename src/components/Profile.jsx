import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { api } from '../services/api';
import { toast } from '../utils/toast';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        const adminObj = JSON.parse(adminData);
        setAdmin(adminObj);
        setForm({
          name: adminObj.name || '',
          email: adminObj.email || '',
          role: adminObj.role || 'Administrator',
        });
      }
    } catch (err) {
      toast.error('Failed to load profile', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchAdminData();
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      toast.warning('Validation Error', 'Name and email are required');
      return;
    }

    try {
      // Update localStorage
      const updatedAdmin = {
        ...admin,
        name: form.name,
        email: form.email,
        role: form.role,
      };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      setAdmin(updatedAdmin);
      setIsEditing(false);
      toast.success('Profile updated', 'Your profile has been updated successfully');
    } catch (err) {
      toast.error('Failed to update profile', err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">No profile data found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Account</p>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
          >
            <FiEdit2 />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
            >
              <FiX />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              <FiSave />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{admin.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{admin.role || 'Administrator'}</p>
              <div className="w-full pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FiMail className="text-gray-400" />
                  <span className="truncate">{admin.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{admin.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{admin.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiShield className="text-gray-400" />
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{admin.role || 'Administrator'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    Account Created
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiShield className="text-gray-400" />
                    Account Status
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

