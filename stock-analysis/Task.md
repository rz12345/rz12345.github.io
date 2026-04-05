# Task — 已完成任務紀錄

> 每次工作階段結束後，將 Todo.md 中完成的項目移至此處，並標註日期。

---

## 2026-04-05（第二批）

### UI 優化
- Monospace 字體引入（Roboto Mono via Google Fonts + `css/app.css`）
- 導覽列加 sparkline SVG icon + 最後更新日期（從 `recent_transaction_logs` 最新 date 取得）
- Transaction 表格資產價值欄加差額行（`asset - position`，含正負號與顏色）

### 功能改善
- Transaction 頁面方法切換：`method` 改由 route query 讀取（`?method=bt_dividend`），SharedStockSummary 的跳轉連結自動帶入目前選擇的 method
- `prefixURL` 去重：移除 `Transaction.vue` 內的重複定義，改用全域 `prefixURL`（`app.js`）

---

## 2026-04-05

### 新功能
- 新增 `bt_ma_pullback` 策略顯示（`SharedStockSummary.vue` 按鈕 + `Method.vue` 說明）

### UI 重構
- Bootstrap 4 → Tailwind CSS 完整遷移（Play CDN）
- 建立 `fin-*` 自訂色彩系統（定義於 `index.html` `tailwind.config`）
- Dark Mode 金融風格（TradingView 色調）
- Sticky 導覽列 + `backdrop-blur-md` 毛玻璃效果
- Active nav link 改為藍色底線樣式（取代背景色塊）
- 股票卡片加 IRR badge（`▲/▼` + 顏色背景）
- 金額加千分位格式（`toLocaleString`）
- 報酬率加正負號（`+15.24%` / `-3.40%`）
- TradingView 標準盈虧色（盈 `#089981` / 虧 `#f23645`）
- Transaction 表格：sticky header、mini bar、偶數列斑馬紋
- 移除 `Method.vue` 底部 Hint 區塊

### 文件
- 建立 `CLAUDE.md`（專案規範）
- 建立 `Todo.md`（待辦清單）
- 建立 `Task.md`（本檔）
