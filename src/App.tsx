import { useState } from "react";

// ─── 型定義 ───────────────────────────────────────────
interface Genre { id: string; label: string; icon: string; }
interface FollowerStage { id: string; range: string; label: string; color: string; strategy: string; post_freq: string; focus: string[]; cta_style: string; }
interface ScheduleItem { dow: number; theme: string; type: string; icon: string; }
interface Account { accountName: string; accountId: string; brandName: string; genre: string; followers: string; hashtags: string; themeColor: string; postNote: string; }

// ─── データ定義 ───────────────────────────────────────
const GENRES: Genre[] = [
  { id: "shop", label: "物販・ショップ", icon: "🛍️" },
  { id: "food", label: "飲食・カフェ", icon: "☕" },
  { id: "beauty", label: "美容・サロン", icon: "💄" },
  { id: "craft", label: "ハンドメイド・工芸", icon: "🎨" },
  { id: "health", label: "健康・フィットネス", icon: "💪" },
  { id: "travel", label: "旅行・観光", icon: "✈️" },
  { id: "education", label: "教育・情報発信", icon: "📚" },
  { id: "other", label: "その他", icon: "✨" },
];

const FOLLOWER_STAGES: FollowerStage[] = [
  { id: "seed", range: "0〜100", label: "種まき期", color: "#888780", strategy: "まずは「どんなアカウントか」を明確に。自己紹介・プロフィール整備・ジャンルの一貫性が最優先。", post_freq: "週3〜4回", focus: ["自己紹介投稿を固定", "ジャンルを1つに絞る", "同ジャンルアカウントをフォロー＆コメント", "ストーリーズを毎日更新"], cta_style: "discovery" },
  { id: "growth", range: "100〜1,000", label: "成長期", color: "#1D9E75", strategy: "保存・シェアされる「価値ある情報」が鍵。教育系・豆知識・比較などがフォロワー獲得に効きやすい段階。", post_freq: "週4〜5回", focus: ["保存されるコンテンツを意識", "ハッシュタグを毎回30個使用", "リールを週1以上投稿", "DMでフォロワーと積極交流"], cta_style: "save" },
  { id: "momentum", range: "1,000〜10,000", label: "加速期", color: "#378ADD", strategy: "コメント・シェアが増えるとリーチが爆発的に伸びる。コミュニティ感とストーリー性を強化する段階。", post_freq: "週5〜6回", focus: ["質問・投票でコメントを促す", "コラボ・引用リポストを活用", "リールとフィードのバランスを意識", "インサイト分析を週1で確認"], cta_style: "comment" },
  { id: "influence", range: "10,000〜", label: "影響力期", color: "#7F77DD", strategy: "ブランドとしての信頼が武器。定期的な新情報・独自視点・限定コンテンツでロイヤルフォロワーを育てる。", post_freq: "毎日投稿", focus: ["限定情報・先行告知を活用", "ライブ配信でリアルタイム交流", "スポンサー・コラボ企業との連携", "メルマガ・LINEへの誘導も検討"], cta_style: "share" },
];

