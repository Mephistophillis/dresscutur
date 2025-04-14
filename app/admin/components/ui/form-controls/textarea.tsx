import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = '',
      wrapperClassName = '',
      required = false,
      id,
      maxLength,
      value = '',
      showCharCount = false,
      ...rest
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          value={value}
          maxLength={maxLength}
          className={`
            block w-full py-2 px-3 border 
            ${error ? 'border-red-500' : 'border-gray-300'}
            rounded-md shadow-sm 
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-y text-sm
            ${className}
          `}
          {...rest}
        />

        <div className="flex justify-between mt-1">
          {(error || helperText) && (
            <div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
            </div>
          )}
          
          {showCharCount && maxLength && (
            <div className={`text-xs ${currentLength >= maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {currentLength}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea'; 