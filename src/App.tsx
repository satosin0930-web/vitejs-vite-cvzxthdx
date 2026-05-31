import { useState, useRef, useEffect } from "react";

// ── グローバルスタイル ────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Nunito:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: linear-gradient(135deg, #f0faf7 0%, #e8f7f2 50%, #f5f0ff 100%);
      min-height: 100vh;
      font-family: 'Nunito', sans-serif;
    }

    .app-wrap {
      max-width: 680px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
    }

    /* ヘッダー */
    .app-header {
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
    }
    .app-logo {
      font-family: 'Klee One', cursive;
      font-size: 26px;
      color: #2d9e7e;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .app-logo-emoji { font-size: 28px; }
    .app-sub {
      font-size: 13px;
      color: #7bbfaa;
      font-family: 'Nunito', sans-serif;
    }

    /* デコライン */
    .deco-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
      justify-content: center;
    }
    .deco-line::before, .deco-line::after {
      content: '';
      flex: 1;
      max-width: 80px;
      height: 1.5px;
      background: linear-gradient(90deg, transparent, #a8dfd0);
    }
    .deco-line::after { background: linear-gradient(90deg, #a8dfd0, transparent); }
    .deco-dot { width: 6px; height: 6px; border-radius: 50%; background: #2d9e7e; }

    /* ステップバー */
    .step-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 1.5rem;
      position: relative;
    }
    .step-bar::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0; right: 0;
      height: 2px;
      background: #dff0eb;
      z-index: 0;
      transform: translateY(-50%);
    }
    .step-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
      z-index: 1;
    }
    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.3s;
      border: 2.5px solid #dff0eb;
      background: white;
      color: #b0d5c8;
    }
    .step-circle.active {
      background: linear-gradient(135deg, #3ec9a0, #2d9e7e);
      border-color: #2d9e7e;
      color: white;
      box-shadow: 0 4px 12px rgba(45,158,126,0.3);
    }
    .step-circle.done {
      background: linear-gradient(135deg, #a8dfd0, #7bbfaa);
      border-color: #7bbfaa;
      color: white;
    }
    .step-label {
      font-size: 9px;
      color: #aac9bf;
      font-weight: 600;
      text-align: center;
      letter-spacing: 0.3px;
    }
    .step-label.active { color: #2d9e7e; }
    .step-label.done { color: #7bbfaa; }

    /* カード */
    .card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 24px rgba(45,158,126,0.08), 0 1px 4px rgba(0,0,0,0.04);
      border: 1.5px solid #e8f5f0;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3ec9a0, #a78bfa, #3ec9a0);
      background-size: 200% 100%;
      animation: shimmer 3s linear infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* URL入力ボックス */
    .url-box {
      background: linear-gradient(135deg, #f0fdf8, #f5f0ff);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 20px;
      border: 1.5px dashed #a8dfd0;
    }
    .url-box-label {
      font-family: 'Klee One', cursive;
      font-size: 13px;
      color: #2d9e7e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* 入力フィールド */
    .field-group { margin-bottom: 14px; }
    .field-label {
      font-size: 11px;
      font-weight: 700;
      color: #7bbfaa;
      margin-bottom: 5px;
      display: block;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .field-req { color: #f472b6; margin-left: 3px; }
    input[type=text], input[type=number], textarea, select {
      width: 100%;
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      padding: 10px 14px;
      border: 2px solid #e8f5f0;
      border-radius: 12px;
      background: #fafffe;
      color: #2d4a42;
      outline: none;
      transition: all 0.2s;
    }
    input:focus, textarea:focus, select:focus {
      border-color: #3ec9a0;
      background: white;
      box-shadow: 0 0 0 4px rgba(62,201,160,0.1);
    }
    textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

    /* カラーピッカー */
    .color-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .color-dot {
      width: 30px; height: 30px; border-radius: 50%;
      cursor: pointer; transition: all 0.2s;
      border: 3px solid transparent;
    }
    .color-dot.selected { border-color: #2d4a42; transform: scale(1.15); }
    .color-dot:hover { transform: scale(1.1); }

    /* 保存アカウントタグ */
    .saved-tag {
      font-size: 11px;
      padding: 4px 12px;
      border-radius: 20px;
      cursor: pointer;
      border: 1.5px solid #a8dfd0;
      background: #f0fdf8;
      color: #2d9e7e;
      font-weight: 600;
      transition: all 0.15s;
    }
    .saved-tag:hover, .saved-tag.active { background: #2d9e7e; color: white; border-color: #2d9e7e; }

    /* プライマリボタン */
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #3ec9a0, #2d9e7e);
      color: white;
      border: none;
      border-radius: 14px;
      font-family: 'Nunito', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(45,158,126,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,158,126,0.35); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { background: #d1ede6; box-shadow: none; cursor: not-allowed; color: #a0c8bc; }
    .btn-secondary {
      flex: 1;
      padding: 12px;
      background: white;
      color: #7bbfaa;
      border: 2px solid #e8f5f0;
      border-radius: 14px;
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #a8dfd0; color: #2d9e7e; }
    .btn-row { display: flex; gap: 10px; margin-top: 4px; }

    /* ジャンル・テンプレートグリッド */
    .choice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px; }
    .choice-item {
      padding: 14px 10px;
      text-align: center;
      border: 2px solid #e8f5f0;
      border-radius: 16px;
      cursor: pointer;
      background: white;
      transition: all 0.2s;
      position: relative;
    }
    .choice-item:hover { border-color: #a8dfd0; background: #f0fdf8; transform: translateY(-2px); }
    .choice-item.selected {
      border-color: #3ec9a0;
      background: linear-gradient(135deg, #f0fdf8, #f5f0ff);
      box-shadow: 0 4px 12px rgba(62,201,160,0.2);
      transform: translateY(-2px);
    }
    .choice-item.selected::after {
      content: '✓';
      position: absolute;
      top: 6px; right: 8px;
      font-size: 11px;
      color: #3ec9a0;
      font-weight: 700;
    }
    .choice-icon { font-size: 26px; margin-bottom: 6px; }
    .choice-label { font-size: 11px; font-weight: 600; color: #4a7a6d; }
    .choice-item.selected .choice-label { color: #2d9e7e; }

    /* セクションタイトル */
    .section-title {
      font-family: 'Klee One', cursive;
      font-size: 14px;
      color: #2d9e7e;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* アップロードエリア */
    .upload-area {
      background: linear-gradient(135deg, #f0fdf8, #fdf4ff);
      border: 2px dashed #a8dfd0;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .upload-btn-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      background: linear-gradient(135deg, #a78bfa, #7c3aed);
      color: white;
      border-radius: 12px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Nunito', sans-serif;
      box-shadow: 0 4px 12px rgba(124,58,237,0.25);
      transition: all 0.2s;
    }
    .upload-btn-label:hover { transform: translateY(-1px); }
    .upload-hint { font-size: 11px; color: #9bbfb2; margin-top: 8px; }
    .upload-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-top: 12px; }
    .upload-card { border: 2px solid #e8f5f0; border-radius: 14px; overflow: hidden; background: white; }
    .upload-img-wrap { position: relative; }
    .upload-img-wrap img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
    .upload-del {
      position: absolute; top: 4px; right: 4px;
      width: 22px; height: 22px; border-radius: 50%;
      background: rgba(0,0,0,0.5); color: white;
      border: none; cursor: pointer; font-size: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .upload-card-body { padding: 8px; }
    .upload-select {
      width: 100%;
      font-size: 10px;
      padding: 4px 6px;
      border: 1.5px solid #e8f5f0;
      border-radius: 8px;
      margin-bottom: 4px;
      font-family: 'Nunito', sans-serif;
    }

    /* 生成ローディング */
    .loading-wrap {
      text-align: center;
      padding: 3rem 0;
    }
    .loading-spinner {
      width: 48px; height: 48px;
      border: 4px solid #e8f5f0;
      border-top-color: #3ec9a0;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-msg {
      font-family: 'Klee One', cursive;
      font-size: 15px;
      color: #2d9e7e;
    }
    .loading-dots::after {
      content: '...';
      animation: dots 1.5s steps(3, end) infinite;
    }
    @keyframes dots { 0%,100%{content:'.'} 33%{content:'..'} 66%{content:'...'} }

    /* タブ */
    .tab-bar {
      display: flex;
      background: #f0fdf8;
      border-radius: 14px;
      padding: 4px;
      margin-bottom: 16px;
      gap: 4px;
    }
    .tab-item {
      flex: 1;
      padding: 9px 4px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.2s;
      color: #7bbfaa;
      font-family: 'Nunito', sans-serif;
    }
    .tab-item.active {
      background: white;
      color: #2d9e7e;
      box-shadow: 0 2px 8px rgba(45,158,126,0.15);
    }

    /* 結果カード */
    .result-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid #e8f5f0;
      margin-bottom: 12px;
      box-shadow: 0 2px 12px rgba(45,158,126,0.06);
    }
    .result-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: linear-gradient(135deg, #f0fdf8, #fdf4ff);
      border-bottom: 1.5px solid #e8f5f0;
    }
    .result-head-label { font-size: 12px; font-weight: 700; color: #2d9e7e; font-family: 'Klee One', cursive; }
    .result-body { padding: 16px; font-size: 13px; line-height: 1.8; color: #2d4a42; white-space: pre-wrap; word-break: break-word; }

    /* コピーボタン */
    .copy-btn {
      font-size: 11px;
      padding: 4px 12px;
      border: 1.5px solid #a8dfd0;
      border-radius: 20px;
      background: white;
      color: #2d9e7e;
      cursor: pointer;
      font-weight: 600;
      font-family: 'Nunito', sans-serif;
      transition: all 0.15s;
    }
    .copy-btn:hover { background: #f0fdf8; }
    .copy-btn.ok { background: #2d9e7e; color: white; border-color: #2d9e7e; }

    /* ハッシュタグ */
    .tag-wrap { padding: 14px 16px; display: flex; flex-wrap: wrap; gap: 6px; }
    .hash-tag {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f0fdf8, #f5f0ff);
      color: #2d9e7e;
      border: 1.5px solid #a8dfd0;
      font-weight: 600;
    }

    /* 画像グリッド */
    .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
    .img-card { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .img-canvas { width: 100%; max-width: 220px; border-radius: 12px; border: 2px solid #e8f5f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .dl-btn {
      font-size: 11px;
      padding: 6px 14px;
      background: linear-gradient(135deg, #3ec9a0, #2d9e7e);
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 700;
      font-family: 'Nunito', sans-serif;
      box-shadow: 0 2px 8px rgba(45,158,126,0.2);
      transition: all 0.15s;
    }
    .dl-btn:hover { transform: translateY(-1px); }
    .dl-all-btn {
      font-size: 12px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #a78bfa, #7c3aed);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      font-family: 'Nunito', sans-serif;
      box-shadow: 0 3px 10px rgba(124,58,237,0.25);
      transition: all 0.15s;
    }

    /* フォロワーステージバッジ */
    .stage-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 8px;
    }

    /* エラー */
    .error-box { background: #fff0f5; border: 1.5px solid #fca5c5; border-radius: 12px; padding: 10px 14px; font-size: 12px; color: #e0538a; margin-bottom: 12px; }

    /* フローティングデコ */
    .deco-float {
      position: fixed;
      pointer-events: none;
      z-index: 0;
      opacity: 0.06;
      font-size: 120px;
    }
    .deco-float-1 { top: 5%; right: -2%; }
    .deco-float-2 { bottom: 10%; left: -3%; }
  `}</style>
);

// ── データ ────────────────────────────────────────────
const GENRES = [
  { id: "shop", label: "物販・ショップ", icon: "🛍️" },
  { id: "food", label: "飲食・カフェ", icon: "☕" },
  { id: "beauty", label: "美容・サロン", icon: "💄" },
  { id: "craft", label: "ハンドメイド・工芸", icon: "🎨" },
  { id: "health", label: "健康・フィットネス", icon: "💪" },
  { id: "travel", label: "旅行・観光", icon: "✈️" },
  { id: "education", label: "教育・情報発信", icon: "📚" },
  { id: "other", label: "その他", icon: "✨" },
];
const TEMPLATES = [
  { id: "product", label: "商品・サービス紹介", icon: "📦" },
  { id: "review", label: "お客様の声", icon: "⭐" },
  { id: "tips", label: "豆知識・tips", icon: "💡" },
  { id: "story", label: "ブランドストーリー", icon: "📖" },
  { id: "campaign", label: "キャンペーン・告知", icon: "🎁" },
  { id: "lifestyle", label: "ライフスタイル提案", icon: "🌟" },
  { id: "behind", label: "舞台裏・こだわり", icon: "🎬" },
  { id: "qa", label: "よくある質問", icon: "❓" },
];
const FOLLOWER_STAGES = [
  { id: "seed", range: "0〜100", label: "🌱 種まき期", color: "#7bbfaa" },
  { id: "growth", range: "100〜1,000", label: "🌿 成長期", color: "#2d9e7e" },
  { id: "momentum", range: "1,000〜10,000", label: "🚀 加速期", color: "#a78bfa" },
  { id: "influence", range: "10,000〜", label: "⭐ 影響力期", color: "#f472b6" },
];
const THEME_COLORS = ["#3ec9a0","#a78bfa","#f472b6","#fb923c","#60a5fa","#facc15","#2d9e7e","#7c3aed"];

function getStage(followers: string) {
  const n = parseInt(followers) || 0;
  if (n < 100) return FOLLOWER_STAGES[0];
  if (n < 1000) return FOLLOWER_STAGES[1];
  if (n < 10000) return FOLLOWER_STAGES[2];
  return FOLLOWER_STAGES[3];
}
function parseInstagramUrl(url: string): { accountId: string; accountName: string } | null {
  try {
    const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)\/?/);
    if (match && match[1] && !["p","reel","stories"].includes(match[1])) {
      const accountId = match[1];
      const accountName = accountId.replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      return { accountId, accountName };
    }
  } catch {}
  return null;
}
const SK = "insta_accounts_v2";
function saveAcc(a: Account) { try { const s = JSON.parse(localStorage.getItem(SK)||"[]"); const i = s.findIndex((x: Account) => x.accountId===a.accountId); if(i>=0) s[i]=a; else s.unshift(a); localStorage.setItem(SK,JSON.stringify(s.slice(0,10))); } catch {} }
function loadAccs(): Account[] { try { return JSON.parse(localStorage.getItem(SK)||"[]"); } catch { return []; } }

// ── 型 ────────────────────────────────────────────────
interface SlideData { title: string; lines: string[]; badge?: string; iscover?: boolean; }
interface UploadedImage { file: File; url: string; placement: "auto"|"specific"|"background"; slideIndex?: number; }
interface Account { accountName: string; accountId: string; brandName: string; genre: string; followers: string; hashtags: string; themeColor: string; postNote: string; todayContent: string; }
interface GeneratedResult { caption: string; hashtags: string; slides: SlideData[]; unsplashUrl?: string; }

// ── 画像取得・生成 ───────────────────────────────────────

const GENRE_KEYWORDS: Record<string, string[]> = {
  shop: ["shopping","retail","store","product","market"],
  food: ["food","cafe","coffee","restaurant","cooking"],
  beauty: ["beauty","salon","cosmetics","skincare","makeup"],
  craft: ["handcraft","wood","art","craft","creative"],
  health: ["fitness","health","workout","yoga","wellness"],
  travel: ["travel","landscape","nature","journey","adventure"],
  education: ["education","learning","book","study","knowledge"],
  other: ["business","lifestyle","modern","minimal","creative"],
};

const TEMPLATE_KEYWORDS: Record<string, string> = {
  product: "product showcase",
  review: "customer happy smiling",
  tips: "lightbulb idea inspiration",
  story: "story journey people",
  campaign: "celebration sale discount",
  lifestyle: "lifestyle minimal aesthetic",
  behind: "behind scenes workshop",
  qa: "conversation help support",
};

async function fetchUnsplashImage(genre: string, template: string): Promise<string|null> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  try {
    const genreKw = GENRE_KEYWORDS[genre]?.[Math.floor(Math.random()*3)] || "lifestyle";
    const templateKw = TEMPLATE_KEYWORDS[template] || "minimal";
    const query = encodeURIComponent(`${genreKw} ${templateKw}`);
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&orientation=portrait&content_filter=high`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.urls?.regular || null;
  } catch { return null; }
}

interface UnsplashPhoto { id: string; url: string; thumb: string; credit: string; }

async function searchUnsplashPhotos(keyword: string, count: number = 12): Promise<UnsplashPhoto[]> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];
  try {
    const query = encodeURIComponent(keyword);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&content_filter=high`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((p: any) => ({
      id: p.id,
      url: p.urls.regular,
      thumb: p.urls.thumb,
      credit: p.user.name,
    }));
  } catch { return []; }
}

function generateSvgBg(themeColor: string, genre: string): string {
  const shapes: Record<string, string> = {
    shop: `<circle cx="80%" cy="20%" r="120" fill="${themeColor}" opacity="0.15"/><rect x="10%" y="60%" width="200" height="200" rx="30" fill="${themeColor}" opacity="0.08" transform="rotate(20,200,700)"/>`,
    food: `<circle cx="20%" cy="30%" r="100" fill="${themeColor}" opacity="0.12"/><circle cx="80%" cy="70%" r="150" fill="#a78bfa" opacity="0.08"/><circle cx="50%" cy="10%" r="60" fill="${themeColor}" opacity="0.1"/>`,
    beauty: `<ellipse cx="70%" cy="25%" rx="140" ry="100" fill="${themeColor}" opacity="0.12"/><ellipse cx="20%" cy="75%" rx="100" ry="140" fill="#f472b6" opacity="0.1"/>`,
    craft: `<polygon points="400,50 500,200 300,200" fill="${themeColor}" opacity="0.1"/><polygon points="100,400 200,550 0,550" fill="#a78bfa" opacity="0.08"/>`,
    health: `<circle cx="85%" cy="15%" r="80" fill="${themeColor}" opacity="0.15"/><circle cx="15%" cy="85%" r="100" fill="${themeColor}" opacity="0.1"/><circle cx="50%" cy="50%" r="200" fill="${themeColor}" opacity="0.04"/>`,
    travel: `<path d="M0,200 Q270,100 540,200 L540,675 L0,675 Z" fill="${themeColor}" opacity="0.08"/><circle cx="80%" cy="20%" r="90" fill="#facc15" opacity="0.1"/>`,
    education: `<rect x="60%" y="5%" width="180" height="180" rx="20" fill="${themeColor}" opacity="0.1" transform="rotate(15)"/><rect x="5%" y="60%" width="140" height="140" rx="15" fill="#a78bfa" opacity="0.08" transform="rotate(-10)"/>`,
    other: `<circle cx="75%" cy="25%" r="110" fill="${themeColor}" opacity="0.12"/><circle cx="25%" cy="75%" r="90" fill="#a78bfa" opacity="0.1"/>`,
  };
  const shape = shapes[genre] || shapes.other;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="675" viewBox="0 0 540 675">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a2a22"/>
        <stop offset="100%" stop-color="#12362c"/>
      </linearGradient>
    </defs>
    <rect width="540" height="675" fill="url(#bg)"/>
    ${shape}
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// ── Canvas ────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

function ImageCard({ slide, brand, themeColor, accountId, index, uploadedImages, autoImageUrl, genre }: { slide: SlideData; brand: string; themeColor: string; accountId: string; index: number; uploadedImages: UploadedImage[]; autoImageUrl?: string; genre: string; }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W=540, H=675; canvas.width=W; canvas.height=H;
    const bgImg = uploadedImages.find(img=>img.placement==="background");
    const specificImg = uploadedImages.find(img=>img.placement==="specific"&&img.slideIndex===index);
    const autoImg = uploadedImages.find(img=>img.placement==="auto");
    // 優先順位: ユーザーアップロード > Unsplash自動取得 > SVG生成背景
    const useUploadedImg = specificImg||(index>0&&index<8?autoImg:null)||bgImg;
    const useAutoUrl = !useUploadedImg && autoImageUrl ? autoImageUrl : null;
    const useSvgBg = !useUploadedImg && !useAutoUrl ? generateSvgBg(themeColor, genre) : null;
    const useImg = useUploadedImg ? useUploadedImg.url : (useAutoUrl || useSvgBg);
    const drawContent = () => {
      // ミント系グラデ背景
      const grad = ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0,"#0a2a22"); grad.addColorStop(1,"#12362c");
      ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
      // デコ円
      ctx.fillStyle=themeColor+"15";
      ctx.beginPath(); ctx.arc(W*0.85,H*0.15,120,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(W*0.1,H*0.8,80,0,Math.PI*2); ctx.fill();
      // 上部バー
      const barGrad=ctx.createLinearGradient(0,0,W,0);
      barGrad.addColorStop(0,themeColor); barGrad.addColorStop(1,"#a78bfa");
      ctx.fillStyle=barGrad; ctx.fillRect(0,0,W,6);
      // ブランド名
      ctx.fillStyle=themeColor; ctx.font="bold 20px sans-serif"; ctx.textAlign="center";
      ctx.fillText(brand,W/2,46);
      // 番号
      ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="13px sans-serif"; ctx.textAlign="right";
      ctx.fillText(`${index+1}/10`,W-20,46);
      if(slide.iscover) {
        ctx.fillStyle="#fff"; ctx.font="bold 36px sans-serif"; ctx.textAlign="center";
        const tl=slide.title.match(/.{1,12}/g)||[slide.title];
        tl.forEach((line,i)=>ctx.fillText(line,W/2,200+i*50));
        ctx.strokeStyle=themeColor; ctx.lineWidth=2; ctx.beginPath();
        ctx.moveTo(80,280+tl.length*50); ctx.lineTo(W-80,280+tl.length*50); ctx.stroke();
        slide.lines.forEach((line,i)=>{
          ctx.fillStyle="rgba(255,255,255,0.65)"; ctx.font="17px sans-serif";
          ctx.fillText(line,W/2,330+tl.length*50+i*32);
        });
      } else {
        // タイトルボックス
        ctx.fillStyle=themeColor+"30"; roundRect(ctx,30,66,W-60,66,14); ctx.fill();
        ctx.strokeStyle=themeColor+"60"; ctx.lineWidth=1.5; roundRect(ctx,30,66,W-60,66,14); ctx.stroke();
        ctx.fillStyle="#fff"; ctx.font="bold 28px sans-serif"; ctx.textAlign="center";
        ctx.fillText(slide.title,W/2,112);
        slide.lines.forEach((line,i)=>{
          const y=190+i*52;
          if(line.startsWith("✅")||line.startsWith("💡")||line.startsWith("⭐")||line.startsWith("🔥")||line.startsWith("📌")) {
            ctx.fillStyle=themeColor+"20"; roundRect(ctx,30,y-26,W-60,42,10); ctx.fill();
            ctx.fillStyle="#fff"; ctx.font="bold 20px sans-serif"; ctx.textAlign="left"; ctx.fillText(line,50,y);
          } else {
            ctx.fillStyle="rgba(255,255,255,0.8)"; ctx.font="18px sans-serif"; ctx.textAlign="left";
            if(ctx.measureText(line).width>W-100){const h=Math.floor(line.length/2);ctx.fillText(line.slice(0,h),50,y);ctx.fillText(line.slice(h),50,y+20);}
            else ctx.fillText(line,50,y);
          }
        });
        if(slide.badge){
          const badgeGrad=ctx.createLinearGradient(30,0,W-30,0);
          badgeGrad.addColorStop(0,themeColor); badgeGrad.addColorStop(1,"#a78bfa");
          ctx.fillStyle=badgeGrad; roundRect(ctx,30,H-110,W-60,46,12); ctx.fill();
          ctx.fillStyle="#fff"; ctx.font="bold 20px sans-serif"; ctx.textAlign="center";
          ctx.fillText(slide.badge,W/2,H-80);
        }
      }
      ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.font="14px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`@${accountId}`,W/2,H-16);
      const footGrad=ctx.createLinearGradient(0,0,W,0);
      footGrad.addColorStop(0,themeColor); footGrad.addColorStop(1,"#a78bfa");
      ctx.fillStyle=footGrad; ctx.fillRect(0,H-5,W,5);
    };
    if(useImg){
      const img=new Image();
      const isSvg = typeof useImg === "string" && useImg.startsWith("data:image/svg");
      if(!isSvg) img.crossOrigin="anonymous";
      img.onload=()=>{
        ctx.fillStyle="#0a2a22"; ctx.fillRect(0,0,W,H);
        const scale=Math.max(W/img.width,H/img.height);
        const sw=img.width*scale,sh=img.height*scale;
        ctx.globalAlpha = isSvg ? 1.0 : 0.45;
        ctx.drawImage(img,(W-sw)/2,(H-sh)/2,sw,sh);
        ctx.globalAlpha=1;
        if(!isSvg){ctx.fillStyle="rgba(10,42,34,0.6)"; ctx.fillRect(0,0,W,H);}
        drawContent();
      };
      img.onerror=()=>{ ctx.fillStyle="#0a2a22"; ctx.fillRect(0,0,W,H); drawContent(); };
      // Unsplash画像はw=800&q=80&fm=jpg&fit=crop&crop=entropyを追加してCORS対応
      const imgSrc = typeof useImg === "string" ? useImg : "";
      img.src = (!isSvg && imgSrc.includes("unsplash.com"))
        ? imgSrc + (imgSrc.includes("?") ? "&" : "?") + "w=800&q=80&fm=jpg&fit=crop&crop=entropy"
        : imgSrc;
    } else { ctx.fillStyle="#0a2a22"; ctx.fillRect(0,0,W,H); drawContent(); }
  },[slide,brand,themeColor,accountId,index,uploadedImages]);

  const download = () => {
    const canvas=canvasRef.current; if(!canvas) return;
    const link=document.createElement("a"); link.download=`post_${index+1}.png`; link.href=canvas.toDataURL("image/png"); link.click();
  };
  return (
    <div className="img-card">
      <canvas ref={canvasRef} className="img-canvas" />
      <button className="dl-btn" onClick={download}>⬇ 保存</button>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [ok,setOk]=useState(false);
  return <button className={`copy-btn${ok?" ok":""}`} onClick={()=>{navigator.clipboard.writeText(text).then(()=>{setOk(true);setTimeout(()=>setOk(false),2000);});}}>
    {ok?"✓ コピー済み":"⎘ コピー"}
  </button>;
}

// ── メイン ────────────────────────────────────────────
export default function App() {
  const [step,setStep]=useState(1);
  const [savedAccounts,setSavedAccounts]=useState<Account[]>(()=>loadAccs());
  const [uploadedImages,setUploadedImages]=useState<UploadedImage[]>([]);
  const [account,setAccount]=useState<Account>({accountName:"",accountId:"",brandName:"",genre:"",followers:"",hashtags:"",themeColor:"#3ec9a0",postNote:"",todayContent:""});
  const [selectedTemplate,setSelectedTemplate]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadingMsg,setLoadingMsg]=useState("");
  const [result,setResult]=useState<GeneratedResult|null>(null);
  const [error,setError]=useState("");
  const [activeTab,setActiveTab]=useState("images");
  const [photoKeyword,setPhotoKeyword]=useState("");
  const [photoSearching,setPhotoSearching]=useState(false);
  const [photoCandidates,setPhotoCandidates]=useState<UnsplashPhoto[]>([]);
  const [selectedPhoto,setSelectedPhoto]=useState<UnsplashPhoto|null>(null);

  const stage=getStage(account.followers);
  const brand=account.brandName||account.accountName;

  const handleStep1Next=()=>{
    if(account.accountName&&account.accountId){saveAcc(account);setSavedAccounts(loadAccs());setStep(2);}
  };

  const generate=async()=>{
    setLoading(true);setError("");setResult(null);
    const msgs=["✨ AIがコンテンツを考えています","📝 キャプションを作成中","# ハッシュタグを最適化中","🖼️ 10枚の画像を構成中","🎨 仕上げています"];
    let mi=0;setLoadingMsg(msgs[0]);
    const iv=setInterval(()=>{if(mi<msgs.length-1)setLoadingMsg(msgs[++mi]);},1200);
    const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY;
    const genre=GENRES.find(g=>g.id===account.genre)?.label||"";
    const template=TEMPLATES.find(t=>t.id===selectedTemplate)?.label||"";
    const prompt=`あなたはインスタグラムの投稿専門家です。以下の情報を元に投稿コンテンツを作成してください。
【アカウント情報】
- ブランド名：${brand}
- インスタID：@${account.accountId}
- ジャンル：${genre}
- フォロワー数：${account.followers||"不明"}（${stage.label}）
- 固定ハッシュタグ：${account.hashtags||"なし"}
- 毎回の一言：${account.postNote||"なし"}
- 今日伝えたいこと：${account.todayContent||"おまかせ"}
- テンプレート：${template}
以下のJSON形式のみで出力してください（他の文言不要）：
{"caption":"キャプション（1行目は「${brand}」のみ、改行含む完全なキャプション、絵文字多用）","hashtags":"ハッシュタグ30個スペース区切り","slides":[{"title":"スライドタイトル","lines":["行1","行2","行3"],"badge":"バッジ","iscover":true},{"title":"タイトル2","lines":["✅ ポイント1","✅ ポイント2","✅ ポイント3"],"badge":"アクション"}]}
slidesは必ず10個。1枚目はiscover:trueで表紙。2〜8枚目はメインコンテンツ。9枚目はよくある質問。10枚目はCTA。`;
    try {
      // ClaudeとUnsplashを並列取得
      const [aiRes, unsplashUrl] = await Promise.all([
        fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:3000,messages:[{role:"user",content:prompt}]})}),
        (!selectedPhoto && uploadedImages.length === 0) ? fetchUnsplashImage(account.genre, selectedTemplate) : Promise.resolve(selectedPhoto?.url || null),
      ]);
      const data=await aiRes.json();
      const text=data.content?.[0]?.text||"";
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      clearInterval(iv);
      setResult({caption:parsed.caption||"",hashtags:parsed.hashtags||"",slides:parsed.slides||[],unsplashUrl:unsplashUrl||undefined});
      setStep(4);
    } catch {
      clearInterval(iv);
      setError("生成に失敗しました。もう一度お試しください。");
    } finally { setLoading(false); }
  };

  const downloadAll=()=>{
    document.querySelectorAll<HTMLCanvasElement>("canvas").forEach((canvas,i)=>{
      setTimeout(()=>{const link=document.createElement("a");link.download=`post_${i+1}.png`;link.href=canvas.toDataURL("image/png");link.click();},i*300);
    });
  };

  const STEPS=["アカウント","ジャンル","内容入力","完成！"];

  return (
    <>
      <GlobalStyle />
      <div className="deco-float deco-float-1">🌿</div>
      <div className="deco-float deco-float-2">✨</div>
      <div className="app-wrap" style={{position:"relative",zIndex:1}}>

        {/* ヘッダー */}
        <div className="app-header">
          <div className="app-logo">
            <span className="app-logo-emoji">📱</span>
            インスタ投稿ジェネレーター
          </div>
          <div className="app-sub">AIがフォロワーを増やす投稿を自動生成します</div>
          <div className="deco-line"><div className="deco-dot"/></div>
        </div>

        {/* ステップバー */}
        <div className="step-bar">
          {STEPS.map((label,i)=>(
            <div className="step-item" key={i}>
              <div className={`step-circle${step===i+1?" active":step>i+1?" done":""}`}>
                {step>i+1?"✓":i+1}
              </div>
              <div className={`step-label${step===i+1?" active":step>i+1?" done":""}`}>{label}</div>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step===1&&(
          <div className="card">
            <div className="url-box">
              <div className="url-box-label">📱 インスタURLを貼るだけで自動入力</div>
              <input type="text" placeholder="https://www.instagram.com/アカウント名/"
                onChange={e=>{const parsed=parseInstagramUrl(e.target.value);if(parsed){const saved=loadAccs().find(a=>a.accountId===parsed.accountId);if(saved)setAccount(saved);else setAccount(prev=>({...prev,accountId:parsed.accountId,accountName:parsed.accountName}));}}}
                onPaste={e=>{const pasted=e.clipboardData.getData("text");const parsed=parseInstagramUrl(pasted);if(parsed){const saved=loadAccs().find(a=>a.accountId===parsed.accountId);if(saved)setAccount(saved);else setAccount(prev=>({...prev,accountId:parsed.accountId,accountName:parsed.accountName}));}}}
              />
              {savedAccounts.length>0&&(
                <div style={{marginTop:10}}>
                  <div style={{fontSize:11,color:"#9bbfb2",marginBottom:6,fontWeight:600}}>保存済みアカウント</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {savedAccounts.map(a=>(
                      <div key={a.accountId} className={`saved-tag${account.accountId===a.accountId?" active":""}`} onClick={()=>setAccount(a)}>@{a.accountId}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {[
              {key:"accountName",label:"アカウント表示名",placeholder:"例：レコルトバッテリー館",req:true},
              {key:"accountId",label:"インスタID（@なし）",placeholder:"例：nextsatosin_battery",req:true},
              {key:"brandName",label:"投稿1行目・画像のブランド名",placeholder:"例：Recolte Battery Store"},
              {key:"followers",label:"現在のフォロワー数",placeholder:"例：250"},
              {key:"hashtags",label:"固定ハッシュタグ（スペース区切り）",placeholder:"例：#バッテリー専門店"},
              {key:"postNote",label:"毎回入れる一言（任意）",placeholder:"例：楽天市場にて販売中！"},
            ].map((f)=>(
              <div className="field-group" key={f.key}>
                <label className="field-label">{f.label}{f.req&&<span className="field-req">*</span>}</label>
                <input type="text" placeholder={f.placeholder} value={(account as any)[f.key]} onChange={e=>setAccount(a=>({...a,[f.key]:e.target.value}))} />
              </div>
            ))}

            <div className="field-group">
              <label className="field-label">テーマカラー</label>
              <div className="color-row">
                {THEME_COLORS.map(c=>(
                  <div key={c} className={`color-dot${account.themeColor===c?" selected":""}`} style={{background:c}} onClick={()=>setAccount(a=>({...a,themeColor:c}))} />
                ))}
              </div>
            </div>

            {account.followers&&(
              <div className="stage-badge" style={{background:getStage(account.followers).color+"20",color:getStage(account.followers).color,border:`1.5px solid ${getStage(account.followers).color}44`}}>
                {getStage(account.followers).label}（{getStage(account.followers).range}人）
              </div>
            )}

            <div style={{marginTop:20}}>
              <button className="btn-primary" onClick={handleStep1Next} disabled={!account.accountName||!account.accountId}>
                次へ：ジャンル選択 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div className="card">
            <div className="section-title">🌸 ジャンルを選んでください</div>
            <div className="choice-grid">
              {GENRES.map(g=>(
                <div key={g.id} className={`choice-item${account.genre===g.id?" selected":""}`} onClick={()=>setAccount(a=>({...a,genre:g.id}))}>
                  <div className="choice-icon">{g.icon}</div>
                  <div className="choice-label">{g.label}</div>
                </div>
              ))}
            </div>
            <div className="section-title" style={{marginTop:8}}>✨ 投稿テンプレート</div>
            <div className="choice-grid">
              {TEMPLATES.map(t=>(
                <div key={t.id} className={`choice-item${selectedTemplate===t.id?" selected":""}`} onClick={()=>setSelectedTemplate(t.id)}>
                  <div className="choice-icon">{t.icon}</div>
                  <div className="choice-label">{t.label}</div>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={()=>setStep(1)}>← 戻る</button>
              <button className="btn-primary" style={{flex:2}} onClick={()=>{if(account.genre&&selectedTemplate)setStep(3);}} disabled={!account.genre||!selectedTemplate}>
                次へ：内容入力 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3&&(
          <div className="card">
            <div className="field-group">
              <div className="section-title">💬 今日伝えたいこと</div>
              <textarea placeholder={"例：\n新商品の充電器を紹介したい\n価格3,980円、即日発送対応\nバイク・車・除雪機対応"} value={account.todayContent} onChange={e=>setAccount(a=>({...a,todayContent:e.target.value}))} />
            </div>

            {/* 背景画像検索 */}
            <div style={{marginBottom:16,background:"linear-gradient(135deg,#f0fdf8,#f5f0ff)",border:"2px dashed #a8dfd0",borderRadius:16,padding:16}}>
              <div className="section-title">🔍 背景画像を検索して選ぶ（任意）</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input type="text" placeholder="例：motorcycle battery, バイク, カフェ" value={photoKeyword}
                  onChange={e=>setPhotoKeyword(e.target.value)}
                  onKeyDown={async e=>{
                    if(e.key==="Enter"&&photoKeyword.trim()){
                      setPhotoSearching(true);
                      const results=await searchUnsplashPhotos(photoKeyword.trim());
                      setPhotoCandidates(results);
                      setPhotoSearching(false);
                    }
                  }}
                  style={{flex:1,fontSize:13,padding:"8px 12px",border:"2px solid #e8f5f0",borderRadius:10,fontFamily:"Nunito,sans-serif"}}
                />
                <button
                  onClick={async()=>{
                    if(!photoKeyword.trim()) return;
                    setPhotoSearching(true);
                    const results=await searchUnsplashPhotos(photoKeyword.trim());
                    setPhotoCandidates(results);
                    setPhotoSearching(false);
                  }}
                  style={{padding:"8px 16px",background:"linear-gradient(135deg,#3ec9a0,#2d9e7e)",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Nunito,sans-serif",whiteSpace:"nowrap"}}>
                  {photoSearching?"検索中...":"🔍 検索"}
                </button>
              </div>
              {photoCandidates.length>0&&(
                <>
                  <div style={{fontSize:11,color:"#9bbfb2",marginBottom:8,fontWeight:600}}>タップして背景画像を選択（選択した画像が全スライドの背景になります）</div>
                  <div style={{fontSize:11,color:"#9bbfb2",marginBottom:6,fontWeight:600}}>
                    全スライドの背景にする画像を選んでください（複数枚から選択可）
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                    {photoCandidates.map(photo=>(
                      <div key={photo.id} onClick={()=>setSelectedPhoto(selectedPhoto?.id===photo.id?null:photo)}
                        style={{position:"relative",borderRadius:10,overflow:"hidden",cursor:"pointer",
                          border:`3px solid ${selectedPhoto?.id===photo.id?"#3ec9a0":"transparent"}`,
                          boxShadow:selectedPhoto?.id===photo.id?"0 0 0 2px #3ec9a0, 0 4px 12px rgba(62,201,160,0.3)":"0 2px 6px rgba(0,0,0,0.1)",
                          transition:"all 0.2s",transform:selectedPhoto?.id===photo.id?"scale(1.03)":"scale(1)"}}>
                        <img src={photo.thumb} alt="" style={{width:"100%",aspectRatio:"1/1",objectFit:"cover",display:"block"}} />
                        {selectedPhoto?.id===photo.id&&(
                          <div style={{position:"absolute",inset:0,background:"rgba(62,201,160,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:28,height:28,borderRadius:"50%",background:"#3ec9a0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>✓</div>
                          </div>
                        )}
                        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"3px 5px",background:"rgba(0,0,0,0.55)",fontSize:8,color:"rgba(255,255,255,0.85)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>📷 {photo.credit}</div>
                      </div>
                    ))}
                  </div>
                  {selectedPhoto&&(
                    <div style={{marginTop:10,padding:"8px 14px",background:"linear-gradient(135deg,#f0fdf8,#f5f0ff)",borderRadius:10,fontSize:12,color:"#2d9e7e",fontWeight:600,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #a8dfd0"}}>
                      <span>✓ 背景画像を選択中 — 全スライドに反映されます</span>
                      <span style={{cursor:"pointer",color:"#f472b6",fontSize:13}} onClick={()=>setSelectedPhoto(null)}>✕ 解除</span>
                    </div>
                  )}
                </>
              )}
              {photoCandidates.length===0&&!photoSearching&&(
                <div style={{fontSize:11,color:"#9bbfb2"}}>キーワードを入力してEnterまたは検索ボタンで画像を探せます。選ばなくてもAIが自動生成します。</div>
              )}
            </div>

            <div className="upload-area">
              <div className="section-title">🖼️ 画像アップロード（任意・最大10枚）</div>
              <label className="upload-btn-label">
                ＋ 画像を選ぶ
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{const files=Array.from(e.target.files||[]);const newImgs=files.slice(0,10-uploadedImages.length).map(file=>({file,url:URL.createObjectURL(file),placement:"auto" as const}));setUploadedImages(prev=>[...prev,...newImgs].slice(0,10));}} />
              </label>
              <div className="upload-hint">画像を選ばなくてもAIが自動で美しい画像を構成します ✨</div>
              {uploadedImages.length>0&&(
                <div className="upload-grid">
                  {uploadedImages.map((img,i)=>(
                    <div className="upload-card" key={i}>
                      <div className="upload-img-wrap">
                        <img src={img.url} alt="" />
                        <button className="upload-del" onClick={()=>setUploadedImages(prev=>prev.filter((_,j)=>j!==i))}>✕</button>
                      </div>
                      <div className="upload-card-body">
                        <select className="upload-select" value={img.placement} onChange={e=>setUploadedImages(prev=>prev.map((im,j)=>j===i?{...im,placement:e.target.value as "auto"|"specific"|"background"}:im))}>
                          <option value="auto">AIにおまかせ</option>
                          <option value="specific">特定のスライドに</option>
                          <option value="background">全体の背景に</option>
                        </select>
                        {img.placement==="specific"&&(
                          <select className="upload-select" value={img.slideIndex??0} onChange={e=>setUploadedImages(prev=>prev.map((im,j)=>j===i?{...im,slideIndex:parseInt(e.target.value)}:im))}>
                            {Array.from({length:10},(_,k)=><option key={k} value={k}>{k+1}枚目</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error&&<div className="error-box">{error}</div>}
            <div className="btn-row">
              <button className="btn-secondary" onClick={()=>setStep(2)}>← 戻る</button>
              <button className="btn-primary" style={{flex:2}} onClick={generate} disabled={loading}>
                {loading?(
                  <><div style={{width:16,height:16,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>{loadingMsg}</>
                ):"🤖 AIで一括生成する"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step===4&&result&&(
          <div>
            <div className="tab-bar">
              {[["images","🖼️ 画像10枚"],["caption","📝 キャプション"],["hashtags","# ハッシュタグ"]].map(([id,label])=>(
                <div key={id} className={`tab-item${activeTab===id?" active":""}`} onClick={()=>setActiveTab(id)}>{label}</div>
              ))}
            </div>

            {activeTab==="images"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:13,color:"#7bbfaa",fontWeight:600}}>各画像をダウンロードできます ✨</div>
                  <button className="dl-all-btn" onClick={downloadAll}>⬇ 全部保存</button>
                </div>
                <div className="img-grid">
                  {result.slides.map((slide,i)=><ImageCard key={i} slide={slide} brand={brand} themeColor={account.themeColor} accountId={account.accountId} index={i} uploadedImages={uploadedImages} autoImageUrl={result.unsplashUrl} genre={account.genre}/>)}
                </div>
              </div>
            )}
            {activeTab==="caption"&&(
              <div className="result-card">
                <div className="result-head">
                  <div className="result-head-label">📝 キャプション</div>
                  <CopyBtn text={result.caption}/>
                </div>
                <div className="result-body">
                  {result.caption.split("\n").map((line,i)=>(
                    <span key={i} style={{display:"block",color:i===0?account.themeColor:"#2d4a42",fontWeight:i===0?800:400,textAlign:i===0?"center":"left",fontSize:i===0?16:13,marginBottom:i===0?12:0,fontFamily:i===0?"'Klee One', cursive":"'Nunito', sans-serif"}}>{line}</span>
                  ))}
                </div>
              </div>
            )}
            {activeTab==="hashtags"&&(
              <div className="result-card">
                <div className="result-head">
                  <div className="result-head-label"># ハッシュタグ（{result.hashtags.split(" ").filter(Boolean).length}個）</div>
                  <CopyBtn text={result.hashtags}/>
                </div>
                <div className="tag-wrap">
                  {result.hashtags.split(" ").filter(Boolean).map(tag=><span key={tag} className="hash-tag">{tag}</span>)}
                </div>
              </div>
            )}
            <div className="btn-row" style={{marginTop:16}}>
              <button className="btn-secondary" onClick={()=>{setStep(3);setResult(null);setActiveTab("images");}}>← 再生成する</button>
              <button className="btn-secondary" style={{color:"#a78bfa",borderColor:"#e8d5ff"}} onClick={()=>{setStep(1);setResult(null);setSelectedTemplate("");setActiveTab("images");}}>別アカウントで作る</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
