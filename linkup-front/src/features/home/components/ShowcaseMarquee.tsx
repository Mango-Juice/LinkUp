import { memo } from "react";
import { motion } from "framer-motion";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoAirplane } from "react-icons/io5";
import type { MentorInfo } from "../../../types/MentorInfo";
import { showcaseMentors } from "../../../constants/mockData";

const MarqueeGhostCard = memo<{ mentor: MentorInfo }>(function MarqueeGhostCard({ mentor }) {
  const avatarConfig: AvatarFullConfig = genConfig(mentor.name);

  return (
    <div className="flex flex-col items-center gap-2 p-3 border shadow-md select-none shrink-0 opacity-70 w-36 sm:w-40 md:w-44 lg:w-48 sm:p-4 md:p-5 rounded-2xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur border-neutral-200 dark:border-neutral-700">
      <Avatar
        className="w-10 h-10 rounded-full shadow sm:w-12 md:w-14 sm:h-12 md:h-14 ring-2 ring-white dark:ring-neutral-700"
        {...avatarConfig}
      />
      <div className="text-xs font-semibold text-center text-neutral-700 dark:text-neutral-300 line-clamp-1">
        {mentor.name}
      </div>
      <div className="text-[10px] text-neutral-500 dark:text-neutral-500 line-clamp-1 text-center">
        {mentor.jobTitle}
      </div>
    </div>
  );
});

interface ShowcaseMarqueeProps {
  onExploreClick?: () => void;
}

const ShowcaseMarquee = memo<ShowcaseMarqueeProps>(function ShowcaseMarquee({
  onExploreClick,
}) {
  const items = [...showcaseMentors, ...showcaseMentors];

  return (
    <div className="relative w-full overflow-hidden bg-transparent rounded-xl min-h-[120px] mx-auto mb-4">
      <motion.div
        className="flex w-[50vw] gap-2 px-4 py-2 sm:gap-3 md:gap-4 sm:px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {items.map((m, i) => (
          <MarqueeGhostCard key={m.name + i} mentor={m} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 flex backdrop-blur-[2px]" />
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <button
          type="button"
          onClick={onExploreClick}
          className="px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-primary-500 dark:bg-primary-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-primary-600 dark:hover:bg-primary-500 hover:shadow-xl hover:scale-[1.01] active:scale-[0.96] transition-all duration-300 flex items-center gap-1 pointer-events-auto"
        >
          <IoAirplane className="rotate-[320deg] w-3 h-3 sm:w-4 sm:h-4" />
          탐색하기
        </button>
      </div>
    </div>
  );
});

export default ShowcaseMarquee;
