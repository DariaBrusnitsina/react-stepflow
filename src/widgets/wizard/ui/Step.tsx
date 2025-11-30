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
  const { values } = useWizardForm();
  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = useCallback(() => {
    // First, try Zod schema validation if provided
    if (schema) {
      try {
        schema.parse(values);
        setErrors([]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.issues.map((issue) => {
            const path = issue.path.join('.');
            return path ? `${path}: ${issue.message}` : issue.message;
          });
          setErrors(errorMessages);
          return;
        }
        setErrors(['Validation failed']);
        return;
      }
    }

    // Then, try custom validate function if provided
    if (validate) {
      const validationResult = validate(values);
      if (validationResult === false) {
        setErrors(['Validation failed']);
        return;
      }
      if (Array.isArray(validationResult) && validationResult.length > 0) {
        setErrors(validationResult);
        return;
      }
    }

    setErrors([]);

    // Collect data from form context and update wizard state
    updateData(values);

    if (isLastStep) {
      finish();
    } else {
      goNext();
    }
  }, [validate, schema, values, isLastStep, updateData, finish, goNext]);

  const handleBack = useCallback(() => {
    setErrors([]);
    updateData(values);
    goBack();
  }, [values, updateData, goBack]);

  return (
    <div className="step">
      {title && <h2 className="step-title">{title}</h2>}
      <div className="step-content">{children}</div>
      {errors.length > 0 && (
        <div className="step-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
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
