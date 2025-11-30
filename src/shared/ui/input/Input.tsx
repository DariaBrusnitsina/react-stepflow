import React from 'react';
import { useWizardForm } from '@/shared/lib';
import './input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input: React.FC<InputProps> = ({ name, className, type, ...props }) => {
  const { values, setValue, errors } = useWizardForm();
  const error = errors[name];
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // For number inputs, handle empty string and invalid numbers
    if (type === 'number') {
      if (value === '' || value === '-') {
        // Allow empty string or minus sign (for negative numbers)
        setValue(name, '');
      } else {
        const numValue = Number(value);
        // Only set if it's a valid number (not NaN)
        if (!isNaN(numValue)) {
          setValue(name, value);
        }
        // If NaN, don't update - let the user continue typing
      }
    } else {
      setValue(name, value);
    }
  };

  return (
    <div className="input-wrapper">
      <input
        {...props}
        type={type}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        className={`input-field ${hasError ? 'input-field-error' : ''} ${className || ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && (
        <div id={`${name}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
