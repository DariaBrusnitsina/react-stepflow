/**
 * Example Application: Cleaning Service Subscription Form
 *
 * This file demonstrates how to use the Wizard component library to create
 * a multi-step form with validation, conditional steps, and custom styling.
 *
 * Project Structure:
 * - This file (App.tsx): Main application component with form structure
 * - ./schemas.ts: Zod validation schemas for all form steps
 * - ./constants.ts: Mock data and constants (select options, initial values)
 * - ./styles.css: Application-specific styles (not part of the library)
 *
 * Library Components Used:
 * - Wizard: Main wrapper component managing form state and navigation
 * - Step: Individual form step with built-in validation and navigation buttons
 * - Input, Checkbox, Radio, Textarea, Select: Form input components
 * - TariffCard: Custom card component for tariff selection
 *
 * Key Features Demonstrated:
 * - Multi-step form with conditional steps (individual vs business clients)
 * - Zod schema validation with custom error messages
 * - Pre-selected default values for radio buttons and selects
 * - Dynamic step visibility based on form data
 * - Custom styling and UI/UX enhancements
 */

import React from 'react';
import { Wizard, useWizard } from '@/widgets/wizard';
import { Step } from '@/widgets/wizard';
import { Input, Checkbox, Radio, Textarea, Select, TariffCard } from '@/shared/ui';
import {
  clientTypeSchema,
  individualPersonalInfoSchema,
  businessInfoSchema,
  addressSchema,
  cleaningDetailsSchema,
  businessCleaningDetailsSchema,
  additionalServicesSchema,
  tariffSchema,
  agreementSchema,
} from './schemas';
import {
  frequencies,
  cleaningTypes,
  businessFrequencies,
  businessCleaningTypes,
  initialFormData,
} from './constants';
import './styles.css';

