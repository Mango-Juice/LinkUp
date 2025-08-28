import { memo } from "react";
import { COMMON_STYLES, RESPONSIVE_STYLES } from "../../constants/styles";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  buttonLabel?: string;
}

const FormField = memo<FormFieldProps>(function FormField({
  label,
  id,
  containerClassName = "",
  className = "",
  buttonLabel,
  ...rest
}) {
  return (
    <div
      className={`${RESPONSIVE_STYLES.FORM_FIELD_CONTAINER} ${containerClassName}`}
    >
      <label
        htmlFor={id}
        className={`${RESPONSIVE_STYLES.FORM_FIELD_LABEL} text-left ${COMMON_STYLES.TEXT_SECONDARY} ${COMMON_STYLES.TRANSITION_COLORS}`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`${RESPONSIVE_STYLES.FORM_FIELD_INPUT} ${COMMON_STYLES.TEXT_PRIMARY} ${COMMON_STYLES.TRANSITION_COLORS} ${className}`}
        {...rest}
      />
      {buttonLabel && (
        <button
          type="button"
          className={`px-3 py-2 bg-neutral-400 dark:bg-neutral-600 text-white text-sm rounded-md hover:bg-neutral-500 dark:hover:bg-neutral-500 ${COMMON_STYLES.TRANSITION_COLORS}`}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
});

export default FormField;
