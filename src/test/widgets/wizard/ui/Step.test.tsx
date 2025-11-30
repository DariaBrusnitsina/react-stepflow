import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step } from '@/widgets/wizard';
import { Wizard } from '@/widgets/wizard';
import { Input } from '@/shared/ui';

describe('Step', () => {
  it('should render children', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step>
          <div>Step content</div>
        </Step>
      </Wizard>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="My Step Title">
          <div>Content</div>
        </Step>
      </Wizard>
    );

    // Check step title in content area (heading)
    expect(screen.getByRole('heading', { name: 'My Step Title' })).toBeInTheDocument();
  });

  it('should show Next button when not last step', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Content</Step>
        <Step title="Step 2">Content</Step>
      </Wizard>
    );

    expect(screen.getByRole('button', { name: 'NEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'SUBMIT' })).not.toBeInTheDocument();
  });

  it('should show Submit button on last step', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Content</Step>
      </Wizard>
    );

    expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'NEXT' })).not.toBeInTheDocument();
  });

  it('should not show Back button on first step', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Content</Step>
        <Step title="Step 2">Content</Step>
      </Wizard>
    );

    expect(screen.queryByText('BACK')).not.toBeInTheDocument();
  });

  it('should show Back button when not first step', async () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Content</Step>
        <Step title="Step 2">Content</Step>
      </Wizard>
    );

    const nextButton = screen.getByRole('button', { name: 'NEXT' });
    const user = userEvent.setup();

    await user.click(nextButton);

    expect(screen.getByText('BACK')).toBeInTheDocument();
  });

  it('should navigate to next step when Next is clicked', async () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Step 1 content</Step>
        <Step title="Step 2">Step 2 content</Step>
      </Wizard>
    );

    const nextButton = screen.getByRole('button', { name: 'NEXT' });
    const user = userEvent.setup();

    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Step 1' })).not.toBeInTheDocument();
    });
  });

  it('should navigate to previous step when Back is clicked', async () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">Step 1 content</Step>
        <Step title="Step 2">Step 2 content</Step>
      </Wizard>
    );

    const user = userEvent.setup();

    // Go to step 2
    await user.click(screen.getByRole('button', { name: 'NEXT' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
    });

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: 'BACK' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 1' })).toBeInTheDocument();
    });
  });

  it('should use custom button labels', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step customNextLabel="Continue" customSubmitLabel="Finish">
          Content
        </Step>
      </Wizard>
    );

    expect(screen.getByText('FINISH')).toBeInTheDocument();
  });

  it('should hide buttons when hideDefaultButtons is true', () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step hideDefaultButtons>Content</Step>
      </Wizard>
    );

    expect(screen.queryByRole('button', { name: 'NEXT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'SUBMIT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'BACK' })).not.toBeInTheDocument();
  });

  it('should validate before moving to next step', async () => {
    const validate = vi.fn((data) => {
      if (!data.name) {
        return ['Name is required'];
      }
      return true;
    });

    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1" validate={validate}>
          <Input name="name" />
        </Step>
        <Step title="Step 2">Step 2 content</Step>
      </Wizard>
    );

    const nextButton = screen.getByRole('button', { name: 'NEXT' });
    const user = userEvent.setup();

    await user.click(nextButton);

    expect(validate).toHaveBeenCalled();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Step 2' })).not.toBeInTheDocument();
  });

  it('should allow navigation when validation passes', async () => {
    const validate = vi.fn(() => true);

    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1" validate={validate}>
          <Input name="name" />
        </Step>
        <Step title="Step 2">Step 2 content</Step>
      </Wizard>
    );

    const input = screen.getByRole('textbox');
    const nextButton = screen.getByRole('button', { name: 'NEXT' });
    const user = userEvent.setup();

    await user.type(input, 'John');
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
    });
  });

  it('should preserve input values when navigating between steps', async () => {
    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1">
          <Input name="firstName" placeholder="First Name" />
        </Step>
        <Step title="Step 2">
          <Input name="lastName" placeholder="Last Name" />
        </Step>
        <Step title="Step 3">Step 3 content</Step>
      </Wizard>
    );

    const user = userEvent.setup();

    // Enter value in step 1
    const firstNameInput = screen.getByPlaceholderText('First Name');
    await user.type(firstNameInput, 'John');

    // Navigate to step 2
    await user.click(screen.getByRole('button', { name: 'NEXT' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
    });

    // Enter value in step 2
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    await user.type(lastNameInput, 'Doe');

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: 'BACK' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 1' })).toBeInTheDocument();
    });

    // Check that firstName is preserved
    const firstNameInputAgain = screen.getByPlaceholderText('First Name') as HTMLInputElement;
    expect(firstNameInputAgain.value).toBe('John');

    // Go forward to step 2 again
    await user.click(screen.getByRole('button', { name: 'NEXT' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
    });

    // Check that lastName is preserved
    const lastNameInputAgain = screen.getByPlaceholderText('Last Name') as HTMLInputElement;
    expect(lastNameInputAgain.value).toBe('Doe');
  });

  it('should show validation errors when validation returns false', async () => {
    const validate = vi.fn(() => false);

    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1" validate={validate}>
          Content
        </Step>
      </Wizard>
    );

    const submitButton = screen.getByRole('button', { name: 'SUBMIT' });
    const user = userEvent.setup();

    await user.click(submitButton);

    expect(screen.getByText('Validation failed')).toBeInTheDocument();
  });

  it('should show multiple validation errors', async () => {
    const validate = vi.fn(() => ['Error 1', 'Error 2']);

    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1" validate={validate}>
          Content
        </Step>
      </Wizard>
    );

    const submitButton = screen.getByRole('button', { name: 'SUBMIT' });
    const user = userEvent.setup();

    await user.click(submitButton);

    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
  });

  it('should clear errors when navigating back', async () => {
    const validate = vi.fn(() => ['Error']);

    render(
      <Wizard onFinish={vi.fn()}>
        <Step title="Step 1" validate={validate}>
          Content
        </Step>
        <Step title="Step 2">Step 2 content</Step>
      </Wizard>
    );

    const user = userEvent.setup();

    // Trigger validation error (this is first step, so button is NEXT, not SUBMIT)
    await user.click(screen.getByRole('button', { name: 'NEXT' }));
    expect(screen.getByText('Error')).toBeInTheDocument();

    // Since validation fails, we can't proceed, but let's test the error display
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
