import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[200px] p-8">
            <div className="text-center">
              <div className="mb-2 text-lg font-semibold text-red-500">
                문제가 발생했습니다
              </div>
              <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </div>
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
              >
                다시 시도
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
