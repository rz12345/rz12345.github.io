# 通用抽獎機 (Lucky Draw)

## 專案說明

一個可自訂選項與機率的通用抽獎頁面，採用滾動跑馬燈動畫呈現結果。支援權重機率、可重複/不重複抽取模式、localStorage 持久化、JSON 匯入匯出等功能。示範資料預設為「丙級中餐題組」（301-1~12、302-1~12，共 24 項）。

## 技術架構

| 項目 | 技術 |
|------|------|
| 框架 | Vue.js 2.6.12 (CDN) |
| CSS | Tailwind CSS Play CDN |
| 元件載入 | http-vue-loader 1.4.2 |
| 儲存 | localStorage (JSON) |
| 部署 | GitHub Pages (靜態) |

**無 build step，無 npm** — 直接在瀏覽器開啟 `index.html`。

## 目錄結構

```
lucky-draw/
├── index.html              # 進入點、CDN、Tailwind config、Vue mount
├── js/
│   ├── app.js              # Vue 根實例、抽獎引擎、持久化
│   ├── demoData.js         # 示範資料（301/302 題組）
│   └── component/
│       ├── SlotMachine.vue   # 跑馬燈動畫 + 抽獎邏輯
│       └── OptionEditor.vue  # 選項編輯 + 匯入匯出
├── css/
│   └── app.css             # 自訂動畫與樣式
└── .claude/
    └── CLAUDE.md           # 此檔案
```

## 資料流

### 狀態（Vue data）

```js
{
  options: [{ id, label, weight }, ...],  // 所有選項
  drawMode: 'repeat' | 'unique',          // 抽取模式
  drawnIds: [id, ...],                     // 已抽出選項 ID（不重複模式）
  history: [{ id, label, timestamp }, ...], // 抽獎歷史（最新 100 筆）
}
```

### localStorage

鑰匙：`lucky_draw_config`

```json
{
  "options": [...],
  "drawMode": "repeat",
  "drawnIds": []
}
```

啟動時自動讀取；任何變更立即持久化。

### 抽獎流程

1. **計算可抽 pool**：
   - `repeat`：全部選項
   - `unique`：排除 `drawnIds` 的選項

2. **加權隨機**（`drawOnce()` in app.js）：
   - 總權重 = pool 所有 option.weight 的和
   - 隨機數 0~totalWeight
   - 累加權重直到超過隨機數，該選項為中獎者
   - 不重複模式下加入 `drawnIds`

3. **跑馬燈動畫**（SlotMachine.vue）：
   - 先決定結果（中獎選項），再播動畫
   - 構造「10 倍 shuffled pool + winner」的列表
   - CSS `transform: translateY()` + `cubic-bezier(0.25,0.46,0.45,0.94)` ease-out（3.5 秒）
   - 動畫結束後展示結果、加入歷史

4. **百分比即時計算**（computed）：
   - `(option.weight / totalWeight) * 100`
   - 不重複模式時，pool 動態變化，百分比同步重算

## 核心邏輯

### SlotMachine.vue

- `draw()`：啟動抽獎流程
  - 調用 `$parent.drawOnce()` 得到結果
  - `buildReel(result)`：構造捲軸序列
  - `animateReel()`：播放動畫、設置 lastResult
- `buildReel(winnerOption)`：
  - 取可抽 pool，shuffle 10 倍
  - 末尾加 winner，共約 240+ 項
- `animateReel()`：
  - 計算 targetOffset = -(項數-1) × 96px
  - 無過渡條件下設 transform = 0
  - 50ms 後啟用 transition，滑向 targetOffset
  - 3550ms 後抽籤完成、顯示結果

### OptionEditor.vue

- 雙向綁定 `localOptions`（options 的深拷貝）
- 百分比 `computed`：`(weight / totalWeight) * 100`
- 新增/刪除/編輯選項
- 輸入驗證：label 非空、weight > 0
- 匯入時 schema 驗證（options 陣列、每項 label 字串 + weight 正數）
- 匯出為 JSON 檔

### localStorage + 匯入匯出

**讀取**：`app.js` mounted 時 `loadState()`

**保存**：每次狀態變更呼叫 `saveState()`（用深複製防 mutation）

**匯出**：`exportConfig()` 下載 JSON 檔（filename: `lucky-draw-config.json`）

**匯入**：`importConfig(file)` 讀取 JSON → 驗證結構 → 失敗顯示友善錯誤，不污染現有設定

## 開發規則

- **不可變原則**：用 `...spread`, `filter()`, `map()` 而非直接 mutate
- **驗證邊界**：匯入 JSON 時嚴格驗證；用戶輸入 label/weight 即時驗證
- **錯誤訊息**：中文、使用者友善
- **繁體中文 UI**；英文變數/函式名
- **Tailwind utility 優先**；動畫放 `app.css`

## 相關連結

- [Vue.js 2 文檔](https://v2.vuejs.org/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)
- [http-vue-loader](https://github.com/FranckFreiburger/http-vue-loader)

## 任務管理

完成清單寫在 `.claude/Task.md`（勿提交）；待辦寫在 `.claude/Todo.md`（勿提交）。

---

最後更新：2026-06-02
