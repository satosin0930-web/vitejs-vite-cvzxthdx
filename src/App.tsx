import { useState, useRef, useEffect } from "react";

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
  { id: "seed", range: "0〜100", label: "種まき期", color: "#888780" },
  { id: "growth", range: "100〜1,000", label: "成長期", color: "#1D9E75" },
  { id: "momentum", range: "1,000〜10,000", label: "加速期", color: "#378ADD" },
  { id: "influence", range: "10,000〜", label: "影響力期", color: "#7F77DD" },
];

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
    if (match && match[1] && match[1] !== "p" && match[1] !== "reel" && match[1] !== "stories") {
      const accountId = match[1];
      const accountName = accountId.replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      return { accountId, accountName };
    }
  } catch {}
  return null;
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 2000); }); }}
      style={{ fontSize: 11, padding: "3px 10px", border: `0.5px solid ${ok ? "#1D9E75" : "#ccc"}`, borderRadius: 6, background: "transparent", color: ok ? "#0F6E56" : "#666", cursor: "pointer" }}>
      {ok ? "✓ コピー済み" : "⎘ コピー"}
    </button>
  );
}

// ── Canvas画像カード ──────────────────────────────────
interface SlideData {
  title: string;
  lines: string[];
  badge?: string;
  badgeColor?: string;
  iscover?: boolean;
}

