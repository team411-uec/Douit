# Douit - 利用規約事前同意システム

## 📋 アプリ概要

Douit は、利用規約の複雑化と読み飛ばし問題を解決する革新的なプラットフォームです。利用規約を再利用可能な最小単位（規約片）に分割し、ユーザーが一度理解した内容は自動で同意処理することで、効率的で透明性の高い同意プロセスを実現します。

### ⚙️ 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, TailwindCSS
- **バックエンド**: Firebase/Firestore
- **UI**: Radix UI Themes
- **認証**: Firebase Authentication

### 🚀 開発・実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build
```

### 📚 詳細ドキュメント

- [開発方法](src/docs/rule.md) - 開発の進め方
- [企画書](src/docs/planning.md) - プロジェクトの詳細な企画内容
- [用語集](src/docs/dictionary.md) - プロジェクト内で使用する用語の定義
- [データベース設計](src/docs/firestore.md) - Firestore の設計と実装状況

### ✅ テスト実行（ローカル）

このリポジトリでは Jest + React Testing Library を使ったテストが用意されています。ローカルでテストを実行するには次のコマンドを実行してください。

```bash
# 依存が入っていない場合は先にインストール
npm install

# すべてのテストを実行
npm test

# カバレッジを出力する場合
npm run test:coverage
```

注意点:

- テストは外部サービス（Firebase 等）を直接叩かないよう、該当モジュールをテスト内でモックしています。
- jsdom の制約により、ブラウザの実際のナビゲーション（window.location による遷移）はテスト内で直接検証していない箇所があります。動作確認が必要な場合は実ブラウザでの E2E テストを推奨します。

### 🛠 CI でのテスト（概要）

簡易的な GitHub Actions ワークフロー例（.github/workflows/test.yml）を追加すると、push / pull request 時に自動でテストが実行されます。ワークフローの主要な流れは次の通りです。

1. Node 環境をセットアップ
2. 依存関係をインストール（npm ci）
3. npm test を実行

ポイント:

- CI 実行時もテストは外部サービスに依存しないようモックしてあるため、Firebase のシークレット等は不要です（ただし将来的に E2E を追加する場合はシークレット設定が必要）。

### 外部リンク

main以外のbranchにpushするとこれが更新されます、このURLの前にブランチ名とハイフンをつけるとそのブランチの状態が出るはずです。  
例）feat/docs→feat-docs-douit-electr2s-projects.vercel.app  
スラッシュはハイフンに置換されるので注意してください  
[本番環境](https://douit.vercel.app/)  
mainにmergeされたときに更新されます

---
