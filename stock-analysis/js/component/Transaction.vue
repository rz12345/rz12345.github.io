<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-100 mb-6 tracking-tight">
      <router-link class="text-sky-400 hover:text-sky-300 transition-colors" :to="{
        params:{Market:this.$route.params.Market},
        name:'market'}">{{ title }}</router-link>
      <span class="text-fin-muted mx-2">/</span>
      <span class="text-slate-200">{{this.$route.params.StockId}}</span>
    </h2>

    <div class="bg-fin-card rounded-xl border border-fin-border p-4 mb-6">
      <canvas id="myChart"></canvas>
    </div>

    <div class="bg-fin-card rounded-xl border border-fin-border overflow-hidden">
      <div class="overflow-auto max-h-[70vh]">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr class="bg-fin-surface border-b border-fin-border">
              <th class="px-4 py-3 text-left text-xs font-semibold text-fin-muted uppercase tracking-wider">代號</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-fin-muted uppercase tracking-wider">日期</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-fin-muted uppercase tracking-wider">方法</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">持倉數</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">持倉價格</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">持倉價值</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">當日收盤價</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">期間配息</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-fin-muted uppercase tracking-wider">資產價值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in transaction_logs"
              class="border-b border-fin-border/50 hover:bg-sky-900/10 transition-colors even:bg-fin-surface/30">
              <td class="px-4 py-3 font-semibold text-slate-200 whitespace-nowrap">{{ record.stock_id }}</td>
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap tabular-nums">{{ record.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs bg-sky-900/30 text-sky-400 border border-sky-800/40 font-medium">
                  {{ methodLabel(record.method) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-slate-400 whitespace-nowrap tabular-nums">{{ record.position_size }}</td>
              <td class="px-4 py-3 text-right text-slate-400 whitespace-nowrap tabular-nums">{{ formatCurrency(record.position_price) }}</td>

              <!-- 持倉價值 + mini bar -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-col items-end gap-1">
                  <span class="text-slate-300 tabular-nums">{{ formatCurrency(record.position_value) }}</span>
                  <div class="w-20 h-1 bg-fin-border rounded-full overflow-hidden">
                    <div class="h-1 bg-sky-500/60 rounded-full" :style="{width: barWidth(record.position_value, maxPositionValue)}"></div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3 text-right text-slate-400 whitespace-nowrap tabular-nums">{{ formatCurrency(record.date_closed_price) }}</td>

              <!-- 期間配息 -->
              <td class="px-4 py-3 text-right whitespace-nowrap tabular-nums font-medium"
                :class="record.broker_dividend > 0 ? 'text-amber-400' : 'text-slate-600'">
                {{ formatCurrency(record.broker_dividend) }}
              </td>

              <!-- 資產價值 + 差額 + mini bar -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-col items-end gap-0.5">
                  <span class="tabular-nums font-semibold"
                    :class="record.asset_value >= record.position_value ? 'text-fin-green' : 'text-fin-red'">
                    {{ formatCurrency(record.asset_value) }}
                  </span>
                  <span class="text-xs tabular-nums"
                    :class="record.asset_value >= record.position_value ? 'text-fin-green/60' : 'text-fin-red/60'">
                    {{ record.asset_value >= record.position_value ? '+' : '' }}{{ formatCurrency(record.asset_value - record.position_value) }}
                  </span>
                  <div class="w-20 h-1 bg-fin-border rounded-full overflow-hidden mt-0.5">
                    <div class="h-1 rounded-full"
                      :class="record.asset_value >= record.position_value ? 'bg-fin-green/60' : 'bg-fin-red/60'"
                      :style="{width: barWidth(record.asset_value, maxAssetValue)}"></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['title'],
  data: function () {
    return {
      LiveChart: '',
      transaction_logs: [],
    }
  },
  computed: {
    method() {
      return this.$route.query.method || 'bt_dividend';
    },
    maxAssetValue() {
      if (!this.transaction_logs.length) return 1;
      return Math.max(...this.transaction_logs.map(r => r.asset_value));
    },
    maxPositionValue() {
      if (!this.transaction_logs.length) return 1;
      return Math.max(...this.transaction_logs.map(r => r.position_value));
    },
  },
  methods: {
    methodLabel(key) {
      const map = {
        bt_dividend:    '除息策略',
        bt_signals:     'MACD 訊號',
        bt_ma_pullback: '均線回測',
      };
      return map[key] || key;
    },
    barWidth(value, max) {
      if (!max) return '0%';
      return Math.round(value / max * 100) + '%';
    },
    loadData() {
      this.transaction_logs = [];
      axios.get(prefixURL + `${this.$route.params.Market}/${this.method}/transaction_logs/${this.$route.params.StockId}.json`).then(function (res) {
        this.transaction_logs = Object.values(res.data);
        this.updateChart();
      }.bind(this));
    },
    drawChart() {
      let ctx = document.getElementById('myChart');
      let live_chart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: '', data: [] }] },
        options: {
          backgroundColor: 'transparent',
          scales: {
            x: {
              ticks: { color: '#4b5563' },
              grid:  { color: '#2a2e39' },
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: { beginAtZero: true, color: '#4b5563' },
              grid:  { color: '#2a2e39' },
            },
          },
          plugins: {
            legend: { labels: { color: '#94a3b8' } },
            datalabels: {
              color: '#94a3b8',
              font: { weight: 'bold', size: 10 },
              anchor: 'center',
              align: 'end',
              offset: 8,
              formatter: function(value, context) {
                return context.dataIndex === context.dataset.data.length - 1 ? value : '';
              }
            }
          },
        },
        plugins: [ChartDataLabels],
      });
      this.LiveChart = live_chart;
    },
    updateChart() {
      this.LiveChart.data.labels = this.transaction_logs.map(r => dayjs(r.date).format("YY-MM-DD"));
      this.LiveChart.data.datasets = [
        {
          type: 'line',
          label: '持倉價值',
          data: this.transaction_logs.map(r => r.position_value),
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          borderColor: 'rgba(56, 189, 248, 0.8)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.3,
        },
        {
          type: 'line',
          label: '資產價值',
          data: this.transaction_logs.map(r => r.asset_value),
          backgroundColor: 'rgba(8, 153, 129, 0.08)',
          borderColor: 'rgba(8, 153, 129, 0.8)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.3,
        },
      ];
      this.LiveChart.update();
    },
    formatCurrency(value) {
      const currency = this.$route.params.Market === 'tw' ? 'NT$' : 'USD$';
      return `${currency} ${Number(value).toLocaleString('en-US')}`;
    },
  },
  mounted: function () {
    this.drawChart();
    this.loadData();
  },
  watch: {
    $route() {
      this.loadData();
    },
  }
}
</script>
