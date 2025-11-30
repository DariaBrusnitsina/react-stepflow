import React from 'react';
import { useWizardForm } from '@/shared/lib';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  value: string;
  children?: React.ReactNode;
}

export const Radio: React.FC<RadioProps> = ({ name, value, children, ...props }) => {
  const { values, setValue } = useWizardForm();

  return (
    <label>
      <input
        {...props}
        type="radio"
        name={name}
        value={value}
        checked={values[name] === value}
        onChange={(e) => setValue(name, e.target.value)}
      />
      {children}
    </label>
  );
};
