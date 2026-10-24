# CLAUDE.md — ペアマネ

ふたり専用の割り勘・精算PWA。ユーザーは日本語で、結論ファーストの回答を好む。改修の依頼は、このリポジトリを読めば再開できるようにしてある。まず `README.md` と `docs/design.md` を読むこと。

## 構成の要点

- ビルドなし。`index.html` 1ファイルに CSS と JS（`<script type="module">`）がすべて入っている。
- Firebase JS SDK 10.14.1 を `https://www.gstatic.com/firebasejs/10.14.1/` から ES module で読み込む。Firestore は永続キャッシュ（オフライン対応）。
- 状態は `S`（couples ドキュメント＋サブコレクションのスナップショット）。描画は `render()` で innerHTML を組み直す。入力中やシートを開いている間はスナップショットが来ても描画を保留する（`refresh()` / `dirty`）。
- 書き込みは `putDoc` / `delDoc` / `patchCouple` / `runOps`（400件ずつのバッチ）。
- 計算は `calc(e)`（`docs/design.md` の式）。変える場合は `tests/smoke.mjs` の 1,001円 → 300円 のケースを必ず通す。
- 画面の文言は日本語。色は CSS 変数（`:root` とダーク用の2ブロック）で定義し、直接の色指定を増やさない。

## 守ること

- **Firestoreに新しいフィールドやコレクションを書き込む変更をするときは、`firestore.rules` も更新し、ユーザーにFirebaseコンソールでの公開を先に頼む。** ルールが古いままアプリを出すと保存が失敗する。
- 公開は `main` へのpushで行われる（GitHub Pages）。push前に `node tests/smoke.mjs` を通す。
- `sw.js` はネットワーク優先。アプリを更新したら、ユーザーにホーム画面のアプリを開き直してもらう。
- Firebaseは無料のSparkプランのまま使う。Cloud Functions など有料プランが必要な機能は、提案の段階でそう伝える（プッシュ通知はこれで見送り済み）。
- 一般公開しない。リポジトリはPublicなので、個人情報（メールアドレス、実データ）をコミットしない。

## 動作確認

```sh
node tests/smoke.mjs   # 疑似Firebase（tests/stub-*.js）で、作成→追加→精算→固定費→予算を確認
```

環境によっては `PLAYWRIGHT=<playwrightのindex.mjsのパス>` と `CHROMIUM=<ブラウザのパス>` を指定する。

## 紹介画像・動画の作り直し

`tools/promo/README.md` を参照。