const WEEKLY_SCHEDULE: Record<string, ScheduleItem[]> = {
  shop: [
    { dow: 0, theme: "ブランドストーリー", type: "engagement", icon: "📖" },
    { dow: 1, theme: "豆知識・tips", type: "reach", icon: "💡" },
    { dow: 2, theme: "商品紹介", type: "conversion", icon: "📦" },
    { dow: 3, theme: "メンテナンス・使い方", type: "save", icon: "🔧" },
    { dow: 4, theme: "あるある・共感", type: "engagement", icon: "😂" },
    { dow: 5, theme: "季節・トレンド", type: "reach", icon: "🌟" },
    { dow: 6, theme: "お客様の声", type: "trust", icon: "⭐" },
  ],
  food: [
    { dow: 0, theme: "今週のおすすめ", type: "reach", icon: "🍽️" },
    { dow: 1, theme: "こだわり・想い", type: "engagement", icon: "❤️" },
    { dow: 2, theme: "メニュー詳細紹介", type: "conversion", icon: "📋" },
    { dow: 3, theme: "レシピ・豆知識", type: "save", icon: "👨‍🍳" },
    { dow: 4, theme: "お客様の声", type: "trust", icon: "⭐" },
    { dow: 5, theme: "週末限定・特別メニュー", type: "conversion", icon: "🎁" },
    { dow: 6, theme: "舞台裏・スタッフ", type: "engagement", icon: "🎬" },
  ],
  beauty: [
    { dow: 0, theme: "今週のキャンペーン", type: "conversion", icon: "🎁" },
    { dow: 1, theme: "美容tips", type: "save", icon: "💡" },
    { dow: 2, theme: "施術紹介", type: "reach", icon: "💅" },
    { dow: 3, theme: "ビフォーアフター", type: "trust", icon: "✨" },
    { dow: 4, theme: "スタッフ紹介", type: "engagement", icon: "👩" },
    { dow: 5, theme: "お客様の声", type: "trust", icon: "⭐" },
    { dow: 6, theme: "週末限定メニュー", type: "conversion", icon: "🌸" },
  ],
  craft: [
    { dow: 0, theme: "作品紹介", type: "reach", icon: "🖼️" },
    { dow: 1, theme: "制作への想い", type: "engagement", icon: "💭" },
    { dow: 2, theme: "制作過程", type: "save", icon: "🔨" },
    { dow: 3, theme: "素材・こだわり", type: "trust", icon: "🌿" },
    { dow: 4, theme: "販売・出品告知", type: "conversion", icon: "🛒" },
    { dow: 5, theme: "ギフト提案", type: "reach", icon: "🎁" },
    { dow: 6, theme: "お客様の声・感想", type: "trust", icon: "⭐" },
  ],
  health: [
    { dow: 0, theme: "今週のモチベーション", type: "engagement", icon: "🔥" },
    { dow: 1, theme: "健康tips", type: "save", icon: "💡" },
    { dow: 2, theme: "トレーニング紹介", type: "reach", icon: "🏋️" },
    { dow: 3, theme: "食事・栄養", type: "save", icon: "🥗" },
    { dow: 4, theme: "お客様の変化", type: "trust", icon: "⭐" },
    { dow: 5, theme: "体験・キャンペーン", type: "conversion", icon: "🎁" },
    { dow: 6, theme: "週末チャレンジ", type: "engagement", icon: "💪" },
  ],
  travel: [
    { dow: 0, theme: "今週のおすすめスポット", type: "reach", icon: "📍" },
    { dow: 1, theme: "旅のtips", type: "save", icon: "💡" },
    { dow: 2, theme: "グルメ情報", type: "reach", icon: "🍜" },
    { dow: 3, theme: "絶景・フォトスポット", type: "engagement", icon: "📸" },
    { dow: 4, theme: "モデルコース", type: "save", icon: "🗺️" },
    { dow: 5, theme: "季節のおすすめ", type: "conversion", icon: "🌸" },
    { dow: 6, theme: "旅の思い出・体験談", type: "engagement", icon: "❤️" },
  ],
  education: [
    { dow: 0, theme: "今週の学び予告", type: "engagement", icon: "📣" },
    { dow: 1, theme: "豆知識・解説", type: "save", icon: "💡" },
    { dow: 2, theme: "ハウツー・具体策", type: "reach", icon: "📋" },
    { dow: 3, theme: "よくある質問", type: "save", icon: "❓" },
    { dow: 4, theme: "成果・実績紹介", type: "trust", icon: "⭐" },
    { dow: 5, theme: "講座・セミナー告知", type: "conversion", icon: "📣" },
    { dow: 6, theme: "想い・ストーリー", type: "engagement", icon: "📖" },
  ],
  other: [
    { dow: 0, theme: "今週の予告", type: "engagement", icon: "📣" },
    { dow: 1, theme: "tips・情報", type: "save", icon: "💡" },
    { dow: 2, theme: "メイン紹介", type: "reach", icon: "✨" },
    { dow: 3, theme: "こだわり・想い", type: "engagement", icon: "💭" },
    { dow: 4, theme: "お客様の声", type: "trust", icon: "⭐" },
    { dow: 5, theme: "告知・キャンペーン", type: "conversion", icon: "🎁" },
    { dow: 6, theme: "日常・ひとこと", type: "engagement", icon: "☀️" },
  ],
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  reach: { label: "リーチ拡大", color: "#E63946" },
  engagement: { label: "エンゲージ", color: "#7F77DD" },
  save: { label: "保存狙い", color: "#1D9E75" },
  trust: { label: "信頼構築", color: "#E6A817" },
  conversion: { label: "購買促進", color: "#378ADD" },
};

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const CTA_TEMPLATES: Record<string, string[]> = {
  discovery: ["このアカウントをフォローして最新情報をチェック👆", "プロフィールから他の投稿もぜひご覧ください", "気になった方はコメントで教えてください💬"],
  save: ["後で見返せるように保存しておいてください🔖", "役に立ったと思ったら保存＆シェアをお願いします！", "あとで使える情報なので保存がおすすめです📌"],
  comment: ["あなたはどう思いますか？コメントで教えてください👇", "同じ経験ある方は「あるある」とコメントしてください😊", "質問があればコメントへ！全部お答えします💬"],
  share: ["友達にもシェアしてもらえると嬉しいです🙌", "このアカウントをフォローしている方に紹介してください", "役に立ったらストーリーズでシェアしてください✨"],
};

