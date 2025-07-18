import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      wrapperClassName = '',
      labelClassName = '',
      id,
      required = false,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={`${wrapperClassName}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              required={required}
              disabled={disabled}
              className={`
                h-4 w-4 text-primary-600 border-gray-300 rounded
                focus:ring-primary-500 focus:ring-offset-0
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${error ? 'border-red-500' : ''}
                ${className}
              `}
              {...rest}
            />
          </div>
          
          {label && (
            <div className="ml-3 text-sm">
              <label 
                htmlFor={checkboxId} 
                className={`
                  font-medium text-gray-700
                  ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  ${labelClassName}
                `}
              >
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              
              {helperText && !error && (
                <p className="text-gray-500">{helperText}</p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 