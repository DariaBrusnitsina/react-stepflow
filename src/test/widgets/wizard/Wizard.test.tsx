import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wizard, useWizard } from '@/widgets/wizard';
import { Step } from '@/widgets/wizard';
import { Input } from '@/shared/ui';

describe('Wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render first step by default', () => {
    const onFinish = vi.fn();

    render(
      <Wizard onFinish={onFinish}>
        <Step title="Step 1">
          <div>Step 1 content</div>
        </Step>
        <Step title="Step 2">
          <div>Step 2 content</div>
        </Step>
      </Wizard>
    );

    // Check step title in content (not in indicator)
    expect(screen.getByRole('heading', { name: 'Step 1' })).toBeInTheDocument();
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    // Step 2 should not be in content, but may be in indicator
    expect(screen.queryByRole('heading', { name: 'Step 2' })).not.toBeInTheDocument();
  });

  it('should call onFinish when form is submitted', async () => {
    const onFinish = vi.fn();

    render(
      <Wizard onFinish={onFinish}>
        <Step title="Step 1">
          <Input name="test" />
        </Step>
      </Wizard>
    );

    const submitButton = screen.getByText('SUBMIT');
    const user = userEvent.setup();

    await user.click(submitButton);

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
  });

  it('should pass collected data to onFinish', async () => {
    const onFinish = vi.fn();

    render(
      <Wizard onFinish={onFinish}>
        <Step title="Step 1">
          <Input name="name" />
        </Step>
      </Wizard>
    );

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByText('SUBMIT');
    const user = userEvent.setup();

    await user.type(input, 'John');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ name: 'John' }));
    });
  });

  it('should use initialData', async () => {
    const TestComponent = () => {
      const { data } = useWizard();
      return <div data-testid="data">{JSON.stringify(data)}</div>;
    };

    render(
      <Wizard onFinish={vi.fn()} initialData={{ name: 'Initial' }}>
        <Step>
          <TestComponent />
        </Step>
      </Wizard>
    );

    // Wait for initial data to be set
    await waitFor(() => {
      const dataElement = screen.getByTestId('data');
      expect(dataElement.textContent).toContain('Initial');
    });
  });

  it('should filter out non-Step children', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <div>Not a step</div>
        <Step title="Step 1">Content</Step>
        <span>Also not a step</span>
      </Wizard>
    );

    // Check step title in content area
    expect(screen.getByRole('heading', { name: 'Step 1' })).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should provide wizard context to children', () => {
    const TestComponent = () => {
      const { currentStep, totalSteps, isFirstStep, isLastStep } = useWizard();
      return (
        <div>
          <div data-testid="current">{currentStep}</div>
          <div data-testid="total">{totalSteps}</div>
          <div data-testid="first">{isFirstStep ? 'true' : 'false'}</div>
          <div data-testid="last">{isLastStep ? 'true' : 'false'}</div>
        </div>
      );
    };

    render(
      <Wizard onFinish={vi.fn()}>
        <Step>
          <TestComponent />
        </Step>
      </Wizard>
    );

    expect(screen.getByTestId('current')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('1');
    expect(screen.getByTestId('first')).toHaveTextContent('true');
    expect(screen.getByTestId('last')).toHaveTextContent('true');
  });

  it('should throw error when useWizard is used outside Wizard', () => {
    const TestComponent = () => {
      useWizard();
      return <div>Test</div>;
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useWizard must be used within Wizard component');

    consoleSpy.mockRestore();
  });
});