const HASHTAG_STRATEGY: Record<string, { label: string; desc: string; mix: string }> = {
  reach: { label: "リーチ拡大型", desc: "検索で発見されやすい大中規模タグを中心に", mix: "大(10万+)×5、中(1〜10万)×15、小(1万未満)×10" },
  engagement: { label: "エンゲージ重視型", desc: "コミュニティタグ・ニッチタグで濃いフォロワーを獲得", mix: "大×3、中×10、小×17（ニッチ重視）" },
  save: { label: "保存促進型", desc: "「保存したい」情報ジャンルのタグを優先", mix: "ハウツー系・まとめ系タグを中心に中小タグ×30" },
  trust: { label: "信頼構築型", desc: "専門性を示すタグで権威性を高める", mix: "専門ジャンル×10、地域×5、ブランド×5、汎用×10" },
  conversion: { label: "購買促進型", desc: "購買意欲の高いユーザーに届くタグを選定", mix: "購買系・レビュー系タグを前半に配置" },
};

const BEST_TIME: Record<string, string> = {
  reach: "19:00〜21:00（アクティブユーザーが最多）",
  engagement: "12:00〜13:00 または 21:00〜22:00",
  save: "20:00〜22:00（じっくり読む時間帯）",
  trust: "7:00〜9:00（朝の情報収集タイム）",
  conversion: "20:00〜22:00（購買意欲が高まる時間帯）",
};

function getStage(followers: string): FollowerStage {
  const n = parseInt(followers) || 0;
  if (n < 100) return FOLLOWER_STAGES[0];
  if (n < 1000) return FOLLOWER_STAGES[1];
  if (n < 10000) return FOLLOWER_STAGES[2];
  return FOLLOWER_STAGES[3];
}

function getTodaySchedule(genre: string): ScheduleItem {
  const dow = new Date().getDay();
  const schedule = WEEKLY_SCHEDULE[genre] || WEEKLY_SCHEDULE.other;
  return schedule.find((s) => s.dow === dow) || schedule[0];
}

