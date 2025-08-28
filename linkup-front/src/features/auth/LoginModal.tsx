import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../components/ui/Logo";
import Modal from "../../components/modals/Modal";
import FormField from "../../components/ui/FormField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { post, type ApiResponse } from "../../lib/api";
import useAuthStore from "../../stores/useAuthStore";
import type { UserInfo } from "../../types/UserInfo";
import type { LoginResponse } from "../../types/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authorize = useAuthStore((s) => s.authorize);

  useEffect(() => {
    if (isOpen) {
      setId("");
      setPw("");
      setLoading(false);
    }
  }, [isOpen]);

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

        if (location.pathname === "/signup") {
          navigate("/");
        }
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
      <div className="flex flex-col items-center w-full max-w-sm gap-6 mx-auto">
        <Logo />
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          <FormField
            label="이메일"
            id="login-id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="이메일을 입력하세요"
            autoComplete="username"
            required
          />
          <FormField
            label="PW"
            id="login-pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
          />
          <div className="flex flex-col gap-2 mt-4">
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
