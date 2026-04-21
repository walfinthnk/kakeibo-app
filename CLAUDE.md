# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

家計簿アプリ（Kakeibo App）— 収入・支出を記録・管理する家計簿Webアプリケーション。

## Git 運用ルール

**コードを変更するたびに、必ず GitHub にプッシュすること。**

```bash
git add .
git commit -m "変更内容を簡潔に説明するメッセージ"
git push origin main
```

- コミットメッセージは日本語・英語どちらでも可
- 1つの機能追加やバグ修正ごとに1コミットを作成する
- プッシュ前に `git status` で変更内容を確認する
