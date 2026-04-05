<template>
  <div class="py-8">
    <h2 class="text-2xl font-bold text-slate-100 mb-2 tracking-tight">交易策略</h2>
    <p class="text-slate-500 mb-8 text-sm">設計一套同時適用於台股和美股兩個市場的股票交易策略，並定義不同的買入訊號</p>

    <div class="space-y-3">
      <div class="bg-fin-card rounded-xl border border-fin-border overflow-hidden">
        <div class="bg-fin-surface px-5 py-4 border-b border-fin-border">
          <h5 class="font-semibold text-slate-200">一、資金分配</h5>
        </div>
        <div class="px-5 py-4">
          <ul class="divide-y divide-fin-border text-sm text-slate-400">
            <li class="py-2"><span class="text-slate-300">回測起始日</span>：2020-01-01（台股與美股皆同）</li>
            <li class="py-2"><span class="text-slate-300">台股</span>：每年 NT$100,000，平均分配至當年所有買入訊號</li>
            <li class="py-2"><span class="text-slate-300">美股</span>：每年 USD$3,500，平均分配至當年所有買入訊號</li>
            <li class="py-2"><span class="text-slate-300">定期定額</span>：每年約 12 次；台股每月約 NT$8,333，美股約 USD$292</li>
          </ul>
        </div>
      </div>

      <div class="bg-fin-card rounded-xl border border-fin-border overflow-hidden">
        <div class="bg-fin-surface px-5 py-4 border-b border-fin-border">
          <h5 class="font-semibold text-slate-200">二、買入訊號定義</h5>
        </div>
        <div class="px-5 py-4">
          <ol class="divide-y divide-fin-border text-sm text-slate-400">
            <li class="py-3 flex gap-3 items-start">
              <span class="text-sky-400 font-bold tabular-nums mt-px">01</span>
              <span><span class="text-sky-300 font-medium">MACD 訊號</span>：當移動平均匯聚背離指標(MACD)由負轉正，且 RSI 低於 50 時買入。</span>
            </li>
            <li class="py-3 flex gap-3 items-start">
              <span class="text-sky-400 font-bold tabular-nums mt-px">02</span>
              <span><span class="text-sky-300 font-medium">除息策略</span>：在除息後買入。</span>
            </li>
            <li class="py-3 flex gap-3 items-start">
              <span class="text-sky-400 font-bold tabular-nums mt-px">03</span>
              <span><span class="text-sky-300 font-medium">均線回測</span>：當股價回測到移動平均線（MA）支撐時買入。</span>
            </li>
            <li class="py-3 flex gap-3 items-start">
              <span class="text-sky-400 font-bold tabular-nums mt-px">04</span>
              <span><span class="text-sky-300 font-medium">定期定額</span>：每月固定買入，不擇時進場，長期累積持股。</span>
            </li>
          </ol>
        </div>
      </div>

      <div class="bg-fin-card rounded-xl border border-fin-border overflow-hidden">
        <div class="bg-fin-surface px-5 py-4 border-b border-fin-border">
          <h5 class="font-semibold text-slate-200">三、執行策略</h5>
        </div>
        <div class="px-5 py-4">
          <p class="text-slate-500 text-sm mb-3">根據傳入的股票數據和策略名稱，執行相應的策略。其中包括：</p>
          <ul class="divide-y divide-fin-border text-sm text-slate-400">
            <li class="py-2">根據買入信號進行交易</li>
            <li class="py-2">更新持倉量、持倉成本和資產價值</li>
            <li class="py-2">計算配息金額</li>
            <li class="py-2">計算投資報酬率和年化報酬率</li>
            <li class="py-2">將交易記錄寫入資料庫</li>
            <li class="py-2">將回測摘要寫入資料庫</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
