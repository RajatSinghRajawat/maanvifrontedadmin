import React from 'react';
import { FiBell, FiSearch, FiPlus, FiChevronDown } from 'react-icons/fi';

const Header = () => {
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
        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60"
            alt="User avatar"
          />
          <span className="text-sm font-semibold">Riya</span>
          <FiChevronDown className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;

