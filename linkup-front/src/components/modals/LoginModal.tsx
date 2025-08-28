import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../Logo";
import Modal from "./Modal";
import FormField from "../FormField";
import PrimaryButton from "../PrimaryButton";
import { post, type ApiResponse } from "../../lib/api";
import useAuthStore from "../../store/useAuthStore";
import type { UserInfo } from "../../types/UserInfo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginResponse {
  id: number;
  accessToken: string;
  nickname: string;
  role: "STUDENT" | "MENTOR";
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authorize = useAuthStore((s) => s.authorize);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res: ApiResponse<LoginResponse> = await post<LoginResponse>(
        "/auth/login",
        { email: id, password: pw }
      );
      if (res.success) {
        const data = res.data;
        const mapped: UserInfo = {
          id: data.id,
          token: data.accessToken,
          name: data.nickname,
          role: data.role === "MENTOR" ? "mentor" : "mentee",
        };
        authorize(mapped);
        toast.success("로그인 성공");
        onClose();
      } else {
        toast.error(res.error || "로그인 실패");
      }
    } catch {
      toast.error("아이디와 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center w-[340px] gap-6">
        <Logo />
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <FormField
            label="이메일"
            id="login-id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="이메일"
            autoComplete="username"
            required
          />
          <FormField
            label="PW"
            id="login-pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            required
          />
          <div className="flex flex-col gap-2 mt-2">
            <PrimaryButton
              type="submit"
              onClick={handleSubmit}
              primary
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </PrimaryButton>
            <PrimaryButton
              type="button"
              onClick={handleSignup}
              disabled={loading}
            >
              회원가입
            </PrimaryButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
