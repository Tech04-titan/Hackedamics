import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  action 
}) => {
  return (
    <div className={`bg-gray-800/70 border border-gray-700/50 rounded-xl backdrop-blur-sm shadow-xl ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <div>
            {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
            {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

