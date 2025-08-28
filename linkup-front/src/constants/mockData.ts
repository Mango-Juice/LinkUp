import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

export const mockMentors: MentorInfo[] = [
  { name: "이하늘", jobTitle: "패션 MD", tags: "패션,MD,브랜드" },
  { name: "정유진", jobTitle: "금융 애널리스트", tags: "증권,리서치,투자" },
  { name: "박성호", jobTitle: "항공 승무원", tags: "서비스,에티켓,항공" },
  { name: "김라온", jobTitle: "게임 기획자", tags: "게임,기획,스토리" },
];

export const mockMentees: MenteeInfo[] = [
  {
    id: 1,
    nickname: "고3-의대꿈나무",
    name: "고3-의대꿈나무",
    grade: "고3",
    region: "서울",
    interests: "의대, 생명과학",
    age: 19,
  },
  {
    id: 2,
    nickname: "고2-IT덕후",
    name: "고2-IT덕후",
    grade: "고2",
    region: "경기",
    interests: "영상, 콘텐츠",
    age: 18,
  },
  {
    id: 3,
    nickname: "고1-환경지킴이",
    name: "고1-환경지킴이",
    grade: "고1",
    region: "부산",
    interests: "환경, 봉사",
    age: 16,
  },
  {
    id: 4,
    nickname: "고2-게임매니아",
    name: "고2-게임매니아",
    grade: "고2",
    region: "대구",
    interests: "게임, 프로그래밍",
    age: 17,
  },
];

export const showcaseMentors: MentorInfo[] = [
  {
    name: "김지훈",
    tags: "백엔드,Java,대기업",
    jobTitle: "카카오 백엔드 개발자",
  },
  {
    name: "이서윤",
    tags: "프론트엔드,React,UI/UX",
    jobTitle: "네이버 FE 엔지니어",
  },
  { name: "박민수", tags: "데이터,AI,파이썬", jobTitle: "쿠팡 ML 엔지니어" },
  { name: "정다은", tags: "해외취업,Resume,영어", jobTitle: "실리콘밸리 SDE" },
  { name: "한태호", tags: "스타트업,창업,IR", jobTitle: "CTO" },
  { name: "오유진", tags: "UX,프로덕트,리서치", jobTitle: "프로덕트 디자이너" },
  { name: "최현우", tags: "모바일,iOS,Swift", jobTitle: "iOS 개발자" },
  {
    name: "배수진",
    tags: "클라우드,AWS,DevOps",
    jobTitle: "클라우드 엔지니어",
  },
];
