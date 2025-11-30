import { setup, assign } from 'xstate';
import type { WizardMachineContext, WizardMachineEvent } from './types';

export const createWizardMachine = (totalSteps: number) => {
  return setup({
    types: {
      context: {} as WizardMachineContext,
      events: {} as WizardMachineEvent,
    },
    guards: {
      isNotFirstStep: ({ context }) => context.stepIndex > 0,
      isNotLastStep: ({ context }) => context.stepIndex < context.totalSteps - 1,
      isLastStep: ({ context }) => context.stepIndex === context.totalSteps - 1,
    },
    actions: {
      incrementStep: assign({
        stepIndex: ({ context }) => {
          const nextIndex = context.stepIndex + 1;
          return Math.min(nextIndex, context.totalSteps - 1);
        },
      }),
      decrementStep: assign({
        stepIndex: ({ context }) => {
          const prevIndex = context.stepIndex - 1;
          return Math.max(prevIndex, 0);
        },
      }),
      updateData: assign({
        data: ({ context, event }) => {
          if (event.type === 'UPDATE_DATA') {
            return { ...context.data, ...event.data };
          }
          return context.data;
        },
      }),
      updateTotalSteps: assign({
        totalSteps: ({ context, event }) => {
          if (event.type === 'UPDATE_TOTAL_STEPS') {
            return event.totalSteps;
          }
          return context.totalSteps;
        },
        stepIndex: ({ context, event }) => {
          if (event.type === 'UPDATE_TOTAL_STEPS') {
            const newTotalSteps = event.totalSteps;
            // Adjust stepIndex if it's out of bounds
            return Math.min(context.stepIndex, Math.max(0, newTotalSteps - 1));
          }
          return context.stepIndex;
        },
      }),
    },
  }).createMachine({
    id: 'wizard',
    initial: 'editing',
    context: {
      stepIndex: 0,
      totalSteps,
      data: {},
    },
    states: {
      editing: {
        on: {
          NEXT: {
            guard: 'isNotLastStep',
            actions: 'incrementStep',
          },
          PREV: {
            guard: 'isNotFirstStep',
            actions: 'decrementStep',
          },
          UPDATE_DATA: {
            actions: 'updateData',
          },
          UPDATE_TOTAL_STEPS: {
            actions: 'updateTotalSteps',
          },
          SUBMIT: {
            guard: 'isLastStep',
            target: 'submitting',
          },
        },
      },
      submitting: {
        on: {
          SUBMIT: {
            target: 'finished',
          },
        },
      },
      finished: {
        type: 'final',
      },
    },
  });
};
