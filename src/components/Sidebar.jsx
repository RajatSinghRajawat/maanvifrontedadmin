import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import Logo from './Logo';
import { toast } from '../utils/toast';

const Sidebar = ({ items, activeKey, onSelect, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully', 'You have been logged out');
    navigate('/login');
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-gray-200">
            <Logo size="default" />
            <p className="text-xs text-gray-500 mt-2">Admin Control Panel</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition ${
                  activeKey === item.key
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </span>
                <FiChevronRight
                  className={`text-base transition ${activeKey === item.key ? 'rotate-90' : ''}`}
                />
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-semibold"
            >
              <FiLogOut />
              Logout
            </button>
            <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              <p className="font-semibold mb-1">Need support?</p>
              <p className="text-indigo-700 mb-3">Our team responds in under 10 minutes.</p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition">
                Chat with us
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

