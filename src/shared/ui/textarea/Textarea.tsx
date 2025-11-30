import React from 'react';
import { useWizardForm } from '@/shared/lib';
import './textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export const Textarea: React.FC<TextareaProps> = ({ name, className, ...props }) => {
  const { values, setValue, errors } = useWizardForm();
  const error = errors[name];
  const hasError = !!error;

  return (
    <div className="textarea-wrapper">
      <textarea
        {...props}
        name={name}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        className={`textarea-field ${hasError ? 'textarea-field-error' : ''} ${className || ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && (
        <div id={`${name}-error`} className="textarea-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
