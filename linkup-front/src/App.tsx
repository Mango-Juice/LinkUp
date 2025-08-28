import { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router";
import "./App.css";

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App font-mono h-screen w-full">
        <Router />
      </div>
      <ToastContainer
        aria-label="notification"
        progressClassName="progress-bar"
        position="bottom-right"
      />
    </QueryClientProvider>
  );
}

export default App;
