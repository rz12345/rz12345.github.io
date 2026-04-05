<template>
    <div>
        <!-- Loading -->
        <div v-show="!FetchComplete" class="flex items-center gap-3 py-8">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-wow-gold border-t-transparent"></div>
            <span class="text-wow-text-dim text-sm">載入中...</span>
        </div>

        <!-- Notice -->
        <div v-show="FetchComplete && NoticeMsg"
            class="text-wow-text-dim italic text-center py-10">{{ NoticeMsg }}</div>

        <!-- Content -->
        <div v-show="FetchComplete && AuctionRecords.length > 0">

            <!-- Breadcrumb -->
            <nav class="mb-4">
                <ol class="flex items-center gap-1.5 text-sm bg-wow-panel border border-wow-border rounded px-3 py-2">
                    <li class="text-wow-text-dim">{{ ItemClassName }}</li>
                    <li class="text-wow-border text-xs select-none">/</li>
                    <li class="text-wow-text-dim">{{ ItemSubClassName }}</li>
                    <li class="text-wow-border text-xs select-none">/</li>
                    <li class="flex items-center gap-1.5">
                        <a :href="`https://www.wowhead.com/item=${Item}/`" target="_blank"
                            class="text-wow-link hover:text-wow-link-hov no-underline">{{ ItemName }}</a>
                        <button
                            @click="$parent.toggleFavorite({id:Item, name:ItemName, item_class_id:ItemClass, item_subclass_id:ItemSubClass})"
                            class="text-sm leading-none transition-colors"
                            :class="$parent.isFavorite(Item) ? 'text-yellow-400 hover:text-gray-400' : 'text-wow-text-dim hover:text-yellow-300'"
                            :title="$parent.isFavorite(Item) ? '移除收藏' : '加入收藏'">
                            {{ $parent.isFavorite(Item) ? '★' : '☆' }}
                        </button>
                    </li>
                </ol>
            </nav>

            <!-- Summary Cards -->
            <div class="grid grid-cols-3 gap-3 mb-4" v-if="PriceRecords.length > 0">
                <div class="bg-wow-panel border border-wow-border rounded p-3 text-center">
                    <div class="text-wow-text-dim text-xs uppercase tracking-wider mb-1">最低價</div>
                    <div class="text-base" v-html="convertPrice(LatestRecord.min)"></div>
                </div>
                <div class="bg-wow-panel border border-wow-border rounded p-3 text-center">
                    <div class="text-wow-text-dim text-xs uppercase tracking-wider mb-1">中間價</div>
                    <div class="text-base" v-html="convertPrice(LatestRecord.median)"></div>
                </div>
                <div class="bg-wow-panel border border-wow-border rounded p-3 text-center">
                    <div class="text-wow-text-dim text-xs uppercase tracking-wider mb-1">最高價</div>
                    <div class="text-base" v-html="convertPrice(LatestRecord.max)"></div>
                </div>
            </div>

            <!-- Chart -->
            <canvas id="myChart"
                class="w-full rounded border border-wow-border bg-wow-panel p-2 mb-4"></canvas>

            <!-- Price Table -->
            <table class="price-table w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-wow-nav border-b border-wow-border">
                        <th class="text-left px-3 py-2.5 text-wow-gold text-xs font-semibold uppercase tracking-wider">日期</th>
                        <th class="text-left px-3 py-2.5 text-wow-gold text-xs font-semibold uppercase tracking-wider">最低價</th>
                        <th class="text-left px-3 py-2.5 text-wow-gold text-xs font-semibold uppercase tracking-wider">最高價</th>
                        <th class="text-left px-3 py-2.5 text-wow-gold text-xs font-semibold uppercase tracking-wider">中間價</th>
                        <th class="text-left px-3 py-2.5 text-wow-gold text-xs font-semibold uppercase tracking-wider">貨量</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="record in PriceRecords.sort((a, b) => new Date(b.date) - new Date(a.date))"
                        class="border-b border-wow-border odd:bg-wow-panel even:bg-wow-panel-alt transition-colors duration-75">
                        <td class="px-3 py-2.5 text-wow-text-dim">{{ record.date }}</td>
                        <td class="px-3 py-2.5" v-html="convertPrice(record.min)"></td>
                        <td class="px-3 py-2.5" v-html="convertPrice(record.max)"></td>
                        <td class="px-3 py-2.5" v-html="convertPrice(record.median)"></td>
                        <td class="px-3 py-2.5 text-wow-text-dim">{{ record.qty }}</td>
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
            const g = parseInt(price / 10000);
            const s = parseInt((price % 10000) / 100);
            const c = parseInt(price % 100);
            return `<span class="price-gold">${g}G</span> <span class="price-silver">${s}S</span> <span class="price-copper">${c}C</span>`;
        },
        drawChart() {
            const tickColor = '#7a7e8a';
            const gridColor = '#35383d';
            let ctx = document.getElementById('myChart');
            let live_chart = new Chart(ctx, {
                type: 'line',
                data: { labels: [], datasets: [{ label: '', data: [] }] },
                options: {
                    plugins: {
                        legend: {
                            labels: { color: '#b8bdc8', boxWidth: 12 }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: tickColor },
                            grid: { color: gridColor }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: { color: tickColor, beginAtZero: true },
                            grid: { color: gridColor }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            ticks: { color: tickColor, beginAtZero: true },
                            grid: { drawOnChartArea: false }
                        },
                    }
                }
            });
            this.LiveChart = live_chart;
        },
        updateChart() {
            this.LiveChart.data.labels = this.PriceRecords.map(record => dayjs(record.date).format("MM-DD"));
            this.LiveChart.data.datasets = [{
                type: 'line',
                label: '最低價',
                data: this.PriceRecords.map(record => record.min),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                type: 'line',
                label: '最高價',
                data: this.PriceRecords.map(record => record.max),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
            {
                type: 'line',
                label: '中間價',
                data: this.PriceRecords.map(record => record.median),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
                type: 'bar',
                label: '貨量',
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
        LatestRecord: function () {
            if (this.PriceRecords.length === 0) return { min: 0, max: 0, median: 0 };
            return this.PriceRecords.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];
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
