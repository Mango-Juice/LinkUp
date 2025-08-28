interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
  const classes = [
    "flex flex-col justify-center select-none cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div className="relative text-2xl font-extrabold md:text-3xl lg:text-4xl font-title">
        <span className="text-transparent transition-colors duration-500 bg-gradient-to-r from-primary-500 via-primary-400 to-violet-500 dark:from-primary-400 dark:via-primary-300 dark:to-violet-400 bg-clip-text font-title">
          LINK UP
        </span>
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <div className="my-0 text-xs font-medium transition-colors duration-300 text-neutral-500 dark:text-neutral-400">
        현직자와 만나는 커피챗 타임
      </div>
    </div>
  );
};

export default Logo;
