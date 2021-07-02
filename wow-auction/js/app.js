var app = new Vue({
    el: '#app',
    data: {
        AuctionRecords:[],
        Items:[],
        Realms:[],
        LiveChart:'',
        Select: {
            ItemClassName:'消耗品',
            ItemSubClassName:'精煉藥劑',
            ItemName:'鬼靈威力精煉藥劑',
            ItemId:'171276',
            RealmId:'980',
        },
        FetchComplete:true,
        NoticeMsg:'',
    },
    methods: {
        selectItem(item_id,item_name) {
            this.Select.ItemId = item_id; 
            this.Select.ItemName = item_name;
            gtag('event', 'Item Click', {
                'event_category': 'Click',
                'event_label': item_name,
                //'value': 500
            });
            this.fetchAuctionData(this.Select.RealmId,item_id);
        },
        convertPrice(price){
            let g = parseInt(price/10000);
            let s = parseInt((price%10000)/100);
            let c = parseInt((price%10000%100));
            return `${g}G ${s}S ${c}C`;
        },
        drawChart(){
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
        updateChart(){
            this.LiveChart.data.labels = this.PriceRecords.map(record=>dayjs(record.datetime).format("MM-DD"));
            this.LiveChart.data.datasets = [
                {
                    type: 'line',
                    label: 'min',
                    data: this.PriceRecords.map(record=>record.min),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                   //yAxisID: 'y',
                },
                {
                    type: 'line',
                    label: 'max',
                    data: this.PriceRecords.map(record=>record.max),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    //yAxisID: 'y',
                },
                {
                    type: 'line',
                    label: 'median',
                    data: this.PriceRecords.map(record=>record.median),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    //yAxisID: 'y',
                },
                {
                    type: 'bar',
                    label: 'qty',
                    data: this.PriceRecords.map(record=>record.qty),
                    yAxisID: 'y1',
                }
            ];
            this.LiveChart.update();
        },
        fetchAuctionData(realm_id,item_id){
            this.FetchComplete = false;
            this.AuctionRecords = []; // 清空一次
            axios.get(`https://wow-auction-7d35e-default-rtdb.firebaseio.com/auction/${realm_id}/${item_id}.json`).then(function(res){
                if(res.data != null){
                    this.AuctionRecords = res.data;
                    this.NoticeMsg = '';
                }else{
                    this.NoticeMsg = '查無紀錄';
                }               
                this.FetchComplete = true;
                this.updateChart();
            }.bind(this));        
        },
    },
    mounted: function(){
        // item & realm data initial 
        axios.get(`https://wow-auction-7d35e-default-rtdb.firebaseio.com/item_focus_list.json`).then(function(res){
            this.Items = res.data;
        }.bind(this));
        axios.get(`https://wow-auction-7d35e-default-rtdb.firebaseio.com/realm_sets.json`).then(function(res){
            this.Realms = res.data;
        }.bind(this));
        // chart initial
        this.drawChart();
        // data initial
        this.fetchAuctionData(this.Select.RealmId,this.Select.ItemId);
    },
    computed: {
        ItemClasses: function(){
            return [...new Set(this.Items.map(item=>item.item_class_name))];
        },
        ItemSubClasses: function(){
            return [...new Set(this.Items.filter(item=>item.item_class_name == this.Select.ItemClassName).map(item=>item.item_subclass_name))];
        },
        ItemRecords: function(){
            return this.Items.filter(item=>item.item_class_name == this.Select.ItemClassName && item.item_subclass_name == this.Select.ItemSubClassName);
        },        
        PriceRecords: function(){
            return this.AuctionRecords.filter(record=>record.item_id == this.Select.ItemId && record.qty != 0);
        },
    },
  });