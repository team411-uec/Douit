// 理解記録の型定義
export interface UnderstoodRecord {
  id?: string;
  fragmentId: string; // 理解した規約片のID
  version: number; // 理解した時点でのバージョン
  understoodAt: Date; // 理解した日時
}
