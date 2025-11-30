import type { WizardData } from '@/shared/lib/types';

export interface WizardProps {
  children: React.ReactNode;
  onFinish: (data: WizardData) => void;
  initialData?: WizardData;
  debug?: boolean;
}

export interface WizardContextValue {
  goNext: () => void;
  goBack: () => void;
  goToStep: (stepIndex: number) => void;
  updateData: (partialData: Partial<WizardData>) => void;
  finish: () => void;
  reset: () => void;
  currentStep: number;
  totalSteps: number;
  data: WizardData;
  isFirstStep: boolean;
  isLastStep: boolean;
  isFinished: boolean;
}

export interface StepInfo {
  title?: string;
  index: number;
  visibleIndex: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
  stepData?: Record<string, any>; // Data collected in this step
}
