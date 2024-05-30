<template>
  <div class="row my-5">
    <div class="col-md-6">
      <div class="card border-0 shadow">
        <img src="./image/cover-about.jpg" class="card-img-top" alt="cute orange cat">
      </div>
    </div>
    <div class="col-md-6">
      <h2 class="mb-4">關於我</h2>
      <div class="mb-4">
        <p class="lead">
          大家好,我從 2014 年開始接觸台股市場,逐步買進(持有)不同產業的股票,包括傳統產業、電信、金融和電子行業。
          於 2020 年時,開設了 FirstTrade 帳戶,將標的範圍擴大到美股市場。早期會花時間研究個股財報,技術線趨勢。
          後來發現我沒有靠個股賺錢的眼光(差不多是損益兩平的狀態),後來轉換持股至 ETF。靠著自學設計交易策略,
          自 2020 起,年化報酬超過一年期定存利率的四倍。
        </p>
        <p class="lead">
          過去設計的交易策略以技術指標為基礎,例如當相對強弱指數(RSI)低於 30 時買入,高於 70 時賣出。然而不同交易策略的回測,
          需要經過深入分析,不同市場、不同標的,散戶、大戶的買賣行為也不盡相同。
          隨著生成式人工智能的出現,分析這項任務變得簡化許多。經過研究發現,在除息後買入的策略適用於大部分
          的台股 ETF,這可能與國情差異有關。
        </p>
        <p class="lead mb-0">我把近幾年的實做的模擬成效,以測試的形式公開在網頁上,分享給大家。</p>
      </div>
      <!--
      <div class="mb-4">
        <ol class="list-group list-group-flush">
          <li class="list-group-item">bt_signals: 當移動平均匯聚背離指標(MACD)由負轉正,且 RSI 低於 50 時買入。</li>
          <li class="list-group-item">bt_dividend: 在除息後買入。</li>
        </ol>
      </div>
      -->
      <div class="mb-4">
        <h3>技術堆疊</h3>
        <ul class="list-inline">
          <li class="list-inline-item"><span class="badge badge-pill badge-primary">Python</span></li>
          <li class="list-inline-item"><span class="badge badge-pill badge-secondary">Firebase</span></li>
          <li class="list-inline-item"><span class="badge badge-pill badge-success">Vue</span></li>
          <li class="list-inline-item"><span class="badge badge-pill badge-danger">Claude.ai</span></li>
          <li class="list-inline-item"><span class="badge badge-pill badge-warning">Cat 🐈</span></li>
        </ul>
      </div>
      <div>
        <h3>相關連結</h3>
        <ul class="list-unstyled">
          <li><a href="https://www.facebook.com/joxiaomao/" target="_blank" rel="noopener noreferrer">FB 粉專</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>