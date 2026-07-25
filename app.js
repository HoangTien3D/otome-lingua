/**
 * Otome Lingua - App Logic Engine
 * Duolingo competitor disguised as Mystic Messenger Otome Sim
 * Features 10-Tier progression, Gemma 4 OpenRouter LLM, Convex Sync & Secret Telemetry Dashboard
 */

// Global Configuration
const CONVEX_HTTP_SITE = "https://wary-reindeer-174.convex.site";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

// Character Definitions (Pure Target Language Greetings)
const CHARACTERS = {
  ren: {
    id: "ren",
    name: "Ren Takahashi",
    language: "Japanese",
    flag: "🇯🇵",
    avatar: "/src/assets/images/ren_avatar_1784989852267.jpg",
    role: "Upperclassman & Musician",
    personality: "Gentle, cultured, and soft-spoken musician who guides you through Japanese.",
    greeting: "こんにちは！今日は一緒に日本語と音楽の勉強をしましょう。❤️",
    greetingTranslation: "Hello! Shall we study Japanese and music together today?",
    greetingTip: "'Konnichiwa' (こんにちは) is the standard polite daytime greeting in Japanese.",
    sampleVoice: "Gentle Japanese tenor",
  },
  bao: {
    id: "bao",
    name: "Bao Nguyen",
    language: "Vietnamese",
    flag: "🇻🇳",
    avatar: "/src/assets/images/bao_avatar_1784989868706.jpg",
    role: "Artisan Chef & Barista",
    personality: "Charming, energetic coffee artisan who teaches you delicious Vietnamese phrases.",
    greeting: "Xin chào em! Anh vừa pha một ly cà phê sữa đá rất ngon. Em muốn học tiếng Việt cùng anh không? ☕",
    greetingTranslation: "Hello! I just brewed a delicious iced milk coffee. Want to learn Vietnamese with me?",
    greetingTip: "'Xin chào' means hello, and 'cà phê sữa đá' is traditional Vietnamese iced coffee.",
    sampleVoice: "Warm energetic baritone",
  },
  julian: {
    id: "julian",
    name: "Julian Vance",
    language: "English",
    flag: "🇬🇧",
    avatar: "/src/assets/images/julian_avatar_1784989883570.jpg",
    role: "Literature Scholar & Architect",
    personality: "Witty, romantic scholar who guides you through poetic English idioms and prose.",
    greeting: "Good day, my darling. Shall we indulge in the subtleties of English prose and poetry today? 📖",
    greetingTranslation: "Good day, my darling. Shall we indulge in the subtleties of English prose and poetry today?",
    greetingTip: "'Indulge' means to allow oneself to enjoy the pleasure of something sweet.",
    sampleVoice: "Refined British scholar",
  }
};

