<!-- SharedStockSummary.vue -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <div v-if="recent_transaction_logs.length > 0">
      <h3>近期交易紀錄</h3>
      <div class="row">
        <div class="col-md-4 col-sm-6" v-for="record in recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
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
    <h3>投資方法</h3>
    <div class="mb-3">
      <!-- New buttons for switching methods -->
      <button 
        class="btn mr-2" 
        :class="method === 'bt_dividend' ? 'btn-primary' : 'btn-secondary'"
        @click="switchMethod('bt_dividend')"
      >
        bt_dividend
      </button>
      <button 
        class="btn mr-2" 
        :class="method === 'bt_signals' ? 'btn-primary' : 'btn-secondary'"
        @click="switchMethod('bt_signals')"
      >
        bt_signals
      </button>
    </div>
    <h3>標的投報率</h3>
    <div class="mb-3">
      <button 
        class="btn mr-2" 
        :class="sortKey == 'irr' ? 'btn-primary' : 'btn-secondary'" 
        @click="sortBy('irr')"
      >年化報酬率 <i class="fas fa-sort-down"></i></button>
      <button 
        class="btn mr-2" 
        :class="sortKey == 'roi' ? 'btn-primary' : 'btn-secondary'" 
        @click="sortBy('roi')"
      >投報率 <i class="fas fa-sort-down"></i></button>
      <button 
        class="btn mr-2" 
        :class="sortKey == 'asset_value' ? 'btn-primary' : 'btn-secondary'" 
        @click="sortBy('asset_value')"
      >資產價值 <i class="fas fa-sort-down"></i></button>
      <button 
        class="btn mr-2" 
        :class="sortKey == 'position_value' ? 'btn-primary' : 'btn-secondary'" 
        @click="sortBy('position_value')"
      >持倉價值 <i class="fas fa-sort-down"></i></button>
      <button 
        class="btn mr-2" 
        :class="sortKey == 'broker_dividend' ? 'btn-primary' : 'btn-secondary'" 
        @click="sortBy('broker_dividend')"
      >期間配息 <i class="fas fa-sort-down"></i></button>
    </div>

    <div v-if="summaries.length > 0">

      <div class="row">
        <div class="col-md-4 col-sm-6" v-for="record in sortedSummaries">
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
        sortKey: 'irr', // 默認按年化報酬率排序
        method: 'bt_dividend',
      }
    },
    methods: {
      convertRate(real) {
        let rate = parseInt(real * 10000) / 100;
        return `${rate} %`;
      },
      switchMethod(method){
        this.method = method;
        this.getSummary();
      },
      getRecentTransaction() {
        this.recent_transaction_logs = [];
        axios.get(`${prefixURL}${this.$route.params.Market}/recent_transaction_logs.json`).then(function(res) {
          this.recent_transaction_logs = Object.values(res.data);
        }.bind(this));
      },
      getSummary() {
        this.summaries = [];
        axios.get(`${prefixURL}${this.$route.params.Market}/${this.method}/summaries.json`).then(function(res) {
          this.summaries = Object.values(res.data);
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
      this.getRecentTransaction();
      this.getSummary();
    },
    watch: {
        $route(to, from) {
          this.getRecentTransaction()
          this.getSummary();
        },
        //deep: true,
        immediate: true,
    }
  }
  </script>