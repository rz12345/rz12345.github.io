<!-- SharedStockSummary.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-100 mb-6 tracking-tight">{{ title }}</h2>

    <div v-if="recent_transaction_logs.length > 0">
      <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">近期交易紀錄</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        <div v-for="record in recent_transaction_logs.slice().sort((a, b) => b.irr - a.irr)">
          <div class="bg-fin-card rounded-xl border border-fin-border p-4 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 transition-all">
            <div class="flex justify-between items-start">
              <h5 class="text-base font-bold">
                <router-link class="text-sky-400 hover:text-sky-300 transition-colors" :to="{
                  name: 'transaction',
                  params: { Market: $route.params.Market, StockId: record.stock_id },
                  query: { method: method }
                }">{{ record.stock_id }}</router-link>
              </h5>
              <div class="text-right text-xs text-slate-500">
                {{ record.date }}<br/>
                <span class="text-slate-400">{{ formatCurrency(record.date_closed_price) }}</span>
              </div>
            </div>
            <div class="flex justify-end mt-3">
              <span class="text-xs text-sky-400/70 bg-sky-900/20 border border-sky-800/30 px-2 py-0.5 rounded-full">{{ record.method }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">投資方法</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="method === 'bt_dividend'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-900/30'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="switchMethod('bt_dividend')"
      >bt_dividend</button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="method === 'bt_signals'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-900/30'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="switchMethod('bt_signals')"
      >bt_signals</button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="method === 'bt_ma_pullback'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-900/30'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="switchMethod('bt_ma_pullback')"
      >bt_ma_pullback</button>
    </div>

    <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">標的投報率</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="sortKey == 'irr'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="sortBy('irr')"
      >年化報酬率 <i class="fas fa-sort-down ml-1 opacity-60"></i></button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="sortKey == 'roi'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="sortBy('roi')"
      >投報率 <i class="fas fa-sort-down ml-1 opacity-60"></i></button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="sortKey == 'asset_value'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="sortBy('asset_value')"
      >資產價值 <i class="fas fa-sort-down ml-1 opacity-60"></i></button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="sortKey == 'position_value'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="sortBy('position_value')"
      >持倉價值 <i class="fas fa-sort-down ml-1 opacity-60"></i></button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="sortKey == 'broker_dividend'
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
        @click="sortBy('broker_dividend')"
      >期間配息 <i class="fas fa-sort-down ml-1 opacity-60"></i></button>
    </div>

    <div v-if="summaries.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="record in sortedSummaries">
          <div class="bg-fin-card rounded-xl border border-fin-border p-4 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 transition-all">

            <!-- 卡片頂部：代號 + IRR badge -->
            <div class="flex justify-between items-center mb-1">
              <h5 class="text-lg font-bold">
                <router-link class="text-sky-400 hover:text-sky-300 transition-colors" :to="{
                  name: 'transaction',
                  params: { Market: $route.params.Market, StockId: record.stock_id },
                  query: { method: method }
                }">{{ record.stock_id }}</router-link>
              </h5>
              <span class="text-xs font-bold tabular-nums px-2 py-1 rounded border"
                :class="record.irr >= 0
                  ? 'bg-fin-green/10 text-fin-green border-fin-green/30'
                  : 'bg-fin-red/10 text-fin-red border-fin-red/30'">
                {{ record.irr >= 0 ? '▲' : '▼' }} {{ convertRate(record.irr) }}
              </span>
            </div>
            <div class="text-xs text-slate-500 mb-3">{{ record.date }} · 收盤 {{ formatCurrency(record.close) }}</div>

            <!-- 數據列 -->
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-slate-500">年化報酬率</span>
                <span class="font-semibold tabular-nums"
                  :class="record.irr >= 0 ? 'text-fin-green' : 'text-fin-red'">
                  {{ convertRate(record.irr) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">投報率</span>
                <span class="font-medium tabular-nums"
                  :class="record.roi >= 0 ? 'text-fin-green' : 'text-fin-red'">
                  {{ convertRate(record.roi) }}
                </span>
              </div>
              <div class="h-px bg-fin-border my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">資產價值</span>
                <span class="font-medium tabular-nums text-slate-300">{{ formatCurrency(record.asset_value) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">持倉價值</span>
                <span class="tabular-nums text-slate-400">{{ formatCurrency(record.position_value) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">期間配息</span>
                <span class="tabular-nums"
                  :class="record.broker_dividend > 0 ? 'text-amber-400' : 'text-slate-600'">
                  {{ formatCurrency(record.broker_dividend) }}
                </span>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <span class="text-xs text-sky-400/70 bg-sky-900/20 border border-sky-800/30 px-2 py-0.5 rounded-full">{{ record.method }}</span>
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
      sortKey: 'irr',
      method: 'bt_dividend',
    }
  },
  methods: {
    convertRate(real) {
      const rate = (parseInt(real * 10000) / 100).toFixed(2);
      const sign = real >= 0 ? '+' : '';
      return `${sign}${rate}%`;
    },
    switchMethod(method) {
      this.method = method;
      this.getSummary();
    },
    getRecentTransaction() {
      this.recent_transaction_logs = [];
      axios.get(`${prefixURL}${this.$route.params.Market}/recent_transaction_logs.json`).then(function(res) {
        this.recent_transaction_logs = Object.values(res.data);
        if (this.recent_transaction_logs.length > 0) {
          this.$root.lastUpdated = this.recent_transaction_logs
            .map(r => r.date).sort().pop();
        }
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
      const formatted = Number(value).toLocaleString('en-US');
      return `${currency} ${formatted}`;
    },
  },
  computed: {
    sortedSummaries: function() {
      return this.summaries.slice().sort((a, b) => b[this.sortKey] - a[this.sortKey]);
    },
  },
  mounted: function() {
    this.getRecentTransaction();
    this.getSummary();
  },
  watch: {
    $route(to, from) {
      this.getRecentTransaction();
      this.getSummary();
    },
    immediate: true,
  }
}
</script>
