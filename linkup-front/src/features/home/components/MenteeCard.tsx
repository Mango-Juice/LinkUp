import { memo } from "react";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import type { MenteeInfo } from "../../../types/MenteeInfo";
import { parseTagsFromString, getCardBaseClasses, getTagClasses, getAvatarClasses } from "../../../utils/cardHelpers";
import { COMMON_STYLES } from "../../../constants/styles";

interface MenteeCardProps {
  mentee: MenteeInfo;
}

const MenteeCard = memo<MenteeCardProps>(function MenteeCard({ mentee }) {
  const avatarConfig: AvatarFullConfig = genConfig(mentee.name);
  const interests = parseTagsFromString(mentee.interests, 3);

  return (
    <div className={getCardBaseClasses("mentee")}>
      <div className="flex flex-col items-center justify-between flex-1 gap-2 text-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar
            className={getAvatarClasses("md")}
            {...avatarConfig}
          />
          <div className="flex flex-col gap-1">
            <div className={`text-sm font-semibold line-clamp-1 ${COMMON_STYLES.TEXT_PRIMARY} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {mentee.name}
            </div>
            <div className={`text-[11px] font-medium line-clamp-1 text-center h-8 flex items-center justify-center ${COMMON_STYLES.TEXT_SECONDARY} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {mentee.age}세
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-1 overflow-hidden max-h-12">
          {interests.map((t) => (
            <span key={t} className={`${getTagClasses()} ${COMMON_STYLES.TRANSITION_COLORS}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MenteeCard;
