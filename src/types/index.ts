export interface TermFragment {
  id: string;
  title: string; // タイトル
  content: string; // 本文（[__]プレースホルダー含む）
  parameters: string[]; // プレースホルダーに対応するパラメータ名の配列
  tags: string[]; // タグの配列
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
  currentVersion: number; // 現在のバージョン番号
}

export interface TermSet {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  currentVersion: number;
  fragmentsRefs?: FragmentRef[];
}

export interface FragmentRef {
  fragmentId: string; // 参照する規約片のID
  order: number; // 表示順序
  parameterValues: Record<string, string>; // プレースホルダーの置換値
}

export interface User {
  name: string; // ユーザー名
  email: string; // メールアドレス
  createdAt: Date; // アカウント作成日時
}

export interface UnderstoodRecord {
  fragmentId: string; // 理解した規約片のID
  version: number; // 理解した時点でのバージョン
  understoodAt: Date; // 理解した日時
}
