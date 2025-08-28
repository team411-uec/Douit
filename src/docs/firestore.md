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

## 実装済み関数の概要

本プロジェクトでは、以下の関数群が `src/app/functions/` ディレクトリに実装されています：

### 型定義 (`types.ts`)
- `TermFragment`: 規約片の型定義
- `TermSet`: 規約セットの型定義  
- `FragmentRef`: セット内フラグメント参照の型定義
- `UnderstoodRecord`: 理解記録の型定義
- `User`: ユーザー情報の型定義
- `ApiKey`: APIキーの型定義

### Firebase接続 (`firebase.ts`)
- Firebase初期化設定
- Firestore データベース接続
- Analytics設定（クライアントサイドのみ）

---

## 1. 規約片の編集作成削除

**実装済み関数** (`termFragments.ts`)

- `createTermFragment(title, content, tags, parameters)`: 新規規約片作成
  - 戻り値: 作成された fragmentId
- `updateTermFragment(fragmentId, title, content, tags, parameters)`: 規約片編集
  - 現在版を versions サブコレクションに保存後、親ドキュメント更新
  - currentVersion を自動インクリメント
- `getTermFragment(fragmentId)`: 規約片取得
  - 戻り値: TermFragment | null
- `findReferencingSets(fragmentId)`: 規約片を参照しているセットを検索
  - 戻り値: 参照している TermSet の ID 配列
- `safeDeleteTermFragment(fragmentId, forceDelete?)`: 安全な削除
  - 参照チェック付きで削除実行
  - forceDelete=false の場合、参照があれば警告を返す
- `deleteTermFragment(fragmentId)`: 基本削除機能

**処理**

- 作成: `title/content/tags/parameters` を入力し `termFragments/{fragmentId}` 新規作成。
- 編集: 現行を versions/{currentVersion} にコピー → 親ドキュメント更新 → currentVersion++、`updatedAt` 再設定。
- 削除: `termFragments/{fragmentId}` を削除（参照中セットがあれば UI で注意）。

---

## 2. 規約片のタグ付け機能

**実装状況**

- タグ付けは `createTermFragment` と `updateTermFragment` で `tags: string[]` として保存済み
- 専用関数は不要（作成・編集関数に統合）

**処理**

- 作成/編集時に `tags` を配列で保存。

---

## 3. 規約片のタグでの検索機能

**実装済み関数** (`tagSearch.ts`)

- `searchTermFragmentsByTag(tag)`: 指定タグでの検索
  - Firestore クエリ: `where("tags", "array-contains", tag)` を使用
  - 戻り値: `{id: string, data: TermFragment}[]`
- `getAllTermFragments()`: 全規約片取得
  - タグ指定なしで全ての規約片を取得
- `searchTermFragments(tag?)`: 統合検索インターフェース
  - tag が空/未指定の場合は全取得、指定されている場合はタグ検索

**処理**

- Firestore クエリ: `where("tags", "array-contains", tag)`

---

## 4. 利用規約セットの作成・管理機能

**実装済み関数** (`termSetService.ts`)

- `createTermSet()`: 規約セット作成
  - 戻り値: 作成された termSetId
- `addFragmentToSet(termSetId, fragmentId, parameterValues, order?)`: フラグメント追加
  - order 未指定時は最後に追加
- `updateFragmentOrder(termSetId, fragmentRefId, newOrder)`: 順序変更
- `updateFragmentParameters(termSetId, fragmentRefId, parameterValues)`: パラメータ更新
- `removeFragmentFromSet(termSetId, fragmentRefId)`: フラグメント削除
- `getTermSetFragments(termSetId)`: セット内フラグメント取得（order順）
- `renderTermSet(termSetId)`: レンダリング済みセット取得
  - parameterValues を適用したコンテンツを返す
- `updateTermSet(termSetId, callback)`: セット更新
  - バージョニング機能付き（現在版を versions に保存）

**処理**

- セット作成: `termSets/{termSetId}` 作成。
- フラグメント追加: `termSets/{termSetId}/fragments/{fragmentRefId}` に `fragmentId`, `order`, `parameterValues` を保存。
- 並べ替え: 対象 fragmentRef の `order:number` を更新（頻度低のため全体更新許容）。
- 編集時: 現行を versions/{currentVersion} にコピー → 更新 → currentVersion++
- プレビュー/公開表示: `order` 昇順で取得 → `parameterValues` を適用してレンダリング。

---

## 5. 利用規約セット公開用の API キー発行機能（Firestore 隠匿が目的）

**実装状況**

- ⚠️ **未実装**: API キー発行・管理機能は未実装
- Cloud Functions での実装が推奨される部分

**予定される処理**

- 発行: 管理 UI → Cloud Functions → ランダム key 生成 → `apiKeys/{apiKeyId}` に保存 → 生キーを UI に一度表示。
- 取得 API: `key` と `termSetId` を受け取り、termSets/{termSetId} を内部取得し、レンダリング済み（`parameterValues` 適用済み）の本文を返す。

これによりクライアントは Firestore を直接触らない。  
（セキュリティガチるならハッシュ化＋ソルトしたほうが良きだけど多分いらん）

---

## 6. 理解済み規約片の識別表示機能

**実装済み関数** (`understandingService.ts`)

- `getUnderstoodFragmentIds(userId)`: ユーザーが理解済みのフラグメントID一覧取得
  - 戻り値: `Set<string>` 高速検索用
- `getUserUnderstoodRecords(userId)`: ユーザーの理解記録詳細取得
  - 理解日時降順でソート済み
- `getUnderstoodStatus(userId, fragmentIds)`: 複数フラグメントの理解状況一括取得
  - UI表示用の一括チェック機能

**処理**

- 表示時: `users/{userId}/understood` を取得し、`fragmentId` の一致でハイライト。

---

## 7. 利用規約の理解（understood）の記録機能

**実装済み関数** (`understandingService.ts`)

- `addUnderstoodRecord(userId, fragmentId, version)`: 理解記録追加
  - バージョン管理機能付き（どのバージョンを理解したか記録）
  - 戻り値: 作成された recordId

**処理**

- 「理解した」操作で `users/{userId}/understood` に `fragmentId` と `understoodAt` を追加。

---

## 8. 理解済み規約片の一覧確認機能

**実装済み関数** (`understandingService.ts`)

- `getUserUnderstoodRecords(userId)`: ユーザーの理解記録一覧取得
  - フラグメント詳細情報とともに取得
  - 理解日時の降順でソート
- `getUnderstoodFragmentsWithDetails(userId)`: 理解済みフラグメントの詳細情報付き一覧
  - TermFragment の title などの詳細情報も含めて取得

**処理**

- `users/{userId}/understood` を取得し、`fragmentId` から `termFragments/{fragmentId}.title` を参照して一覧表示。
