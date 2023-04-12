var app = new Vue({
    el: '#app',
    data: {
        TargetPrices:[],
        BackTradeRecords:[],
        StockLogs:{},
        Select:{
            ItemName: 'BackTradeRecords'

        },
        FetchComplete:false,
        NoticeMsg:'',
    },
    methods: {
        getStockLogs: function(stock_code) {            
            axios.get(`https://invest-8738f-default-rtdb.firebaseio.com/tw-stock/logs/${stock_code}.json`).then(function(res){
                Vue.set(this.StockLogs, stock_code, res.data);                
            }.bind(this)); 
        }
    },
    filters: {
        dateFormat: function(value) {
            let result =  new Date(value).toString("yyyy/MM/dd");
            return result;
        }
    },
    mounted: function(){
        // item & realm data initial 
        axios.get(`https://invest-8738f-default-rtdb.firebaseio.com/tw-stock/bt.json`).then(function(res){
            this.BackTradeRecords = res.data.sort( (a,b) => b.irr - a.irr);
        }.bind(this));        
        axios.get(`https://invest-8738f-default-rtdb.firebaseio.com/tw-stock/target_prices.json`).then(function(res){
            this.TargetPrices = res.data.sort((a,b)=>(a.last - a.target_price)/a.last - (b.last - b.target_price)/b.last);
        }.bind(this));
        
    },
    computed: {

    },
  });