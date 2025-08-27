// 規約片（Term Fragment）の型定義
export interface TermFragment {
  title: string;           // タイトル
  content: string;         // 本文（[__]プレースホルダー含む）
  parameters: string[];    // プレースホルダーに対応するパラメータ名の配列
  tags: string[];          // タグの配列
  createdAt: Date;         // 作成日時
  updatedAt: Date;         // 更新日時
  currentVersion: number;  // 現在のバージョン番号
}

// 規約片のバージョン履歴の型定義
export interface TermFragmentVersion {
  title: string;
  content: string;
  parameters: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 規約セット（Term Set）の型定義
export interface TermSet {
  createdAt: Date;
  updatedAt: Date;
  currentVersion: number;
}

// 規約セット内のフラグメント参照の型定義
export interface FragmentRef {
  fragmentId: string;                    // 参照する規約片のID
  order: number;                         // 表示順序
  parameterValues: Record<string, string>; // プレースホルダーの置換値
}

// 規約セットのバージョン履歴の型定義
export interface TermSetVersion {
  createdAt: Date;
}

// ユーザーの型定義
export interface User {
  name: string;    // ユーザー名
  email: string;   // メールアドレス
  createdAt: Date; // アカウント作成日時
}

// 理解記録の型定義
export interface UnderstoodRecord {
  fragmentId: string;    // 理解した規約片のID
  version: number;       // 理解した時点でのバージョン
  understoodAt: Date;    // 理解した日時
}

// APIキーの型定義
export interface ApiKey {
  key: string;      // APIキー文字列
  issuedBy: string; // 発行者のユーザーID
  createdAt: Date;  // 発行日時
}