const Summary: React.FC = () => {
  const { data } = useWizard();

  return (
    <div className="summary">
      <h3>Order Summary</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const App: React.FC = () => {
  const handleFinish = (_data: Record<string, any>) => {
    alert('Order submitted! Check console for data.');
  };

  return (
    <div className="app">
      <h1>Cleaning Service Subscription</h1>
      <Wizard onFinish={handleFinish} debug={true} initialData={initialFormData}>
        <Step title="Welcome" customNextLabel="Get Started">
          <div className="welcome-step">
            <div className="welcome-header">
              <div className="welcome-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="30" fill="#1976d2" opacity="0.1" />
                  <path
                    d="M32 16L36 24H44L37 30L39 38L32 33L25 38L27 30L20 24H28L32 16Z"
                    fill="#1976d2"
                  />
                  <path d="M20 44H44V48H20V44Z" fill="#1976d2" />
                </svg>
              </div>
              <h2 className="welcome-title">Professional Cleaning Service</h2>
              <p className="welcome-subtitle">
                Get your space sparkling clean with our professional cleaning services. Trusted by
                thousands of satisfied customers.
              </p>
            </div>

            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="welcome-feature-icon">✓</div>
                <div className="welcome-feature-content">
                  <h3>Expert Cleaners</h3>
                  <p>Professional, trained, and insured cleaning staff</p>
                </div>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">✓</div>
                <div className="welcome-feature-content">
                  <h3>Flexible Scheduling</h3>
                  <p>Choose the frequency that works best for you</p>
                </div>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">✓</div>
                <div className="welcome-feature-content">
                  <h3>Eco-Friendly Products</h3>
                  <p>Safe for your family, pets, and the environment</p>
                </div>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">✓</div>
                <div className="welcome-feature-content">
                  <h3>Satisfaction Guaranteed</h3>
                  <p>100% satisfaction or we'll come back free of charge</p>
                </div>
              </div>
            </div>

            <div className="welcome-cta">
              <p className="welcome-cta-text">
                Ready to get started? Let's set up your cleaning service in just a few simple steps.
              </p>
            </div>
          </div>
        </Step>

        <Step title="Client Type" schema={clientTypeSchema}>
          <div className="form-group">
            <label data-label="Select client type" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#616161', fontWeight: 'normal' }}>
                Choose the option that applies to you
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="radio-wrapper">
                <Radio name="clientType" value="individual">
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Individual</div>
                    <div style={{ fontSize: '13px', color: '#616161' }}>
                      For homes and apartments
                    </div>
                  </div>
                </Radio>
              </div>
              <div className="radio-wrapper">
                <Radio name="clientType" value="business">
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Business</div>
                    <div style={{ fontSize: '13px', color: '#616161' }}>
                      For offices and commercial spaces
                    </div>
                  </div>
                </Radio>
              </div>
            </div>
          </div>
        </Step>

        {/* Personal Information for Individuals */}
        <Step
          title="Personal Information"
          condition={(data) => data.clientType === 'individual'}
          schema={individualPersonalInfoSchema}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #90caf9',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#1565c0', fontWeight: '500' }}>
              ℹ️ This step is for individual clients. Please provide your personal contact
              information.
            </p>
          </div>
          <div className="form-group">
            <label data-label="First Name">
              <Input name="firstName" placeholder="Enter your first name" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Last Name">
              <Input name="lastName" placeholder="Enter your last name" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Phone Number">
              <Input name="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Email Address">
              <Input name="email" type="email" placeholder="Enter your email" />
            </label>
          </div>
        </Step>

        {/* Business Information */}
        <Step
          title="Business Information"
          condition={(data) => data.clientType === 'business'}
          schema={businessInfoSchema}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f3e5f5',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #ce93d8',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#7b1fa2', fontWeight: '500' }}>
              ℹ️ This step is for business clients. Please provide your company information and
              contact details.
            </p>
          </div>
          <div className="form-group">
            <label data-label="Company Name">
              <Input name="companyName" placeholder="Enter company name" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Contact Person">
              <Input name="contactPerson" placeholder="Full name of contact person" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Phone Number">
              <Input name="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Email Address">
              <Input name="email" type="email" placeholder="Enter company email" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Tax ID (optional)">
              <Input name="taxId" placeholder="Enter tax identification number" />
            </label>
          </div>
        </Step>

        {/* Address for both types */}
        <Step title="Service Address" schema={addressSchema}>
          <div className="form-group">
            <label data-label="Street Address">
              <Input name="address" placeholder="123 Main Street" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="City">
              <Input name="city" placeholder="Enter your city" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Zip Code">
              <Input name="zipCode" placeholder="12345" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Apartment/Office Number (optional)">
              <Input name="apartment" placeholder="Apt 4B, Office 201, etc." />
            </label>
          </div>
        </Step>

        {/* Cleaning Details for Individuals */}
        <Step
          title="Cleaning Details"
          condition={(data) => data.clientType === 'individual'}
          schema={cleaningDetailsSchema}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #90caf9',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#1565c0', fontWeight: '500' }}>
              ℹ️ Individual cleaning service details. Tell us about your home cleaning needs.
            </p>
          </div>
          <div className="form-group">
            <label data-label="Apartment/House Area (m²)">
              <Input name="area" type="number" placeholder="Enter area in square meters" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Cleaning Frequency">
              <Select name="frequency" options={frequencies} required />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Type of Cleaning">
              <Select name="cleaningType" options={cleaningTypes} required />
            </label>
          </div>
        </Step>

        {/* Cleaning Details for Business */}
        <Step
          title="Cleaning Details"
          condition={(data) => data.clientType === 'business'}
          schema={businessCleaningDetailsSchema}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f3e5f5',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #ce93d8',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#7b1fa2', fontWeight: '500' }}>
              ℹ️ Business cleaning service details. Provide information about your office or
              commercial space.
            </p>
          </div>
          <div className="form-group">
            <label data-label="Office Area (m²)">
              <Input name="area" type="number" placeholder="Enter office area in square meters" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Number of Employees">
              <Input name="employees" type="number" placeholder="Enter number of employees" />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Cleaning Frequency">
              <Select name="frequency" options={businessFrequencies} required />
            </label>
          </div>
          <div className="form-group">
            <label data-label="Type of Cleaning">
              <Select name="cleaningType" options={businessCleaningTypes} required />
            </label>
          </div>
        </Step>

        {/* Additional Services */}
        <Step title="Additional Services" schema={additionalServicesSchema}>
          <div className="form-group">
            <label data-label="Select Additional Services" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#616161', fontWeight: 'normal' }}>
                Choose any additional services you need (optional)
              </span>
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="windows">
                  Window cleaning
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="oven">
                  Oven cleaning
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="fridge">
                  Refrigerator cleaning
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="carpet">
                  Carpet cleaning
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="laundry">
                  Laundry service
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="ironing">
                  Ironing service
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="additionalServices" value="other">
                  Other services
                </Checkbox>
              </div>
            </div>
          </div>
        </Step>

        {/* Other Services Details - shown only if "other" is selected */}
        <Step
          title="Other Services Details"
          condition={(data) => {
            const services = data.additionalServices;
            return Array.isArray(services) && services.includes('other');
          }}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #ffb74d',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#e65100', fontWeight: '500' }}>
              ℹ️ You selected "Other services". Please specify what additional services you need.
            </p>
          </div>
          <div className="form-group">
            <label data-label="Please specify other services">
              <Textarea
                name="otherServicesDetails"
                placeholder="Please describe what other services you need (e.g., balcony cleaning, garage cleaning, etc.)..."
                rows={4}
              />
            </label>
          </div>
        </Step>

        {/* Tariff Selection */}
        <Step title="Choose Your Plan" schema={tariffSchema}>
          <div className="tariff-cards-container">
            <TariffCard
              name="tariff"
              value="basic"
              title="Basic"
              price="$50/cleaning"
              description="Perfect for small spaces and regular maintenance"
              features={[
                'Up to 50 m²',
                'Regular cleaning',
                'Standard equipment',
                'Basic supplies included',
              ]}
            />
            <TariffCard
              name="tariff"
              value="standard"
              title="Standard"
              price="$80/cleaning"
              description="Most popular choice for most homes and offices"
              features={[
                'Up to 100 m²',
                'Deep cleaning option',
                'Premium equipment',
                'Eco-friendly supplies',
                'Priority scheduling',
                'Satisfaction guarantee',
              ]}
              recommended
            />
            <TariffCard
              name="tariff"
              value="premium"
              title="Premium"
              price="$120/cleaning"
              description="For large spaces and premium service"
              features={[
                'Up to 200 m²',
                'All cleaning types',
                'Professional equipment',
                'Premium eco supplies',
                'Flexible scheduling',
                'Dedicated cleaner',
                '24/7 support',
              ]}
            />
          </div>
        </Step>

        {/* Special Instructions */}
        <Step title="Special Instructions">
          <div className="form-group">
            <label data-label="Special Instructions (optional)">
              <Textarea
                name="instructions"
                placeholder="Any special requirements, access codes, pet information, or other details we should know..."
                rows={5}
              />
            </label>
          </div>
        </Step>

        {/* Agreement */}
        <Step title="Agreement" schema={agreementSchema}>
          <div className="form-group">
            <label data-label="Legal Agreements" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#616161', fontWeight: 'normal' }}>
                Please review and accept the following agreements
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="checkbox-wrapper">
                <Checkbox name="agree">
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      I agree to the terms and conditions
                    </div>
                    <div style={{ fontSize: '13px', color: '#616161' }}>
                      By checking this, you accept our service terms
                    </div>
                  </div>
                </Checkbox>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox name="privacyPolicy">
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      I agree to the privacy policy
                    </div>
                    <div style={{ fontSize: '13px', color: '#616161' }}>
                      You consent to our data processing practices
                    </div>
                  </div>
                </Checkbox>
              </div>
            </div>
          </div>
        </Step>

        <Step title="Review & Confirm">
          <Summary />
        </Step>
      </Wizard>
    </div>
  );
};
