<template>
    <div>
      <h2>台股回測</h2>
      <div v-if="tw.recent_transaction_logs">
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
            <tr v-for="record in tw.recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
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
      <div v-if="tw.summaries.length > 0">
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
            <tr v-for="record in tw.summaries.slice().sort((a, b) => b.irr - a.irr)">
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
      <h2>美股回測</h2>
      <div v-if="us.recent_transaction_logs.length > 0">
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
            <!-- reverse sort by date -->
            <tr v-for="record in us.recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
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
      <div v-if="us.summaries.length > 0">
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
            <tr v-for="record in us.summaries.slice().sort((a, b) => b.irr - a.irr)">
              <td>
                <router-link :to="{
                params:{Market:'us',StockId:record.stock_id},
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
    const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
    module.exports = {
      data: function() {
        return {
          us: {
            summaries: [],
            recent_transaction_logs: [],
          },
          tw: {
            summaries: [],
            recent_transaction_logs: [],
          }
        }
      },
      //props: ['ItemClass', 'ItemSubClass', 'Item', 'ItemRecords'],
      methods: {
        convertRate(real) {
          let rate = parseInt(real * 10000) / 100;
          return `${rate} %`;
        },
      },
      mounted: function() {
        axios.get(prefixURL + `/tw/best_bt_summaries.json`).then(function(res) {
          this.tw.summaries = Object.values(res.data);
        }.bind(this));
        axios.get(prefixURL + `/tw/recent_transaction_logs.json`).then(function(res) {
          this.tw.recent_transaction_logs = Object.values(res.data);
        }.bind(this));
        axios.get(prefixURL + `/us/best_bt_summaries.json`).then(function(res) {
          this.us.summaries = Object.values(res.data);
        }.bind(this));
        axios.get(prefixURL + `/us/recent_transaction_logs.json`).then(function(res) {
          this.us.recent_transaction_logs = Object.values(res.data);
        }.bind(this));
      },
      computed: {},
      watch: {
        $route(to, from) {},
        deep: true,
        immediate: true,
      }
    }
  </script>