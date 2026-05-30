import { useState } from "react";

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

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 2000); }); }}
      style={{ fontSize: 11, padding: "3px 10px", border: `0.5px solid ${ok ? "#1D9E75" : "#ccc"}`, borderRadius: 6, background: "transparent", color: ok ? "#0F6E56" : "#666", cursor: "pointer" }}>
      {ok ? "✓ コピー済み" : "⎘ コピー"}
    </button>
  );
}

interface Account {
  accountName: string;
  accountId: string;
  brandName: string;
  genre: string;
  followers: string;
  hashtags: string;
  themeColor: string;
  postNote: string;
  todayContent: string;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<Account>({
    accountName: "", accountId: "", brandName: "", genre: "",
    followers: "", hashtags: "", themeColor: "#E63946", postNote: "", todayContent: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ caption: "", hashtags: "", imageSpec: "" });
  const [error, setError] = useState("");

  const stage = getStage(account.followers);
  const inputStyle: React.CSSProperties = { width: "100%", fontSize: 13, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", color: "#111", boxSizing: "border-box" };

  const generate = async () => {
    setLoading(true);
    setError("");
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const brand = account.brandName || account.accountName;
    const genre = GENRES.find(g => g.id === account.genre)?.label || "";
    const template = TEMPLATES.find(t => t.id === selectedTemplate)?.label || "";

    const prompt = `あなたはインスタグラムの投稿専門家です。以下の情報を元に、フォロワーが増える成長型のインスタ投稿を作成してください。

【アカウント情報】
- ブランド名：${brand}
- インスタID：@${account.accountId}
- ジャンル：${genre}
- フォロワー数：${account.followers || "不明"}（現在のステージ：${stage.label}）
- 固定ハッシュタグ：${account.hashtags || "なし"}
- 毎回の一言：${account.postNote || "なし"}

【今日の投稿内容】
- テンプレート：${template}
- 今日伝えたいこと：${account.todayContent || "おまかせ"}

以下の3つをJSON形式で出力してください。他の文言は一切不要です：
{
  "caption": "投稿キャプション（1行目は必ず「${brand}」を中央配置イメージで、改行を含む完全なキャプション）",
  "hashtags": "ハッシュタグ30個スペース区切り（${stage.label}に最適な構成で）",
  "imageSpec": "画像生成指示（10枚構成の詳細な指示）"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ caption: parsed.caption || "", hashtags: parsed.hashtags || "", imageSpec: parsed.imageSpec || "" });
      setStep(4);
    } catch (e) {
      setError("生成に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 680, margin: "0 auto", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "0.5px solid #ddd" }}>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>📈 インスタ成長型投稿ジェネレーター</div>
        <div style={{ fontSize: 12, color: "#666" }}>AIがフォロワーを増やす投稿を自動生成します</div>
      </div>

      {/* ステップバー */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["アカウント登録", "ジャンル", "テンプレート・内容", "生成結果"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "6px 2px", borderRadius: 6, background: step === i + 1 ? account.themeColor : step > i + 1 ? "#1D9E75" : "#e0e0e0", color: step >= i + 1 ? "#fff" : "#999", fontWeight: step === i + 1 ? 500 : 400 }}>
            {step > i + 1 ? "✓ " : ""}{label}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {([
              { key: "accountName", label: "アカウント表示名", placeholder: "例：レコルトバッテリー館", req: true },
              { key: "accountId", label: "インスタID（@なし）", placeholder: "例：nextsatosin_battery", req: true },
              { key: "brandName", label: "投稿1行目のブランド名", placeholder: "例：Recolte Battery Store" },
              { key: "followers", label: "現在のフォロワー数", placeholder: "例：250" },
              { key: "hashtags", label: "固定ハッシュタグ（スペース区切り）", placeholder: "例：#バッテリー専門店 #スーパーナット" },
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
              <div style={{ padding: "10px 14px", background: getStage(account.followers).color + "15", borderRadius: 8, border: `1px solid ${getStage(account.followers).color}44` }}>
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
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>ジャンルを選んでください</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8, marginBottom: 16 }}>
            {GENRES.map(g => (
              <div key={g.id} onClick={() => setAccount(a => ({ ...a, genre: g.id }))}
                style={{ padding: "14px 10px", textAlign: "center", border: `${account.genre === g.id ? "2px" : "0.5px"} solid ${account.genre === g.id ? account.themeColor : "#ddd"}`, borderRadius: 10, cursor: "pointer", background: account.genre === g.id ? "#f8f8f8" : "#fff" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{g.icon}</div>
                <div style={{ fontSize: 12, fontWeight: account.genre === g.id ? 500 : 400 }}>{g.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 12, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#666" }}>← 戻る</button>
            <button onClick={() => { if (account.genre) setStep(3); }} disabled={!account.genre}
              style={{ flex: 2, padding: 12, background: account.genre ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              次へ：テンプレート選択 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>今日の投稿テンプレートを選んでください</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8, marginBottom: 16 }}>
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                style={{ padding: "14px 10px", textAlign: "center", border: `${selectedTemplate === t.id ? "2px" : "0.5px"} solid ${selectedTemplate === t.id ? account.themeColor : "#ddd"}`, borderRadius: 10, cursor: "pointer", background: selectedTemplate === t.id ? "#f8f8f8" : "#fff" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 12, fontWeight: selectedTemplate === t.id ? 500 : 400 }}>{t.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 6 }}>
              今日伝えたいこと・キーワード（任意）
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const, lineHeight: 1.6 }}
              placeholder="例：新商品のバッテリー充電器を紹介したい。価格は3,980円で即日発送対応。"
              value={account.todayContent}
              onChange={e => setAccount(a => ({ ...a, todayContent: e.target.value }))}
            />
          </div>

          {error && <div style={{ color: "#E63946", fontSize: 12, marginBottom: 12 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 12, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#666" }}>← 戻る</button>
            <button onClick={generate} disabled={!selectedTemplate || loading}
              style={{ flex: 2, padding: 12, background: selectedTemplate && !loading ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  AIが生成中...
                </>
              ) : "🤖 AIで投稿を生成する"}
            </button>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #eee", background: "#f8f8f8" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}>📝 キャプション</span>
              <CopyBtn text={result.caption} />
            </div>
            <div style={{ padding: 14, fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {result.caption.split("\n").map((line, i) => (
                <span key={i} style={{ display: "block", color: i === 0 ? account.themeColor : "#111", fontWeight: i === 0 ? 600 : 400, textAlign: i === 0 ? "center" : "left", fontSize: i === 0 ? 15 : 13, marginBottom: i === 0 ? 10 : 0 }}>{line}</span>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #eee", background: "#f8f8f8" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}># ハッシュタグ</span>
              <CopyBtn text={result.hashtags} />
            </div>
            <div style={{ padding: 14, display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
              {result.hashtags.split(" ").filter(Boolean).map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: account.themeColor + "18", color: account.themeColor, border: `0.5px solid ${account.themeColor}44` }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #eee", background: "#f8f8f8" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}>🖼️ 画像生成指示</span>
              <CopyBtn text={result.imageSpec} />
            </div>
            <div style={{ padding: 14, fontSize: 12, lineHeight: 1.7, color: "#666", background: "#fafafa", whiteSpace: "pre-wrap" }}>{result.imageSpec}</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStep(3); setResult({ caption: "", hashtags: "", imageSpec: "" }); }}
              style={{ flex: 1, padding: 11, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 12, cursor: "pointer", color: "#666" }}>
              ← 再生成する
            </button>
            <button onClick={() => { setStep(1); setResult({ caption: "", hashtags: "", imageSpec: "" }); setSelectedTemplate(""); }}
              style={{ flex: 1, padding: 11, background: account.themeColor, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              別アカウントで作る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
