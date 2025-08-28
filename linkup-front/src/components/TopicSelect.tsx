import React from "react";

interface TopicOption {
  value: string;
  label: string;
}

const DEFAULT_OPTIONS: TopicOption[] = [
  { value: "입시", label: "입시" },
  { value: "전과", label: "전과" },
  { value: "해외진학", label: "해외진학" },
  { value: "직무", label: "직무" },
];

interface TopicSelectProps {
  value: string | null;
  onChange: (value: string) => void;
  options?: TopicOption[];
  disabled?: boolean;
  label?: string;
  className?: string;
}

const TopicSelect: React.FC<TopicSelectProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  disabled = false,
  label = "상담 주제",
  className = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
      )}
      <div className="grid grid-cols-2 gap-2">
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
              className={`px-3 py-2 rounded-md border text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400
              ${
                selected
                  ? "bg-primary-400 text-white shadow"
                  : "bg-white hover:bg-primary-50 border-gray-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelect;
