// 規約片（Term Fragment）の型定義
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
