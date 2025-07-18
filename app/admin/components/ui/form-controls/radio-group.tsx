import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  inline?: boolean;
  required?: boolean;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  label,
  error,
  disabled = false,
  inline = false,
  required = false,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      )}
      
      <div className={`flex ${inline ? 'flex-row space-x-4' : 'flex-col space-y-2'}`}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isDisabled = disabled || option.disabled;
          
          return (
            <div 
              key={option.value} 
              className={`relative flex items-start ${inline ? '' : 'pl-1 py-1'}`}
            >
              <div className="flex items-center h-5">
                <input
                  id={id}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  disabled={isDisabled}
                  required={required && option.value === options[0].value}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer
                    disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={id} 
                  className={`font-medium text-gray-700 cursor-pointer
                    ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 