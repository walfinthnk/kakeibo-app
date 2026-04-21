# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

レシート画像をアップロードすると Claude API が内容を自動読み取りし、家計を管理できる Web アプリ。

## Git 運用ルール

**コードを変更するたびに、必ず GitHub にプッシュすること。**

```bash
git add .
git commit -m "変更内容を簡潔に説明するメッセージ"
git push origin main
```

## 開発サーバーの起動

バックエンドとフロントエンドを **別々のターミナル** で起動する。

```bash
# バックエンド（ポート 3001）
cd backend
npm install       # 初回のみ
npm run dev

# フロントエンド（ポート 5173）
cd frontend
npm install       # 初回のみ
npm run dev
```

フロントエンドの `/api/*` リクエストは Vite のプロキシ設定でバックエンドに転送される。

## 環境変数のセットアップ

`backend/.env` を作成し、Anthropic API キーを設定する（`.gitignore` 済み）。

```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

`backend/.env.example` を参照。

## アーキテクチャ

```
kakeibo-app/
├── backend/           # Express サーバー
│   └── server.js      # POST /api/analyze-receipt（multer → Claude API → JSON返却）
└── frontend/          # React + Vite
    └── src/
        ├── App.jsx                # 状態管理・月フィルター・集計ロジック
        ├── components/
        │   ├── ReceiptUploader    # 画像アップロード・ドラッグ&ドロップ
        │   ├── ExpenseList        # レシート一覧・削除
        │   ├── Charts             # Chart.js 円グラフ・棒グラフ
        │   └── Summary            # カテゴリ別集計サマリー
        └── utils/
            ├── storage.js         # localStorage の読み書き
            └── constants.js       # CATEGORY_COLORS（カテゴリ名 → カラーコード）
```

### データフロー

1. ユーザーがレシート画像をアップロード
2. フロントエンドが `FormData` で `POST /api/analyze-receipt` を呼ぶ
3. バックエンドが画像を Base64 化して Claude API（`claude-haiku-4-5-20251001`）へ送信
4. Claude が JSON（`{ date, store, items[], total }`）を返す
5. フロントエンドが受け取ったデータを `receipts` ステートに追加し、`localStorage` に保存

### カテゴリ

食費 / 外食 / 日用品 / 交通費 / 娯楽 / 医療費 / その他
