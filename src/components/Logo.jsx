import React from 'react';
import manviLogo from '../assets/manvi.png';

const Logo = ({ className = '', size = 'default' }) => {
  const sizeClasses = {
    small: 'h-12',
    default: 'h-16',
    large: 'h-20',
  };

  const logoSizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${logoSizeClass} ${logoSizeClass} rounded-full overflow-hidden bg-white p-2 shadow-lg`}>
        <img
          src={manviLogo}
          alt="MANVI ENTERPRISES"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mt-2 text-center leading-tight">
        <p className="text-sm font-bold text-gray-900 tracking-wide">MANVI ENTERPRISES</p>
      </div>
    </div>
  );
};

export default Logo;

