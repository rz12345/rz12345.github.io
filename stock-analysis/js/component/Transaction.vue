<template>
    <div>
        <h2>
            <router-link class="p-2 text-dark" :to="{
                params:{Market:this.$route.params.Market},
                name:'market'}">{{ title }}</router-link> / {{this.$route.params.StockId}}
        </h2>
        <div class="card shadow mb-4">
            <div class="card-body">
                <canvas id="myChart"></canvas>
            </div>
        </div>
        <div class="card shadow">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
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
                                <td>{{ formatCurrency(record.position_price) }}</td>
                                <td>{{ formatCurrency(record.position_value) }}</td>
                                <td>{{ formatCurrency(record.date_closed_price) }}</td>
                                <td>{{ formatCurrency(record.broker_dividend) }}</td>
                                <td>{{ formatCurrency(record.asset_value) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
module.exports = {
    props: ['title'],
    data: function () {
        return {
            LiveChart:'',
            transaction_logs: [],
        }
    },
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
                    },
                    plugins: {
                        datalabels: {
                        color: 'black',
                        font: {weight: 'bold'},
                        anchor: 'center',    //錨點放在中間
                        align: 'end',      //對齊尾端
                        offset: 8,             //往中間遠離8px
                        formatter: function(value, context) {
                            if (context.dataIndex === context.dataset.data.length - 1) {
                                return value;
                            } else {
                                return '';
                            }
                            }
                        }
                    },
                },
                plugins: [ChartDataLabels],
                
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
        formatCurrency(value) {
            const currency = this.$route.params.Market === 'tw' ? 'NT$' : 'USD$';
            return `${currency} ${value}`;
        },

    },
    mounted: function () {
        this.drawChart();

        axios.get(prefixURL+`${this.$route.params.Market}/best_transaction_logs/${this.$route.params.StockId}.json`).then(function (res) {
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
