import { Box, Heading } from "@radix-ui/themes";
import { LoadingState } from "@/types";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export const Loading = ({ message = "読み込み中...", size = "medium" }: LoadingProps) => {
  const sizeMap = {
    small: "2",
    medium: "4",
    large: "6",
  } as const;

  return (
    <Box className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Heading size={sizeMap[size]} color="gray">
          {message}
        </Heading>
      </div>
    </Box>
  );
};

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  size?: "small" | "medium" | "large";
}

export const ErrorDisplay = ({ error, onRetry, size = "medium" }: ErrorDisplayProps) => {
  const sizeMap = {
    small: "2",
    medium: "4",
    large: "6",
  } as const;

  return (
    <Box className="text-center py-8">
      <Heading size={sizeMap[size]} color="red" className="mb-4">
        {error}
      </Heading>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          再試行
        </button>
      )}
    </Box>
  );
};

interface LoadingWrapperProps {
  loadingState: LoadingState;
  onRetry?: () => void;
  loadingMessage?: string;
  children: React.ReactNode;
}

export const LoadingWrapper = ({
  loadingState,
  onRetry,
  loadingMessage,
  children,
}: LoadingWrapperProps) => {
  if (loadingState.isLoading) {
    return <Loading {...(loadingMessage && { message: loadingMessage })} />;
  }

  if (loadingState.error) {
    return <ErrorDisplay error={loadingState.error} {...(onRetry && { onRetry })} />;
  }

  return <>{children}</>;
};
