import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import '@fontsource/zen-maru-gothic/500.css';
import '@fontsource/zen-maru-gothic/700.css';

const FPS = 30;
const INTRO = 75;
const VID_SEC = 23.83;
const VID = Math.round(VID_SEC * FPS);
const OUTRO = 90;
export const TOTAL = INTRO + VID + OUTRO;

const C = {indigo: '#3b5bdb', ink: '#151b2e', soft: '#e4eaff', blue: '#8fa4ff', pink: '#f783ac', pinkSoft: '#ffc2d6', bg: '#f3f6fc'};
const FONT = "'Zen Maru Gothic', sans-serif";

// seconds inside the recorded demo video (from rel.json)
const CAPTIONS = [
  {from: 0.00, to: 5.92, h: '＋で立て替えを記録', s: '金額を入れて、払った人を選ぶ'},
  {from: 5.92, to: 11.49, h: '負担割合は、自由自在', s: '70:30も、5:5も、全額どちらかも'},
  {from: 11.49, to: 15.82, h: '渡す金額は、ひと目で', s: '誰が誰にいくらか、自動で計算'},
  {from: 15.82, to: 20.42, h: '精算は、ワンタップ', s: '確定すると、残高は0円に'},
  {from: 20.42, to: 23.83, h: '予算もグラフも管理', s: 'カテゴリごとの使いすぎチェック'},
];

const Circles: React.FC<{p: number; size?: number; opacity?: number}> = ({p, size = 300, opacity = 1}) => {
  // the logo: two smiling coins slide together, then a heart pops up between them
  const d = (1 - p) * 34;
  const h = interpolate(p, [0.75, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg viewBox="0 0 120 68" style={{width: size * 1.9, height: size * 1.9 * 68 / 120, opacity, overflow: 'visible'}}>
      <g transform={`translate(${-d} 0) rotate(-8 40 40)`}><circle cx="40" cy="40" r="24" fill="#4c6ef5" /><circle cx="40" cy="40" r="18" fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={2} /><ellipse cx="33" cy="37" rx="2.6" ry="3.4" fill="#151b2e" /><ellipse cx="47" cy="37" rx="2.6" ry="3.4" fill="#151b2e" /><path d="M34 45q6 5 12 0" fill="none" stroke="#151b2e" strokeWidth={2.6} strokeLinecap="round" /><circle cx="27" cy="44" r="3.2" fill="#ff8fb3" opacity={0.85} /><circle cx="53" cy="44" r="3.2" fill="#ff8fb3" opacity={0.85} /></g>
      <g transform={`translate(${d} 0) rotate(8 80 40)`}><circle cx="80" cy="40" r="24" fill="#f06595" /><circle cx="80" cy="40" r="18" fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={2} /><ellipse cx="73" cy="37" rx="2.6" ry="3.4" fill="#151b2e" /><ellipse cx="87" cy="37" rx="2.6" ry="3.4" fill="#151b2e" /><path d="M74 45q6 5 12 0" fill="none" stroke="#151b2e" strokeWidth={2.6} strokeLinecap="round" /><circle cx="67" cy="44" r="3.2" fill="#ffd1e1" opacity={0.85} /><circle cx="93" cy="44" r="3.2" fill="#ffd1e1" opacity={0.85} /></g>
      <path transform={`translate(60 ${11 + (1 - h) * 8}) scale(${1.2 * h})`} d="M0 7C-6 2.5-8-1-5.6-4.2-3.4-7 0-5.6 0-3.2 0-5.6 3.4-7 5.6-4.2 8-1 6 2.5 0 7Z" fill="#ff6b9a" />
    </svg>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 18, stiffness: 90}, durationInFrames: 35});
  const t = interpolate(f, [28, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [60, 75], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70, transform: 'translateY(-60px)'}}>
        <Circles p={p} size={260} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 168, color: '#fff', letterSpacing: `${0.1 + (1 - t) * 0.25}em`, opacity: t}}>ペアマネ</div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 46, color: C.pinkSoft, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>ふたりの立て替えを、かんたん精算</div>
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{h: string; s: string; len: number}> = ({h, s, len}) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [len - 8, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = Math.min(inn, out);
  return (
    <div style={{position: 'absolute', left: 72, right: 72, top: 110, textAlign: 'center', opacity: o, transform: `translateY(${(1 - inn) * 28 - (1 - out) * 10}px)`}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 80, color: '#fff', lineHeight: 1.25}}>{h}</div>
      <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 40, color: C.pinkSoft, marginTop: 18}}>{s}</div>
    </div>
  );
};

