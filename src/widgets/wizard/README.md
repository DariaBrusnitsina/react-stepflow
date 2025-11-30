# Wizard Component Library

Ready-to-use component library for creating step-by-step forms (Wizard) with React + TypeScript + XState.

## Components

### `<Wizard />`

Main component that manages form steps and state.

**Props:**

- `children` - array of `<Step />` components
- `onFinish` - function called after the last step
- `initialData?` - initial form state
- `debug?` - enables XState state logging to console

### `<Step />`

Wrapper for a single form step.

**Props:**

- `children` - step content
- `title?` - step title
- `validate?` - validation function (returns `boolean | string[]`)
- `schema?` - Zod schema for validation
- `condition?` - function for conditional step display
- `hideDefaultButtons?` - hide Next/Back buttons
- `customNextLabel?` - custom Next button text
- `customSubmitLabel?` - custom Submit button text

### `<StepIndicator />`

Visual step indicator (used inside Wizard).

## Usage

```tsx
import { Wizard, Step } from '@/widgets/wizard';
import { Input } from '@/shared/ui';

function MyForm() {
  const handleFinish = (data) => {
    console.log('Form data:', data);
  };

  return (
    <Wizard onFinish={handleFinish}>
      <Step title="Step 1">
        <Input name="firstName" />
      </Step>
      <Step title="Step 2">
        <Input name="lastName" />
      </Step>
    </Wizard>
  );
}
```

## Styles

Component library styles are located in:

- `ui/wizard.css` - styles for Wizard
- `ui/step.css` - styles for Step
- `ui/step-indicator.css` - styles for StepIndicator

All styles are automatically imported when using the components.

## Dependencies

- React 18+
- TypeScript
- XState 5+
- Zod (for validation)

## Hooks

### `useWizard()`

Hook for accessing navigation functions and form data from components inside steps.

```tsx
const { goNext, goBack, currentStep, totalSteps, data } = useWizard();
```
