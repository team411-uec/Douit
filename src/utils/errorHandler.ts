import { ApiResult } from "@/types";

export enum ErrorType {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  FIREBASE = "FIREBASE",
  UNKNOWN = "UNKNOWN",
}

// エラータイプの定義
export interface CustomError extends Error {
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  type: ErrorType;

  code?: string;

  details?: unknown;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    if (code !== undefined) {
      this.code = code;
    }
    if (details !== undefined) {
      this.details = details;
    }

    // Error.captureStackTrace が利用可能な場合のみ使用
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Firebase エラーコードのマッピング
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "ユーザーが見つかりません。",
  "auth/wrong-password": "パスワードが間違っています。",
  "auth/email-already-in-use": "このメールアドレスは既に使用されています。",
  "auth/weak-password": "パスワードが弱すぎます。",
  "auth/invalid-email": "無効なメールアドレスです。",
  "auth/too-many-requests": "リクエストが多すぎます。しばらく待ってから再試行してください。",
  "permission-denied": "この操作を実行する権限がありません。",
  "not-found": "ドキュメントが見つかりません。",
  "already-exists": "ドキュメントが既に存在します。",
  cancelled: "操作がキャンセルされました。",
  unknown: "不明なエラーが発生しました。",
  "invalid-argument": "無効な引数です。",
  "deadline-exceeded": "操作がタイムアウトしました。",
  unauthenticated: "認証が必要です。",
  "resource-exhausted": "リソースが不足しています。",
  "failed-precondition": "操作の前提条件が満たされていません。",
  aborted: "操作が中止されました。",
  "out-of-range": "範囲外の値です。",
  unimplemented: "この機能は実装されていません。",
  internal: "内部エラーが発生しました。",
  unavailable: "サービスが利用できません。",
  "data-loss": "データが失われました。",
};

/**
 * Firebase エラーを AppError に変換
 */
export const convertFirebaseError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  const firebaseError = error as { code?: string; message?: string };
  const errorCode = firebaseError.code || "unknown";
  const errorMessage =
    FIREBASE_ERROR_MESSAGES[errorCode] || firebaseError.message || "不明なエラーが発生しました。";

  return new AppError(errorMessage, ErrorType.FIREBASE, errorCode, error);
};

/**
 * エラーハンドリングのユーティリティ関数
 */
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Firebase エラーかどうかをチェック
    if (error.message.includes("Firebase") || (error as any).code) {
      return convertFirebaseError(error);
    }

    return new AppError(error.message, ErrorType.UNKNOWN, undefined, error);
  }

  // エラーが文字列の場合
  if (typeof error === "string") {
    return new AppError(error, ErrorType.UNKNOWN);
  }

  // その他の場合
  return new AppError("不明なエラーが発生しました。", ErrorType.UNKNOWN, undefined, error);
};

/**
 * エラーログの出力
 */
export const logError = (error: AppError | Error | unknown, context?: string): void => {
  const prefix = context ? `[${context}]` : "";

  if (error instanceof AppError) {
    console.error(`${prefix} AppError:`, {
      message: error.message,
      type: error.type,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
};

/**
 * 成功結果を作成
 */
export const createSuccessResult = <T>(data: T): ApiResult<T> => ({
  success: true,
  data,
});

/**
 * エラー結果を作成
 */
export const createErrorResult = <T>(error: string | AppError): ApiResult<T> => {
  const errorMessage = error instanceof AppError ? error.message : error;
  return {
    success: false,
    error: errorMessage,
  };
};

/**
 * 非同期操作を安全に実行し、結果を ApiResult として返す
 */
export const safeExecute = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<ApiResult<T>> => {
  try {
    const result = await operation();
    return createSuccessResult(result);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, context);
    return createErrorResult(appError);
  }
};

/**
 * エラーが特定のタイプかどうかをチェック
 */
export const isErrorType = (error: unknown, type: ErrorType): boolean => {
  return error instanceof AppError && error.type === type;
};

/**
 * エラーが Firebase 認証エラーかどうかをチェック
 */
export const isAuthError = (error: unknown): boolean => {
  return isErrorType(error, ErrorType.AUTHENTICATION);
};

/**
 * エラーが Firebase データベースエラーかどうかをチェック
 */
export const isFirebaseError = (error: unknown): boolean => {
  return isErrorType(error, ErrorType.FIREBASE);
};

/**
 * エラーがネットワークエラーかどうかをチェック
 */
export const isNetworkError = (error: unknown): boolean => {
  return isErrorType(error, ErrorType.NETWORK);
};
