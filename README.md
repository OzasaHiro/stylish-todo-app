# Stylish Todo App

スタイリッシュで使いやすいTODOリストアプリケーション。Next.js、React、Tailwind CSS、shadcn/uiを使用して構築されています。

## 特徴

- ✨ モダンで美しいUI
- 🌙 ダークモード/ライトモードの切り替え
- 📝 タスクの作成、編集、削除
- 🏷️ カテゴリとタグでタスクを整理
- ⚡ 優先度レベル（低、普通、高、緊急）
- 📅 期限の設定
- ✓ タスク完了のマーキング
- 🔄 ドラッグ＆ドロップでの並べ替え（予定）
- ✨ スムーズなアニメーション

## 技術スタック

- **フロントエンド:**
  - Next.js 15.1.3
  - React 18.2.0
  - TypeScript 5.0.0
  - Tailwind CSS 3.4.17
  - shadcn/ui 2.1.8
  - Framer Motion

- **バックエンド:**
  - Next.js API Routes
  - Prisma ORM
  - SQLite データベース

## 始め方

このプロジェクトをローカルで実行するには、以下の手順に従ってください：

1. リポジトリをクローンする
   ```
   git clone https://github.com/OzasaHiro/stylish-todo-app.git
   cd stylish-todo-app
   ```

2. 依存関係をインストール
   ```
   npm install
   ```

3. Prismaの初期設定
   ```
   npx prisma generate
   npx prisma db push
   ```

4. 開発サーバーを起動
   ```
   npm run dev
   ```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 主要コンポーネント

- `TodoList`: メインのタスクリスト表示
- `TodoItem`: 個々のタスク項目
- `TodoDialog`: タスクの追加・編集フォーム
- `EmptyState`: タスクがない場合の表示

## データベーススキーマ

```prisma
model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    String    @default("NORMAL") // 値: "LOW", "NORMAL", "HIGH", "URGENT"
  category    String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  position    Int       @default(0)
}
```

## API エンドポイント

- `GET /api/todos` - すべてのタスクを取得
- `POST /api/todos` - 新しいタスクを作成
- `GET /api/todos/[id]` - 特定のタスクを取得
- `PATCH /api/todos/[id]` - タスクを更新
- `DELETE /api/todos/[id]` - タスクを削除
- `POST /api/todos/reorder` - タスクの順序を変更
