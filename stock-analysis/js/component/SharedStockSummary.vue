<!-- SharedStockSummary.vue -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <div v-if="recent_transaction_logs.length > 0">
      <h3>近期交易紀錄</h3>
      <div class="row">
        <div class="col-md-4" v-for="record in recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <h5 class="card-title mb-0">
                  <router-link :to="{
                    name: 'transaction',
                    params: {
                      Market: $route.params.Market,
                      StockId: record.stock_id,
                    }
                  }">
                    {{ record.stock_id }}
                  </router-link>
                </h5>
                <small class="text-muted text-right">
                  {{ record.date }}<br/>
                  收盤價 {{ formatCurrency(record.date_closed_price) }}
                </small>
              </div>
              <div class="d-flex justify-content-end mt-4">
                <small class="text-muted">方法 {{ record.method }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="summaries.length > 0">
      <h3>標的投報率</h3>
      <div class="mb-3">
        <button class="btn btn-secondary mr-2" @click="sortBy('irr')">年化報酬率 <i class="fas fa-sort-down"></i></button>
        <button class="btn btn-secondary mr-2" @click="sortBy('roi')">投報率 <i class="fas fa-sort-down"></i></button>
        <button class="btn btn-secondary mr-2" @click="sortBy('asset_value')">資產價值 <i class="fas fa-sort-down"></i></button>
        <button class="btn btn-secondary mr-2" @click="sortBy('position_value')">持倉價值 <i class="fas fa-sort-down"></i></button>
        <button class="btn btn-secondary" @click="sortBy('broker_dividend')">期間配息 <i class="fas fa-sort-down"></i></button>
      </div>
      <div class="row">
        <div class="col-md-4" v-for="record in sortedSummaries">
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <h5 class="card-title mb-0">
                  <router-link :to="{
                    name: 'transaction',
                    params: {
                      Market: $route.params.Market,
                      StockId: record.stock_id,
                    }
                  }">
                    {{ record.stock_id }}
                  </router-link>
                </h5>
                <small class="text-muted text-right">
                  {{ record.date }}<br/>
                  收盤價 {{ formatCurrency(record.close) }}
                </small>
              </div>
              <div class="row mt-4">
                <div class="col-6">年化報酬率</div>
                <div class="col-6 text-success text-right">{{ convertRate(record.irr) }}</div>
                <div class="col-6">投報率</div>
                <div class="col-6 text-success text-right">{{ convertRate(record.roi) }}</div>
                <div class="col-6">資產價值</div>
                <div class="col-6 text-success text-right">{{ formatCurrency(record.asset_value) }}</div>
                <div class="col-6">持倉價值</div>
                <div class="col-6 text-success text-right">{{ formatCurrency(record.position_value) }}</div>
                <div class="col-6">期間配息</div>
                <div class="col-6 text-success text-right">{{ formatCurrency(record.broker_dividend) }}</div>
              </div>
              <div class="d-flex justify-content-end mt-4">
                <small class="text-muted">方法 {{ record.method }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>
  
  <script>

  module.exports = {
    props: ['title'],
    data: function() {
      return {
        summaries: [],
        recent_transaction_logs: [],
        sortKey: 'irr' // 默認按年化報酬率排序
      }
    },
    methods: {
      convertRate(real) {
        let rate = parseInt(real * 10000) / 100;
        return `${rate} %`;
      },
      getData() {
        axios.get(`${prefixURL}${this.$route.params.Market}/best_bt_summaries.json`).then(function(res) {
          this.summaries = Object.values(res.data);
        }.bind(this));
        axios.get(`${prefixURL}${this.$route.params.Market}/recent_transaction_logs.json`).then(function(res) {
          this.recent_transaction_logs = Object.values(res.data);
        }.bind(this));
      },
      sortBy(key) {
        this.sortKey = key;
      },
      formatCurrency(value) {
        const currency = this.$route.params.Market === 'tw' ? 'NT$' : 'USD$';
        return `${currency} ${value}`;
      },
    },
    computed: {
      sortedSummaries: function () {
            return this.summaries.slice().sort((a, b) => b[this.sortKey] - a[this.sortKey]);
        },
    },
    mounted: function() {
      this.getData()
    },
    watch: {
        $route(to, from) {
          this.getData()
        },
        //deep: true,
        immediate: true,
    }
  }
  </script>