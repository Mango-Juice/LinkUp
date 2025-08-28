import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useMentorsExplore, useStudentsExplore } from "../hooks/useExplore";
import MentorCard from "../components/home/MentorCard";
import MenteeCard from "../components/home/MenteeCard";
import { LoadingText, ErrorText } from "../components/common/LoadingError";
import ProfileDetailModal from "../components/modals/ProfileDetailModal";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

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

  const handleProfileClick = (
    profile: MentorInfo | MenteeInfo,
    type: "mentor" | "mentee"
  ) => {
    setSelectedProfile(profile);
    setProfileType(type);
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.interests.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 로그인되지 않은 경우 렌더링하지 않음
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="m-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {isMentor ? "학생 멘티 찾기" : "현직자 멘토 찾기"}
          </h1>
          <p className="text-neutral-600 mb-6">
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
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-gray-400 transition"
    />
    <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
      <IoSearch className="w-5 h-5" />
    </span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xl font-semibold mb-6 text-neutral-900">{children}</div>
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
  <div className="flex flex-wrap gap-4 min-h-[190px] justify-center">
    {loading && <LoadingText />}
    {!loading && error && <ErrorText message={error} />}
    {!loading && !error && items.length === 0 && (
      <div className="w-full text-center py-8 text-gray-500">
        검색 결과가 없습니다.
      </div>
    )}
    {!loading &&
      !error &&
      items.map((item) => (
        <div
          key={item.name}
          onClick={() => onItemClick(item)}
          className="cursor-pointer"
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