function buildCaption(account: Account, todayItem: ScheduleItem, stage: FollowerStage): string {
  const brand = account.brandName || account.accountName;
  const ctas = CTA_TEMPLATES[stage.cta_style] || CTA_TEMPLATES.discovery;
  const cta = ctas[0];
  const note = account.postNote ? `\n${account.postNote}\n` : "";
  return `${brand}\n${todayItem.icon} ${todayItem.theme}\n\n（ここに今日のメインコンテンツを書いてください）\n${note}\n━━━━━━━━━━\n${cta}\n━━━━━━━━━━`;
}

function buildHashtags(account: Account, todayItem: ScheduleItem): string {
  const base = account.hashtags ? account.hashtags.split(/[,\s　]+/).filter(Boolean).map((h) => (h.startsWith("#") ? h : "#" + h)) : [];
  const typeExtra: Record<string, string[]> = {
    reach: ["#インスタグラム", "#フォローミー", "#おすすめ"],
    engagement: ["#共感", "#あるある", "#コメントください"],
    save: ["#保存推奨", "#まとめ", "#豆知識"],
    trust: ["#専門家", "#プロ", "#実績"],
    conversion: ["#購入", "#販売中", "#通販"],
  };
  const extra = typeExtra[todayItem.type] || [];
  return [...base, ...extra].slice(0, 30).join(" ");
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 2000); }); };
  return (
    <button onClick={copy} style={{ fontSize: 11, padding: "3px 10px", border: `0.5px solid ${ok ? "#1D9E75" : "#ccc"}`, borderRadius: 6, background: "transparent", color: ok ? "#0F6E56" : "#666", cursor: "pointer" }}>
      {ok ? "✓ コピー済み" : "⎘ コピー"}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>{children}</div>;
}

function CardHead({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid #e0e0e0", background: "#f8f8f8" }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}>{label}</span>
      {action}
    </div>
  );
}

