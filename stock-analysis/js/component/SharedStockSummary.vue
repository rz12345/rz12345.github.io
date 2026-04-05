<!-- SharedStockSummary.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-100 mb-6 tracking-tight">{{ title }}</h2>

    <!-- 主版面：左 70% + 右 30% -->
    <div class="flex gap-6 items-start">

      <!-- 左側主區塊 -->
      <div style="flex: 0 0 80%; min-width: 0;">

        <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">投資方法</h3>
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="m in methods"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="method === m.key
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-900/30'
              : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
            @click="switchMethod(m.key)"
          >{{ m.label }}</button>
        </div>

        <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">排序依據</h3>
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="s in sortOptions"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="sortKey == s.key
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
              : 'bg-fin-card text-slate-500 border border-fin-border hover:border-slate-500 hover:text-slate-300'"
            @click="sortBy(s.key)"
          >{{ s.label }} <i :class="['fas ml-1 opacity-60', sortKey == s.key ? (sortDir === 'desc' ? 'fa-sort-down' : 'fa-sort-up') : 'fa-sort']"></i></button>
        </div>

        <!-- 載入骨架屏 -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="i in 6" class="bg-fin-card rounded-xl border border-fin-border p-4 animate-pulse h-44"></div>
        </div>

        <!-- 空資料提示 -->
        <div v-else-if="summaries.length === 0" class="text-center py-16 text-slate-500">
          <i class="fas fa-inbox text-3xl mb-3 block opacity-40"></i>
          此策略目前無資料
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="record in sortedSummaries">
              <div class="bg-fin-card rounded-xl border border-fin-border p-4 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 transition-all overflow-hidden"
                :style="{ borderLeft: '4px solid ' + (record.irr >= 0 ? '#089981' : '#f23645') }">

                <!-- 卡片頂部：代號 + IRR badge -->
                <div class="flex justify-between items-center mb-1">
                  <h5 class="text-lg font-bold">
                    <router-link class="text-sky-400 hover:text-sky-300 transition-colors" :to="{
                      name: 'transaction',
                      params: { Market: $route.params.Market, StockId: record.stock_id },
                      query: { method: method }
                    }">{{ record.stock_id }}</router-link>
                  </h5>
                  <div class="text-right">
                    <div class="text-xs text-slate-400">{{ record.date }}</div>
                    <div class="text-xs text-slate-400">{{ formatCurrency(record.close) }}</div>
                  </div>
                </div>

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

      <!-- 右側近期交易紀錄 20% -->
      <div style="flex: 0 0 20%; min-width: 0;">
        <h3 class="text-xs font-semibold text-fin-muted uppercase tracking-widest mb-3">近期交易紀錄</h3>
        <div v-if="recent_transaction_logs.filter(r => r.method === method).length === 0"
          class="bg-fin-card rounded-lg border border-fin-border px-3 py-6 text-center text-slate-500">
          <i class="fas fa-clock text-2xl mb-2 block opacity-30"></i>
          <span class="text-xs">尚無近期交易</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="record in recent_transaction_logs.filter(r => r.method === method).slice().sort((a, b) => b.irr - a.irr)">
            <router-link :to="{
              name: 'transaction',
              params: { Market: $route.params.Market, StockId: record.stock_id },
              query: { method: method }
            }" class="block bg-fin-card rounded-lg border border-fin-border px-3 py-2.5 hover:border-sky-500/40 transition-all overflow-hidden"
              :style="{ borderLeft: '3px solid ' + (record.irr >= 0 ? '#089981' : '#f23645') }">
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-sm font-bold text-sky-400">{{ record.stock_id }}</span>
                  <span class="text-xs text-slate-500 ml-2">{{ record.date }}</span>
                </div>
                <span v-if="record.irr !== undefined"
                  class="text-xs font-bold tabular-nums"
                  :class="record.irr >= 0 ? 'text-fin-green' : 'text-fin-red'">
                  {{ record.irr >= 0 ? '▲' : '▼' }} {{ convertRate(record.irr) }}
                </span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-sky-400/60 bg-sky-900/20 border border-sky-800/30 px-1.5 py-0.5 rounded-full">{{ record.method }}</span>
                <span class="text-xs text-slate-500">{{ formatCurrency(record.date_closed_price) }}</span>
              </div>
            </router-link>
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
      sortDir: 'desc',
      isLoading: false,
      methods: [
        { key: 'bt_dividend', label: '除息策略' },
        { key: 'bt_signals',  label: 'MACD 訊號' },
      ],
      sortOptions: [
        { key: 'irr',            label: '年化報酬率' },
        { key: 'roi',            label: '投報率' },
        { key: 'asset_value',    label: '資產價值' },
        { key: 'position_value', label: '持倉價值' },
        { key: 'broker_dividend', label: '期間配息' },
      ],
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
      this.isLoading = true;
      axios.get(`${prefixURL}${this.$route.params.Market}/${this.method}/summaries.json`).then(function(res) {
        this.summaries = Object.values(res.data);
        this.isLoading = false;
      }.bind(this)).catch(function() {
        this.isLoading = false;
      }.bind(this));
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        this.sortKey = key;
        this.sortDir = 'desc';
      }
    },
    formatCurrency(value) {
      const currency = this.$route.params.Market === 'tw' ? 'NT$' : 'USD$';
      const formatted = Number(value).toLocaleString('en-US');
      return `${currency} ${formatted}`;
    },
  },
  computed: {
    sortedSummaries: function() {
      return this.summaries.slice().sort((a, b) =>
        this.sortDir === 'desc' ? b[this.sortKey] - a[this.sortKey] : a[this.sortKey] - b[this.sortKey]
      );
    },
    avgIrr: function() {
      if (this.summaries.length === 0) return 0;
      return this.summaries.reduce((sum, r) => sum + r.irr, 0) / this.summaries.length;
    },
    profitCount: function() {
      return this.summaries.filter(r => r.irr >= 0).length;
    },
    lossCount: function() {
      return this.summaries.filter(r => r.irr < 0).length;
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
