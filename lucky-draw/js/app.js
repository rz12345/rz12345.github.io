const ComponentBasePath = './js/component';

const router = new VueRouter({
  routes: []
});

const app = new Vue({
  el: '#app',
  router: router,
  data: {
    options: [],
    drawMode: 'repeat', // 'repeat' | 'unique'
    drawnIds: [],
    history: [],
    error: null,
  },
  methods: {
    loadState() {
      const saved = localStorage.getItem('lucky_draw_config');
      if (saved) {
        try {
          const config = JSON.parse(saved);
          if (config.options && Array.isArray(config.options)) {
            this.options = config.options;
            this.drawMode = config.drawMode || 'repeat';
            this.drawnIds = config.drawnIds || [];
          }
        } catch (e) {
          console.error('Failed to load config:', e);
        }
      }
    },
    saveState() {
      const config = {
        options: this.options,
        drawMode: this.drawMode,
        drawnIds: this.drawnIds,
      };
      localStorage.setItem('lucky_draw_config', JSON.stringify(config));
    },
    getPool() {
      if (this.drawMode === 'unique') {
        return this.options.filter(o => !this.drawnIds.includes(o.id));
      }
      return this.options;
    },
    drawOnce() {
      const pool = this.getPool();
      if (pool.length === 0) {
        return null;
      }

      const totalWeight = pool.reduce((s, o) => s + o.weight, 0);
      let r = Math.random() * totalWeight;

      for (let option of pool) {
        r -= option.weight;
        if (r <= 0) {
          if (this.drawMode === 'unique' && !this.drawnIds.includes(option.id)) {
            this.drawnIds = [...this.drawnIds, option.id];
          }
          return option;
        }
      }

      return pool[pool.length - 1];
    },
    handleDraw(result) {
      if (result) {
        this.history = [{
          id: result.id,
          label: result.label,
          timestamp: new Date().toLocaleTimeString('zh-TW'),
        }, ...this.history.slice(0, 99)];
        this.saveState();
      }
    },
    toggleMode() {
      this.drawMode = this.drawMode === 'repeat' ? 'unique' : 'repeat';
      this.drawnIds = [];
      this.history = [];
      this.saveState();
    },
    resetDrawn() {
      this.drawnIds = [];
      this.history = [];
      this.saveState();
    },
    updateOptions(newOptions) {
      this.options = newOptions;
      this.saveState();
    },
    loadDemo() {
      this.options = JSON.parse(JSON.stringify(LUCKY_DRAW_DEMO.options));
      this.drawnIds = [];
      this.history = [];
      this.drawMode = 'repeat';
      this.saveState();
    },
    exportConfig() {
      const config = {
        options: this.options,
        drawMode: this.drawMode,
      };
      const json = JSON.stringify(config, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lucky-draw-config.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    importConfig(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          if (!config.options || !Array.isArray(config.options)) {
            throw new Error('選項格式錯誤');
          }
          for (let opt of config.options) {
            if (!opt.label || typeof opt.label !== 'string' || opt.label.trim() === '') {
              throw new Error('每個選項須有非空的 label');
            }
            if (typeof opt.weight !== 'number' || opt.weight <= 0) {
              throw new Error('每個選項的 weight 須為正數');
            }
          }
          this.options = config.options;
          this.drawMode = config.drawMode || 'repeat';
          this.drawnIds = [];
          this.history = [];
          this.error = null;
          this.saveState();
        } catch (err) {
          this.error = `匯入失敗：${err.message}`;
          setTimeout(() => { this.error = null; }, 3000);
        }
      };
      reader.readAsText(file);
    },
  },
  computed: {
    poolSize() {
      return this.getPool().length;
    },
  },
  mounted() {
    this.loadState();
    router.afterEach((to, from) => {
      gtag('event', 'page_view', {
        'send_to': 'G-TJWWQVVMP3',
        'page_path': to.fullPath
      });
    });
  },
  components: {
    'slot-machine': httpVueLoader(`${ComponentBasePath}/SlotMachine.vue`),
    'option-editor': httpVueLoader(`${ComponentBasePath}/OptionEditor.vue`),
  }
});
