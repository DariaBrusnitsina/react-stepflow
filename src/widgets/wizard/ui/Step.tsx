import React, { useCallback, useState } from 'react';
import { z } from 'zod';
import { useWizard } from '../model/useWizard';
import { useWizardForm, type ValidationResult } from '@/shared/lib';
import './step.css';

export interface StepProps {
  children: React.ReactNode;
  title?: string;
  validate?: (data: Record<string, any>) => ValidationResult;
  schema?: z.ZodSchema<any>;
  hideDefaultButtons?: boolean;
  customNextLabel?: string;
  customSubmitLabel?: string;
  /**
   * Conditional function for step display.
   * If the function returns false, the step will be skipped.
   * By default, the step is always visible.
   */
  condition?: (data: Record<string, any>) => boolean;
}

export const Step: React.FC<StepProps> = ({
  children,
  title,
  validate,
  schema,
  hideDefaultButtons = false,
  customNextLabel = 'Next',
  customSubmitLabel = 'Submit',
}) => {
  const { goNext, goBack, finish, isFirstStep, isLastStep, isFinished, updateData } = useWizard();
  const { values, setErrors: setFormErrors } = useWizardForm();
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);

  const handleNext = useCallback(() => {
    // Clear previous errors
    setFormErrors({});
    setGeneralErrors([]);

    // First, try Zod schema validation if provided
    if (schema) {
      try {
        schema.parse(values);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          const generalErrorMessages: string[] = [];

          error.issues.forEach((issue) => {
            const fieldName = issue.path[0] as string;
            const errorMessage = issue.message;

            if (fieldName) {
              // Field-specific error
              fieldErrors[fieldName] = errorMessage;
            } else {
              // General error (no field path)
              generalErrorMessages.push(errorMessage);
            }
          });

          setFormErrors(fieldErrors);
          if (generalErrorMessages.length > 0) {
            setGeneralErrors(generalErrorMessages);
          }
          return;
        }
        setGeneralErrors(['Validation failed']);
        return;
      }
    }

    // Then, try custom validate function if provided
    if (validate) {
      const validationResult = validate(values);
      if (validationResult === false) {
        setGeneralErrors(['Validation failed']);
        return;
      }
      if (Array.isArray(validationResult) && validationResult.length > 0) {
        // Try to parse field-specific errors from custom validation
        const fieldErrors: Record<string, string> = {};
        const generalErrorMessages: string[] = [];

        validationResult.forEach((errorMsg) => {
          // Check if error message is in format "fieldName: message"
          const match = errorMsg.match(/^([^:]+):\s*(.+)$/);
          if (match) {
            const [, fieldName, message] = match;
            fieldErrors[fieldName.trim()] = message.trim();
          } else {
            generalErrorMessages.push(errorMsg);
          }
        });

        setFormErrors(fieldErrors);
        if (generalErrorMessages.length > 0) {
          setGeneralErrors(generalErrorMessages);
        }
        return;
      }
    }

    // Collect data from form context and update wizard state
    updateData(values);

    if (isLastStep) {
      finish();
    } else {
      goNext();
    }
  }, [validate, schema, values, isLastStep, updateData, finish, goNext, setFormErrors]);

  const handleBack = useCallback(() => {
    setFormErrors({});
    setGeneralErrors([]);
    updateData(values);
    goBack();
  }, [values, updateData, goBack, setFormErrors]);

  return (
    <div className="step">
      {title && <h2 className="step-title">{title}</h2>}
      <div className="step-content">{children}</div>
      {generalErrors.length > 0 && (
        <div className="step-errors" role="alert" aria-live="polite">
          <div className="step-errors-header">
            <svg
              className="step-errors-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 6V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14H10.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="step-errors-title">
              {generalErrors.length === 1
                ? 'Validation Error'
                : `${generalErrors.length} Validation Errors`}
            </span>
          </div>
          <ul className="step-errors-list">
            {generalErrors.map((error, index) => (
              <li key={index} className="error-message">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!hideDefaultButtons && !isFinished && (
        <div className="step-actions">
          {!isFirstStep && (
            <button type="button" onClick={handleBack} className="step-button step-button-back">
              BACK
            </button>
          )}
          {isLastStep ? (
            <button type="button" onClick={handleNext} className="step-button step-button-submit">
              {customSubmitLabel.toUpperCase()}
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="step-button step-button-next">
              {customNextLabel.toUpperCase()}
            </button>
          )}
        </div>
      )}
      {isFinished && (
        <div className="step-actions">
          <div className="step-success-message">Form submitted successfully!</div>
        </div>
      )}
    </div>
  );
};
