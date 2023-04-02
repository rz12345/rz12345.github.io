var app = new Vue({
    el: '#app',
    data: {
        TargetPrices:[],
        BackTradeRecords:[],
        Select:{
            ItemName: 'BackTradeRecords'

        },
        FetchComplete:false,
        NoticeMsg:'',
    },
    methods: {

    },
    mounted: function(){
        // item & realm data initial 
        axios.get(`https://invest-8738f-default-rtdb.firebaseio.com/tw-stock/bt.json`).then(function(res){
            this.BackTradeRecords = res.data.sort( (a,b) => b.irr - a.irr);
        }.bind(this));        
        axios.get(`https://invest-8738f-default-rtdb.firebaseio.com/utw-stock/target_prices.json`).then(function(res){
            this.TargetPrices = res.data.sort((a,b)=>a.last - a.target_price);
        }.bind(this));
        
    },
    computed: {

    },
  });