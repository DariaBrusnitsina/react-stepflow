# React Step Flow
<img width="1187" height="776" alt="Снимок экрана 2025-12-01 в 00 38 26" src="https://github.com/user-attachments/assets/cb90daca-19e2-41c8-9b74-648be0ae8257" />

A universal, production-ready step-by-step form component (Wizard) built with React, TypeScript, and XState. This library provides a flexible and powerful solution for creating multi-step forms with state management, validation, conditional steps, and smooth animations.

## Features

- 🎯 **State Management**: Powered by XState 5 for robust state management
- ✅ **Validation**: Built-in support for Zod schema validation and custom validation functions
- 🔄 **Conditional Steps**: Dynamically show/hide steps based on form data
- 📱 **Responsive Design**: Fully responsive with mobile-optimized step indicator
- 🎨 **Customizable**: Easy to style and customize to match your design system
- 🧩 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🧪 **Well-Tested**: Comprehensive test coverage with Vitest
- 🏗️ **FSD Architecture**: Organized using Feature-Sliced Design methodology

## Installation

```bash
npm install
```

## Quick Start

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run checks before each commit:

- **Lint-staged**: Automatically lints and formats staged files (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.md`)
- **Tests**: Runs all tests before allowing the commit

If any check fails, the commit will be blocked. This ensures code quality and prevents broken code from being committed.

To bypass hooks (not recommended), use `git commit --no-verify`.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Update the base path in `vite.config.ts`**:
   - Replace `'/react-stepflow/'` with your repository name
   - For example, if your repo is `my-wizard-app`, change it to `'/my-wizard-app/'`
   - If deploying from the root of your GitHub Pages site, use `'/'`

2. **Enable GitHub Pages in your repository**:
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"

3. **Push to the main branch**:
   - The workflow will automatically build and deploy your site
   - Your site will be available at: `https://<your-username>.github.io/<repository-name>/`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist folder will contain the production build
# You can deploy it using any static hosting service
```

### Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

## Project Structure

The project follows Feature-Sliced Design (FSD) architecture:

```
src/
├── app/              # Application layer (example usage)
├── widgets/          # Complex UI blocks
│   └── wizard/       # Wizard component library
├── shared/           # Shared resources
│   ├── lib/          # Shared libraries (XState machine, context)
│   └── ui/           # Shared UI components (Input, Checkbox, etc.)
└── test/             # Test files
```

## Core Components

### `<Wizard />`

The main wrapper component that manages form steps and state using XState.

**Props:**

| Prop           | Type                                  | Description                                  |
| -------------- | ------------------------------------- | -------------------------------------------- |
| `children`     | `ReactNode`                           | Array of `<Step />` components               |
| `onFinish`     | `(data: Record<string, any>) => void` | Callback function called after the last step |
| `initialData?` | `Record<string, any>`                 | Initial form state                           |
| `debug?`       | `boolean`                             | Enable XState state logging to console       |

**Example:**

```tsx
<Wizard
  onFinish={(data) => {
    console.log('Form submitted:', data);
    // Send to server
  }}
  initialData={{ name: 'John' }}
>
  <Step title="Step 1">...</Step>
  <Step title="Step 2">...</Step>
</Wizard>
```

### `<Step />`

Wrapper component for a single form step with built-in validation and navigation.

**Props:**

| Prop                  | Type                                                 | Description                              |
| --------------------- | ---------------------------------------------------- | ---------------------------------------- |
| `children`            | `ReactNode`                                          | Step content                             |
| `title?`              | `string`                                             | Step title (optional)                    |
| `validate?`           | `(data: Record<string, any>) => boolean \| string[]` | Custom validation function               |
| `schema?`             | `z.ZodSchema<any>`                                   | Zod schema for validation                |
| `condition?`          | `(data: Record<string, any>) => boolean`             | Conditional function for step display    |
| `hideDefaultButtons?` | `boolean`                                            | Hide default Next/Back buttons           |
| `customNextLabel?`    | `string`                                             | Custom Next button text                  |
| `customSubmitLabel?`  | `string`                                             | Custom Submit button text (on last step) |

**Example:**

```tsx
<Step
  title="Personal Information"
  schema={z.object({
    firstName: z.string().min(2),
    email: z.string().email(),
  })}
  condition={(data) => data.userType === 'individual'}
>
  <Input name="firstName" placeholder="First Name" />
  <Input name="email" type="email" placeholder="Email" />
</Step>
```

### `<StepIndicator />`

Visual step indicator component that displays progress, active step, and completed steps. Automatically included in `<Wizard />` but can be customized.

## Hooks

### `useWizard()`

Hook for accessing navigation functions and form data from components inside steps.

**Returns:**

```tsx
{
  goNext: () => void;                    // Navigate to next step
  goBack: () => void;                    // Navigate to previous step
  goToStep: (index: number) => void;     // Navigate to specific step
  updateData: (partialData: Partial<WizardData>) => void;  // Update form data
  finish: () => void;                    // Finish the form
  reset: () => void;                     // Reset the form
  currentStep: number;                   // Current step index (0-based)
  totalSteps: number;                    // Total number of steps
  data: WizardData;                      // All collected form data
  isFirstStep: boolean;                  // Is this the first step
  isLastStep: boolean;                   // Is this the last step
  isFinished: boolean;                   // Is the form finished
}
```

**Example:**

```tsx
const MyComponent = () => {
  const { goNext, goBack, currentStep, totalSteps, data } = useWizard();

  return (
    <div>
      <p>
        Step {currentStep + 1} of {totalSteps}
      </p>
      <button onClick={goBack}>Back</button>
      <button onClick={goNext}>Next</button>
    </div>
  );
};
```

### `useWizardForm()`

Hook for working with controlled inputs inside steps. Automatically syncs with the global form state.

**Returns:**

```tsx
{
  values: Record<string, any>;                    // Current field values
  setValue: (name: string, value: any) => void;    // Set field value
  getValue: (name: string) => any;                 // Get field value
}
```

**Example:**

```tsx
const CustomInput = ({ name }) => {
  const { values, setValue } = useWizardForm();

  return <input value={values[name] || ''} onChange={(e) => setValue(name, e.target.value)} />;
};
```

## Form Components

The library includes a set of pre-built form components that automatically integrate with the wizard:

### `<Input />`

Controlled input component that automatically syncs with form state.

```tsx
<Input name="firstName" type="text" placeholder="Enter your first name" />
```

**Supported types:** `text`, `email`, `tel`, `number`, `date`, `url`, etc.

### `<Textarea />`

Controlled textarea component.

```tsx
<Textarea name="description" rows={4} placeholder="Enter description" />
```

### `<Checkbox />`

Controlled checkbox component. Supports multiple selections when using the same `name`.

```tsx
<Checkbox name="agree">
  I agree to the terms and conditions
</Checkbox>

<Checkbox name="services" value="cleaning">
  Cleaning service
</Checkbox>
```

### `<Radio />`

Controlled radio button component.

```tsx
<Radio name="clientType" value="individual">
  Individual
</Radio>
<Radio name="clientType" value="business">
  Business
</Radio>
```

### `<Select />`

Controlled select dropdown component.

```tsx
<Select
  name="country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  required
/>
```

### `<TariffCard />`

Special radio button component styled as a card, perfect for plan/tariff selection.

```tsx
<TariffCard
  name="tariff"
  value="premium"
  title="Premium Plan"
  price="$99/month"
  description="Best value for large teams"
  features={['Feature 1', 'Feature 2', 'Feature 3']}
  recommended
/>
```

## Validation

The library supports two types of validation:

### 1. Zod Schema Validation (Recommended)

Use Zod schemas for type-safe, declarative validation:

```tsx
import { z } from 'zod';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, {
    message: 'Please enter a valid phone number',
  }),
});

