# Todo — 小貓選股

> 未完成的改善項目，依優先序排列。

---

## 功能改善

### 美股策略支援
**目標：** 目前美股（us）市場尚未有策略資料，待後端 Python 產出後前端應可直接支援  
**確認項目：**
- Firebase `/us/bt_dividend/summaries.json` 路徑是否已有資料
- `formatCurrency` 已支援 `USD$` 前綴，無需修改前端
- 後端就緒後，前端零改動即可自動支援
