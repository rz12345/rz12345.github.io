const ComponentBasePath = './js/component';
const prefixURL = 'https://jojocat-stock-analysis-default-rtdb.asia-southeast1.firebasedatabase.app/';
const routes = [
    {
        name: 'transaction',
        path: '/:Market/:StockId',
        component: httpVueLoader(`${ComponentBasePath}/Transaction.vue`),
    },
    {
        name: 'home',
        path: '/',
        component: httpVueLoader(`${ComponentBasePath}/Home.vue`),
        //props: true
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