// Progressive Story Trees for Dynamic Story Evolution
const STORY_TREES = {
  ren: {
    mcStages: [
      {
        greeting: "こんにちは！今日は一緒に日本語の勉強をしましょう。❤️",
        greetingTranslation: "Hello! Shall we study Japanese together today?",
        greetingTip: "'Konnichiwa' (こんにちは) is the standard polite daytime greeting in Japanese.",
        options: [
          { text: "Konnichiwa, Ren-san! Yoroshiku onegaishimasu.", hint: "Hello Ren! Pleased to practice with you!" },
          { text: "O-genki desu ka? Kyou wa piano no renshuu desu ka?", hint: "How are you? Are we practicing piano today?" },
          { text: "Ren-san to hanashitakatta desu! Kyou mo kirei desu ne.", hint: "I wanted to talk with you! You look handsome today too." }
        ]
      },
      {
        greeting: "お元気そうで良かったです！私は今、ピアノで新しい曲を作っていました。聞いてくれますか？",
        greetingTranslation: "I'm so glad you're well! I was just composing a new song on the piano. Will you listen?",
        greetingTip: "'Kiite kuremasu ka' (聞いてくれますか) means 'Will you listen for me?' - a gentle request.",
        options: [
          { text: "Hai, Ren-san no piano ga daisuki desu! Kikitai desu.", hint: "Yes, I love your piano playing! I want to listen." },
          { text: "Subarashii desu ne! Nan no kyoku desu ka?", hint: "Wonderful! What kind of song is it?" },
          { text: "Anata no tsukuru melody wa ittsumo kirei desu.", hint: "The melodies you compose are always beautiful." }
        ]
      },
      {
        greeting: "ありがとうございます。あなたを想って作った曲なんです... 一緒に温かい緑茶でも飲みませんか？",
        greetingTranslation: "Thank you. It's a song I composed thinking of you... Shall we drink warm green tea together?",
        greetingTip: "'O-cha' (お茶) is tea, and 'nomimashou' (飲みましょう) means 'let's drink'.",
        options: [
          { text: "Hai! Ren-san no tateru o-cha wo nomitai desu.", hint: "Yes! I want to drink the tea you brew." },
          { text: "O-cha wo nominagara, motto hanashimashou!", hint: "Let's talk more while enjoying tea!" },
          { text: "Anata to sugosu jikan wa totemo shiawase desu.", hint: "Time spent with you makes me so happy." }
        ]
      },
      {
        greeting: "私もあなたといると、心がとても温かくなります。明日もこうしてお話しできますか？",
        greetingTranslation: "When I'm with you, my heart feels so warm too. Can we talk like this again tomorrow?",
        greetingTip: "'Kokoro' (心) means heart/soul, and 'atatakaku' (温かく) means warm.",
        options: [
          { text: "Mochiron desu! Ashita mo kanarazu aimashou.", hint: "Of course! Let's definitely meet tomorrow." },
          { text: "Ren-san no soba ni ittsumo itai desu.", hint: "I always want to be by your side, Ren." },
          { text: "Ashita wa piano wo issho ni hikimashou ne.", hint: "Tomorrow let's play the piano together, okay?" }
        ]
      },
      {
        greeting: "約束ですね。あなたの言葉が、何よりの旋律のように胸に響きます。",
        greetingTranslation: "It's a promise then. Your words resonate in my heart like the sweetest melody.",
        greetingTip: "'Yakusoku' (約束) means promise, and 'senritsu' (旋律) means melody.",
        options: [
          { text: "Anata no smile ga watashi no treasure desu.", hint: "Your smile is my treasure." },
          { text: "Komban mo anata no yume wo mimasu.", hint: "I will dream of you tonight as well." },
          { text: "Issho ni itadaki, wirklich arigatou gozaimasu.", hint: "Thank you so much for being with me." }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "Let\'s drink hot tea together today."',
        translation: "Kyou issho ni atsui o-cha wo nomimashou.",
        chips: ["Kyou", "issho ni", "atsui", "o-cha wo", "nomimashou", "suki", "oishii"]
      },
      {
        prompt: 'Translate: "I love listening to your piano song."',
        translation: "Anata no piano no kyoku wo kiku no ga daisuki desu.",
        chips: ["Anata no", "piano no", "kyoku wo", "kiku no ga", "daisuki desu", "kirei", "arigatou"]
      },
      {
        prompt: 'Translate: "Your smile always makes me happy."',
        translation: "Anata no egao wa itsumo watashi wo shiawase ni shimasu.",
        chips: ["Anata no", "egao wa", "itsumo", "watashi wo", "shiawase ni", "shimasu", "subarashii"]
      },
      {
        prompt: 'Translate: "I want to stay by your side forever."',
        translation: "Zutto anata no soba ni itai desu.",
        chips: ["Zutto", "anata no", "soba ni", "itai desu", "kokoro", "aisuru"]
      }
    ]
  },
  bao: {
    mcStages: [
      {
        greeting: "Xin chào em! Anh vừa pha một ly cà phê sữa đá rất ngon. Em muốn học tiếng Việt cùng anh không? ☕",
        greetingTranslation: "Hello! I just brewed a delicious iced milk coffee. Want to learn Vietnamese with me?",
        greetingTip: "'Xin chào' is hello, and 'cà phê sữa đá' is traditional Vietnamese iced coffee.",
        options: [
          { text: "Xin chào anh Bao! Rất vui được gặp anh ạ.", hint: "Hello Bao! Very glad to meet you." },
          { text: "Cà phê sữa đá của anh trông ngon quá!", hint: "Your iced milk coffee looks so delicious!" },
          { text: "Em rất thích học tiếng Việt cùng anh Bao!", hint: "I really love learning Vietnamese with you, Bao!" }
        ]
      },
      {
        greeting: "Dạ! Anh đã chuẩn bị thêm bánh mì giòn xốp nữa nè. Em thích ăn ngọt hay mặn?",
        greetingTranslation: "Yes! I also prepared a crispy baguette for you. Do you like sweet or savory?",
        greetingTip: "'Bánh mì' is Vietnamese baguette, and 'ngọt' means sweet.",
        options: [
          { text: "Em thích đồ ngọt giống như anh vậy!", hint: "I like sweet things just like you!" },
          { text: "Bánh mì anh làm chắc chắn rất ngon.", hint: "The bánh mì you make must be delicious." },
          { text: "Anh Bao chu đáo với em quá!", hint: "You are so thoughtful with me, Bao!" }
        ]
      },
      {
        greeting: "Cảm ơn em! Nụ cười của em ngọt ngào hơn bất kỳ ly cà phê nào. Chiều nay mình đi dạo phố nhé?",
        greetingTranslation: "Thank you! Your smile is sweeter than any coffee. Shall we stroll the city this afternoon?",
        greetingTip: "'Nụ cười' means smile, and 'đi dạo phố' means walking around the city streets.",
        options: [
          { text: "Vâng ạ! Em rất muốn đi dạo phố cùng anh.", hint: "Yes! I really want to stroll the streets with you." },
          { text: "Mình cùng ngắm hoàng hôn chiều nay nhé!", hint: "Let's watch the sunset together this afternoon!" },
          { text: "Đi dạo cùng anh Bao chắc chắn rất hạnh phúc.", hint: "Strolling with you will surely make me so happy." }
        ]
      },
      {
        greeting: "Mỗi khi ở bên em, anh cảm thấy bình yên và hạnh phúc lắm. Em là người đặc biệt nhất đối với anh.",
        greetingTranslation: "Whenever I'm beside you, I feel so peaceful and happy. You are the most special person to me.",
        greetingTip: "'Bình yên' means peaceful, and 'đặc biệt' means special.",
        options: [
          { text: "Anh Bao cũng là người đặc biệt nhất với em!", hint: "You are also the most special person to me, Bao!" },
          { text: "Cảm ơn anh vì luôn luôn chăm sóc em.", hint: "Thank you for always caring for me." },
          { text: "Em muốn ở bên anh mãi mãi.", hint: "I want to stay by your side forever." }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "I love drinking coffee with you every day."',
        translation: "Em thích uống cà phê cùng anh mỗi ngày.",
        chips: ["Em", "thích", "uống", "cà phê", "cùng anh", "mỗi ngày", "ngon"]
      },
      {
        prompt: 'Translate: "Your smile makes my day brighter."',
        translation: "Nụ cười của anh làm ngày của em sáng hơn.",
        chips: ["Nụ cười", "của anh", "làm", "ngày của em", "sáng hơn", "rất", "đẹp"]
      },
      {
        prompt: 'Translate: "I want to walk with you under the sunset."',
        translation: "Em muốn đi dạo cùng anh dưới hoàng hôn.",
        chips: ["Em", "muốn", "đi dạo", "cùng anh", "dưới", "hoàng hôn", "thích"]
      }
    ]
  },
  julian: {
    mcStages: [
      {
        greeting: "Good day, my darling. Shall we indulge in the subtleties of English prose and poetry today? 📖",
        greetingTranslation: "Good day, my darling. Shall we indulge in the subtleties of English prose and poetry today?",
        greetingTip: "'Indulge' means to allow oneself to enjoy the pleasure of something sweet.",
        options: [
          { text: "Good day, Julian! I'd love to read literature with you.", hint: "Warm polite greeting" },
          { text: "Your passion for poetry is truly enchanting.", hint: "Compliment on his literary taste" },
          { text: "Which classic book shall we explore together today?", hint: "Enthusiastic engagement" }
        ]
      },
      {
        greeting: "How wonderful! I have selected a rare volume of Shakespearean sonnets for us. Do you prefer romantic poetry or classic prose?",
        greetingTranslation: "How wonderful! I have selected a rare volume of Shakespearean sonnets for us. Do you prefer romantic poetry or classic prose?",
        greetingTip: "'Sonnets' are 14-line rhyming poems traditionally written about love.",
        options: [
          { text: "Romantic poetry, especially when read in your charming voice.", hint: "Flirty compliment" },
          { text: "Classic prose has a timeless elegance that I deeply admire.", hint: "Sophisticated preference" },
          { text: "Whatever you choose to read to me will be a sheer delight.", hint: "Warm devotion" }
        ]
      },
      {
        greeting: "Your graceful appreciation of literature touches my soul. Shall we step out onto the balcony under the evening stars?",
        greetingTranslation: "Your graceful appreciation of literature touches my soul. Shall we step out onto the balcony under the evening stars?",
        greetingTip: "'Touches my soul' is a romantic idiom expressing deep emotional resonance.",
        options: [
          { text: "The stars are breathtaking, but you shine even brighter.", hint: "Poetic romantic reply" },
          { text: "I'd love nothing more than to gaze at the starlit sky with you.", hint: "Sweet date invitation" },
          { text: "With poetry and stars, this evening feels like a fairy tale.", hint: "Enchanted feeling" }
        ]
      },
      {
        greeting: "You bring warmth and inspiration into my quiet life, my darling. I cherish every moment by your side.",
        greetingTranslation: "You bring warmth and inspiration into my quiet life, my darling. I cherish every moment by your side.",
        greetingTip: "'Cherish' means to hold something dear and love it protectively.",
        options: [
          { text: "I cherish our moments together just as deeply, Julian.", hint: "Reciprocating affection" },
          { text: "You inspire me every single day as well.", hint: "Admiring encouragement" },
          { text: "Promise me we will spend many more starlit evenings together.", hint: "Sweet promise request" }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "I cherish our quiet literature discussions dearly."',
        translation: "I cherish our quiet literature discussions dearly.",
        chips: ["I", "cherish", "our", "quiet", "literature", "discussions", "dearly"]
      },
      {
        prompt: 'Translate: "Your presence brings warmth into my heart."',
        translation: "Your presence brings warmth into my heart.",
        chips: ["Your", "presence", "brings", "warmth", "into", "my", "heart"]
      },
      {
        prompt: 'Translate: "Let us walk together under the starlit sky."',
        translation: "Let us walk together under the starlit sky.",
        chips: ["Let", "us", "walk", "together", "under", "the", "starlit", "sky"]
      }
    ]
  }
};

// 10-Tier Difficulty Progression System
const TIERS = [
  { level: 1, name: "Tier 1: Baby Talk (Greetings)", mode: "mc", heartsPerAns: 10, desc: "Basic hellos, polite greetings & high-frequency phrases." },
  { level: 2, name: "Tier 2: First Impressions", mode: "mc", heartsPerAns: 12, desc: "Sharing favorite foods, hobbies & polite introductions." },
  { level: 3, name: "Tier 3: Coffee Date", mode: "mc", heartsPerAns: 15, desc: "Ordering drinks, warm gratitude & simple compliments." },
  { level: 4, name: "Tier 4: Word Builder", mode: "wordbank", heartsPerAns: 18, desc: "Building 4–6 word sentences with Word Bank chips." },
  { level: 5, name: "Tier 5: Daily Routines", mode: "wordbank", heartsPerAns: 20, desc: "Expressing daily schedule, time & weather feelings." },
  { level: 6, name: "Tier 6: Flirting & Compliments", mode: "wordbank", heartsPerAns: 22, desc: "Crafting romantic compliments & sweet invitations." },
  { level: 7, name: "Tier 7: Heart-to-Heart", mode: "wordbank", heartsPerAns: 25, desc: "Deeper personal conversations & shared dreams." },
  { level: 8, name: "Tier 8: Advanced Romance", mode: "free", heartsPerAns: 30, desc: "Free-form text input evaluated by Gemma 4 AI." },
  { level: 9, name: "Tier 9: Poetic Fluency", mode: "free", heartsPerAns: 35, desc: "Metaphors, romantic idioms & emotional nuances." },
  { level: 10, name: "Tier 10: Soulmate Mastery", mode: "free", heartsPerAns: 50, desc: "Full immersion, natural speed & romantic soulmate bond." }
];

// App Persistent State
let userState = {
  userId: localStorage.getItem("otome_user_id") || "user_" + Math.random().toString(36).substring(2, 9),
  totalHearts: parseInt(localStorage.getItem("otome_hearts")) || 285,
  streak: parseInt(localStorage.getItem("otome_streak")) || 5,
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { ren: 1, bao: 1, julian: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { ren: 45, bao: 30, julian: 20 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { ren: 0, bao: 0, julian: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
};

// Runtime cache for dynamic AI generated next turn options
let dynamicMcOptions = { ren: null, bao: null, julian: null };
let dynamicWordBank = { ren: null, bao: null, julian: null };

// Save user id
localStorage.setItem("otome_user_id", userState.userId);

// Telemetry & Secret Dashboard State
let analyticsData = {
  clicks: 0,
  answersSubmitted: 0,
  startTime: Date.now(),
  timeSpentSeconds: 0,
  apiCalls: 0,
  convexSyncCount: 0,
  characterInteractions: { ren: 0, bao: 0, julian: 0 },
};

// Currently Active Chat Session
let activeCharacterId = null;

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initKeybinds();
  initOpenRouterKey();
  startTimer();
  renderChatList();
  renderCharactersList();
  renderRoadmap();
  
  // Initial Convex Sync
  syncUserDataToConvex("Initial app load sync");
});

// Timer for Session Analytics
function startTimer() {
  setInterval(() => {
    analyticsData.timeSpentSeconds = Math.floor((Date.now() - analyticsData.startTime) / 1000);
    updateClock();
    if (document.getElementById("secretDashboard").classList.contains("visible")) {
      updateDashboardUI();
    }
  }, 1000);
}

// Live Digital Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const clockEl = document.getElementById("liveClock");
  if (clockEl) {
    clockEl.textContent = `${formattedHours}:${minutes} ${ampm}`;
  }
}

// Global UI Click Listener for Telemetry
document.addEventListener("click", () => {
  analyticsData.clicks++;
  if (document.getElementById("secretDashboard").classList.contains("visible")) {
    document.getElementById("dashTotalClicks").textContent = analyticsData.clicks;
  }
});

// UI Event Handlers & Tab Navigation
function initUI() {
  // Tab Buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
    });
  });

  // OpenRouter Key Save
  document.getElementById("saveKeyBtn").addEventListener("click", () => {
    const key = document.getElementById("openRouterKeyInput").value.trim();
    if (key) {
      localStorage.setItem("openrouter_api_key", key);
      updateKeySavedStatus(true);
      alert("❤️ OpenRouter API Key saved successfully to localStorage!");
    } else {
      alert("Please enter a valid API key.");
    }
  });

  // Save Modal Key
  document.getElementById("saveModalKeyBtn").addEventListener("click", () => {
    const key = document.getElementById("modalKeyInput").value.trim();
    if (key) {
      localStorage.setItem("openrouter_api_key", key);
      updateKeySavedStatus(true);
    }
    document.getElementById("apiKeyModal").style.display = "none";
  });

  // Skip Modal Key
  document.getElementById("skipModalKeyBtn").addEventListener("click", () => {
    document.getElementById("apiKeyModal").style.display = "none";
  });

  // Manual Convex Sync Button
  document.getElementById("manualSyncBtn").addEventListener("click", () => {
    syncUserDataToConvex("Manual button trigger");
  });

  // Close Active Chat Button
  document.getElementById("closeChatBtn").addEventListener("click", () => {
    document.getElementById("chatWindow").classList.remove("active");
    activeCharacterId = null;
    renderChatList();
  });

  // Free Form Text Message Send Button
  document.getElementById("sendFreeMsgBtn").addEventListener("click", handleSendFreeMessage);
  document.getElementById("freeChatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendFreeMessage();
  });

  // Submit Word Bank Sentence
  document.getElementById("submitSentenceBtn").addEventListener("click", handleSendWordBankMessage);

  // Secret Dashboard Manual Upload Button
  document.getElementById("dashUploadBtn").addEventListener("click", uploadAnalyticsToConvex);

  // Close Dashboard Button
  document.getElementById("closeDashBtn").addEventListener("click", () => {
    document.getElementById("secretDashboard").classList.remove("visible");
  });

  // Update Header Badges
  document.getElementById("userHearts").textContent = userState.totalHearts;
  document.getElementById("userStreak").textContent = userState.streak;
}

