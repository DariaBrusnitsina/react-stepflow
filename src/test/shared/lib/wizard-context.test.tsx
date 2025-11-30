import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WizardFormProvider, useWizardForm } from '@/shared/lib';

describe('WizardFormProvider and useWizardForm', () => {
  it('should provide initial values', () => {
    const TestComponent = () => {
      const { values } = useWizardForm();
      return <div>{JSON.stringify(values)}</div>;
    };

    render(
      <WizardFormProvider initialValues={{ name: 'John', age: 30 }}>
        <TestComponent />
      </WizardFormProvider>
    );

    expect(screen.getByText('{"name":"John","age":30}')).toBeInTheDocument();
  });

  it('should update values when setValue is called', async () => {
    const TestComponent = () => {
      const { values, setValue } = useWizardForm();
      return (
        <div>
          <div data-testid="values">{JSON.stringify(values)}</div>
          <button onClick={() => setValue('name', 'Jane')}>Set Name</button>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider>
        <TestComponent />
      </WizardFormProvider>
    );

    const button = screen.getByText('Set Name');
    await user.click(button);

    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"Jane"}');
  });

  it('should call onValuesChange when values change', async () => {
    const onValuesChange = vi.fn();
    const TestComponent = () => {
      const { setValue } = useWizardForm();
      return <button onClick={() => setValue('test', 'value')}>Set Value</button>;
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider onValuesChange={onValuesChange}>
        <TestComponent />
      </WizardFormProvider>
    );

    const button = screen.getByText('Set Value');
    await user.click(button);

    expect(onValuesChange).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should merge values when updating', async () => {
    const TestComponent = () => {
      const { values, setValue } = useWizardForm();
      return (
        <div>
          <div data-testid="values">{JSON.stringify(values)}</div>
          <button onClick={() => setValue('name', 'John')}>Set Name</button>
          <button onClick={() => setValue('age', 25)}>Set Age</button>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <WizardFormProvider initialValues={{ name: 'Initial' }}>
        <TestComponent />
      </WizardFormProvider>
    );

    await user.click(screen.getByText('Set Name'));
    await user.click(screen.getByText('Set Age'));

    const valuesText = screen.getByTestId('values').textContent;
    const values = JSON.parse(valuesText || '{}');
    expect(values).toEqual({ name: 'John', age: 25 });
  });

  it('should throw error when useWizardForm is used outside provider', () => {
    const TestComponent = () => {
      useWizardForm();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useWizardForm must be used within Wizard component');

    consoleSpy.mockRestore();
  });

  it('should get value using getValue', () => {
    const TestComponent = () => {
      const { getValue } = useWizardForm();
      return <div data-testid="value">{getValue('test') || 'empty'}</div>;
    };

    render(
      <WizardFormProvider initialValues={{ test: 'value' }}>
        <TestComponent />
      </WizardFormProvider>
    );

    expect(screen.getByTestId('value')).toHaveTextContent('value');
  });
});
