export interface SelectOption {
  value: string;
  label: string;
}

export const frequencies: SelectOption[] = [
  { value: 'once', label: 'One-time cleaning' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly (every 2 weeks)' },
  { value: 'monthly', label: 'Monthly' },
];

export const cleaningTypes: SelectOption[] = [
  { value: 'regular', label: 'Regular cleaning' },
  { value: 'deep', label: 'Deep cleaning' },
  { value: 'post-renovation', label: 'Post-renovation cleaning' },
  { value: 'move-in', label: 'Move-in/Move-out cleaning' },
];

export const businessFrequencies: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays (Mon-Fri)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const businessCleaningTypes: SelectOption[] = [
  { value: 'office', label: 'Office cleaning' },
  { value: 'deep', label: 'Deep cleaning' },
  { value: 'window', label: 'Window cleaning' },
  { value: 'carpet', label: 'Carpet cleaning' },
];

export const initialFormData = {
  clientType: 'individual',
  frequency: 'weekly',
  cleaningType: 'regular',
  tariff: 'standard',
} as const;
