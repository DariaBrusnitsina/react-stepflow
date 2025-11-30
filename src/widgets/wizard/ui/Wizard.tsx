import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { createWizardMachine, WizardFormProvider, type WizardData } from '@/shared/lib';
import { Step } from './Step';
import { StepIndicator } from './StepIndicator';
import { WizardContext } from '../model/useWizard';
import type { WizardProps, WizardContextValue } from '../model/types';
import './wizard.css';
import './step-indicator.css';

export const Wizard: React.FC<WizardProps> = ({
  children,
  onFinish,
  initialData = {},
  debug = false,
}) => {
  // Get all step elements
  const allSteps = useMemo(() => {
    return React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && child.type === Step
    ) as React.ReactElement[];
  }, [children]);

  // Track data separately to trigger re-evaluation of conditions
  const [formData, setFormData] = useState<WizardData>(initialData);

  // Filter visible steps based on conditions and current data
  const visibleSteps = useMemo(() => {
    return allSteps.filter((step) => {
      if (!React.isValidElement(step)) return false;
      const stepProps = step.props as React.ComponentProps<typeof Step>;
      const condition = stepProps.condition;
      if (!condition) return true; // Step is always visible if no condition
      return condition(formData);
    });
  }, [allSteps, formData]);

  const totalSteps = visibleSteps.length;

  // Create machine with correct step count
  const machine = useMemo(() => {
    return createWizardMachine(Math.max(totalSteps, 1));
  }, [totalSteps]);

  const [state, send] = useMachine(machine);

  // Initialize formData from state on mount
  useEffect(() => {
    if (Object.keys(state.context.data).length > 0) {
      setFormData(state.context.data);
    } else if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, []);

  // Sync formData with state.context.data
  useEffect(() => {
    setFormData(state.context.data);
  }, [state.context.data]);

  // Initialize data if provided
  useEffect(() => {
    if (Object.keys(initialData).length > 0 && Object.keys(state.context.data).length === 0) {
      send({ type: 'UPDATE_DATA', data: initialData });
      setFormData(initialData);
    }
  }, [initialData, state.context.data, send]);

  // Update machine context totalSteps when visible steps change
  useEffect(() => {
    if (state.context.totalSteps !== totalSteps && totalSteps > 0) {
      // Update totalSteps in machine context so guards work correctly
      send({ type: 'UPDATE_TOTAL_STEPS', totalSteps });
    }
  }, [totalSteps, state.context.totalSteps, send]);

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (debug) {
      console.log('Wizard State:', state.value);
      console.log('Wizard Context:', state.context);
      console.log('Visible Steps:', visibleSteps.length, 'Total Steps:', allSteps.length);
      console.log('Form Data:', formData);
    }
  }, [state, debug, visibleSteps.length, allSteps.length, formData]);

  useEffect(() => {
    if (state.value === 'submitting') {
      onFinishRef.current(state.context.data);
      send({ type: 'SUBMIT' });
    }
  }, [state.value, state.context.data, send]);

  const goNext = () => {
    if (state.status === 'active' && state.value !== 'finished') {
      // Always ensure totalSteps is synced in machine context before navigation
      // This is critical when conditional steps appear/disappear
      if (state.context.totalSteps !== totalSteps && totalSteps > 0) {
        send({ type: 'UPDATE_TOTAL_STEPS', totalSteps });
        // Use requestAnimationFrame to ensure state update is processed
        requestAnimationFrame(() => {
          const currentIndex = Math.min(state.context.stepIndex, Math.max(0, totalSteps - 1));
          if (currentIndex < totalSteps - 1) {
            send({ type: 'NEXT' });
          } else if (currentIndex === totalSteps - 1) {
            send({ type: 'SUBMIT' });
          }
        });
        return;
      }

      // Normal navigation when totalSteps is already synced
      send({ type: 'NEXT' });
    }
  };

  const goBack = () => {
    if (state.status === 'active' && state.value !== 'finished') {
      send({ type: 'PREV' });
    }
  };

  const targetStepRef = useRef<number | null>(null);

  const updateData = (partialData: Partial<WizardData>) => {
    if (state.status === 'active' && state.value !== 'finished') {
      const newData = { ...state.context.data, ...partialData };
      // Remove internal step index if present
      delete (newData as any).__stepIndex;
      send({ type: 'UPDATE_DATA', data: newData });
    }
  };

  const finish = () => {
    if (state.status === 'active' && state.value !== 'finished') {
      send({ type: 'SUBMIT' });
    }
  };

  const reset = () => {
    // Reset is handled by checking state before sending events
    // To fully reset, the parent component should remount Wizard with new key
  };

  const isFinished = state.value === 'finished';
  const currentVisibleIndex = isFinished
    ? Math.max(0, totalSteps - 1)
    : Math.min(state.context.stepIndex, Math.max(0, totalSteps - 1));

  const goToStep = (targetStepIndex: number) => {
    if (state.status === 'active' && state.value !== 'finished') {
      const targetIndex = Math.max(0, Math.min(targetStepIndex, totalSteps - 1));
      const currentIndex = currentVisibleIndex;

      if (targetIndex === currentIndex) return;

      targetStepRef.current = targetIndex;

      // Navigate to target step using NEXT/PREV events
      const stepsToMove = targetIndex - currentIndex;
      if (stepsToMove > 0) {
        send({ type: 'NEXT' });
      } else {
        send({ type: 'PREV' });
      }
    }
  };

  // Continue navigation until we reach target step
  useEffect(() => {
    if (targetStepRef.current !== null && state.status === 'active' && state.value !== 'finished') {
      const targetIndex = targetStepRef.current;
      const currentIndex = currentVisibleIndex;

      if (targetIndex === currentIndex) {
        targetStepRef.current = null;
      } else {
        const stepsToMove = targetIndex - currentIndex;
        if (stepsToMove > 0) {
          send({ type: 'NEXT' });
        } else if (stepsToMove < 0) {
          send({ type: 'PREV' });
        }
      }
    }
  }, [currentVisibleIndex, state.status, state.value, send]);

  // Track which fields belong to which step
  const stepFieldsMap = useRef<Map<number, Set<string>>>(new Map());

  // Extract field names from step element
  const extractFieldNames = React.useCallback((element: React.ReactElement): string[] => {
    const fields: string[] = [];

    // Check if element itself has a name prop (Input, Checkbox, Radio)
    if (element.props?.name) {
      fields.push(element.props.name);
    }

    // Recursively check children
    if (element.props?.children) {
      React.Children.forEach(element.props.children, (child) => {
        if (React.isValidElement(child)) {
          fields.push(...extractFieldNames(child));
        }
      });
    }

    return fields;
  }, []);

  // Update step fields map for all visible steps
  useEffect(() => {
    visibleSteps.forEach((step, visibleIndex) => {
      if (React.isValidElement(step)) {
        const fields = extractFieldNames(step);
        if (fields.length > 0) {
          const fieldSet = new Set(fields);
          stepFieldsMap.current.set(visibleIndex, fieldSet);
        }
      }
    });
  }, [visibleSteps, extractFieldNames]);

  // Helper function to extract step data summary
  const getStepDataSummary = (stepIndex: number): Record<string, any> | undefined => {
    if (stepIndex >= currentVisibleIndex) return undefined; // Don't show data for future steps
    const stepFields = stepFieldsMap.current.get(stepIndex);
    if (!stepFields || stepFields.size === 0) return undefined;

    const stepData: Record<string, any> = {};
    stepFields.forEach((field) => {
      if (
        state.context.data[field] !== undefined &&
        state.context.data[field] !== null &&
        state.context.data[field] !== ''
      ) {
        stepData[field] = state.context.data[field];
      }
    });

    return Object.keys(stepData).length > 0 ? stepData : undefined;
  };

  // Get current step element from visible steps
  const currentStepElement = visibleSteps[currentVisibleIndex];

  const stepInfos = visibleSteps.map((step, visibleIndex) => {
    if (React.isValidElement(step)) {
      const stepProps = step.props as React.ComponentProps<typeof Step>;
      return {
        title: stepProps.title,
        index: visibleIndex,
        visibleIndex,
        isActive: !isFinished && visibleIndex === currentVisibleIndex,
        isCompleted: visibleIndex < currentVisibleIndex || isFinished,
        isLast: visibleIndex === totalSteps - 1,
        stepData: getStepDataSummary(visibleIndex),
      };
    }
    return {
      title: undefined,
      index: visibleIndex,
      visibleIndex,
      isActive: false,
      isCompleted: false,
      isLast: false,
      stepData: undefined,
    };
  });

  const contextValue: WizardContextValue = {
    goNext,
    goBack,
    goToStep,
    updateData,
    finish,
    reset,
    currentStep: currentVisibleIndex,
    totalSteps,
    data: state.context.data,
    isFirstStep: currentVisibleIndex === 0,
    isLastStep: currentVisibleIndex === totalSteps - 1,
    isFinished,
  };

  // Scroll to top smoothly when step changes
  const wizardContentRef = useRef<HTMLDivElement>(null);
  const prevStepIndexRef = useRef<number | null>(null);

  useEffect(() => {
    // Only scroll if step actually changed (not on initial mount)
    if (prevStepIndexRef.current !== null && prevStepIndexRef.current !== currentVisibleIndex) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Scroll wizard content to top smoothly
        if (wizardContentRef.current) {
          wizardContentRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
        // Also scroll window to top if needed
        const wizardElement = document.querySelector('.wizard');
        if (wizardElement) {
          wizardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
    prevStepIndexRef.current = currentVisibleIndex;
  }, [currentVisibleIndex]);

  // Use stepIndex as key to force WizardFormProvider to reset when step changes
  // This ensures form values are properly loaded from XState context
  return (
    <WizardContext.Provider value={contextValue}>
      <WizardFormProvider
        key={currentVisibleIndex}
        initialValues={state.context.data || initialData}
        onValuesChange={(values) => {
          updateData(values);
        }}
      >
        <div className="wizard">
          <StepIndicator steps={stepInfos} />
          <div className="wizard-content" ref={wizardContentRef}>
            {currentStepElement}
          </div>
        </div>
      </WizardFormProvider>
    </WizardContext.Provider>
  );
};
