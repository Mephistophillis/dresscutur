import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  required?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  size = 'md',
  className = '',
  labelClassName = '',
  wrapperClassName = '',
  required = false,
}: ToggleProps) {
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  // Размеры в зависимости от prop size
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      knob: 'h-3 w-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-10 h-5',
      knob: 'h-4 w-4',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-12 h-6',
      knob: 'h-5 w-5',
      translate: 'translate-x-6',
    },
  };

  return (
    <div className={`flex items-center ${wrapperClassName}`}>
      <label 
        htmlFor={toggleId} 
        className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={() => !disabled && onChange(!checked)}
          disabled={disabled}
          className="sr-only"
          required={required}
        />
        <div
          className={`relative ${sizeClasses[size].switch} 
            ${checked ? 'bg-primary-600' : 'bg-gray-300'} 
            rounded-full transition-colors duration-200 ease-in-out 
            ${className}
          `}
        >
          <span
            className={`${checked ? sizeClasses[size].translate : 'translate-x-0'} 
              inline-block ${sizeClasses[size].knob} rounded-full bg-white 
              transform transition-transform duration-200 ease-in-out absolute inset-y-0.5 left-0.5
            `}
          />
        </div>
        {label && (
          <span className={`ml-2 text-sm text-gray-700 ${labelClassName}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        )}
      </label>
    </div>
  );
} 