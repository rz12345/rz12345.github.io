<template>
    <div>
        <h2><router-link :to="{name:'home'}" >首頁</router-link> / {{this.$route.params.Market.toUpperCase()}} /  {{this.$route.params.StockId}} 交易紀錄</h2>
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
            transaction_logs: [],
        }
    },
    props: ['Market', 'StockId'],
    methods: {

    },
    mounted: function () {
        // /tw/best_transaction_logs/0050.json
        axios.get(prefixURL+`/${this.$route.params.Market}/best_transaction_logs/${this.$route.params.StockId}.json`).then(function (res) {
            this.transaction_logs = Object.values(res.data);            
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
