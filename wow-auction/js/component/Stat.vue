<template>
    <div>
        <!-- Loading -->
        <div v-show="!FetchComplete">
            <div class="d-flex align-items-center">
                <strong>Loading...</strong>
                <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
            </div>
        </div>
        <!-- Notice -->
        <div v-show="FetchComplete">{{ NoticeMsg }}</div>
        <div v-show="FetchComplete & AuctionRecords.length > 0">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">{{ ItemClassName }}</li>
                    <li class="breadcrumb-item">{{ ItemSubClassName }}</li>
                    <li class="breadcrumb-item">
                        <a :href="`https://www.wowhead.com/item=${Item}/`" target="_blank">{{ ItemName }}</a>
                    </li>
                </ol>
            </nav>
            <!-- Chart -->
            <canvas id="myChart"></canvas>
            <!-- AuctionRecords -->
            <table class="table">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>最低價</th>
                        <th>最高價</th>
                        <th>中間價</th>
                        <th>貨量</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- reverse sort by date -->
                    <tr v-for="record in PriceRecords.sort((a, b) => new Date(b.date) - new Date(a.date))">
                        <td>{{ record.date }}</td>
                        <td>{{ convertPrice(record.min) }}</td>
                        <td>{{ convertPrice(record.max) }}</td>
                        <td>{{ convertPrice(record.median) }}</td>
                        <td>{{ record.qty }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
const prefixURL = 'https://jojocat-wow-f72a5-default-rtdb.asia-southeast1.firebasedatabase.app';
//const prefixURL = 'https://jojocat-poc-default-rtdb.firebaseio.com/';
module.exports = {
    data: function () {
        return {
            AuctionRecords: [],
            RTAuctionRecords: [],
            LiveChart: '',
            FetchComplete: true,
            NoticeMsg: '',
            ItemName: '',
            ItemClassName: '',
            ItemSubClassName: '',
        }
    },
    props: ['ItemClass', 'ItemSubClass', 'Item', 'ItemRecords'],
    methods: {
        fetchAuctionData(item_id) {
            this.FetchComplete = false;
            this.RTAuctionRecords = []; // 清空一次
            this.AuctionRecords = []; // 清空一次
            // 即時的 auction 資料(4小時更新一次)
            axios.get(prefixURL + `/wow/auction_realtime/${item_id}.json`).then(function (res) {                
                if (res.data != null) {
                    this.RTAuctionRecords = res.data;
                    this.NoticeMsg = '';
                } else {
                    this.NoticeMsg = '查無紀錄';
                }
                this.FetchComplete = true;
                //this.updateChart();
            }.bind(this));
            // 過去28天的 auction 資料
            axios.get(prefixURL + `/wow/auction/${item_id}.json`).then(function (res) {                
                if (res.data != null) {
                    this.AuctionRecords = res.data;
                    this.NoticeMsg = '';
                } else {
                    this.NoticeMsg = '查無紀錄';
                }
                this.FetchComplete = true;
                //this.updateChart();
            }.bind(this));
        },
        /**
         * 用於透過 params 載入頁面時，讀取 item 資訊
         * @param {*} item_id 
         */
        fetchItemInfo(item_id) {
            axios.get(prefixURL+`/wow/item_focus_list/${item_id}.json`).then(function (res) {
                this.ItemName = res.data.name;
                this.ItemClassName = res.data.item_class_name;
                this.ItemSubClassName = res.data.item_subclass_name;
            }.bind(this));
        },
        convertPrice(price) {
            let g = parseInt(price / 10000);
            let s = parseInt((price % 10000) / 100);
            let c = parseInt((price % 10000 % 100));
            return `${g}G ${s}S ${c}C`;
        },
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
                    //responsive: true,
                    //maintainAspectRatio: false,
                    /* 
                    legend: {
                        display: false
                    },
                    */
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                                beginAtZero: true
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            ticks: {
                                beginAtZero: true
                            },
                            // grid line settings                                
                            grid: {
                                drawOnChartArea: false, // only want the grid lines for one axis to show up
                            },

                        },
                        /*
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        */
                    }
                }
            });
            this.LiveChart = live_chart;
        },
        updateChart() {
            this.LiveChart.data.labels = this.PriceRecords.map(record => dayjs(record.date).format("MM-DD"));
            this.LiveChart.data.datasets = [{
                type: 'line',
                label: 'min',
                data: this.PriceRecords.map(record => record.min),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                //yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'max',
                data: this.PriceRecords.map(record => record.max),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                //yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'median',
                data: this.PriceRecords.map(record => record.median),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                //yAxisID: 'y',
            },
            {
                type: 'bar',
                label: 'qty',
                data: this.PriceRecords.map(record => record.qty),
                yAxisID: 'y1',
            }
            ];
            this.LiveChart.update();
        },

    },
    mounted: function () {
        // chart initial
        this.drawChart();
        this.fetchAuctionData(this.$route.params.Item);
        this.fetchItemInfo(this.$route.params.Item);
    },
    computed: {
        NoticeMsg: function () {
            if (this.AuctionRecords.length > 0) {
                this.NoticeMsg = '';
            } else {
                this.NoticeMsg = '查無紀錄';
            }
        },
        // 只會保留每個唯一日期的第一條記錄，重複的日期記錄將被過濾掉。
        PriceRecords: function () {
            const records = this.RTAuctionRecords.concat(this.AuctionRecords).filter(record => record.qty != 0);
            const uniqueRecords = [];
            const seenDates = new Set();

            for (const record of records) {
                if (!seenDates.has(record.date)) {
                    uniqueRecords.push(record);
                    seenDates.add(record.date);
                }
            }

            return uniqueRecords;
        },
    },
    watch: {
        PriceRecords: function (newVal, oldVal) {
            this.updateChart();
        },
        $route(to, from) {
            this.fetchAuctionData(to.params.Item);
            this.fetchItemInfo(to.params.Item);
        },
        deep: true,
        immediate: true,
    }

}
</script>
