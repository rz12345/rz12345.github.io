const ComponentBasePath = './js/component';

const routes = [
    
    {
        name: 'itemClass',
        path: '/:ItemClass',
    },
    {
        name: 'itemSubClass',
        path: '/:ItemClass/:ItemSubClass',
    },
    
    {
        name: 'Stat',
        path: '/:ItemClass/:ItemSubClass/:Item',
        component: httpVueLoader(`${ComponentBasePath}/Stat.vue`),
        props: true
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
        Items: [],
        ItemClasses: [],
        Select: {
            ItemClass: null,
            ItemSubClass: null,            
            ItemClassName: null,
            ItemSubClassName: null,
            Item: null,
            ItemName: null,
        },
        SearchItemName: null,
    },
    methods: {
        selectItem(id,name) {
            this.SearchItemName = null;
            this.Select.Item = id;
            this.Select.ItemName = name;            
            gtag('event', 'SelectItem', {
                'Item': name
            });
        },
        selectItemClass(id,name) {
            if(id == this.Select.ItemClass){
                this.Select.ItemClass = null;
                this.Select.ItemClassName = null;
            } else {
                this.Select.ItemClass = id;
                this.Select.ItemClassName = name;
            }            
        },
        selectItemSubClass(id,name) {
            this.Select.ItemSubClass = id;
            this.Select.ItemSubClassName = name;
        },

    },
    mounted: function () {
        // item data initial 
        axios.get(`https://jojocat-poc-default-rtdb.firebaseio.com/wow/item_focus_list.json`).then(function (res) {
            //this.Items = res.data;
            this.Items = Object.values(res.data);            
        }.bind(this));
        axios.get(`https://jojocat-poc-default-rtdb.firebaseio.com/wow/item_class.json`).then(function (res) {
            this.ItemClasses = res.data;
        }.bind(this));

    },
    computed: {
        ItemRecords: function () {
            return this.Items.filter(item => item.item_class_id == this.Select.ItemClass && item.item_subclass_id == this.Select.ItemSubClass);
        },
        SearchItemRecords: function() {
            return this.Items.filter(item=>item.name.includes(this.SearchItemName));
        },
    },
    watch: {
        Select(newVal, oldVal) {
            //console.log(this.Select);
        },
        $route(to, from) {
            //console.log(this.$route.params);

        },
        deep: true,
        immediate: true,
    },
    components: {
        'itemclass': httpVueLoader('./js/component/ItemClass.vue'),
    }
    //
});