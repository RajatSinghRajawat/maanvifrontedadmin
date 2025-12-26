import React, { useMemo, useState } from 'react';
import { FiHome, FiUsers, FiCalendar, FiSettings, FiMail, FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboards from './Dashboards';
import Employees from './Employees';
import Attendence from './Attendence';
import Enquiery from './Enquiery';
import Setings from './Setings';

const Layout = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { key: 'Dashboard', label: 'Dashboard', icon: <FiHome /> },
      { key: 'Employees', label: 'Employees', icon: <FiUsers /> },
      { key: 'Attendence', label: 'Attendance', icon: <FiCalendar /> },
      { key: 'Enquiery', label: 'Enquiries', icon: <FiMail /> },
      { key: 'Setings', label: 'Settings', icon: <FiSettings /> },
    ],
    []
  );

  const renderContent = () => {
    switch (activePage) {
      case 'Employees':
        return <Employees />;
      case 'Attendence':
        return <Attendence />;
      case 'Enquiery':
        return <Enquiery />;
      case 'Setings':
        return <Setings />;
      default:
        return <Dashboards />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center ">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Mannvi Admin</p>
          <p className="text-base font-semibold">Control Center</p>
        </div>
        <button
          onClick={() => setIsMobileNavOpen((p) => !p)}
          className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div className="flex">
       <div>
       <Sidebar
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          activeKey={activePage}
          onSelect={(key) => {
            setActivePage(key);
            setIsMobileNavOpen(false);
          }}
          items={navItems}
        />
       </div>

        <div className="w-full">
          <Header />
          <main className="p-3 md:p-4 lg:p-6 bg-white">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