// Switch Bottom Tabs
function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `view-${tabName}`);
  });
}

// OpenRouter Key Management
function initOpenRouterKey() {
  const savedKey = localStorage.getItem("openrouter_api_key");
  if (savedKey) {
    document.getElementById("openRouterKeyInput").value = savedKey;
    updateKeySavedStatus(true);
  } else {
    updateKeySavedStatus(false);
    // Show modal on first load if key missing
    setTimeout(() => {
      document.getElementById("apiKeyModal").style.display = "flex";
    }, 600);
  }
}

function updateKeySavedStatus(isSaved) {
  const statusEl = document.getElementById("keySavedStatus");
  if (isSaved) {
    statusEl.textContent = "Key Active";
    statusEl.style.color = "var(--accent-emerald)";
  } else {
    statusEl.textContent = "Fallback AI Mode";
    statusEl.style.color = "var(--accent-gold)";
  }
}

// Secret Keyboard Shortcut Listener (CTRL + SHIFT + ALT)
function initKeybinds() {
  window.addEventListener("keydown", (e) => {
    // Secret Keybind: CTRL + SHIFT + ALT
    if (e.ctrlKey && e.shiftKey && e.altKey) {
      e.preventDefault();
      const dash = document.getElementById("secretDashboard");
      dash.classList.toggle("visible");
      logDashboardEvent("Secret Keybind [CTRL + SHIFT + ALT] pressed.");
      updateDashboardUI();
    }
    // ESC to close dashboard
    if (e.key === "Escape") {
      document.getElementById("secretDashboard").classList.remove("visible");
    }
  });
}

