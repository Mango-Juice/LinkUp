export const parseTagsFromString = (tagsString: string, maxTags: number = 3): string[] => {
  return tagsString
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, maxTags);
};

export const getCardBaseClasses = (size: "mentor" | "mentee" = "mentor"): string => {
  const sizeClasses = size === "mentee" ? "w-[240px] h-[200px]" : "w-[240px] h-[180px]";
  
  return [
    "group relative",
    sizeClasses,
    "p-4 md:p-5",
    "rounded-2xl",
    "bg-white/70 dark:bg-neutral-800/70 backdrop-blur",
    "border border-neutral-200 dark:border-neutral-700",
    "shadow-md hover:shadow-xl hover:-translate-y-1",
    "transition-all duration-300 cursor-pointer",
    "flex flex-col"
  ].join(" ");
};

export const getTagClasses = (): string => {
  return [
    "px-2 py-0.5 rounded-full",
    "bg-primary-100 dark:bg-primary-900/30",
    "text-primary-600 dark:text-primary-400",
    "text-[10px] font-medium",
    "transition-colors duration-300"
  ].join(" ");
};

export const getAvatarClasses = (size: "sm" | "md" | "lg" = "md"): string => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14", 
    lg: "w-16 h-16"
  };
  
  return [
    "rounded-full shadow-md",
    sizeClasses[size],
    "ring-4 ring-white dark:ring-neutral-700"
  ].join(" ");
};