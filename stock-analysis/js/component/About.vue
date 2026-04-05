<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
    <div>
      <div class="bg-fin-card rounded-xl border border-fin-border overflow-hidden">
        <img src="./image/cover-about.jpg" class="w-full object-cover opacity-90" alt="cute orange cat">
      </div>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-slate-100 mb-6 tracking-tight">關於我</h2>
      <div class="space-y-4 mb-6">
        <p class="text-slate-400 leading-relaxed text-sm">
          大家好,我從 2014 年開始接觸台股市場,逐步買進(持有)不同產業的股票,包括傳統產業、電信、金融和電子行業。
          於 2020 年時,開設了 FirstTrade 帳戶,將標的範圍擴大到美股市場。早期會花時間研究個股財報,技術線趨勢。
          後來發現我沒有靠個股賺錢的眼光(差不多是損益兩平的狀態),後來轉換持股至 ETF。靠著自學設計交易策略,
          自 2020 起,年化報酬超過一年期定存利率的四倍。
        </p>
        <p class="text-slate-400 leading-relaxed text-sm">
          過去設計的交易策略以技術指標為基礎,例如當相對強弱指數(RSI)低於 30 時買入,高於 70 時賣出。然而不同交易策略的回測,
          需要經過深入分析,不同市場、不同標的,散戶、大戶的買賣行為也不盡相同。
          隨著生成式人工智能的出現,分析這項任務變得簡化許多。經過研究發現,在除息後買入的策略適用於大部分
          的台股 ETF,這可能與國情差異有關。
        </p>
        <p class="text-slate-400 leading-relaxed text-sm">我把近幾年的實做的模擬成效,以測試的形式公開在網頁上,分享給大家。</p>
      </div>

      <div class="mb-6">
        <h3 class="text-sm font-semibold text-fin-muted uppercase tracking-widest mb-3">技術堆疊</h3>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-sky-900/30 text-sky-300 border border-sky-800/40">Python</span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/40 text-slate-300 border border-slate-600/40">Firebase</span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-800/40">Vue</span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-violet-900/30 text-violet-300 border border-violet-800/40">Claude.ai</span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300 border border-amber-800/40">Cat 🐈</span>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-fin-muted uppercase tracking-widest mb-3">相關連結</h3>
        <ul class="space-y-2">
          <li>
            <a href="https://www.facebook.com/joxiaomao/" target="_blank" rel="noopener noreferrer"
              class="text-sky-400 hover:text-sky-300 transition-colors text-sm">
              <i class="fab fa-facebook mr-1"></i> FB 粉專
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
