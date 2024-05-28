<template>
    <div>
        <h2><router-link :to="{name:'home'}" >首頁</router-link> / {{this.$route.params.Market.toUpperCase()}} /  {{this.$route.params.StockId}} 交易紀錄</h2>
            <!-- Chart -->
            <canvas id="myChart"></canvas>
          <table class="table">
            <thead>
                <tr>
                    <th>代號</th>
                    <th>日期</th>
                    <th>方法</th>
                    <th>持倉數</th>
                    <th>持倉價格</th>
                    <th>持倉價值</th>
                    <th>當日收盤價</th>
                    <th>期間配息</th>
                    <th>資產價值</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in transaction_logs">
                    <td>{{ record.stock_id }}</td>
                    <td>{{ record.date }}</td>
                    <td>{{ record.method }}</td>
                    <td>{{ record.position_size }}</td>
                    <td>{{ record.position_price }}</td>
                    <td>{{ record.position_value }}</td>
                    <td>{{ record.date_closed_price }}</td>
                    <td>{{ record.broker_dividend }}</td>
                    <td>{{ record.asset_value }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
module.exports = {
    data: function () {
        return {
            LiveChart:'',
            transaction_logs: [],
        }
    },
    props: ['Market', 'StockId'],
    methods: {
        drawChart() {
            let ctx = document.getElementById('myChart');
            let live_chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '',
                        data: [],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                                beginAtZero: true
                            }
                        },
                    }
                }
            });
            this.LiveChart = live_chart;
        },
        updateChart() { // transaction_logs
            this.LiveChart.data.labels = this.transaction_logs.map(record => dayjs(record.date).format("YY-MM-DD"));
            this.LiveChart.data.datasets = [{
                type: 'line',
                label: '持倉價值',
                data: this.transaction_logs.map(record => record.position_value),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                //yAxisID: 'y',
            },
            {
                type: 'line',
                label: '資產價值',
                data: this.transaction_logs.map(record => record.asset_value),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                //yAxisID: 'y',
            },
            ];
            this.LiveChart.update();
        },

    },
    mounted: function () {
        this.drawChart();

        axios.get(prefixURL+`/${this.$route.params.Market}/best_transaction_logs/${this.$route.params.StockId}.json`).then(function (res) {
            this.transaction_logs = Object.values(res.data);
            this.updateChart();
        }.bind(this));
    },
    computed: {

    },
    watch: {
        $route(to, from) {
        },
        deep: true,
        immediate: true,
    }

}
</script>
