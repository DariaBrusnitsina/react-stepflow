import React from 'react';
import type { StepInfo } from '../model/types';
import './step-indicator.css';

// Helper function to format step data for display
const formatStepData = (
  stepData: Record<string, any> | undefined
): Array<{ label: string; value: string }> => {
  if (!stepData || Object.keys(stepData).length === 0) return [];

  const entries = Object.entries(stepData)
    .filter(([key, value]) => {
      // Filter out empty values and internal fields
      if (value === null || value === undefined || value === '' || key.startsWith('__'))
        return false;
      // Only show simple values (strings, numbers, booleans)
      return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    })
    .map(([key, value]) => {
      let displayValue = '';
      if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else {
        displayValue = String(value);
      }

      // Format label: capitalize first letter and replace camelCase with spaces
      const formattedLabel = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      return {
        label: formattedLabel,
        value: displayValue,
      };
    })
    .filter((entry) => entry.value);

  return entries;
};

interface StepIndicatorProps {
  steps: StepInfo[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepData = formatStepData(step.stepData);
        const hasData = stepData.length > 0 && step.isCompleted;

        return (
          <div key={index} className="step-indicator-item">
            <div className="step-indicator-line-container">
              <div
                className={`step-indicator-circle ${
                  step.isActive ? 'active' : step.isCompleted ? 'completed' : 'inactive'
                }`}
              >
                {step.isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{step.index + 1}</span>
                )}
              </div>
              {!step.isLast && (
                <div className={`step-indicator-line ${step.isCompleted ? 'completed' : ''}`} />
              )}
            </div>
            <div className="step-indicator-content">
              <div
                className={`step-indicator-title ${
                  step.isActive ? 'active' : ''
                } ${step.isCompleted ? 'completed' : ''} ${hasData ? 'has-data' : ''}`}
              >
                <span className="step-indicator-title-text">
                  {step.title || `Step ${step.index + 1}`}
                </span>
              </div>
              {hasData && (
                <div className="step-indicator-data">
                  {stepData.map((item, idx) => (
                    <div key={idx} className="step-indicator-data-item">
                      <span className="step-indicator-data-label">{item.label}:</span>
                      <span className="step-indicator-data-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
