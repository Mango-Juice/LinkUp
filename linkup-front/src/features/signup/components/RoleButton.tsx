import { COMMON_STYLES } from "../../../constants/styles";

interface RoleButtonProps {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const RoleButton = ({
  icon,
  label,
  description,
  onClick,
  disabled,
}: RoleButtonProps) => {
  return (
    <button
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={`flex flex-col items-center p-4 w-full min-w-[300px] max-w-[320px] border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg bg-white dark:bg-neutral-800 ${COMMON_STYLES.TRANSITION_ALL} ${
        disabled
          ? "cursor-default border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20"
          : `hover:shadow-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600 ${COMMON_STYLES.BUTTON_SCALE_UP}`
      }`}
    >
      <img src={icon} alt={label} className="w-32 h-32 mb-2" />
      <div className={`text-base md:text-lg font-semibold text-center ${COMMON_STYLES.TEXT_PRIMARY} ${COMMON_STYLES.TRANSITION_COLORS}`}>{label}</div>
      <div className={`text-xs md:text-sm text-center px-2 ${COMMON_STYLES.TEXT_MUTED} ${COMMON_STYLES.TRANSITION_COLORS}`}>{description}</div>
    </button>
  );
};

export default RoleButton;
