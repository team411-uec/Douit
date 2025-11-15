// 規約セット（Term Set）の型定義
export interface TermSet {
  id: string;
  title?: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  currentVersion: number;
  isPublic?: boolean;
  fragmentsRefs?: FragmentRef[];
}

// 規約セット内のフラグメント参照の型定義
export interface FragmentRef {
  fragmentId: string; // 参照する規約片のID
  order: number; // 表示順序
  parameterValues: Record<string, string>; // プレースホルダーの置換値
}
