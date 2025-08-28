import { memo, Suspense, lazy } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import { AnimatePresence, motion } from "framer-motion";

const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Explore = lazy(() => import("./pages/Explore"));
const Reservation = lazy(() => import("./pages/Reservation"));

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const PageWrapper = memo<{ children: React.ReactNode }>(function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-[calc(100vh-5rem)]"
    >
      {children}
    </motion.div>
  );
});

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
                <Home />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <PageWrapper>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
                <SignUp />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="/explore"
          element={
            <PageWrapper>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
                <Explore />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="/reservation"
          element={
            <PageWrapper>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
                <Reservation />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <div className="flex items-center justify-center h-full text-2xl font-semibold m-5">
                존재하지 않는 페이지입니다.
              </div>
              <Link to="/">홈으로 돌아가기</Link>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default Router;
