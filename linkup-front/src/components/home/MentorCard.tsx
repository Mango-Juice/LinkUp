import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import type { MentorInfo } from "../../types/MentorInfo";

interface MentorCardProps {
  mentor: MentorInfo;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const avatarConfig: AvatarFullConfig = genConfig(mentor.name);
  const tags = mentor.tags.split(/[\s,]+/).filter(Boolean).slice(0, 3);

  return (
    <div className="group relative w-56 p-5 rounded-2xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur border border-gray-200 dark:border-neutral-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex flex-col items-center text-center gap-3">
        <Avatar
          className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-neutral-700 shadow-md"
          {...avatarConfig}
        />
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sm text-gray-800 dark:text-neutral-200 line-clamp-1">
            {mentor.name}
          </div>
          <div className="text-[11px] font-medium text-gray-600 dark:text-neutral-400 line-clamp-1">
            {mentor.jobTitle}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}