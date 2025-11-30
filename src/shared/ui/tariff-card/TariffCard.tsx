import React from 'react';
import { useWizardForm } from '@/shared/lib';

export interface TariffCardProps {
  name: string;
  value: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const TariffCard: React.FC<TariffCardProps> = ({
  name,
  value,
  title,
  price,
  description,
  features,
  recommended = false,
}) => {
  const { values, setValue } = useWizardForm();
  const isSelected = values[name] === value;

  const handleClick = () => {
    setValue(name, value);
  };

  return (
    <div
      className={`tariff-card ${isSelected ? 'selected' : ''} ${recommended ? 'recommended' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {recommended && <div className="tariff-card-badge">Recommended</div>}
      <div className="tariff-card-header">
        <h3 className="tariff-card-title">{title}</h3>
        <div className="tariff-card-price">{price}</div>
      </div>
      <p className="tariff-card-description">{description}</p>
      <ul className="tariff-card-features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="tariff-card-radio">
        <input
          type="radio"
          name={name}
          value={value}
          checked={isSelected}
          onChange={handleClick}
          readOnly
        />
      </div>
    </div>
  );
};
