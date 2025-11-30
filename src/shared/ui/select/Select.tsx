import React from 'react';
import { useWizardForm } from '@/shared/lib';

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

export const Select: React.FC<SelectProps> = ({ name, options, ...props }) => {
  const { values, setValue } = useWizardForm();

  return (
    <select
      {...props}
      name={name}
      value={values[name] || ''}
      onChange={(e) => setValue(name, e.target.value)}
    >
      {!props.required && <option value="">-- Select an option --</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
