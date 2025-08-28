interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
  const classes = ["flex flex-col justify-center select-none", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div className="text-4xl font-extrabold text-primary-500 font-title">
        LINK UP
      </div>
      <div className="my-0 text-xs font-medium tracking-wider text-gray-500">
        현직자와 만나는 커피챗 타임
      </div>
    </div>
  );
};

export default Logo;
