import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./modals/LoginModal";
import { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-toastify";

interface HeaderLocationState {
  openLogin?: boolean;
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const deauthorize = useAuthStore((s) => s.deauthorize);

  useEffect(() => {
    const state = location.state as HeaderLocationState | null;
    if (state?.openLogin) {
      setIsOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleAuthClick = () => {
    if (user) {
      deauthorize();
      toast.success("로그아웃 되었습니다.");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full h-20 flex items-center justify-start border-b border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm z-40">
        <Logo
          className="cursor-pointer pl-6 pr-6"
          onClick={() => navigate("/")}
        />
        <HeaderMenu onClick={() => navigate("/reservation")}>예약 현황</HeaderMenu>
        <HeaderMenu onClick={() => navigate("/")}>커피챗 내역</HeaderMenu>
        <HeaderMenu onClick={() => navigate("/")}>개인 정보</HeaderMenu>
        <HeaderMenu onClick={() => navigate("/")}>챗봇 💬</HeaderMenu>
        <div className="flex-1" />
        <HeaderMenu onClick={handleAuthClick}>
          {user ? "로그아웃" : "로그인/회원가입"}
        </HeaderMenu>
        <div className="pr-2" />
      </header>
      <div className="h-20" />
      <LoginModal isOpen={isOpen && !user} onClose={() => setIsOpen(false)} />
    </>
  );
};

interface HeaderMenuProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const HeaderMenu = ({ children, onClick }: HeaderMenuProps) => {
  return (
    <div
      className="p-4 cursor-pointer text-grayscale-500 hover:text-primary hover:font-semibold transition-all duration-300 select-none"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Header;
