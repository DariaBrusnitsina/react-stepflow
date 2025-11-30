import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { createWizardMachine } from './wizard-machine';

describe('WizardMachine', () => {
  it('should initialize with first step', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    expect(actor.getSnapshot().context.stepIndex).toBe(0);
    expect(actor.getSnapshot().context.totalSteps).toBe(3);
    expect(actor.getSnapshot().context.data).toEqual({});
    expect(actor.getSnapshot().value).toBe('editing');
  });

  it('should move to next step on NEXT event', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'NEXT' });

    expect(actor.getSnapshot().context.stepIndex).toBe(1);
  });

  it('should not move beyond last step', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'NEXT' });
    actor.send({ type: 'NEXT' });
    actor.send({ type: 'NEXT' }); // Should not move beyond step 2

    expect(actor.getSnapshot().context.stepIndex).toBe(2);
  });

  it('should move to previous step on PREV event', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'NEXT' });
    actor.send({ type: 'NEXT' });
    actor.send({ type: 'PREV' });

    expect(actor.getSnapshot().context.stepIndex).toBe(1);
  });

  it('should not move before first step', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'PREV' }); // Should not move before step 0

    expect(actor.getSnapshot().context.stepIndex).toBe(0);
  });

  it('should update data on UPDATE_DATA event', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'UPDATE_DATA', data: { name: 'John' } });

    expect(actor.getSnapshot().context.data).toEqual({ name: 'John' });
  });

  it('should merge data on multiple UPDATE_DATA events', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'UPDATE_DATA', data: { name: 'John' } });
    actor.send({ type: 'UPDATE_DATA', data: { age: 30 } });

    expect(actor.getSnapshot().context.data).toEqual({ name: 'John', age: 30 });
  });

  it('should transition to submitting on SUBMIT when on last step', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'NEXT' });
    actor.send({ type: 'NEXT' });
    actor.send({ type: 'SUBMIT' });

    expect(actor.getSnapshot().value).toBe('submitting');
  });

  it('should not transition to submitting on SUBMIT when not on last step', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'SUBMIT' });

    expect(actor.getSnapshot().value).toBe('editing');
    expect(actor.getSnapshot().context.stepIndex).toBe(0);
  });

  it('should transition to finished after submitting', () => {
    const machine = createWizardMachine(3);
    const actor = createActor(machine).start();

    actor.send({ type: 'NEXT' });
    actor.send({ type: 'NEXT' });
    actor.send({ type: 'SUBMIT' });
    actor.send({ type: 'SUBMIT' });

    expect(actor.getSnapshot().value).toBe('finished');
  });

  it('should work with single step', () => {
    const machine = createWizardMachine(1);
    const actor = createActor(machine).start();

    expect(actor.getSnapshot().context.stepIndex).toBe(0);
    expect(actor.getSnapshot().context.totalSteps).toBe(1);

    actor.send({ type: 'SUBMIT' });
    expect(actor.getSnapshot().value).toBe('submitting');
  });

  it('should work with many steps', () => {
    const machine = createWizardMachine(10);
    const actor = createActor(machine).start();

    for (let i = 0; i < 9; i++) {
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().context.stepIndex).toBe(i + 1);
    }

    expect(actor.getSnapshot().context.stepIndex).toBe(9);
  });
});
