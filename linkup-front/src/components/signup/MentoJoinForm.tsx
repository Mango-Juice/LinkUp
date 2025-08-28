import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { post } from "../../lib/api";
import FormField from "../FormField";
import PrimaryButton from "../PrimaryButton";
import CareerSelect from "../CareerSelect";
import TopicSelect from "../TopicSelect";
import useAuthStore from "../../store/useAuthStore";
import { validateEmail } from "../../utils/validation";
import type { UserInfo } from "../../types/UserInfo";

interface Props {
  onCancel: () => void;
  onSubmit: () => void; // 후속 네비게이션 등
}

interface MentorSignupPayload {
  email: string;
  password: string;
  nickname: string;
  age: number;
  role: "MENTOR";
  mentor: {
    jobTitle: string;
    major: string;
    intro: string;
    tags: string;
    orgName: string;
    verificationUrl: string;
  };
}

interface SignupResponse {
  accessToken: string;
  age: number;
  message: string;
  nickname: string;
  email: string;
  role: "STUDENT" | "MENTOR";
}

type SignupRes = SignupResponse;

const MentoJoinForm = ({ onCancel, onSubmit }: Props) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [education, setEducation] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const authorize = useAuthStore((s) => s.authorize);

  const signupMutation = useMutation({
    mutationFn: (payload: MentorSignupPayload) =>
      post<SignupRes>("/auth/signup", payload),
    onSuccess: async (res) => {
      try {
        if (res.success) {
          const signupData = res.data;
          const user: UserInfo = {
            token: signupData.accessToken,
            name: signupData.nickname,
            role: signupData.role === "MENTOR" ? "mentor" : "mentee",
          };
          authorize(user);
          toast.success("멘토 가입 및 로그인 완료!");
          onSubmit();
        } else {
          toast.error(res.error || "가입 실패");
        }
      } catch {
        toast.error("처리 중 오류");
      }
    },
    onError: () => toast.error("서버 오류가 발생했습니다"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupMutation.isPending) return;
    
    if (!validateEmail(userId)) {
      toast.error("올바른 이메일 형식을 입력해주세요");
      return;
    }
    
    const payload: MentorSignupPayload = {
      role: "MENTOR",
      email: userId,
      password,
      nickname: name,
      age: Number(age),
      mentor: {
        jobTitle: job,
        major: major || "기타",
        intro: "나에 대한 설명",
        tags: major || "기타",
        orgName: education,
        verificationUrl: "https://example.com/studentcard.png",
      },
    };
    signupMutation.mutate(payload);
  };

  const disabled =
    !userId ||
    !password ||
    !name ||
    !age ||
    !major ||
    !job ||
    !education ||
    signupMutation.isPending;

  return (
    <div className="bg-[#F9F9F9] rounded-lg p-6 mb-6 shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4">멘토 정보 입력</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <FormField
          label="이메일"
          id="mentor-userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="이메일"
          autoComplete="username"
          required
        />
        <FormField
          label="PW"
          id="mentor-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="new-password"
          required
        />
        <hr className="mt-1" />
        <FormField
          label="이름"
          id="mentor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          autoComplete="name"
          buttonLabel="인증하기"
          required
        />
        <FormField
          label="나이"
          id="mentor-age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="나이"
          min={0}
          max={120}
          required
        />
        <FormField
          label="직무"
          id="mentor-job"
          type="text"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          placeholder="예: 프론트엔드 개발자"
          required
        />
        <FormField
          label="학력"
          id="mentor-education"
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="예: OO대학교 컴퓨터공학과 학사"
          buttonLabel="인증하기"
          required
        />
        <hr className="mt-1" />
        <CareerSelect value={major} onChange={setMajor} label="전공" />
        <TopicSelect value={topic} onChange={setTopic} label="희망 상담 주제" />
        <div className="mt-2">
          <PrimaryButton type="submit" primary disabled={disabled}>
            {signupMutation.isPending ? "제출 중..." : "가입하기"}
          </PrimaryButton>
          <PrimaryButton className="mt-2" onClick={onCancel}>
            뒤로가기
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default MentoJoinForm;
