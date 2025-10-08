import { ApiResult } from "@/types";

export const unwrapApiResult = <T>(result: ApiResult<T>, defaultValue?: T): T => {
  if (result.success && result.data !== undefined) {
    return result.data;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(result.error || "API call failed");
};

export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      console.error("Async operation failed:", error);
    }
    return null;
  }
};
