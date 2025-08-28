import React from "react";
import { CAREER_OPTIONS } from "../constants/career";

export interface CareerOption {
  value: string;
  label: string;
}

interface CareerSelectProps {
  value: string | null;
  onChange: (val: string) => void;
  options?: CareerOption[];
  className?: string;
  disabled?: boolean;
  label?: string;
}

const CareerSelect: React.FC<CareerSelectProps> = ({
  value,
  onChange,
  options = CAREER_OPTIONS,
  className = "",
  disabled = false,
  label = "희망 진로",
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => !disabled && onChange(opt.value)}
              className={`relative px-3 py-2 rounded-md border text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400
                ${
                  selected
                    ? "bg-primary-400 text-white"
                    : "bg-white hover:bg-primary-50 border-gray-300"
                }
                ${
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CareerSelect;
