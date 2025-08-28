import { motion } from "framer-motion";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoAirplane } from "react-icons/io5";
import type { MentorInfo } from "../../types/MentorInfo";
import { showcaseMentors } from "../../constants/mockData";

const MarqueeGhostCard = ({ mentor }: { mentor: MentorInfo }) => {
  const avatarConfig: AvatarFullConfig = genConfig(mentor.name);

  return (
    <div className="flex flex-col items-center shrink-0 gap-2 opacity-70 border shadow-md w-48 p-5 rounded-2xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur border-gray-200 dark:border-neutral-700 select-none">
      <Avatar
        className="w-14 h-14 rounded-full ring-2 ring-white dark:ring-neutral-700 shadow"
        {...avatarConfig}
      />
      <div className="text-xs font-semibold text-gray-700 dark:text-neutral-300 line-clamp-1">
        {mentor.name}
      </div>
      <div className="text-[10px] text-gray-500 dark:text-neutral-500 line-clamp-1">
        {mentor.jobTitle}
      </div>
    </div>
  );
};

interface ShowcaseMarqueeProps {
  onExploreClick?: () => void;
}

export default function ShowcaseMarquee({ onExploreClick }: ShowcaseMarqueeProps) {
  const items = [...showcaseMentors, ...showcaseMentors];

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white dark:bg-neutral-800"
      style={{ width: "calc(100vw - 320px)" }}
    >
      <motion.div
        className="flex gap-4 py-2 px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {items.map((m, i) => (
          <MarqueeGhostCard key={m.name + i} mentor={m} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 flex backdrop-blur-[2px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onExploreClick}
          className="px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold shadow-lg hover:bg-primary-400 hover:shadow-xl hover:scale-[1.01] active:scale-[0.96] transition flex items-center gap-1"
        >
          <IoAirplane className="rotate-[320deg]" />
          탐색하기
        </button>
      </div>
    </div>
  );
}
