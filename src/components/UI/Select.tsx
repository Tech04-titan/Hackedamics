import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  icon,
  options,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-2.5 text-gray-400">
            {icon}
          </span>
        )}
        <select
          className={`w-full bg-gray-700/50 border border-gray-600/50 rounded-lg ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors [&>option]:bg-gray-800 [&>option]:text-white ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
};

