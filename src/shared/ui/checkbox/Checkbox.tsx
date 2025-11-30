import React from 'react';
import { useWizardForm } from '@/shared/lib';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children'
> {
  name: string;
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ name, children, value, ...props }) => {
  const { values, setValue } = useWizardForm();

  // If value prop is provided, treat as multiple checkboxes (array)
  // Otherwise, treat as single checkbox (boolean)
  const isMultiple = value !== undefined;
  const currentValue = values[name];
  const checked = isMultiple
    ? Array.isArray(currentValue) && currentValue.includes(value)
    : !!currentValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMultiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (e.target.checked) {
        setValue(name, [...currentArray, value]);
      } else {
        setValue(
          name,
          currentArray.filter((v) => v !== value)
        );
      }
    } else {
      setValue(name, e.target.checked);
    }
  };

  return (
    <label>
      <input
        {...props}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      {children}
    </label>
  );
};
