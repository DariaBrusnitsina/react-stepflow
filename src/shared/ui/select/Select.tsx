import React from 'react';
import { useWizardForm } from '@/shared/lib';
import './select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> {
  name: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ name, options, className, ...props }) => {
  const { values, setValue, errors } = useWizardForm();
  const error = errors[name];
  const hasError = !!error;

  return (
    <div className="select-wrapper">
      <select
        {...props}
        name={name}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        className={`select-field ${hasError ? 'select-field-error' : ''} ${className || ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      >
        {!props.required && <option value="">-- Select an option --</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <div id={`${name}-error`} className="select-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
