import { z } from 'zod';

// Zod schemas for validation
export const clientTypeSchema = z.object({
  clientType: z.enum(['individual', 'business']), // Pre-selected, no validation needed
});

export const individualPersonalInfoSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  phone: z
    .string({ message: 'Phone number is required' })
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-+()]+$/, {
      message: 'Please enter a valid phone number',
    }),
  email: z.string({ message: 'Email is required' }).email('Please enter a valid email address'),
});

export const businessInfoSchema = z.object({
  companyName: z
    .string({ message: 'Company name is required' })
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  contactPerson: z
    .string({ message: 'Contact person is required' })
    .min(2, 'Contact person name must be at least 2 characters'),
  phone: z
    .string({ message: 'Phone number is required' })
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-+()]+$/, {
      message: 'Please enter a valid phone number',
    }),
  email: z.string({ message: 'Email is required' }).email('Please enter a valid email address'),
  taxId: z.string().min(5, 'Tax ID must be at least 5 characters').optional().or(z.literal('')),
});

export const addressSchema = z.object({
  address: z
    .string({ message: 'Address is required' })
    .min(5, 'Address must be at least 5 characters'),
  city: z.string({ message: 'City is required' }).min(2, 'City must be at least 2 characters'),
  zipCode: z
    .string({ message: 'Zip code is required' })
    .min(4, 'Zip code must be at least 4 characters')
    .max(10, 'Zip code must be less than 10 characters'),
  apartment: z.string().optional().or(z.literal('')),
});

export const cleaningDetailsSchema = z.object({
  area: z
    .union([z.string(), z.number()])
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Area is required',
    })
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return NaN;
        return Number(val);
      }
      return val;
    })
    .pipe(
      z
        .number()
        .refine((val) => !isNaN(val) && isFinite(val), {
          message: 'Area must be a valid number',
        })
        .int('Area must be a whole number')
        .min(10, 'Area must be at least 10 m²')
        .max(1000, 'Area must be less than 1000 m²')
    ),
  frequency: z.string(), // Pre-selected, no validation needed
  cleaningType: z.string(), // Pre-selected, no validation needed
});

export const businessCleaningDetailsSchema = z.object({
  area: z
    .union([z.string(), z.number()])
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Area is required',
    })
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return NaN;
        return Number(val);
      }
      return val;
    })
    .pipe(
      z
        .number()
        .refine((val) => !isNaN(val) && isFinite(val), {
          message: 'Area must be a valid number',
        })
        .int('Area must be a whole number')
        .min(20, 'Area must be at least 20 m²')
        .max(5000, 'Area must be less than 5000 m²')
    ),
  frequency: z.string(), // Pre-selected, no validation needed
  cleaningType: z.string(), // Pre-selected, no validation needed
  employees: z
    .union([z.string(), z.number()])
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Number of employees is required',
    })
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return NaN;
        return Number(val);
      }
      return val;
    })
    .pipe(
      z
        .number()
        .refine((val) => !isNaN(val) && isFinite(val), {
          message: 'Number of employees must be a valid number',
        })
        .int('Number of employees must be a whole number')
        .min(1, 'Must have at least 1 employee')
        .max(1000, 'Too many employees')
    ),
});

export const additionalServicesSchema = z.object({
  additionalServices: z.any().optional(),
});

export const tariffSchema = z.object({
  tariff: z.enum(['basic', 'standard', 'premium']), // Pre-selected, no validation needed
});

export const agreementSchema = z.object({
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
});
