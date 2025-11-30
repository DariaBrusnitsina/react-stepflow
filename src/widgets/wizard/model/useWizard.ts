import React from 'react';
import type { WizardContextValue } from '../model/types';

const WizardContext = React.createContext<WizardContextValue | null>(null);

export const useWizard = () => {
  const context = React.useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within Wizard component');
  }
  return context;
};

export { WizardContext };
