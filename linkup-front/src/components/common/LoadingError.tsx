import { memo } from 'react';

interface LoadingTextProps {
  text?: string;
}

export const LoadingText = memo<LoadingTextProps>(function LoadingText({ text = "불러오는 중..." }) {
  return (
    <div className="text-center text-neutral-500 dark:text-neutral-400 py-8" role="status" aria-label="로딩 중">
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        <span>{text}</span>
      </div>
    </div>
  );
});

interface ErrorTextProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorText = memo<ErrorTextProps>(function ErrorText({ message, onRetry }) {
  return (
    <div className="text-center text-red-500 py-8" role="alert" aria-live="polite">
      <div className="space-y-2">
        <div>{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
});