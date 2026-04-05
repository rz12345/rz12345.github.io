# 小貓選股 — CLAUDE.md

## 專案概述

股票回測結果展示網頁，支援台股（tw）與美股（us）兩個市場。  
後端資料由 Python 計算後寫入 Firebase Realtime Database，前端透過 Vue.js 讀取並展示。

---

## Tech Stack

| 項目 | 版本 / 說明 |
|------|-------------|
| Vue.js | 2.6.12（CDN，無 build process） |
| Vue Router | 3.4.3 |
| Tailwind CSS | Play CDN（`cdn.tailwindcss.com`） |
| Font Awesome | 5.15.3 |
| axios | 0.20.0 |
| Chart.js | 3.3.2 + chartjs-plugin-datalabels |
| dayjs | 1.8.21 |
| http-vue-loader | 1.4.2（讓 CDN 環境支援 .vue SFC） |
| Firebase | Realtime Database（REST API via axios） |

> **重要**：此專案無 Node.js / npm / build step，所有 JS 從 CDN 載入。
> 不可使用需要 import/require 或 bundler 的寫法。

---

## 檔案結構

```
stock-analysis/
├── index.html              # 入口，含 Tailwind config、Vue 掛載點、導覽列
├── css/
│   └── app.css             # active nav link 樣式（其餘全用 Tailwind）
└── js/
    ├── app.js              # Vue Router 路由定義、Firebase base URL
    └── component/
        ├── SharedStockSummary.vue  # 台股/美股列表頁（卡片網格）
        ├── Transaction.vue         # 個股詳細交易紀錄（圖表 + 表格）
        ├── Method.vue              # 交易策略說明頁（靜態）
        └── About.vue               # 關於頁面
```

---

## Firebase 資料結構

**Base URL：**
```
https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/
```

**路徑規則：**
```
/{Market}/{method}/summaries.json                      # 策略摘要列表
/{Market}/{method}/transaction_logs/{StockId}.json     # 個股交易紀錄
/{Market}/recent_transaction_logs.json                  # 近期交易紀錄
```

**Market 值：** `tw`（台股）、`us`（美股）

**目前策略（method）：**
- `bt_dividend` — 除息後買入
- `bt_signals` — MACD 由負轉正 + RSI < 50 買入
- `bt_ma_pullback` — 股價回測均線支撐買入

**新增策略時：**
1. 在 Firebase 寫入對應路徑資料
2. 在 `SharedStockSummary.vue` 的「投資方法」按鈕區加入新按鈕
3. 在 `Method.vue` 的「三、買入訊號定義」清單新增說明

---

## 設計系統

### 色彩（定義於 `index.html` 的 `tailwind.config`）

```js
fin: {
  bg:      '#0e0f11',   // 最深背景（body）
  surface: '#131722',   // 次深面（table header、card header）
  card:    '#1a1d27',   // 卡片背景
  border:  '#2a2e39',   // 邊框、分隔線
  muted:   '#4b5563',   // 次要文字
  green:   '#089981',   // 盈利（TradingView 標準綠）
  red:     '#f23645',   // 虧損（TradingView 標準紅）
}
```

**其他常用色：**
- `text-slate-100` — 主要標題
- `text-slate-300` — 次要文字
- `text-slate-400 / 500` — 輔助文字
- `text-sky-400` — 連結、active 狀態、主要 accent
- `text-amber-400` — 配息、paw icon

### Active Nav Link（`css/app.css`）
```css
.router-link-active.nav-link,
.router-link-exact-active.nav-link {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
  font-weight: 600;
}
```

### 卡片樣式
```
bg-fin-card rounded-xl border border-fin-border p-4
hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 transition-all
```

### 按鈕（active / inactive）
```
active:   bg-sky-500/20 text-sky-300 border border-sky-500/50
inactive: bg-fin-card text-slate-500 border border-fin-border
          hover:border-slate-500 hover:text-slate-300
```

---

## 共用 Methods 規範

### `formatCurrency(value)`
- 加千分位分隔符
- 台股前綴 `NT$`，美股 `USD$`
```js
formatCurrency(value) {
  const currency = this.$route.params.Market === 'tw' ? 'NT$' : 'USD$';
  return `${currency} ${Number(value).toLocaleString('en-US')}`;
}
```

### `convertRate(real)`
- 輸入為小數（e.g. `0.1524`），輸出 `+15.24%`
- 加正負號、固定 2 位小數
```js
convertRate(real) {
  const rate = (parseInt(real * 10000) / 100).toFixed(2);
  const sign = real >= 0 ? '+' : '';
  return `${sign}${rate}%`;
}
```

### 盈虧色彩判斷
- `asset_value >= position_value` → `text-fin-green`（盈利）
- `asset_value < position_value`  → `text-fin-red`（虧損）
- `irr / roi >= 0` → `text-fin-green`
- `broker_dividend > 0` → `text-amber-400`，否則 `text-slate-600`

---

## 路由定義（`js/app.js`）

| name | path | component |
|------|------|-----------|
| `home` | `/` | redirect → `market/tw` |
| `market` | `/:Market` | SharedStockSummary.vue |
| `transaction` | `/:Market/:StockId` | Transaction.vue |
| `method` | `/method` | Method.vue |
| `about` | `/about` | About.vue |

---

## 任務管理規則

每次工作階段遵循以下流程：

1. **開始前** — 讀取 `Todo.md` 了解待辦項目，讀取 `Task.md` 了解已完成的歷史
2. **進行中** — 完成的項目從 `Todo.md` 移除
3. **結束時** — 將本次完成的項目整理後**移入 `Task.md`**，標註日期與分類

### 檔案職責

| 檔案 | 用途 |
|------|------|
| `Todo.md` | 未完成項目，含做法說明與優先序 |
| `Task.md` | 已完成項目的歷史紀錄，依日期分段 |
| `CLAUDE.md` | 專案規範，本身的更動也需記錄至 `Task.md` |

> 已完成的項目**不留在 `Todo.md`**，一律移至 `Task.md`。

---

## 注意事項

- 此專案無 build process，**不可使用 ES module import**
- Vue 元件透過 `http-vue-loader` 動態載入，需從本地 server 或 GitHub Pages 執行（直接開 file:// 會 CORS 錯誤）
- `prefixURL` 定義於 `js/app.js`（全域）與 `Transaction.vue`（重複定義，歷史遺留）
- Google Analytics ID: `G-TJWWQVVMP3`
