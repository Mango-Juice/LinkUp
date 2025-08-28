import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoSearch, IoCafe, IoTime } from "react-icons/io5";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import {
  useMentorRecommendations,
  useMenteeRecommendations,
} from "../hooks/useRecommendations";
import { mockMentors, mockMentees } from "../constants/mockData";
import MentorCard from "../features/home/components/MentorCard";
import MenteeCard from "../features/home/components/MenteeCard";
import ShowcaseMarquee from "../features/home/components/ShowcaseMarquee";
import LoginModal from "../features/auth/LoginModal";
import ProfileDetailModal from "../components/modals/ProfileDetailModal";
import { LoadingText, ErrorText } from "../components/common/LoadingError";
import { get, type ApiResponse } from "../lib/api";
import type { UserInfo } from "../types/UserInfo";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

interface BookingUser {
  id: number;
  nickname: string;
  jobTitle?: string;
}

interface PendingBooking {
  id: number;
  status: "PENDING";
  student: BookingUser;
  mentor: BookingUser;
  proposer: BookingUser;
  note: string;
  createdAt: string;
}

const Home = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const isMentor = user?.role === "mentor";
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<
    MentorInfo | MenteeInfo | null
  >(null);
  const [profileType, setProfileType] = useState<"mentor" | "mentee">("mentor");

  const handleAuthRequired = useCallback(
    (callback?: () => void) => {
      if (!user) {
        setShowLoginModal(true);
      } else {
        callback?.();
      }
    },
    [user]
  );

  const handleExploreClick = useCallback(() => {
    handleAuthRequired(() => {
      navigate("/explore");
    });
  }, [handleAuthRequired, navigate]);

  const handleProfileClick = useCallback(
    (profile: MentorInfo | MenteeInfo, type: "mentor" | "mentee") => {
      setSelectedProfile(profile);
      setProfileType(type);
    },
    []
  );

  return (
    <>
      <div className="flex flex-col gap-6 mx-4 my-4 xl:flex-row md:mx-6 md:my-6 md:gap-8 xl:gap-10">
        <AvatarSection user={user} onAuthRequired={handleAuthRequired} />
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

const AvatarSection = ({
  user,
  onAuthRequired,
}: {
  user: UserInfo | null;
  onAuthRequired: (callback?: () => void) => void;
}) => {
  const avatarConfig: AvatarFullConfig = genConfig(user?.name || "Guest");

  return (
    <div className="xl:sticky xl:top-24 xl:self-start">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-xl p-4 md:p-6 shadow-lg dark:shadow-xl flex flex-col items-center gap-2 w-full xl:w-[280px] max-w-sm mx-auto xl:mx-0 transition-colors duration-300">
        <Avatar
          className="w-20 h-20 sm:w-24 lg:w-28 sm:h-24 lg:h-28"
          {...avatarConfig}
        />
        <div className="mt-2 text-sm font-semibold text-center transition-colors duration-300 text-neutral-800 dark:text-neutral-200">
          {user?.name
            ? `${user.name}님, 안녕하세요!`
            : "현직자 커피챗, 빠르고 쉽게!"}
        </div>
        <SearchStubInput user={user} onAuthRequired={onAuthRequired} />
      </div>
      <PendingBookingsAlert user={user} />
    </div>
  );
};

const SearchStubInput = ({
  onAuthRequired,
}: {
  user: UserInfo | null;
  onAuthRequired: (callback?: () => void) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      onAuthRequired(() => {
        navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      });
    },
    [searchQuery, onAuthRequired, navigate]
  );

  return (
    <div className="w-full mt-3">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="멘토 / 멘티 검색"
          className="w-full px-3 py-2 pr-10 text-xs transition-colors duration-300 border rounded-lg border-neutral-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />
        <button
          type="submit"
          className="absolute inset-y-0 flex items-center text-xs transition-colors bg-transparent border-0 right-2 text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400"
        >
          <IoSearch />
        </button>
      </form>
    </div>
  );
};