function ImageCard({ slide, brand, themeColor, accountId, index }: {
  slide: SlideData; brand: string; themeColor: string; accountId: string; index: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 540, H = 675;
    canvas.width = W;
    canvas.height = H;

    // 背景
    ctx.fillStyle = "#0D1117";
    ctx.fillRect(0, 0, W, H);

    // グラデーション装飾
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, themeColor + "22");
    grad.addColorStop(1, "#0D1117");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 上部バー
    ctx.fillStyle = themeColor;
    ctx.fillRect(0, 0, W, 8);

    // ブランド名（中央・テーマカラー）
    ctx.fillStyle = themeColor;
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(brand, W / 2, 50);

    // スライド番号
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${index + 1} / 10`, W - 20, 50);

    if (slide.iscover) {
      // 表紙デザイン
      ctx.fillStyle = "#fff";
      ctx.font = "bold 38px sans-serif";
      ctx.textAlign = "center";
      const titleLines = slide.title.match(/.{1,12}/g) || [slide.title];
      titleLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, 200 + i * 50);
      });
      // 装飾ライン
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 280 + titleLines.length * 50);
      ctx.lineTo(W - 80, 280 + titleLines.length * 50);
      ctx.stroke();
      // サブライン
      slide.lines.forEach((line, i) => {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "18px sans-serif";
        ctx.fillText(line, W / 2, 340 + titleLines.length * 50 + i * 32);
      });
    } else {
      // 通常スライド
      // タイトルボックス
      ctx.fillStyle = themeColor + "33";
      roundRect(ctx, 30, 70, W - 60, 70, 10);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(slide.title, W / 2, 115);

      // コンテンツライン
      slide.lines.forEach((line, i) => {
        const y = 190 + i * 52;
        if (line.startsWith("✅") || line.startsWith("📌") || line.startsWith("💡") || line.startsWith("⭐") || line.startsWith("🔥")) {
          ctx.fillStyle = themeColor + "22";
          roundRect(ctx, 30, y - 26, W - 60, 42, 8);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "bold 17px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(line, 50, y);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.75)";
          ctx.font = "16px sans-serif";
          ctx.textAlign = "left";
          // 長い行は折り返し
          const maxW = W - 100;
          if (ctx.measureText(line).width > maxW) {
            const half = Math.floor(line.length / 2);
            ctx.fillText(line.slice(0, half), 50, y);
            ctx.fillText(line.slice(half), 50, y + 22);
          } else {
            ctx.fillText(line, 50, y);
          }
        }
      });

      // バッジ
      if (slide.badge) {
        ctx.fillStyle = slide.badgeColor || themeColor;
        roundRect(ctx, 30, H - 120, W - 60, 48, 10);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 17px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(slide.badge, W / 2, H - 89);
      }
    }

    // フッター
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`@${accountId}`, W / 2, H - 18);

    // 下部ライン
    ctx.fillStyle = themeColor + "66";
    ctx.fillRect(0, H - 6, W, 6);

  }, [slide, brand, themeColor, accountId, index]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `post_${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 270, borderRadius: 8, border: "0.5px solid #333" }} />
      <button onClick={download} style={{ fontSize: 11, padding: "4px 12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
        ⬇ ダウンロード
      </button>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── メインアプリ ──────────────────────────────────────
interface Account {
  accountName: string; accountId: string; brandName: string; genre: string;
  followers: string; hashtags: string; themeColor: string; postNote: string; todayContent: string;
}

interface GeneratedResult {
  caption: string; hashtags: string; slides: SlideData[];
}

export default function App() {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<Account>({
    accountName: "", accountId: "", brandName: "", genre: "",
    followers: "", hashtags: "", themeColor: "#E63946", postNote: "", todayContent: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("images");

  const stage = getStage(account.followers);
  const inputStyle: React.CSSProperties = { width: "100%", fontSize: 13, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", color: "#111", boxSizing: "border-box" };

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const msgs = ["AIがコンテンツを考えています...", "キャプションを作成中...", "ハッシュタグを最適化中...", "10枚の画像を構成中...", "仕上げています..."];
    let mi = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { if (mi < msgs.length - 1) setLoadingMsg(msgs[++mi]); }, 1200);

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const brand = account.brandName || account.accountName;
    const genre = GENRES.find(g => g.id === account.genre)?.label || "";
    const template = TEMPLATES.find(t => t.id === selectedTemplate)?.label || "";

    const prompt = `あなたはインスタグラムの投稿専門家です。以下の情報を元に投稿コンテンツを作成してください。

【アカウント情報】
- ブランド名：${brand}
- インスタID：@${account.accountId}
- ジャンル：${genre}
- フォロワー数：${account.followers || "不明"}（${stage.label}）
- 固定ハッシュタグ：${account.hashtags || "なし"}
- 毎回の一言：${account.postNote || "なし"}
- 今日伝えたいこと：${account.todayContent || "おまかせ"}
- テンプレート：${template}

以下のJSON形式のみで出力してください（他の文言不要）：
{
  "caption": "キャプション（1行目は「${brand}」のみ、改行含む完全なキャプション、絵文字多用）",
  "hashtags": "ハッシュタグ30個スペース区切り",
  "slides": [
    {"title": "スライドタイトル", "lines": ["行1", "行2", "行3"], "badge": "バッジテキスト（任意）", "iscover": true},
    {"title": "タイトル2", "lines": ["✅ ポイント1", "✅ ポイント2", "✅ ポイント3"], "badge": "アクション文言"},
    ...10枚分
  ]
}

slidesは必ず10個。1枚目はiscover:trueで表紙。2〜8枚目はメインコンテンツ。9枚目はよくある質問。10枚目はCTA。`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      clearInterval(iv);
      setResult({ caption: parsed.caption || "", hashtags: parsed.hashtags || "", slides: parsed.slides || [] });
      setStep(4);
    } catch {
      clearInterval(iv);
      setError("生成に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    const canvases = document.querySelectorAll<HTMLCanvasElement>("canvas");
    canvases.forEach((canvas, i) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.download = `post_${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }, i * 300);
    });
  };

  const brand = account.brandName || account.accountName;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 720, margin: "0 auto", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "0.5px solid #ddd" }}>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>📈 インスタ成長型投稿ジェネレーター</div>
        <div style={{ fontSize: 12, color: "#666" }}>AIがキャプション・ハッシュタグ・画像10枚を一括生成します</div>
      </div>

      {/* ステップバー */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem" }}>
        {["アカウント登録", "ジャンル", "内容入力", "生成結果"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "6px 2px", borderRadius: 6, background: step === i + 1 ? account.themeColor : step > i + 1 ? "#1D9E75" : "#e0e0e0", color: step >= i + 1 ? "#fff" : "#999", fontWeight: step === i + 1 ? 500 : 400 }}>
            {step > i + 1 ? "✓ " : ""}{label}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          {/* URL自動入力 */}
          <div style={{ marginBottom: 16, padding: "12px 14px", background: "#f0f8ff", borderRadius: 10, border: "1px solid #b3d9ff" }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#378ADD", display: "block", marginBottom: 6 }}>
              📱 インスタのURLを貼るだけで自動入力
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ flex: 1, fontSize: 13, padding: "8px 10px", border: "0.5px solid #b3d9ff", borderRadius: 8, background: "#fff", color: "#111" }}
                placeholder="https://www.instagram.com/アカウント名/"
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  const parsed = parseInstagramUrl(pasted);
                  if (parsed) {
                    setAccount(a => ({ ...a, accountId: parsed.accountId, accountName: parsed.accountName }));
                  }
                }}
                onChange={(e) => {
                  const parsed = parseInstagramUrl(e.target.value);
                  if (parsed) {
                    setAccount(a => ({ ...a, accountId: parsed.accountId, accountName: parsed.accountName }));
                  }
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>URLを貼ると下のID・名前が自動で入ります</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {([
              { key: "accountName", label: "アカウント表示名", placeholder: "例：レコルトバッテリー館", req: true },
              { key: "accountId", label: "インスタID（@なし）", placeholder: "例：nextsatosin_battery", req: true },
              { key: "brandName", label: "投稿1行目・画像上部のブランド名", placeholder: "例：Recolte Battery Store" },
              { key: "followers", label: "現在のフォロワー数", placeholder: "例：250" },
              { key: "hashtags", label: "固定ハッシュタグ（スペース区切り）", placeholder: "例：#バッテリー専門店 #レコルトバッテリー館" },
              { key: "postNote", label: "毎回入れる一言（任意）", placeholder: "例：楽天市場にて販売中！" },
            ] as { key: keyof Account; label: string; placeholder: string; req?: boolean }[]).map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 5 }}>
                  {f.label}{f.req && <span style={{ color: "#E63946", marginLeft: 2 }}>*</span>}
                </label>
                <input style={inputStyle} placeholder={f.placeholder} value={account[f.key]} onChange={(e) => setAccount(a => ({ ...a, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 6 }}>テーマカラー</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["#E63946", "#1D9E75", "#378ADD", "#7F77DD", "#D4537E", "#E6A817", "#D85A30", "#0D1117"].map(c => (
                  <div key={c} onClick={() => setAccount(a => ({ ...a, themeColor: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: account.themeColor === c ? "3px solid #111" : "2px solid transparent" }} />
                ))}
              </div>
            </div>
            {account.followers && (
              <div style={{ padding: "8px 14px", background: getStage(account.followers).color + "15", borderRadius: 8, border: `1px solid ${getStage(account.followers).color}44` }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: getStage(account.followers).color }}>
                  現在のステージ：{getStage(account.followers).label}（{getStage(account.followers).range}人）
                </div>
              </div>
            )}
          </div>
          <button onClick={() => { if (account.accountName && account.accountId) setStep(2); }} disabled={!account.accountName || !account.accountId}
            style={{ width: "100%", marginTop: 20, padding: 13, background: account.accountName && account.accountId ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            次へ：ジャンル選択 →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>ジャンルとテンプレートを選んでください</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#444", marginBottom: 8 }}>ジャンル</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginBottom: 16 }}>
            {GENRES.map(g => (
              <div key={g.id} onClick={() => setAccount(a => ({ ...a, genre: g.id }))}
                style={{ padding: "12px 8px", textAlign: "center", border: `${account.genre === g.id ? "2px" : "0.5px"} solid ${account.genre === g.id ? account.themeColor : "#ddd"}`, borderRadius: 10, cursor: "pointer", background: account.genre === g.id ? "#f8f8f8" : "#fff" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{g.icon}</div>
                <div style={{ fontSize: 11, fontWeight: account.genre === g.id ? 500 : 400 }}>{g.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#444", marginBottom: 8 }}>投稿テンプレート</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginBottom: 16 }}>
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                style={{ padding: "12px 8px", textAlign: "center", border: `${selectedTemplate === t.id ? "2px" : "0.5px"} solid ${selectedTemplate === t.id ? account.themeColor : "#ddd"}`, borderRadius: 10, cursor: "pointer", background: selectedTemplate === t.id ? "#f8f8f8" : "#fff" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
                <div style={{ fontSize: 11, fontWeight: selectedTemplate === t.id ? 500 : 400 }}>{t.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 12, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#666" }}>← 戻る</button>
            <button onClick={() => { if (account.genre && selectedTemplate) setStep(3); }} disabled={!account.genre || !selectedTemplate}
              style={{ flex: 2, padding: 12, background: account.genre && selectedTemplate ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              次へ：内容入力 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 6 }}>
              今日伝えたいこと・キーワード（任意・空欄でもOK）
            </label>
            <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" as const, lineHeight: 1.6 }}
              placeholder={`例：\n新商品の充電器を紹介したい\n価格3,980円、即日発送対応\nバイク・車・除雪機対応`}
              value={account.todayContent}
              onChange={e => setAccount(a => ({ ...a, todayContent: e.target.value }))} />
          </div>
          {error && <div style={{ color: "#E63946", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "#fff0f0", borderRadius: 8 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 12, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#666" }}>← 戻る</button>
            <button onClick={generate} disabled={loading}
              style={{ flex: 2, padding: 12, background: !loading ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  {loadingMsg}
                </>
              ) : "🤖 AIで一括生成する"}
            </button>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && result && (
        <div>
          {/* タブ */}
          <div style={{ display: "flex", marginBottom: 16, border: "0.5px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
            {[["images", "🖼️ 画像10枚"], ["caption", "📝 キャプション"], ["hashtags", "# ハッシュタグ"]].map(([id, label], i) => (
              <div key={id} onClick={() => setActiveTab(id)}
                style={{ flex: 1, padding: "10px 4px", textAlign: "center", fontSize: 12, fontWeight: activeTab === id ? 500 : 400, cursor: "pointer", background: activeTab === id ? account.themeColor : "#f8f8f8", color: activeTab === id ? "#fff" : "#666", borderRight: i < 2 ? "0.5px solid #ddd" : "none" }}>
                {label}
              </div>
            ))}
          </div>

          {/* 画像タブ */}
          {activeTab === "images" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#666" }}>画像をタップしてダウンロード</div>
                <button onClick={downloadAll} style={{ fontSize: 12, padding: "6px 14px", background: account.themeColor, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  ⬇ 全部ダウンロード
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {result.slides.map((slide, i) => (
                  <ImageCard key={i} slide={slide} brand={brand} themeColor={account.themeColor} accountId={account.accountId} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* キャプションタブ */}
          {activeTab === "caption" && (
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #eee", background: "#f8f8f8" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}>📝 キャプション</span>
                <CopyBtn text={result.caption} />
              </div>
              <div style={{ padding: 14, fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {result.caption.split("\n").map((line, i) => (
                  <span key={i} style={{ display: "block", color: i === 0 ? account.themeColor : "#111", fontWeight: i === 0 ? 600 : 400, textAlign: i === 0 ? "center" : "left", fontSize: i === 0 ? 16 : 13, marginBottom: i === 0 ? 12 : 0 }}>{line}</span>
                ))}
              </div>
            </div>
          )}

          {/* ハッシュタグタブ */}
          {activeTab === "hashtags" && (
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #eee", background: "#f8f8f8" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}># ハッシュタグ（{result.hashtags.split(" ").filter(Boolean).length}個）</span>
                <CopyBtn text={result.hashtags} />
              </div>
              <div style={{ padding: 14, display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {result.hashtags.split(" ").filter(Boolean).map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: account.themeColor + "18", color: account.themeColor, border: `0.5px solid ${account.themeColor}44` }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => { setStep(3); setResult(null); setActiveTab("images"); }}
              style={{ flex: 1, padding: 11, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 12, cursor: "pointer", color: "#666" }}>
              ← 再生成する
            </button>
            <button onClick={() => { setStep(1); setResult(null); setSelectedTemplate(""); setActiveTab("images"); }}
              style={{ flex: 1, padding: 11, background: account.themeColor, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              別アカウントで作る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
