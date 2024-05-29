<!-- SharedStockSummary.vue -->
<template>
    <div>
      <h2>{{ title }}</h2>
      <div v-if="recent_transaction_logs.length > 0">
        <h3>近期交易紀錄</h3>
        <table class="table">
          <thead>
            <tr>
              <th>代號</th>
              <th>日期</th>
              <th>方法</th>
              <th>收盤價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
              <td>
                <router-link :to="{
                params:{Market:'tw',StockId:record.stock_id},
                name:'transaction'}">{{ record.stock_id }}</router-link>
              </td>
              <td>{{ record.date }}</td>
              <td>{{ record.method }}</td>
              <td>{{ record.date_closed_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="summaries.length > 0">
        <h3>標的投報率</h3>
        <table class="table">
          <thead>
            <tr>
              <th>代號</th>
              <th>日期</th>
              <th>方法</th>
              <th>收盤價</th>
              <th>持倉價值</th>
              <th>期間配息</th>
              <th>資產價值</th>
              <th>投報率</th>
              <th>年化報酬率</th>
            </tr>
          </thead>
          <tbody>
            <!-- reverse sort by date -->
            <tr v-for="record in summaries.slice().sort((a, b) => b.irr - a.irr)">
              <td>
                <router-link :to="{
                params:{Market:'tw',StockId:record.stock_id},
                name:'transaction'}">{{ record.stock_id }}</router-link>
              </td>
              <td>{{ record.date }}</td>
              <td>{{ record.method }}</td>
              <td>{{ record.close }}</td>
              <td>{{ record.position_value }}</td>
              <td>{{ record.broker_dividend }}</td>
              <td>{{ record.asset_value }}</td>
              <td>{{ convertRate(record.roi) }}</td>
              <td>{{ convertRate(record.irr) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  module.exports = {
    props: ['market', 'title'],
    data: function() {
      return {
        summaries: [],
        recent_transaction_logs: [],
      }
    },
    methods: {
      convertRate(real) {
        let rate = parseInt(real * 10000) / 100;
        return `${rate} %`;
      },
    },
    mounted: function() {
      axios.get(`${prefixURL}/${this.market}/best_bt_summaries.json`).then(function(res) {
        this.summaries = Object.values(res.data);
      }.bind(this));
      axios.get(`${prefixURL}/${this.market}/recent_transaction_logs.json`).then(function(res) {
        this.recent_transaction_logs = Object.values(res.data);
      }.bind(this));
    },
  }
  </script>