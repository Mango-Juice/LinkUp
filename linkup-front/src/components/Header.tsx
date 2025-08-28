import Logo from "./ui/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../features/auth/LoginModal";
import ThemeToggle from "./ui/ThemeToggle";
import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-toastify";
import { IoMenu, IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderLocationState {
  openLogin?: boolean;
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const deauthorize = useAuthStore((s) => s.deauthorize);

  useEffect(() => {
    const state = location.state as HeaderLocationState | null;
    if (state?.openLogin) {
      setIsOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        event.target &&
        !(event.target as Element).closest("header")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [isMobileMenuOpen]);

  const handleAuthClick = useCallback(() => {
    if (user) {
      deauthorize();
      toast.warn("로그아웃 되었습니다.");
      navigate("/", { state: { openLogin: false } });
    } else {
      setIsOpen(true);
    }
  }, [user, deauthorize, navigate]);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between w-full h-16 px-4 border-b shadow-sm md:h-20 border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm md:px-6">
        <Logo className="cursor-pointer" onClick={() => navigate("/")} />

        {/* Desktop Menu */}
        <div className="items-center hidden space-x-1 md:flex">
          <HeaderMenu onClick={() => navigate("/reservation")}>
            예약 현황
          </HeaderMenu>
          <HeaderMenu
            onClick={() => toast.info("커피챗 내역은 준비 중입니다.")}
          >
            커피챗 내역
          </HeaderMenu>
          <HeaderMenu onClick={() => toast.info("개인 정보는 준비 중입니다.")}>
            개인 정보
          </HeaderMenu>
          <HeaderMenu onClick={() => toast.info("챗봇은 준비 중입니다.")}>
            챗봇 💬
          </HeaderMenu>
        </div>

        {/* Right side controls */}
        <div className="items-center hidden space-x-3 md:flex">
          <ThemeToggle />
          <HeaderMenu onClick={handleAuthClick}>
            {user ? "로그아웃" : "로그인/회원가입"}
          </HeaderMenu>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={handleToggleMobileMenu}
            className="p-2 transition-all duration-300 border rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <IoClose className="w-5 h-5" />
              ) : (
                <IoMenu className="w-5 h-5" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute left-0 right-0 overflow-hidden bg-white border-t border-b shadow-lg top-full dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="py-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <MobileHeaderMenu
                  onClick={() => {
                    navigate("/reservation");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  예약 현황
                </MobileHeaderMenu>
                <MobileHeaderMenu
                  onClick={() => {
                    toast.info("커피챗 내역은 준비 중입니다.");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  커피챗 내역
                </MobileHeaderMenu>
                <MobileHeaderMenu
                  onClick={() => {
                    toast.info("개인 정보는 준비 중입니다.");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  개인 정보
                </MobileHeaderMenu>
                <MobileHeaderMenu
                  onClick={() => {
                    toast.info("챗봇은 준비 중입니다.");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  챗봇 💬
                </MobileHeaderMenu>
                <div className="my-2 border-t border-neutral-200 dark:border-neutral-700" />
                <MobileHeaderMenu
                  onClick={() => {
                    handleAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {user ? "로그아웃" : "로그인/회원가입"}
                </MobileHeaderMenu>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-16 md:h-20" />
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
    <button
      className="px-3 py-2 transition-all duration-200 bg-transparent border-none rounded-lg outline-none select-none hover:scale-[1.02] text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 "
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

interface MobileHeaderMenuProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MobileHeaderMenu = ({ children, onClick }: MobileHeaderMenuProps) => {
  return (
    <button
      className="w-full px-4 py-3 text-left transition-all duration-300 bg-transparent border-l-4 border-transparent select-none text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default Header;
