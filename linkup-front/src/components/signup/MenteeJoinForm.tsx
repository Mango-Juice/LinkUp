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
  onSubmit: () => void;
}

interface MenteeSignupPayload {
  email: string;
  password: string;
  nickname: string;
  age: number | null;
  role: "STUDENT";
}

interface LoginResponse {
  accessToken: string;
  nickname: string;
  role: "STUDENT" | "MENTOR";
}

type SignupRes = LoginResponse;

const MenteeJoinForm = ({ onCancel, onSubmit }: Props) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const authorize = useAuthStore((s) => s.authorize);

  const signupMutation = useMutation({
    mutationFn: (payload: MenteeSignupPayload) =>
      post<SignupRes>("/auth/signup", payload),
    onSuccess: async (res) => {
      try {
        if (res.success) {
          const loginData = res.data;
          const user: UserInfo = {
            token: loginData.accessToken,
            name: loginData.nickname,
            role: loginData.role === "MENTOR" ? "mentor" : "mentee",
          };
          authorize(user);
          try {
            await post<unknown>("/students/me", {
              grade: "고2",
              region: "서울",
              interests: topic ? `${topic}` : "없음",
            });
          } catch (e) {
            console.error("[STUDENT EXTRA FAIL]", e);
          }
          toast.success("멘티 가입 및 로그인 완료!");
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
    
    const payload: MenteeSignupPayload = {
      role: "STUDENT",
      email: userId,
      password,
      nickname: name,
      age: age ? Number(age) : null,
    };
    signupMutation.mutate(payload);
  };

  const disabled =
    !userId ||
    !password ||
    !name ||
    !age ||
    !major ||
    !topic ||
    signupMutation.isPending;

  return (
    <div className="bg-[#F9F9F9] rounded-lg p-6 mb-6 shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4">멘티 정보 입력</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <FormField
          label="이메일"
          id="mentee-userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="이메일"
          autoComplete="username"
          required
        />
        <FormField
          label="PW"
          id="mentee-password"
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
          id="mentee-name"
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
          id="mentee-age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="나이"
          min={0}
          max={120}
          required
        />
        <hr className="mt-1" />
        <CareerSelect value={major} onChange={setMajor} label="희망 진로" />
        <TopicSelect value={topic} onChange={setTopic} label="상담 주제" />
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

export default MenteeJoinForm;