const PendingBookingsAlert = ({ user }: { user: UserInfo | null }) => {
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const navigate = useNavigate();

  const fetchPendingBookings = useCallback(async () => {
    if (!user) return;
    try {
      const res: ApiResponse<PendingBooking[]> = await get("/bookings/me");
      if (res.success) {
        const pending = res.data.filter(
          (booking) =>
            booking.status === "PENDING" && booking.proposer.id !== user.id
        );
        setPendingBookings(pending);
      }
    } catch {
      // 오류 무시 - 핵심 기능이 아니므로
    }
  }, [user]);

  const handleGoReservation = useCallback(() => {
    navigate("/reservation");
  }, [navigate]);

  useEffect(() => {
    fetchPendingBookings();
  }, [fetchPendingBookings]);

  if (!user || pendingBookings.length === 0) return null;

  return (
    <div className="mt-4 w-full xl:w-[280px] max-w-sm mx-auto xl:mx-0">
      <div className="p-3 transition-colors duration-300 border rounded-lg shadow-lg bg-accent-gold/10 dark:bg-accent-gold/20 border-primary-300 dark:border-primary-700">
        <div className="flex items-center gap-1 mb-2">
          <IoCafe className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          <span className="text-xs font-medium text-primary-500 dark:text-primary-400">
            대기 중인 예약 신청 {pendingBookings.length}건
          </span>
        </div>
        <div className="space-y-1">
          {pendingBookings.slice(0, 2).map((booking) => {
            const otherUser =
              user?.role === "mentor" ? booking.student : booking.mentor;
            return (
              <div
                key={booking.id}
                className="flex items-center gap-[2.5px] text-xs text-primary-400 dark:text-primary-500"
              >
                <IoTime className="w-3 h-3" />
                <span>{otherUser.nickname}님</span>
                {otherUser.jobTitle && <span>• {otherUser.jobTitle}</span>}
              </div>
            );
          })}
          {pendingBookings.length > 2 && (
            <div className="text-xs text-primary-400/80 dark:text-primary-500/80">
              외 {pendingBookings.length - 2}건
            </div>
          )}
        </div>
        <button
          onClick={handleGoReservation}
          className="w-full py-1 mt-2 text-xs font-medium transition-colors duration-300 border rounded border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/60 hover:border-primary-400"
        >
          예약 관리하기
        </button>
      </div>
    </div>
  );
};

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

  const handleMentorClick = useCallback(
    (mentor: MentorInfo) => {
      onAuthRequired(() => {
        onProfileClick(mentor, "mentor");
      });
    },
    [onAuthRequired, onProfileClick]
  );

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

  const handleMenteeClick = useCallback(
    (mentee: MenteeInfo) => {
      onAuthRequired(() => {
        onProfileClick(mentee, "mentee");
      });
    },
    [onAuthRequired, onProfileClick]
  );

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
  <div className="mb-4 text-lg font-semibold transition-colors duration-300 md:text-xl text-neutral-900 dark:text-neutral-100">
    {children}
  </div>
);

const MenteeMoreHeadline = () => (
  <h2 className="mt-8 mb-4 text-lg font-semibold transition-colors duration-300 md:text-xl md:mt-12 text-neutral-900 dark:text-neutral-100">
    더 많은 현직자 멘토분들을 만나볼까요?
  </h2>
);

const MentorMoreHeadline = () => (
  <h2 className="mt-8 mb-4 text-lg font-semibold transition-colors duration-300 md:text-xl md:mt-12 text-neutral-900 dark:text-neutral-100">
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
  <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-6 min-h-[190px]">
    {loading && (
      <div className="flex justify-center w-full">
        <LoadingText />
      </div>
    )}
    {!loading && error && (
      <div className="flex justify-center w-full">
        <ErrorText message={error} />
      </div>
    )}
    {!loading &&
      !error &&
      list.map((m) => (
        <div
          key={m.name}
          onClick={() => onCardClick?.(m)}
          className="flex-shrink-0 transition-transform duration-300 cursor-pointer hover:scale-105"
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
  <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-6 min-h-[190px]">
    {loading && (
      <div className="flex justify-center w-full">
        <LoadingText />
      </div>
    )}
    {!loading && error && (
      <div className="flex justify-center w-full">
        <ErrorText message={error} />
      </div>
    )}
    {!loading &&
      !error &&
      list.map((s) => (
        <div
          key={s.name}
          onClick={() => onCardClick?.(s)}
          className="flex-shrink-0 transition-transform duration-300 cursor-pointer hover:scale-105"
        >
          <MenteeCard mentee={s} />
        </div>
      ))}
  </div>
);

export default Home;
