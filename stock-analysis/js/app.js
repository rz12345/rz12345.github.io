const ComponentBasePath = './js/component';
const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
const routes = [
    {
        name: 'home',
        path: '/',
        redirect: { name: 'market', params: { Market: 'tw' } },
    },
    {
        name: 'about',
        path: '/about',
        component: httpVueLoader(`${ComponentBasePath}/About.vue`),
    },
    {
        name: 'transaction',
        path: '/:Market/:StockId',
        component: httpVueLoader(`${ComponentBasePath}/Transaction.vue`),        
        props: route => ({
            title: route.params.Market === 'tw' ? '台股' : route.params.Market === 'us' ? '美股' : ''
        }),
    },
    {
        name: 'market',
        path: '/:Market',
        component: httpVueLoader(`${ComponentBasePath}/SharedStockSummary.vue`),
        props: route => ({
            title: route.params.Market === 'tw' ? '台股' : route.params.Market === 'us' ? '美股' : ''
        }),
    },
];

const router = new VueRouter({
    //mode: 'history',
    routes: routes
});

const app = new Vue({
    el: '#app',
    router: router,
    data: {
    },
    methods: {
    },
    mounted: function () {
    },
    computed: {
    },    
    watch: {
        $route(to, from) {
            //console.log(this.$route.params);

        },
        deep: true,
        immediate: true,
    },    
    components: {
        //'home': httpVueLoader('./js/component/Home.vue'),
    }
    //
});