// Update Dashboard UI Values
function updateDashboardUI() {
  document.getElementById("dashTotalClicks").textContent = analyticsData.clicks;
  document.getElementById("dashAnswersSubmitted").textContent = analyticsData.answersSubmitted;
  document.getElementById("dashApiCalls").textContent = analyticsData.apiCalls;
  document.getElementById("dashTotalHearts").textContent = userState.totalHearts;
  document.getElementById("dashConvexSyncCount").textContent = analyticsData.convexSyncCount;

  // Format time spent HH:MM:SS
  const s = analyticsData.timeSpentSeconds;
  const hrs = Math.floor(s / 3600).toString().padStart(2, "0");
  const mins = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const secs = (s % 60).toString().padStart(2, "0");
  document.getElementById("dashTimeSpent").textContent = `${hrs}:${mins}:${secs}`;
}

function logDashboardEvent(msg) {
  const box = document.getElementById("dashLogBox");
  const time = new Date().toLocaleTimeString();
  box.innerHTML += `[${time}] ${msg}<br/>`;
  box.scrollTop = box.scrollHeight;
}

// Render Chatrooms List
function renderChatList() {
  const container = document.getElementById("chatListContainer");
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const tierNum = userState.currentTiers[char.id] || 1;
    const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
    const affectionPct = userState.affection[char.id] || 0;

    const history = userState.chatHistories[char.id] || [];
    const lastMsg = history.length > 0 ? history[history.length - 1].text : char.greeting;

    const card = document.createElement("div");
    card.className = "chat-card";
    card.onclick = () => openChatroom(char.id);

    card.innerHTML = `
      <div class="chat-avatar-wrapper">
        <img src="${char.avatar}" class="chat-avatar" alt="${char.name}" />
        <div class="online-badge"></div>
      </div>
      <div class="chat-info">
        <div class="chat-top-row">
          <div class="chat-name">${char.name} <span class="flag-icon">${char.flag}</span></div>
          <div class="chat-time">Active Now</div>
        </div>
        <div class="chat-snippet">${lastMsg}</div>
        <div class="chat-meta">
          <span class="tier-badge">Tier ${tierNum}</span>
          <span class="affection-mini">❤️ ${affectionPct}% Affection</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render Characters Tab
function renderCharactersList() {
  const container = document.getElementById("charactersListContainer");
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const tierNum = userState.currentTiers[char.id] || 1;

    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <div class="char-header-row">
        <img src="${char.avatar}" class="char-img" alt="${char.name}" />
        <div class="char-details">
          <h3>${char.name} ${char.flag}</h3>
          <div class="char-tagline">${char.role} (${char.language})</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">"${char.personality}"</div>
        </div>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px; color:var(--primary-pink);">
          <span>Affection Level</span>
          <span>❤️ ${affectionPct}%</span>
        </div>
        <div class="affection-progress-bar">
          <div class="affection-fill" style="width: ${affectionPct}%;"></div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <span class="tier-badge">Current Tier: ${tierNum} / 10</span>
        <button class="primary-btn" style="padding:6px 14px; font-size:12px; width:auto; margin:0;" onclick="openChatroom('${char.id}')">
          Chat with ${char.name.split(" ")[0]} ❤️
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render 10-Tier Roadmap
function renderRoadmap() {
  const container = document.getElementById("roadmapContainer");
  container.innerHTML = "";

  TIERS.forEach((tier) => {
    const node = document.createElement("div");
    node.className = "tier-node" + (tier.level === 1 ? " active-tier" : "");

    node.innerHTML = `
      <div class="tier-number-badge">${tier.level}</div>
      <div style="flex:1;">
        <div style="font-size:14px; font-weight:700; color:#fff;">${tier.name}</div>
        <div style="font-size:12px; color:var(--text-muted);">${tier.desc}</div>
      </div>
      <div style="font-size:12px; font-weight:700; color:var(--primary-pink);">
        +${tier.heartsPerAns} ❤️
      </div>
    `;

    container.appendChild(node);
  });
}

// Open Active Chatroom
function openChatroom(charId) {
  activeCharacterId = charId;
  analyticsData.characterInteractions[charId]++;
  const char = CHARACTERS[charId];
  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
  const affectionPct = userState.affection[charId] || 0;

  // Set Chat Header Info
  document.getElementById("chatHeaderName").innerHTML = `${char.name} <span>${char.flag}</span>`;
  document.getElementById("chatHeaderAvatar").src = char.avatar;
  document.getElementById("chatHeaderTier").textContent = `Tier ${tierNum}: ${tierObj.name.split(":")[1] || tierObj.name}`;
  document.getElementById("chatHeaderAffection").textContent = `❤️ ${affectionPct}%`;

  // Render History
  renderChatHistory();

  // Configure Input Bar for Active Tier
  setupTierInputControls(tierObj, char);

  // Show Window
  document.getElementById("chatWindow").classList.add("active");
}

// Render Chat History Messages
function renderChatHistory() {
  const container = document.getElementById("chatHistory");
  container.innerHTML = "";

  const char = CHARACTERS[activeCharacterId];
  let history = userState.chatHistories[activeCharacterId] || [];

  // Seed greeting if history empty
  if (history.length === 0) {
    history = [
      {
        sender: "li",
        text: char.greeting,
        translation: char.greetingTranslation,
        tip: char.greetingTip,
        time: "Just now",
      },
    ];
    userState.chatHistories[activeCharacterId] = history;
    saveLocalState();
  }

  history.forEach((msg) => {
    const group = document.createElement("div");
    group.className = "message-group " + (msg.sender === "user" ? "user-msg" : "li-msg");

    if (msg.sender === "li") {
      group.innerHTML = `
        <img src="${char.avatar}" class="msg-avatar" alt="${char.name}" />
        <div class="msg-body">
          <div class="msg-sender">${char.name}</div>
          <div class="msg-bubble">
            <div>${msg.text}</div>
            <div class="hover-assist-badge">💡 Hover for English Translation & Tips</div>
            ${msg.translation ? `<div class="translation-text">💬 ${msg.translation}</div>` : ""}
            ${msg.tip ? `<div class="tip-card"><div class="tip-title">💡 Grammar/Vocab Tip</div>${msg.tip}</div>` : ""}
            ${msg.fix ? `<div class="fix-card"><div class="fix-title">❤️ Corrected Phrasing</div>${msg.fix}</div>` : ""}
          </div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    } else {
      group.innerHTML = `
        <div class="msg-body">
          <div class="msg-bubble">${msg.text}</div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    }

    container.appendChild(group);
  });

  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Setup Input Bar based on Tier Mode (MC vs WordBank vs FreeForm)
function setupTierInputControls(tierObj, char) {
  const mcContainer = document.getElementById("mcContainer");
  const wordBankContainer = document.getElementById("wordBankContainer");
  const freeInputContainer = document.getElementById("freeInputContainer");
  const labelEl = document.getElementById("tierModeLabel");
  const multEl = document.getElementById("tierHeartMultiplier");

  labelEl.textContent = `${tierObj.name}`;
  multEl.textContent = `+${tierObj.heartsPerAns} ❤️ per correct reply`;

  mcContainer.style.display = "none";
  wordBankContainer.style.display = "none";
  freeInputContainer.style.display = "none";

  if (tierObj.mode === "mc") {
    // Tier 1–3 Multiple Choice Mode
    mcContainer.style.display = "flex";
    renderMultipleChoiceOptions(tierObj, char);
  } else if (tierObj.mode === "wordbank") {
    // Tier 4–7 Word Bank Sentence Builder
    wordBankContainer.style.display = "flex";
    setupWordBankPrompt(tierObj, char);
  } else {
    // Tier 8–10 Free Form Text Chat
    freeInputContainer.style.display = "flex";
  }
}

// Render Progressive Multiple Choice Options for Tier 1–3
function renderMultipleChoiceOptions(tierObj, char) {
  const container = document.getElementById("mcContainer");
  container.innerHTML = "";

  let options = [];

  // Check if AI generated dynamic next-turn options exist
  if (dynamicMcOptions[char.id] && dynamicMcOptions[char.id].length > 0) {
    options = dynamicMcOptions[char.id];
  } else {
    // Fallback to progressive story tree stages based on current chatStep
    const tree = STORY_TREES[char.id] || STORY_TREES.ren;
    const stepIndex = (userState.chatStep[char.id] || 0) % tree.mcStages.length;
    const stage = tree.mcStages[stepIndex];
    options = stage.options;
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "mc-option-btn";
    btn.innerHTML = `
      <span>${opt.text}</span>
      <span class="mc-hint">${opt.hint}</span>
    `;
    btn.onclick = () => handleSelectMCOption(opt, tierObj);
    container.appendChild(btn);
  });
}

// Handle Multiple Choice Choice Click
async function handleSelectMCOption(option, tierObj) {
  analyticsData.answersSubmitted++;

  // Add User Message
  addUserMessageToHistory(option.text);

  // Advance Chat Step
  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;
  // Clear consumed dynamic options so next stage loads
  dynamicMcOptions[activeCharacterId] = null;

  // Award Hearts & Affection
  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 5);

  // Trigger Heart Visual Particles
  triggerHeartBurst();

  // Fetch AI or Fallback Response
  await triggerLLMResponse(option.text, tierObj);
}

// Setup Word Bank Prompt for Tier 4–7
let currentConstructedWords = [];
function setupWordBankPrompt(tierObj, char) {
  currentConstructedWords = [];
  const guideEl = document.getElementById("wordBankPromptGuide");
  const chipsGrid = document.getElementById("wordChipsGrid");
  const boxEl = document.getElementById("constructedSentenceBox");

  boxEl.innerHTML = `<span style="color:var(--text-muted); font-size:12px;" id="constructedPlaceholder">Click word chips below to build your sentence...</span>`;

  let promptText = "";
  let chips = [];

  if (dynamicWordBank[char.id] && dynamicWordBank[char.id].prompt) {
    promptText = dynamicWordBank[char.id].prompt;
    chips = dynamicWordBank[char.id].chips || [];
  } else {
    const tree = STORY_TREES[char.id] || STORY_TREES.ren;
    const stepIndex = (userState.chatStep[char.id] || 0) % tree.wordBankStages.length;
    const stage = tree.wordBankStages[stepIndex];
    promptText = stage.prompt;
    chips = stage.chips;
  }

  guideEl.textContent = promptText;
  chipsGrid.innerHTML = "";

  chips.forEach((word) => {
    const chip = document.createElement("button");
    chip.className = "word-chip";
    chip.textContent = word;
    chip.onclick = () => {
      currentConstructedWords.push(word);
      updateConstructedBox();
    };
    chipsGrid.appendChild(chip);
  });
}

function updateConstructedBox() {
  const boxEl = document.getElementById("constructedSentenceBox");
  boxEl.innerHTML = "";

  if (currentConstructedWords.length === 0) {
    boxEl.innerHTML = `<span style="color:var(--text-muted); font-size:12px;">Click word chips below to build your sentence...</span>`;
    return;
  }

  currentConstructedWords.forEach((w, idx) => {
    const span = document.createElement("span");
    span.className = "word-chip";
    span.style.background = "var(--primary-pink)";
    span.textContent = w + " ✕";
    span.onclick = () => {
      currentConstructedWords.splice(idx, 1);
      updateConstructedBox();
    };
    boxEl.appendChild(span);
  });
}

// Submit Word Bank Constructed Message
async function handleSendWordBankMessage() {
  if (currentConstructedWords.length === 0) {
    alert("Please click word chips to build a sentence first!");
    return;
  }

  const constructedText = currentConstructedWords.join(" ");
  analyticsData.answersSubmitted++;

  // Add User Message
  addUserMessageToHistory(constructedText);

  // Advance Chat Step
  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;
  dynamicWordBank[activeCharacterId] = null;

  const tierNum = userState.currentTiers[activeCharacterId] || 4;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[3];

  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 8);
  triggerHeartBurst();

  // Fetch AI Response
  await triggerLLMResponse(constructedText, tierObj);
}

// Handle Free-Form Text Chat Message
async function handleSendFreeMessage() {
  const input = document.getElementById("freeChatInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  analyticsData.answersSubmitted++;

  addUserMessageToHistory(text);

  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;

  const tierNum = userState.currentTiers[activeCharacterId] || 8;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[7];

  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 10);
  triggerHeartBurst();

  await triggerLLMResponse(text, tierObj);
}

// Add User Message to History & LocalStorage
function addUserMessageToHistory(text) {
  const history = userState.chatHistories[activeCharacterId] || [];
  history.push({
    sender: "user",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  userState.chatHistories[activeCharacterId] = history;
  saveLocalState();
  renderChatHistory();
}

// LLM Integration with Gemma 4 via OpenRouter API (+ Fallback Engine)
async function triggerLLMResponse(userText, tierObj) {
  analyticsData.apiCalls++;
  const apiKey = localStorage.getItem("openrouter_api_key");
  const char = CHARACTERS[activeCharacterId];

  // Show "Typing..." indicator in chat
  showTypingIndicator(char);

  let responseData = null;

  if (apiKey) {
    try {
      logDashboardEvent(`Sending OpenRouter API call (${OPENROUTER_MODEL}) for ${char.name}...`);
      
      const prompt = `You are playing the role of ${char.name}, a handsome, romantic Otome dating sim character from Otome Lingua.
Target Language taught: ${char.language}.
Personality: ${char.personality}.
Current User Difficulty Tier: ${tierObj.name}.
User just said: "${userText}".

CRITICAL LANGUAGE RULE:
1. 'characterResponse' MUST BE 100% IN ${char.language.toUpperCase()} ONLY! Do NOT mix English inside 'characterResponse' (unless target language is English).
2. Provide full English translation in 'translation'.
3. Provide a helpful grammar/vocabulary tip in 'tip'.
4. Provide a gentle correction in 'fix' if the user made a grammar/vocab mistake (or null if none).
5. For Tier 1-3, provide 3 new creative options in ${char.language} for the user's NEXT turn in 'nextMcOptions': [{"text": "sentence in ${char.language}", "hint": "English hint"}].

Respond strictly in valid JSON format with these exact keys:
{
  "characterResponse": "100% ${char.language} text",
  "translation": "English translation",
  "tip": "Grammar/vocab tip",
  "fix": "Gentle correction or null",
  "nextMcOptions": [
    { "text": "Option 1", "hint": "Hint 1" },
    { "text": "Option 2", "hint": "Hint 2" },
    { "text": "Option 3", "hint": "Hint 3" }
  ],
  "affectionChange": 5
}`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Otome Lingua",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: "You are a language tutor in a romantic Otome game. Always reply in valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices[0].message.content;
        try {
          responseData = JSON.parse(content);
        } catch {
          // If JSON wrapped in ```json block
          const clean = content.replace(/```json/g, "").replace(/```/g, "").trim();
          responseData = JSON.parse(clean);
        }
        if (responseData && responseData.nextMcOptions) {
          dynamicMcOptions[char.id] = responseData.nextMcOptions;
        }
        logDashboardEvent(`OpenRouter API response received successfully.`);
      } else {
        logDashboardEvent(`OpenRouter API returned status ${res.status}. Switching to Fallback Engine.`);
      }
    } catch (err) {
      logDashboardEvent(`OpenRouter API call failed: ${err.message}. Using Fallback Engine.`);
    }
  }

  // Fallback Engine if API key missing or call failed
  if (!responseData) {
    responseData = generateFallbackResponse(char, userText, tierObj);
  }

  // Remove typing indicator
  removeTypingIndicator();

  // Push LI Message to History
  const history = userState.chatHistories[activeCharacterId] || [];
  history.push({
    sender: "li",
    text: responseData.characterResponse,
    translation: responseData.translation,
    tip: responseData.tip,
    fix: responseData.fix,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  userState.chatHistories[activeCharacterId] = history;

  // Check for Tier Level Up if Affection hits threshold
  checkTierLevelUp(activeCharacterId);

  saveLocalState();
  renderChatHistory();

  // Refresh input controls for NEXT turn so options progress!
  setupTierInputControls(tierObj, char);

  // Auto Sync to Convex Cloud
  syncUserDataToConvex(`Post-chat response sync (${char.name})`);
}

// Fallback Response Generator (100% Pure Target Language)
function generateFallbackResponse(char, userText, tierObj) {
  const tree = STORY_TREES[char.id] || STORY_TREES.ren;
  const step = userState.chatStep[char.id] || 0;
  const stageIndex = Math.min(step, tree.mcStages.length - 1);
  const nextStage = tree.mcStages[stageIndex] || tree.mcStages[0];

  return {
    characterResponse: nextStage.greeting,
    translation: nextStage.greetingTranslation,
    tip: nextStage.greetingTip,
    fix: userText.length < 3 ? "Tip: Try writing a slightly longer response for bonus affection points!" : null,
    affectionChange: 10,
  };
}

// Typing Indicator Helpers
function showTypingIndicator(char) {
  const container = document.getElementById("chatHistory");
  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className = "message-group li-msg";
  indicator.innerHTML = `
    <img src="${char.avatar}" class="msg-avatar" alt="${char.name}" />
    <div class="msg-body">
      <div class="msg-bubble" style="font-style:italic; color:var(--accent-emerald);">
        ${char.name} is typing... 💬
      </div>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

// Hearts & Affection Increment
function addHearts(amount) {
  userState.totalHearts += amount;
  document.getElementById("userHearts").textContent = userState.totalHearts;
  saveLocalState();
}

function increaseAffection(charId, amount) {
  userState.affection[charId] = Math.min(100, (userState.affection[charId] || 0) + amount);
  saveLocalState();
  renderCharactersList();
}

// Check Tier Level-Up
function checkTierLevelUp(charId) {
  const aff = userState.affection[charId] || 0;
  const currentTier = userState.currentTiers[charId] || 1;
  const nextTierThreshold = currentTier * 10;

  if (aff >= nextTierThreshold && currentTier < 10) {
    userState.currentTiers[charId]++;
    logDashboardEvent(`🎉 LEVEL UP! ${CHARACTERS[charId].name} advanced to Tier ${userState.currentTiers[charId]}!`);
    alert(`🎉 LEVEL UP! You and ${CHARACTERS[charId].name} advanced to Tier ${userState.currentTiers[charId]}!`);
  }
}

// Heart Particle Visual Animation
function triggerHeartBurst() {
  const frame = document.getElementById("appFrame");
  const heart = document.createElement("div");
  heart.className = "heart-burst";
  heart.textContent = "❤️ +10";
  heart.style.left = Math.random() * 60 + 20 + "%";
  heart.style.bottom = "120px";
  frame.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
}

// Save LocalStorage State
function saveLocalState() {
  localStorage.setItem("otome_hearts", userState.totalHearts);
  localStorage.setItem("otome_streak", userState.streak);
  localStorage.setItem("otome_tiers", JSON.stringify(userState.currentTiers));
  localStorage.setItem("otome_affection", JSON.stringify(userState.affection));
  localStorage.setItem("otome_chat_step", JSON.stringify(userState.chatStep));
  localStorage.setItem("otome_chats", JSON.stringify(userState.chatHistories));
}

// Synchronize User Data to Convex Cloud (`/sync-user`)
async function syncUserDataToConvex(reason = "") {
  try {
    const statusEl = document.getElementById("convexSyncStatus");
    if (statusEl) statusEl.textContent = "🟡 Syncing...";

    const payload = {
      userId: userState.userId,
      totalHearts: userState.totalHearts,
      streak: userState.streak,
      tiers: userState.currentTiers,
      affection: userState.affection,
      syncedAt: new Date().toISOString(),
      syncReason: reason,
    };

    const res = await fetch(`${CONVEX_HTTP_SITE}/sync-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      analyticsData.convexSyncCount++;
      if (statusEl) statusEl.textContent = "🟢 Convex Synced";
      logDashboardEvent(`Convex [/sync-user] sync successful (${reason}).`);
    } else {
      if (statusEl) statusEl.textContent = "🔴 Sync Offline";
      logDashboardEvent(`Convex [/sync-user] returned status ${res.status}.`);
    }
  } catch (err) {
    const statusEl = document.getElementById("convexSyncStatus");
    if (statusEl) statusEl.textContent = "🔴 Sync Offline";
    logDashboardEvent(`Convex [/sync-user] fetch error: ${err.message}`);
  }
}

