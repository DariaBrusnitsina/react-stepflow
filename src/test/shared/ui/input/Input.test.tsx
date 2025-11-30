import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/shared/ui';
import { WizardFormProvider, useWizardForm } from '@/shared/lib';

describe('Input', () => {
  it('should render input with name', () => {
    render(
      <WizardFormProvider>
        <Input name="test" />
      </WizardFormProvider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'test');
  });

  it('should display initial value from form context', () => {
    render(
      <WizardFormProvider initialValues={{ test: 'initial value' }}>
        <Input name="test" />
      </WizardFormProvider>
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial value');
  });

  it('should update form context when value changes', async () => {
    const TestComponent = () => {
      const { values } = useWizardForm();
      return (
        <div>
          <Input name="test" />
          <div data-testid="value">{values.test || ''}</div>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider>
        <TestComponent />
      </WizardFormProvider>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'new value');

    expect(screen.getByTestId('value')).toHaveTextContent('new value');
  });

  it('should support all standard input props', () => {
    render(
      <WizardFormProvider>
        <Input
          name="test"
          type="email"
          placeholder="Enter email"
          disabled
          data-testid="custom-input"
        />
      </WizardFormProvider>
    );

    const input = screen.getByTestId('custom-input') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.placeholder).toBe('Enter email');
    expect(input.disabled).toBe(true);
  });

  it('should handle empty value', () => {
    render(
      <WizardFormProvider>
        <Input name="test" />
      </WizardFormProvider>
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
