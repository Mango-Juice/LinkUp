import { useState, useEffect, useMemo, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useMentorsExplore, useStudentsExplore } from "../hooks/useExplore";
import MentorCard from "../features/home/components/MentorCard";
import MenteeCard from "../features/home/components/MenteeCard";
import { LoadingText, ErrorText } from "../components/common/LoadingError";
import ProfileDetailModal from "../components/modals/ProfileDetailModal";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";
import { toast } from "react-toastify";

const Explore = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMentor = user?.role === "mentor";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<
    MentorInfo | MenteeInfo | null
  >(null);
  const [profileType, setProfileType] = useState<"mentor" | "mentee">("mentor");

  useEffect(() => {
    if (!user) {
      toast.warn("로그인이 필요한 기능입니다.");
      navigate("/", { state: { openLogin: true } });
    }
  }, [user, navigate]);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const {
    data: mentors,
    loading: mentorsLoading,
    error: mentorsError,
  } = useMentorsExplore(!!user && !isMentor);
  const {
    data: students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudentsExplore(!!user && isMentor);

  const handleProfileClick = useCallback((
    profile: MentorInfo | MenteeInfo,
    type: "mentor" | "mentee"
  ) => {
    setSelectedProfile(profile);
    setProfileType(type);
  }, []);

  const filteredMentors = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(query) ||
        mentor.jobTitle.toLowerCase().includes(query) ||
        mentor.tags.toLowerCase().includes(query)
    );
  }, [mentors, searchQuery]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.interests.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="mx-4 my-4 md:mx-6 md:my-6">
        <div className="mb-6 md:mb-8">
          <h1 className="mb-2 text-2xl font-bold transition-colors duration-300 md:text-3xl text-neutral-900 dark:text-neutral-100">
            {isMentor ? "학생 멘티 찾기" : "현직자 멘토 찾기"}
          </h1>
          <p className="mb-4 transition-colors duration-300 text-neutral-600 dark:text-neutral-400 md:mb-6">
            {isMentor
              ? "진로 고민을 가진 학생들과 소중한 시간을 나눠보세요"
              : "다양한 분야의 현직자 멘토분들을 만나보세요"}
          </p>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={isMentor ? "멘티 검색..." : "멘토 검색..."}
          />
        </div>

        <div className="mb-6">
          <SectionTitle>
            {isMentor ? "함께 성장할 멘티들" : "경험을 나눌 멘토분들"}
          </SectionTitle>

          {isMentor ? (
            <ExploreGrid
              items={filteredStudents}
              loading={studentsLoading}
              error={studentsError}
              type="mentee"
              onItemClick={(item) => handleProfileClick(item, "mentee")}
            />
          ) : (
            <ExploreGrid
              items={filteredMentors}
              loading={mentorsLoading}
              error={mentorsError}
              type="mentor"
              onItemClick={(item) => handleProfileClick(item, "mentor")}
            />
          )}
        </div>
      </div>

      <ProfileDetailModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
        profileType={profileType}
      />
    </>
  );
};

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
}) => (
  <div className="relative w-full">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 pr-12 text-sm transition-colors duration-300 bg-white border rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
    />
    <span className="absolute inset-y-0 flex items-center right-4 text-neutral-400 dark:text-neutral-500">
      <IoSearch className="w-5 h-5" />
    </span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-lg font-semibold transition-colors duration-300 md:text-xl md:mb-6 text-neutral-900 dark:text-neutral-100">
    {children}
  </div>
);

interface ExploreGridProps {
  items: MentorInfo[] | MenteeInfo[];
  loading: boolean;
  error: string | null;
  type: "mentor" | "mentee";
  onItemClick: (item: MentorInfo | MenteeInfo) => void;
}

const ExploreGrid = ({
  items,
  loading,
  error,
  type,
  onItemClick,
}: ExploreGridProps) => (
  <div className="flex flex-wrap justify-center gap-4 md:gap-6 min-h-[190px]">
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
    {!loading && !error && items.length === 0 && (
      <div className="w-full py-8 text-center text-neutral-500 dark:text-neutral-400">
        검색 결과가 없습니다.
      </div>
    )}
    {!loading &&
      !error &&
      items.map((item) => (
        <div
          key={item.name}
          onClick={() => onItemClick(item)}
          className="flex-shrink-0 transition-transform duration-300 cursor-pointer hover:scale-105"
        >
          {type === "mentor" ? (
            <MentorCard mentor={item as MentorInfo} />
          ) : (
            <MenteeCard mentee={item as MenteeInfo} />
          )}
        </div>
      ))}
  </div>
);

export default Explore;
