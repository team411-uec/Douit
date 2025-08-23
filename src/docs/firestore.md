# 前提と用語

**Term Fragment（規約片）**: 規約の最小単位。本文中に [__] プレースホルダ（パラメータ）を含む。  
**Term Set（規約セット）**: 複数 Fragment を順序付きで並べた編集単位。表示時に parameterValues でプレースホルダを埋める。  
**Understood（理解記録）**: ユーザーが「該当 Fragment を理解した」事実の記録。

# Firestore 全体

:の右側に firestore での型を書いてあります

```yaml
Firestore
├── termFragments
│   └── {fragmentId}
│       ├── title: string
│       ├── content: string
│       ├── parameters: array<string>       # content 内の [__] に対応するラベル
│       ├── tags: array<string>
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── currentVersion: number
│       └── versions (subcollection)        # 過去バージョンの履歴
│           └── {versionNumber}
│               ├── title: string
│               ├── content: string
│               ├── parameters: array<string>
│               ├── tags: array<string>
│               ├── createdAt: timestamp
│               └── updatedAt: timestamp
│
├── termSets
│   └── {termSetId}
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── currentVersion: number
│       ├── fragments (subcollection)      # 最新版の順序・パラメータ
│       │   └── {fragmentRefId}
│       │       ├── fragmentId: string
│       │       ├── order: number
│       │       └── parameterValues: map<string, string>
│       └── versions (subcollection)       # 過去バージョンの履歴
│           └── {versionNumber}
│               ├── createdAt: timestamp
│               └── fragments (subcollection)
│                   └── {fragmentRefId}
│                       ├── fragmentId: string
│                       ├── order: number
│                       └── parameterValues: map<string, string>
│
├── users
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       ├── createdAt: timestamp
│       └── understood (subcollection)
│           └── {recordId}
│               ├── fragmentId: string
│               ├── version: number           # どのバージョンを理解したか
│               └── understoodAt: timestamp
│
└── apiKeys
    └── {apiKeyId}
        ├── key: string                        # Firestore 隠匿が目的
        ├── issuedBy: string                   # userId
        └── createdAt: timestamp


```

# 機能ごとの「処理」と「データ構造」

## 1. 規約片の編集作成削除

**処理**

- 作成: `title/content/tags/parameters` を入力し `termFragments/{fragmentId}` 新規作成。
- 編集: 現行を versions/{currentVersion} にコピー → 親ドキュメント更新 → currentVersion++、`updatedAt` 再設定。
- 削除: `termFragments/{fragmentId}` を削除（参照中セットがあれば UI で注意）。

---

## 2. 規約片のタグ付け機能

**処理**

- 作成/編集時に `tags` を配列で保存。

---

## 3. 規約片のタグでの検索機能

**処理**

- Firestore クエリ: `where("tags", "array-contains", tag)`

---

## 4. 利用規約セットの作成・管理機能

- セット作成: `termSets/{termSetId}` 作成。
- フラグメント追加: `termSets/{termSetId}/fragments/{fragmentRefId}` に `fragmentId`, `order`, `parameterValues` を保存。
- 並べ替え: 対象 fragmentRef の `order:number` を更新（頻度低のため全体更新許容）。
- 編集時: 現行を versions/{currentVersion} にコピー → 更新 → currentVersion++
- プレビュー/公開表示: `order` 昇順で取得 → `parameterValues` を適用してレンダリング。

---

## 5. 利用規約セット公開用の API キー発行機能（Firestore 隠匿が目的）

- 発行: 管理 UI → Cloud Functions → ランダム key 生成 → `apiKeys/{apiKeyId}` に保存 → 生キーを UI に一度表示。
- 取得 API: `key` と `termSetId` を受け取り、termSets/{termSetId} を内部取得し、レンダリング済み（`parameterValues` 適用済み）の本文を返す。

これによりクライアントは Firestore を直接触らない。  
（セキュリティガチるならハッシュ化＋ソルトしたほうが良きだけど多分いらん）

---

## 6. 理解済み規約片の識別表示機能

- 表示時: `users/{userId}/understood` を取得し、`fragmentId` の一致でハイライト。

---

## 7. 利用規約の理解（understood）の記録機能

- 「理解した」操作で `users/{userId}/understood` に `fragmentId` と `understoodAt` を追加。

---

## 8. 理解済み規約片の一覧確認機能

- `users/{userId}/understood` を取得し、`fragmentId` から `termFragments/{fragmentId}.title` を参照して一覧表示。
