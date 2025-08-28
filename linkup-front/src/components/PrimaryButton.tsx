import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  full?: boolean;
  primary?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  full = true,
  className = "",
  primary = false,
  disabled = false,
  ...rest
}) => {
  const classes = [
    full && "w-full",
    "rounded-md py-2 px-4 text-sm font-medium",
    "active:scale-[0.99] cursor-pointer transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
    primary
      ? "bg-primary-500 text-white hover:bg-primary-600 disabled:hover:bg-primary-500"
      : "bg-white text-primary-500 hover:bg-primary-50 border border-primary-500 disabled:hover:bg-white",
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
