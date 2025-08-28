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
      <div className="text-2xl font-extrabold transition-colors duration-300 md:text-3xl lg:text-4xl text-primary-500 dark:text-primary-400 font-title">
        LINK UP
      </div>
      <div className="my-0 text-xs font-medium transition-colors duration-300 text-neutral-500 dark:text-neutral-400">
        현직자와 만나는 커피챗 타임
      </div>
    </div>
  );
};

export default Logo;