function StepDot({ n, label, active, done, color }: { n: number; label: string; active: boolean; done: boolean; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: done ? "#1D9E75" : active ? color : "#f0f0f0", border: `1.5px solid ${done ? "#1D9E75" : active ? color : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: done || active ? "#fff" : "#aaa" }}>
        {done ? "✓" : n}
      </div>
      <span style={{ fontSize: 11, color: active ? "#111" : "#999", fontWeight: active ? 500 : 400 }}>{label}</span>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<Account>({ accountName: "", accountId: "", brandName: "", genre: "", followers: "", hashtags: "", themeColor: "#E63946", postNote: "" });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const stage = getStage(account.followers);
  const todayItem = getTodaySchedule(account.genre);
  const caption = generated ? buildCaption(account, todayItem, stage) : "";
  const hashtags = generated ? buildHashtags(account, todayItem) : "";
  const hashStrategy = HASHTAG_STRATEGY[todayItem?.type] || HASHTAG_STRATEGY.reach;
  const bestTime = BEST_TIME[todayItem?.type] || BEST_TIME.reach;

  const inputStyle: React.CSSProperties = { width: "100%", fontSize: 13, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", color: "#111", boxSizing: "border-box" };

  const generate = () => { setLoading(true); setTimeout(() => { setLoading(false); setGenerated(true); }, 1600); };

  const today = new Date();
  const todayLabel = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")} (${DAYS[today.getDay()]})`;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 680, margin: "0 auto", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "0.5px solid #ddd" }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#111", marginBottom: 4 }}>📈 インスタ成長型投稿ジェネレーター</div>
        <div style={{ fontSize: 12, color: "#666" }}>フォロワーを増やす戦略つきで投稿を自動生成します</div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
        {(["アカウント登録", "ジャンル選択", "生成・戦略確認"] as string[]).map((label, i) => (
          <StepDot key={i} n={i + 1} label={label} active={step === i + 1} done={step > i + 1} color={account.themeColor} />
        ))}
      </div>

      {step === 1 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {([
              { key: "accountName", label: "アカウント表示名", placeholder: "例：レコルトバッテリー館", req: true },
              { key: "accountId", label: "インスタID（@なし）", placeholder: "例：nextsatosin_battery", req: true },
              { key: "brandName", label: "投稿1行目のブランド名", placeholder: "例：Recolte Battery Store" },
              { key: "followers", label: "現在のフォロワー数", placeholder: "例：250" },
              { key: "hashtags", label: "固定ハッシュタグ（スペース区切り）", placeholder: "例：#バッテリー専門店" },
              { key: "postNote", label: "毎回入れる一言（任意）", placeholder: "例：楽天市場にて販売中！" },
            ] as { key: keyof Account; label: string; placeholder: string; req?: boolean }[]).map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 5 }}>
                  {f.label}{f.req && <span style={{ color: "#E63946", marginLeft: 2 }}>*</span>}
                </label>
                <input style={inputStyle} placeholder={f.placeholder} value={account[f.key]} onChange={(e) => setAccount((a) => ({ ...a, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 6 }}>テーマカラー</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["#E63946", "#1D9E75", "#378ADD", "#7F77DD", "#D4537E", "#E6A817", "#D85A30", "#0D1117"].map((c) => (
                  <div key={c} onClick={() => setAccount((a) => ({ ...a, themeColor: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: account.themeColor === c ? "3px solid #111" : "2px solid transparent" }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => { if (account.accountName && account.accountId) setStep(2); }} disabled={!account.accountName || !account.accountId}
            style={{ width: "100%", marginTop: 20, padding: 13, background: account.accountName && account.accountId ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            次へ：ジャンル選択 →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>@{account.accountId} のジャンルを選んでください</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8, marginBottom: 16 }}>
            {GENRES.map((g) => (
              <div key={g.id} onClick={() => setAccount((a) => ({ ...a, genre: g.id }))}
                style={{ padding: "14px 10px", textAlign: "center", border: `${account.genre === g.id ? "2px" : "0.5px"} solid ${account.genre === g.id ? account.themeColor : "#ddd"}`, borderRadius: 10, cursor: "pointer", background: account.genre === g.id ? "#f8f8f8" : "#fff" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{g.icon}</div>
                <div style={{ fontSize: 12, fontWeight: account.genre === g.id ? 500 : 400 }}>{g.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 12, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#666" }}>← 戻る</button>
            <button onClick={() => { if (account.genre) { setStep(3); generate(); } }} disabled={!account.genre}
              style={{ flex: 2, padding: 12, background: account.genre ? account.themeColor : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              🚀 投稿＋戦略を生成する
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          {loading && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{ width: 36, height: 36, margin: "0 auto 16px", border: "3px solid #eee", borderTopColor: account.themeColor, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontSize: 14, color: "#666" }}>戦略と投稿コンテンツを生成中...</div>
            </div>
          )}

          {generated && !loading && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0", marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: account.themeColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {(account.brandName || account.accountName).charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{account.brandName || account.accountName}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>@{account.accountId}　·　フォロワー {account.followers || "未設定"}</div>
                </div>
                <div style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: stage.color + "22", color: stage.color }}>{stage.label}</div>
              </div>

              <div style={{ display: "flex", marginBottom: 16, border: "0.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
                {(["today", "strategy", "schedule"] as string[]).map((id, i) => (
                  <div key={id} onClick={() => setActiveTab(id)}
                    style={{ flex: 1, padding: "9px 4px", textAlign: "center", fontSize: 11, fontWeight: activeTab === id ? 500 : 400, cursor: "pointer", background: activeTab === id ? account.themeColor : "#f8f8f8", color: activeTab === id ? "#fff" : "#666", borderRight: i < 2 ? "0.5px solid #e0e0e0" : "none" }}>
                    {["📅 今日の投稿", "📈 成長戦略", "📆 週間スケジュール"][i]}
                  </div>
                ))}
              </div>

              {activeTab === "today" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", marginBottom: 12, background: "#fff", borderRadius: 8, border: "0.5px solid #e0e0e0" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>{todayLabel}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{todayItem.icon} 今日のテーマ：{todayItem.theme}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: TYPE_LABELS[todayItem.type].color + "22", color: TYPE_LABELS[todayItem.type].color }}>{TYPE_LABELS[todayItem.type].label}</span>
                      <span style={{ fontSize: 10, color: "#666" }}>最適時間：{bestTime}</span>
                    </div>
                  </div>

                  <Card>
                    <CardHead label="📝 キャプション" action={<CopyBtn text={caption} />} />
                    <div style={{ padding: 14, fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {caption.split("\n").map((line, i) => (
                        <span key={i} style={{ display: "block", color: i === 0 ? account.themeColor : "#111", fontWeight: i === 0 ? 500 : 400, textAlign: i === 0 ? "center" : "left", fontSize: i === 0 ? 14 : 13, marginBottom: i === 0 ? 8 : 0 }}>{line}</span>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <CardHead label="# ハッシュタグ" action={<CopyBtn text={hashtags} />} />
                    <div style={{ padding: "8px 14px 14px" }}>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{hashStrategy.label}（{hashStrategy.desc}）</div>
                      <div style={{ fontSize: 11, padding: "4px 10px", background: "#f8f8f8", borderRadius: 6, color: "#666", marginBottom: 10 }}>{hashStrategy.mix}</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                        {hashtags.split(" ").filter(Boolean).map((tag) => (
                          <span key={tag} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: account.themeColor + "18", color: account.themeColor, border: `0.5px solid ${account.themeColor}44` }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "strategy" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginBottom: 16 }}>
                    {FOLLOWER_STAGES.map((s) => (
                      <div key={s.id} style={{ padding: 12, borderRadius: 10, border: `${s.id === stage.id ? "2px" : "0.5px"} solid ${s.id === stage.id ? s.color : "#e0e0e0"}`, background: s.id === stage.id ? s.color + "12" : "#fff" }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: s.color, marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: "#666" }}>{s.range}人</div>
                        {s.id === stage.id && <div style={{ fontSize: 9, color: s.color, marginTop: 4, fontWeight: 500 }}>← 現在</div>}
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHead label={`📊 現在の戦略：${stage.label}（${stage.range}人）`} />
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{stage.strategy}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#666", marginBottom: 8 }}>投稿頻度：{stage.post_freq}</div>
                      {stage.focus.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", background: "#f8f8f8", borderRadius: 8, marginBottom: 6 }}>
                          <span style={{ color: stage.color, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 12, lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "schedule" && (
                <>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>{GENRES.find((g) => g.id === account.genre)?.label} の推奨週間スケジュール</div>
                  {(WEEKLY_SCHEDULE[account.genre] || WEEKLY_SCHEDULE.other).map((s) => {
                    const isToday = s.dow === new Date().getDay();
                    return (
                      <div key={s.dow} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 6, borderRadius: 8, border: `${isToday ? "2px" : "0.5px"} solid ${isToday ? account.themeColor : "#e0e0e0"}`, background: isToday ? account.themeColor + "10" : "#fff" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: isToday ? account.themeColor : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: isToday ? "#fff" : "#666" }}>{DAYS[s.dow]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: isToday ? 500 : 400 }}>{s.icon} {s.theme}{isToday && <span style={{ marginLeft: 8, fontSize: 10, color: account.themeColor, fontWeight: 500 }}>← 今日</span>}</div>
                          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>最適時間：{BEST_TIME[s.type]}</div>
                        </div>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: TYPE_LABELS[s.type].color + "20", color: TYPE_LABELS[s.type].color, fontWeight: 500 }}>{TYPE_LABELS[s.type].label}</span>
                      </div>
                    );
                  })}
                </>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 11, background: "transparent", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 12, cursor: "pointer", color: "#666" }}>← ジャンルを変える</button>
                <button onClick={() => { setStep(1); setGenerated(false); setActiveTab("today"); }} style={{ flex: 1, padding: 11, background: account.themeColor, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>別アカウントで作る</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
