import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoSearch } from "react-icons/io5";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import {
  useMentorRecommendations,
  useMenteeRecommendations,
} from "../hooks/useRecommendations";
import { mockMentors, mockMentees } from "../constants/mockData";
import MentorCard from "../components/home/MentorCard";
import MenteeCard from "../components/home/MenteeCard";
import ShowcaseMarquee from "../components/home/ShowcaseMarquee";
import LoginModal from "../components/modals/LoginModal";
import ProfileDetailModal from "../components/modals/ProfileDetailModal";
import { LoadingText, ErrorText } from "../components/common/LoadingError";
import type { UserInfo } from "../types/UserInfo";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

const Home = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const isMentor = user?.role === "mentor";
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<
    MentorInfo | MenteeInfo | null
  >(null);
  const [profileType, setProfileType] = useState<"mentor" | "mentee">("mentor");

  const handleAuthRequired = (callback?: () => void) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      callback?.();
    }
  };

  const handleExploreClick = () => {
    handleAuthRequired(() => {
      navigate("/explore");
    });
  };

  const handleProfileClick = (
    profile: MentorInfo | MenteeInfo,
    type: "mentor" | "mentee"
  ) => {
    setSelectedProfile(profile);
    setProfileType(type);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row m-6 gap-10">
        <AvatarSection user={user} />
        {isMentor ? (
          <MentorView
            onAuthRequired={handleAuthRequired}
            onProfileClick={handleProfileClick}
            onExploreClick={handleExploreClick}
          />
        ) : (
          <MenteeView
            onAuthRequired={handleAuthRequired}
            onProfileClick={handleProfileClick}
            onExploreClick={handleExploreClick}
          />
        )}
      </div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <ProfileDetailModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
        profileType={profileType}
      />
    </>
  );
};

const AvatarSection = ({ user }: { user: UserInfo | null }) => {
  const avatarConfig: AvatarFullConfig = genConfig(user?.name || "Guest");

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="bg-primary-100 dark:bg-primary-900/20 rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-center gap-2 w-full lg:w-[250px] max-w-sm mx-auto lg:mx-0">
        <Avatar
          className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28"
          {...avatarConfig}
        />
        <div className="text-center mt-2 font-semibold text-sm text-neutral-800 dark:text-neutral-200">
          {user?.name
            ? `${user.name}님, 안녕하세요!`
            : "현직자 커피챗, 빠르고 쉽게!"}
        </div>
        <SearchStub />
      </div>
    </div>
  );
};

const SearchStub = () => (
  <div className="w-full mt-3">
    <div className="relative">
      <input
        type="text"
        placeholder="멘토 / 멘티 검색"
        className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 px-3 py-2 pr-10 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-gray-400 dark:placeholder:text-neutral-500 transition"
        disabled
      />
      <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-neutral-500 text-xs select-none">
        <IoSearch />
      </span>
    </div>
  </div>
);

interface ViewProps {
  onAuthRequired: (callback?: () => void) => void;
  onProfileClick: (
    profile: MentorInfo | MenteeInfo,
    type: "mentor" | "mentee"
  ) => void;
  onExploreClick: () => void;
}

const MenteeView = ({
  onAuthRequired,
  onProfileClick,
  onExploreClick,
}: ViewProps) => {
  const user = useAuthStore((s) => s.user);
  const { data, loading, error } = useMentorRecommendations(!!user);
  const cards = useMemo(
    () => (user ? data.slice(0, 4) : mockMentors),
    [user, data]
  );

  const handleMentorClick = (mentor: MentorInfo) => {
    onAuthRequired(() => {
      onProfileClick(mentor, "mentor");
    });
  };

  return (
    <div className="flex-1 text-start">
      <SectionTitle>
        현직자와의 커피챗으로 진로 고민을 해결해보세요!
      </SectionTitle>
      <CardsRowMentor
        loading={loading}
        error={error}
        list={cards}
        onCardClick={handleMentorClick}
      />
      <MenteeMoreHeadline />
      <ShowcaseMarquee onExploreClick={onExploreClick} />
    </div>
  );
};

const MentorView = ({
  onAuthRequired,
  onProfileClick,
  onExploreClick,
}: ViewProps) => {
  const user = useAuthStore((s) => s.user);
  const { data, loading, error } = useMenteeRecommendations(!!user);
  const cards = useMemo(
    () => (user ? data.slice(0, 4) : mockMentees),
    [user, data]
  );

  const handleMenteeClick = (mentee: MenteeInfo) => {
    onAuthRequired(() => {
      onProfileClick(mentee, "mentee");
    });
  };

  return (
    <div className="flex-1 text-start">
      <SectionTitle>학생들의 진로 고민을 해결해줄 수 있어요!</SectionTitle>
      <CardsRowMentee
        loading={loading}
        error={error}
        list={cards}
        onCardClick={handleMenteeClick}
      />
      <MentorMoreHeadline />
      <ShowcaseMarquee onExploreClick={onExploreClick} />
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
    {children}
  </div>
);

const MenteeMoreHeadline = () => (
  <h2 className="text-xl font-semibold mt-12 mb-4 text-neutral-900 dark:text-neutral-100">
    더 많은 현직자 멘토분들을 만나볼까요?
  </h2>
);

const MentorMoreHeadline = () => (
  <h2 className="text-xl font-semibold mt-12 mb-4 text-neutral-900 dark:text-neutral-100">
    더 많은 학생 멘티들을 만나볼까요?
  </h2>
);

const CardsRowMentor = ({
  list,
  loading,
  error,
  onCardClick,
}: {
  list: MentorInfo[];
  loading: boolean;
  error: string | null;
  onCardClick?: (mentor: MentorInfo) => void;
}) => (
  <div className="flex flex-wrap gap-4 min-h-[190px]">
    {loading && <LoadingText />}
    {!loading && error && <ErrorText message={error} />}
    {!loading &&
      !error &&
      list.map((m) => (
        <div
          key={m.name}
          onClick={() => onCardClick?.(m)}
          className="cursor-pointer"
        >
          <MentorCard mentor={m} />
        </div>
      ))}
  </div>
);

const CardsRowMentee = ({
  list,
  loading,
  error,
  onCardClick,
}: {
  list: MenteeInfo[];
  loading: boolean;
  error: string | null;
  onCardClick?: (mentee: MenteeInfo) => void;
}) => (
  <div className="flex flex-wrap gap-4 min-h-[190px]">
    {loading && <LoadingText />}
    {!loading && error && <ErrorText message={error} />}
    {!loading &&
      !error &&
      list.map((s) => (
        <div
          key={s.name}
          onClick={() => onCardClick?.(s)}
          className="cursor-pointer"
        >
          <MenteeCard mentee={s} />
        </div>
      ))}
  </div>
);

export default Home;
