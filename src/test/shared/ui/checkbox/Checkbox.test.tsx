import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/shared/ui';
import { WizardFormProvider, useWizardForm } from '@/shared/lib';

describe('Checkbox', () => {
  it('should render checkbox with name', () => {
    render(
      <WizardFormProvider>
        <Checkbox name="test">Test checkbox</Checkbox>
      </WizardFormProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'test');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('should display label text', () => {
    render(
      <WizardFormProvider>
        <Checkbox name="test">I agree</Checkbox>
      </WizardFormProvider>
    );

    expect(screen.getByText('I agree')).toBeInTheDocument();
  });

  it('should be unchecked by default', () => {
    render(
      <WizardFormProvider>
        <Checkbox name="test">Test</Checkbox>
      </WizardFormProvider>
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should be checked when value is true in form context', () => {
    render(
      <WizardFormProvider initialValues={{ test: true }}>
        <Checkbox name="test">Test</Checkbox>
      </WizardFormProvider>
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should update form context when toggled', async () => {
    const TestComponent = () => {
      const { values } = useWizardForm();
      return (
        <div>
          <Checkbox name="test">Test</Checkbox>
          <div data-testid="value">{values.test ? 'checked' : 'unchecked'}</div>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider>
        <TestComponent />
      </WizardFormProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByTestId('value')).toHaveTextContent('checked');
  });

  it('should uncheck when clicked again', async () => {
    const TestComponent = () => {
      const { values } = useWizardForm();
      return (
        <div>
          <Checkbox name="test">Test</Checkbox>
          <div data-testid="value">{values.test ? 'checked' : 'unchecked'}</div>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider initialValues={{ test: true }}>
        <TestComponent />
      </WizardFormProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByTestId('value')).toHaveTextContent('unchecked');
  });

  it('should support all standard input props', () => {
    render(
      <WizardFormProvider>
        <Checkbox name="test" disabled data-testid="custom-checkbox">
          Test
        </Checkbox>
      </WizardFormProvider>
    );

    const checkbox = screen.getByTestId('custom-checkbox') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });
});
