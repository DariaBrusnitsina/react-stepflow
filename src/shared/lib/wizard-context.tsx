import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { WizardData } from './types';

interface WizardFormContextValue {
  values: WizardData;
  setValue: (name: string, value: any) => void;
  getValue: (name: string) => any;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const WizardFormContext = createContext<WizardFormContextValue | null>(null);

export const useWizardForm = () => {
  const context = useContext(WizardFormContext);
  if (!context) {
    throw new Error('useWizardForm must be used within Wizard component');
  }
  return context;
};

interface WizardFormProviderProps {
  children: React.ReactNode;
  initialValues?: WizardData;
  onValuesChange?: (values: WizardData) => void;
}

export const WizardFormProvider: React.FC<WizardFormProviderProps> = ({
  children,
  initialValues = {},
  onValuesChange,
}) => {
  // Since Wizard uses key={stepIndex}, this component will remount on step change
  // So we can safely use initialValues as the initial state
  const [values, setValues] = useState<WizardData>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;

  const setValue = useCallback((name: string, value: any) => {
    setValues((prev) => {
      const newValues = { ...prev, [name]: value };
      onValuesChangeRef.current?.(newValues);
      // Clear error for this field when user starts typing
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
      return newValues;
    });
  }, []);

  const getValue = useCallback(
    (name: string) => {
      return values[name];
    },
    [values]
  );

  return (
    <WizardFormContext.Provider value={{ values, setValue, getValue, errors, setErrors }}>
      {children}
    </WizardFormContext.Provider>
  );
};
