import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  buttonLabel?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  containerClassName = "",
  className = "",
  buttonLabel,
  ...rest
}) => {
  return (
    <div className={`flex items-center gap-3 ${containerClassName}`}>
      <label
        htmlFor={id}
        className="w-10 shrink-0 text-sm font-medium text-neutral-600 text-left"
      >
        {label}
      </label>
      <input
        id={id}
        className={`flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${className}`}
        {...rest}
      />
      {buttonLabel && (
        <button
          type="button"
          className="px-3 py-2 bg-neutral-400 text-white text-sm rounded-md hover:bg-neutral-500 transition-colors"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default FormField;
