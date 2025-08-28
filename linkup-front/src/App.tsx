import { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./App.css";

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="App font-mono min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 overflow-x-hidden">
          <Router />
        </div>
        <ToastContainer
          aria-label="notification"
          progressClassName="progress-bar"
          position="bottom-right"
          theme="colored"
        />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
