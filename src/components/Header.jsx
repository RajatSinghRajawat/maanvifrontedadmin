import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiPlus, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from '../utils/toast';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin name from localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        setAdminName(admin.name || 'Admin');
      } catch (err) {
        console.error('Error parsing admin data:', err);
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully', 'You have been logged out');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4 flex items-center gap-4">
      <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
        <FiSearch className="text-gray-500" />
        <input
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Search employees, enquiries, files..."
        />
      </div>

      <div className="hidden md:flex items-center gap-3">
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition">
          <FiPlus />
          Quick Add
        </button>
        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
          <FiBell />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold">{adminName}</span>
            <FiChevronDown className={`text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500 mt-1">Administrator</p>
              </div>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Trigger custom event to change page in Layout
                  window.dispatchEvent(new CustomEvent('navigateToProfile'));
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <FiUser className="text-gray-500" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <FiLogOut className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

