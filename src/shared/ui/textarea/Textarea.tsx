import React from 'react';
import { useWizardForm } from '@/shared/lib';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export const Textarea: React.FC<TextareaProps> = ({ name, ...props }) => {
  const { values, setValue } = useWizardForm();

  return (
    <textarea
      {...props}
      name={name}
      value={values[name] || ''}
      onChange={(e) => setValue(name, e.target.value)}
    />
  );
};