// Upload Analytics Telemetry Payload to Convex Cloud (`/analytics`)
async function uploadAnalyticsToConvex() {
  const statusEl = document.getElementById("dashUploadStatus");
  statusEl.textContent = "Uploading telemetry...";

  try {
    const payload = {
      userId: userState.userId,
      telemetry: {
        totalClicks: analyticsData.clicks,
        answersSubmitted: analyticsData.answersSubmitted,
        timeSpentSeconds: analyticsData.timeSpentSeconds,
        apiCalls: analyticsData.apiCalls,
        convexSyncCount: analyticsData.convexSyncCount,
        characterInteractions: analyticsData.characterInteractions,
        totalHeartsEarned: userState.totalHearts,
      },
      uploadedAt: new Date().toISOString(),
    };

    const res = await fetch(`${CONVEX_HTTP_SITE}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      statusEl.textContent = "Status: Upload Success! 🟢";
      logDashboardEvent(`Uploaded analytics to Convex HTTP endpoint: ${JSON.stringify(json)}`);
    } else {
      statusEl.textContent = `Status: Failed (${res.status}) 🔴`;
      logDashboardEvent(`Analytics upload failed with status ${res.status}`);
    }
  } catch (err) {
    statusEl.textContent = "Status: Error 🔴";
    logDashboardEvent(`Analytics upload error: ${err.message}`);
  }
}
