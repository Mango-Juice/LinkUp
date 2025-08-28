interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
  return (
    <div
      className={`flex flex-col justify-center select-none ${className}`}
      onClick={onClick}
    >
      <div className="text-4xl font-extrabold text-primary-500">LINK UP</div>
      <div className="text-xs font-medium text-gray-500 my-0">
        현직자와 만나는 커피챗 타임
      </div>
    </div>
  );
};

export default Logo;
