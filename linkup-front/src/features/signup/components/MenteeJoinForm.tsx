import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { post } from "../../../lib/api";
import FormField from "../../../components/ui/FormField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import CareerSelect from "../../../components/CareerSelect";
import TopicSelect from "../../../components/TopicSelect";
import useAuthStore from "../../../stores/useAuthStore";
import { validateEmail } from "../../../utils/validation";
import type { UserInfo } from "../../../types/UserInfo";
import type { FormProps, MenteeSignupPayload, SignupResponse } from "../../../types/auth";
import { COMMON_STYLES } from "../../../constants/styles";

const MenteeJoinForm = ({ onCancel, onSubmit }: FormProps) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const authorize = useAuthStore((s) => s.authorize);

  const signupMutation = useMutation({
    mutationFn: (payload: MenteeSignupPayload) =>
      post<SignupResponse>("/auth/signup", payload),
    onSuccess: async (res) => {
      try {
        if (res.success) {
          const signupData = res.data;
          const user: UserInfo = {
            id: signupData.id,
            token: signupData.accessToken,
            name: signupData.nickname,
            role: signupData.role === "MENTOR" ? "mentor" : "mentee",
          };
          authorize(user);
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
      age: Number(age),
      student: {
        grade: "고2",
        region: "서울",
        interests: major || "기타",
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
    !topic ||
    signupMutation.isPending;

  return (
    <div className={COMMON_STYLES.FORM_CONTAINER}>
      <h2 className={`text-xl font-semibold mb-4 ${COMMON_STYLES.TEXT_PRIMARY}`}>멘티 정보 입력</h2>
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
        <hr className={`${COMMON_STYLES.FORM_DIVIDER} border`} />
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
        <hr className={`${COMMON_STYLES.FORM_DIVIDER} border`} />
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
