import React, { memo } from "react";
import { COMMON_STYLES } from "../../constants/styles";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  full?: boolean;
  primary?: boolean;
}

const PrimaryButton = memo<PrimaryButtonProps>(function PrimaryButton({
  children,
  full = true,
  className = "",
  primary = false,
  disabled = false,
  ...rest
}) {
  const classes = [
    full && "w-full",
    "rounded-md py-2 px-4 text-sm font-medium",
    `${COMMON_STYLES.BUTTON_SCALE_DOWN} cursor-pointer ${COMMON_STYLES.TRANSITION_ALL}`,
    COMMON_STYLES.BUTTON_DISABLED,
    primary
      ? "bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 disabled:hover:bg-primary-500 dark:disabled:hover:bg-primary-600"
      : "bg-white dark:bg-neutral-800 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 border border-primary-500 dark:border-primary-400 disabled:hover:bg-white dark:disabled:hover:bg-neutral-800",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
});

export default PrimaryButton;
