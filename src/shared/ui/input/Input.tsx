import React from 'react';
import { useWizardForm } from '@/shared/lib';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input: React.FC<InputProps> = ({ name, ...props }) => {
  const { values, setValue } = useWizardForm();

  return (
    <input
      {...props}
      name={name}
      value={values[name] || ''}
      onChange={(e) => setValue(name, e.target.value)}
    />
  );
};
