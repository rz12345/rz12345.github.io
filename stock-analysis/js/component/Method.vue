<template>
  <div class="row my-5">
    <div class="col-md-12">
      <h2 class="mb-4">交易策略</h2>
      <p>設計一套同時適用於台股和美股兩個市場的股票交易策略，並定義兩種不同的買入訊號</p>
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">一、建立基礎抽象類 BaseStrategy</h5>
        </div>
        <div class="card-body">
          <p>包含了一些抽象方法和屬性，如：</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">DB_PATH 資料庫路徑</li>
            <li class="list-group-item">BROKER_YEAR_CASH 每年投資金額</li>
            <li class="list-group-item">DIVIDEND_COLUMN 股息列名</li>
            <li class="list-group-item">CLOSED_PRICE_COLUMN 收盤價列名等</li>
          </ul>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">二、台股美股實體類 TwStrategy 和 UsStrategy</h5>
        </div>
        <div class="card-body">
          <p>台股美股原始資料欄位名稱不同，因此定義了兩個實體類 TwStrategy 和 UsStrategy，分別繼承自 BaseStrategy，並設置不同的屬性：</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">DB_PATH 資料庫路徑</li>
            <li class="list-group-item">BROKER_YEAR_CASH 每年投資金額</li>
            <li class="list-group-item">DIVIDEND_COLUMN 股息列名</li>
            <li class="list-group-item">CLOSED_PRICE_COLUMN 收盤價列名等</li>
          </ul>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">三、買入訊號定義</h5>
        </div>
        <div class="card-body">
          <ol class="list-group list-group-flush">
            <li class="list-group-item">bt_signals: 當移動平均匯聚背離指標(MACD)由負轉正,且 RSI 低於 50 時買入。</li>
            <li class="list-group-item">bt_dividend: 在除息後買入。</li>
          </ol>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">四、執行策略</h5>
        </div>
        <div class="card-body">
          <p>根據傳入的股票數據和策略名稱，執行相應的策略。其中包括：</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">根據買入信號進行交易</li>
            <li class="list-group-item">更新持倉量、持倉成本和資產價值</li>
            <li class="list-group-item">計算配息金額</li>            
            <li class="list-group-item">計算投資報酬率和年化報酬率</li>
            <li class="list-group-item">將交易記錄寫入資料庫</li>
            <li class="list-group-item">將回測摘要寫入資料庫</li>            
          </ul>
        </div>
      </div>      
      <div class="alert alert-info mt-4" role="alert">
        <div class="row align-items-center">
          <div class="col">
            <p class="mb-0">Hint：有一半以上的程式碼是由 Claude.ai 產生的，包含這個網頁！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>