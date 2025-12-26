import React from 'react';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Toggle = ({ label, description, enabled }) => (
  <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-xl">
    <div>
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="text-2xl text-indigo-600">{enabled ? <FiToggleRight /> : <FiToggleLeft />}</div>
  </div>
);

const Setings = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Controls</p>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Fine-tune security, notifications and automation.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Toggle
          label="Two-factor authentication"
          description="Require OTP for all admin sign-ins."
          enabled={true}
        />
        <Toggle
          label="Auto reminders"
          description="Ping late attendance and pending enquiries."
          enabled={true}
        />
        <Toggle
          label="Weekly digest email"
          description="A concise summary every Monday at 8 AM."
          enabled={false}
        />
        <Toggle
          label="Public career page"
          description="Showcase openings and accept applications."
          enabled={false}
        />
      </div>
    </div>
  );
};

export default Setings;