<Step title="Personal Information" schema={personalInfoSchema}>
  <Input name="firstName" />
  <Input name="lastName" />
  <Input name="email" type="email" />
  <Input name="phone" type="tel" />
</Step>;
```

### 2. Custom Validation Function

For more complex validation logic:

```tsx
<Step
  title="Step 1"
  validate={(data) => {
    const errors: string[] = [];

    if (!data.name) {
      errors.push('Name is required');
    }

    if (data.age && data.age < 18) {
      errors.push('You must be at least 18 years old');
    }

    return errors.length > 0 ? errors : true;
  }}
>
  <Input name="name" />
  <Input name="age" type="number" />
</Step>
```

**Validation Return Types:**

- `true` - Validation passed
- `false` - Validation failed (generic error)
- `string[]` - Array of error messages

If validation fails, navigation is blocked and errors are displayed below the step content.

## Conditional Steps

Steps can be conditionally shown or hidden based on form data:

```tsx
<Step
  title="Individual Information"
  condition={(data) => data.clientType === 'individual'}
>
  <Input name="firstName" />
  <Input name="lastName" />
</Step>

<Step
  title="Business Information"
  condition={(data) => data.clientType === 'business'}
>
  <Input name="companyName" />
  <Input name="taxId" />
</Step>
```

The wizard automatically adjusts the total number of steps and navigation when steps are conditionally shown/hidden.

## Complete Example

```tsx
import React from 'react';
import { z } from 'zod';
import { Wizard, Step, useWizard } from '@/widgets/wizard';
import { Input, Checkbox, Radio, Select, TariffCard } from '@/shared/ui';

// Validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

const agreementSchema = z.object({
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

function App() {
  const handleFinish = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    // Send to server
    fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <Wizard
      onFinish={handleFinish}
      initialData={{
        clientType: 'individual',
        tariff: 'standard',
      }}
    >
      <Step title="Welcome" customNextLabel="Get Started">
        <div>
          <h2>Welcome to our service!</h2>
          <p>Let's get started with a few simple steps.</p>
        </div>
      </Step>

      <Step title="Client Type">
        <Radio name="clientType" value="individual">
          Individual
        </Radio>
        <Radio name="clientType" value="business">
          Business
        </Radio>
      </Step>

      <Step
        title="Personal Information"
        condition={(data) => data.clientType === 'individual'}
        schema={personalInfoSchema}
      >
        <Input name="firstName" placeholder="First Name" />
        <Input name="lastName" placeholder="Last Name" />
        <Input name="email" type="email" placeholder="Email" />
      </Step>

      <Step
        title="Choose Plan"
        schema={z.object({
          tariff: z.enum(['basic', 'standard', 'premium']),
        })}
      >
        <TariffCard
          name="tariff"
          value="basic"
          title="Basic"
          price="$29/month"
          features={['Feature 1', 'Feature 2']}
        />
        <TariffCard
          name="tariff"
          value="standard"
          title="Standard"
          price="$49/month"
          features={['Feature 1', 'Feature 2', 'Feature 3']}
          recommended
        />
        <TariffCard
          name="tariff"
          value="premium"
          title="Premium"
          price="$99/month"
          features={['All features']}
        />
      </Step>

      <Step title="Agreement" schema={agreementSchema}>
        <Checkbox name="agree">I agree to the terms and conditions</Checkbox>
      </Step>

      <Step title="Review">
        <Summary />
      </Step>
    </Wizard>
  );
}

const Summary = () => {
  const { data } = useWizard();

  return (
    <div>
      <h3>Review Your Information</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

## Architecture

### XState Machine

The wizard uses XState 5 for state management. The state machine has the following states:

- **`editing`** - Form is being edited (navigating through steps)
- **`submitting`** - Form is being submitted
- **`finished`** - Form submission is complete

**Events:**

- `NEXT` - Navigate to next step
- `PREV` - Navigate to previous step
- `UPDATE_DATA` - Update form data
- `UPDATE_TOTAL_STEPS` - Update total number of steps (for conditional steps)
- `SUBMIT` - Submit the form

### Form Context

The `Wizard` component creates a `WizardFormContext` that allows any child component to get and set field values through the `useWizardForm()` hook. This context automatically syncs with the XState machine state.

### Feature-Sliced Design

The project is organized using Feature-Sliced Design methodology:

- **`app/`** - Application layer (example usage, not part of the library)
- **`widgets/wizard/`** - Wizard component library (main export)
- **`shared/lib/`** - Shared libraries (XState machine, form context)
- **`shared/ui/`** - Shared UI components (Input, Checkbox, etc.)

## Styling

The library components come with default styles that can be customized:

- `widgets/wizard/ui/wizard.css` - Wizard container styles
- `widgets/wizard/ui/step.css` - Step component styles
- `widgets/wizard/ui/step-indicator.css` - Step indicator styles

All styles are automatically imported when using the components. You can override them in your application styles.

### Mobile Responsiveness

The step indicator automatically adapts to mobile screens:

- Horizontal layout on mobile
- Compact circles without labels
- Thin connecting lines
- Smooth scrolling

## TypeScript Support

All components are fully typed with TypeScript. Main types are exported:

```tsx
import type { WizardProps, StepProps, WizardData, ValidationResult } from '@/widgets/wizard';
```

## Testing

The project includes comprehensive tests using Vitest and React Testing Library:

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

Test files are located in `src/test/` directory, maintaining the FSD structure.

## Code Quality

The project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Linting with TypeScript, React, React Hooks, and accessibility rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Type checking via `tsc`

### Linting Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Code Quality

The project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Linting with TypeScript, React, and accessibility rules
- **Prettier**: Code formatting
- **Hooks**: React Hooks linting rules

### Linting Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Requirements

- React 18+
- TypeScript 5+
- XState 5+
- Zod 4+ (for validation)
- Node.js 18+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.
