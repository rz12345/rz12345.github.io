const ComponentBasePath = './js/component';
const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
const routes = [
    {
        name: 'transaction',
        path: '/:Market/:StockId',
        component: httpVueLoader(`${ComponentBasePath}/Transaction.vue`),
    },
    {
        name: 'tw',
        path: '/:Market',
        component: httpVueLoader(`${ComponentBasePath}/TW.vue`),
    },
    {
        name: 'us',
        path: '/:Market',
        component: httpVueLoader(`${ComponentBasePath}/US.vue`),
    },
    {
        name: 'about',
        path: '/about',
        component: httpVueLoader(`${ComponentBasePath}/About.vue`),
    },
    {
        name: 'home',
        path: '/',
        component: httpVueLoader(`${ComponentBasePath}/TW.vue`),
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