import { memo } from "react";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import type { MentorInfo } from "../../../types/MentorInfo";
import { parseTagsFromString, getCardBaseClasses, getTagClasses, getAvatarClasses } from "../../../utils/cardHelpers";
import { COMMON_STYLES } from "../../../constants/styles";

interface MentorCardProps {
  mentor: MentorInfo;
}

const MentorCard = memo<MentorCardProps>(function MentorCard({ mentor }) {
  const avatarConfig: AvatarFullConfig = genConfig(mentor.name);
  const tags = parseTagsFromString(mentor.tags, 3);

  return (
    <div className={getCardBaseClasses("mentor")}>
      <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl ${COMMON_STYLES.GRADIENT_OVERLAY} group-hover:opacity-100`} />
      <div className="relative z-10 flex flex-col items-center justify-between flex-1 gap-2 text-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar
            className={getAvatarClasses("md")}
            {...avatarConfig}
          />
          <div className="flex flex-col gap-1">
            <div className={`text-sm font-semibold line-clamp-1 ${COMMON_STYLES.TEXT_PRIMARY} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {mentor.name}
            </div>
            <div className={`text-[11px] font-medium line-clamp-2 text-center h-6 flex items-center justify-center ${COMMON_STYLES.TEXT_SECONDARY} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {mentor.jobTitle}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-1 overflow-hidden max-h-12">
          {tags.map((t) => (
            <span key={t} className={`${getTagClasses()} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MentorCard;
