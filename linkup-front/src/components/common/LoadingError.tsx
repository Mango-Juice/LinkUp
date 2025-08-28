interface LoadingTextProps {
  text?: string;
}

export const LoadingText = ({ text = "불러오는 중..." }: LoadingTextProps) => (
  <div className="text-sm text-gray-400 animate-pulse">{text}</div>
);

interface ErrorTextProps {
  message: string;
}

export const ErrorText = ({ message }: ErrorTextProps) => (
  <div className="text-sm text-red-500">{message}</div>
);