# 紹介画像・説明動画の作り方

アプリの実画面を、疑似Firebase（`tests/stub-*.js`）とサンプルデータ（`seed.mjs`）で動かして撮影し、素材にする。

## 準備

```sh
cd tools/promo
npm init -y
npm install @fontsource/zen-maru-gothic remotion@4.0.250 @remotion/cli@4.0.250 @remotion/bundler@4.0.250 @remotion/renderer@4.0.250 react@18.3.1 react-dom@18.3.1
# Playwright も必要（環境変数 PLAYWRIGHT / CHROMIUM で場所を指定できる）
```

## 紹介画像（1290×2796）

```sh
node shots.mjs     # 画面を撮影して shots/ に保存
node compose.mjs   # スマホ枠と見出しを付けて out/screen-1〜7.png を作成
```

見出しの文言と背景色は `compose.mjs` の `slides` で変える。

## 説明動画（1080×1920・約29秒）

```sh
node rec.mjs       # アプリの操作を録画（vid/ に webm と marks.json）
# vid/marks.json の時刻から先頭を切り、remotion/public/demo.mp4 に変換する（ffmpeg）
npx remotion render remotion/src/index.ts Promo out/pairmane-promo.mp4 --public-dir=remotion/public
```

字幕の文言と表示時刻は `remotion/src/Promo.tsx` の `CAPTIONS` で変える。録画をやり直した場合は、`marks.json` に合わせて時刻を直す。
