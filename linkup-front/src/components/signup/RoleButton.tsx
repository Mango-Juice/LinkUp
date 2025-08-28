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
      className={`flex flex-col items-center p-4 w-[250px] border rounded-lg shadow-lg ${
        disabled
          ? "cursor-default border-none"
          : "hover:shadow-md hover:bg-primary-50 hover:scale-105 transition"
      }`}
    >
      <img src={icon} alt={label} className="w-32 h-32 mb-2" />
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-sm text-gray-500 text-center">{description}</div>
    </button>
  );
};

export default RoleButton;