const Phone: React.FC<{enter: number}> = ({enter}) => {
  const W = 688, H = Math.round(688 * 1864 / 860);
  return (
    <div style={{position: 'absolute', left: (1080 - (W + 44)) / 2, top: 420 + (1 - enter) * 1400, width: W + 44, height: H + 44, borderRadius: 104, background: '#0c0f1a', padding: 22, boxShadow: '0 50px 100px rgba(0,0,0,.35), inset 0 0 0 3px rgba(255,255,255,.14)'}}>
      <div style={{position: 'relative', width: W, height: H, borderRadius: 82, overflow: 'hidden', background: C.bg}}>
        <OffthreadVideo src={staticFile('demo.mp4')} style={{width: W, height: H, display: 'block'}} muted />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 60px 0 66px', color: C.ink, fontSize: 28, fontFamily: 'system-ui, sans-serif', fontWeight: 700}}>
          <span>9:41</span>
          <svg width="92" height="26" viewBox="0 0 92 26"><g fill={C.ink}><rect x="0" y="14" width="5" height="9" rx="1.5"/><rect x="8" y="10" width="5" height="13" rx="1.5"/><rect x="16" y="5" width="5" height="18" rx="1.5"/><rect x="24" y="0" width="5" height="23" rx="1.5"/></g><rect x="42" y="2" width="44" height="20" rx="6" fill="none" stroke={C.ink} strokeWidth="2" opacity=".5"/><rect x="45" y="5" width="34" height="14" rx="3.5" fill={C.ink}/></svg>
        </div>
        <div style={{position: 'absolute', left: '50%', top: 16, width: 176, height: 52, marginLeft: -88, borderRadius: 30, background: '#0c0f1a'}} />
        <div style={{position: 'absolute', left: '50%', bottom: 12, width: 220, height: 8, marginLeft: -110, borderRadius: 4, background: C.ink, opacity: 0.8}} />
      </div>
    </div>
  );
};

const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: f, fps, config: {damping: 20, stiffness: 80}, durationInFrames: 40});
  const exit = interpolate(f, [VID - 14, VID], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{transform: `translateY(${exit * 160}px)`, opacity: 1 - exit}}>
      {CAPTIONS.map((c, i) => {
        const from = Math.round(c.from * FPS) + (i === 0 ? 12 : 0);
        const len = Math.round((c.to - c.from) * FPS) - (i === 0 ? 12 : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={len} layout="none">
            <Caption h={c.h} s={c.s} len={len} />
          </Sequence>
        );
      })}
      <Phone enter={enter} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 18, stiffness: 90}, durationInFrames: 30});
  const t = interpolate(f, [14, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const fade = interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: fade}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64, transform: 'translateY(-40px)'}}>
        <Circles p={p} size={220} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 140, color: '#fff', letterSpacing: '0.1em'}}>ペアマネ</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 56, color: C.pinkSoft, opacity: t}}>ふたり専用・無料</div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 40, color: '#fff', opacity: t * 0.85}}>招待コードで、すぐ始められる</div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{background: C.indigo}}>
    <Sequence from={0} durationInFrames={INTRO}><Intro /></Sequence>
    <Sequence from={INTRO - 10} durationInFrames={VID + 10}><Demo /></Sequence>
    <Sequence from={INTRO + VID - 4} durationInFrames={OUTRO + 4}><Outro /></Sequence>
  </AbsoluteFill>
);
