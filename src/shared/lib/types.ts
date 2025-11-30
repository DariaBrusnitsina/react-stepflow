export type WizardData = Record<string, any>;

export interface WizardMachineContext {
  stepIndex: number;
  totalSteps: number;
  data: WizardData;
}

export type WizardMachineEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'UPDATE_DATA'; data: Partial<WizardData> }
  | { type: 'UPDATE_TOTAL_STEPS'; totalSteps: number }
  | { type: 'SUBMIT' };

export type ValidationResult = boolean | string[];
