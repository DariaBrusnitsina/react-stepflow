# Testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `WizardMachine.test.ts` - tests for XState machine
- `Wizard.test.tsx` - tests for Wizard component
- `Step.test.tsx` - tests for Step component
- `WizardContext.test.tsx` - tests for form context and useWizardForm hook
- `components/Input.test.tsx` - tests for Input component
- `components/Checkbox.test.tsx` - tests for Checkbox component

## Coverage

Tests cover:

- ✅ Navigation between steps
- ✅ Form validation
- ✅ Data collection from input fields
- ✅ State management through XState
- ✅ Error handling
- ✅ Edge cases (first/last step)
