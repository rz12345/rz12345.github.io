<template>
  <div class="bg-lucky-card rounded-lg border border-lucky-border p-6 shadow-lg sticky top-24">
    <h2 class="text-2xl font-bold text-lucky-gold mb-4 flex items-center gap-2">
      <i class="fas fa-sliders-h"></i> 設定選項
    </h2>

    <!-- Demo button -->
    <button
      @click="onLoadDemo"
      class="w-full mb-4 bg-lucky-green hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors"
    >
      <i class="fas fa-flask-vial mr-2"></i>載入示範題組
    </button>

    <!-- Import/Export -->
    <div class="flex gap-2 mb-4">
      <label class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg cursor-pointer transition-colors text-center">
        <i class="fas fa-download mr-2"></i>匯入
        <input
          type="file"
          accept=".json"
          @change="handleFileImport"
          class="hidden"
        />
      </label>
      <button
        @click="onExport"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors"
      >
        <i class="fas fa-upload mr-2"></i>匯出
      </button>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="mb-4 p-3 bg-lucky-red/20 border border-lucky-red text-lucky-red rounded-lg text-sm"
    >
      {{ error }}
    </div>

    <!-- Options list -->
    <div class="mb-4 bg-lucky-surface rounded-lg border border-lucky-border overflow-hidden">
      <div v-if="localOptions.length === 0" class="p-4 text-center text-lucky-muted">
        尚無選項，請新增或載入示範
      </div>
      <div v-else class="divide-y divide-lucky-border max-h-96 overflow-y-auto">
        <div
          v-for="(option, idx) in localOptions"
          :key="option.id"
          class="p-3 hover:bg-lucky-bg/50 transition-colors"
        >
          <div class="flex gap-2 items-start mb-2">
            <div class="flex-1">
              <input
                v-model="option.label"
                @change="emitUpdate"
                type="text"
                placeholder="選項名稱"
                class="w-full bg-lucky-bg border border-lucky-border rounded px-2 py-1 text-sm text-slate-200 placeholder-lucky-muted focus:outline-none focus:border-lucky-gold"
              />
            </div>
            <button
              @click="removeOption(idx)"
              class="text-lucky-red hover:text-red-400 transition-colors px-2"
              title="刪除"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="flex gap-2 items-center text-xs">
            <div class="flex-1 flex items-center">
              <label class="text-lucky-muted mr-2">權重：</label>
              <input
                v-model.number="option.weight"
                @change="validateWeight(option); emitUpdate()"
                type="number"
                min="0.1"
                step="0.1"
                class="flex-1 bg-lucky-bg border border-lucky-border rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-lucky-gold"
              />
            </div>
            <div class="text-lucky-gold font-medium">{{ percent(option) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add new option -->
    <button
      @click="addOption"
      class="w-full bg-lucky-surface hover:bg-lucky-card border-2 border-dashed border-lucky-border hover:border-lucky-gold text-lucky-gold font-medium py-2 rounded-lg transition-colors"
    >
      <i class="fas fa-plus mr-2"></i>新增選項
    </button>

    <!-- Total weight info -->
    <div v-if="localOptions.length > 0" class="mt-4 p-3 bg-lucky-bg rounded-lg border border-lucky-border">
      <p class="text-xs text-lucky-muted mb-1">總權重：{{ totalWeight }}</p>
      <div class="w-full bg-lucky-border rounded-full h-2 overflow-hidden">
        <div class="bg-lucky-gold h-full" style="width: 100%;"></div>
      </div>
      <p class="text-xs text-slate-300 mt-1">已配置 {{ localOptions.length }} 項</p>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    options: Array,
    onLoadDemo: Function,
    onExport: Function,
    onImport: Function,
    onUpdate: Function,
  },
  data() {
    return {
      localOptions: [],
      error: null,
    };
  },
  computed: {
    totalWeight() {
      return this.localOptions.reduce((s, o) => s + (o.weight || 1), 0);
    },
  },
  methods: {
    handleFileImport(event) {
      const file = event.target.files[0];
      if (file && this.onImport) {
        this.onImport(file);
      }
      event.target.value = '';
    },
    percent(option) {
      if (this.totalWeight === 0) return '0';
      return ((option.weight / this.totalWeight) * 100).toFixed(2);
    },
    validateWeight(option) {
      if (!option.weight || option.weight <= 0) {
        option.weight = 1;
      }
    },
    addOption() {
      this.localOptions = [
        ...this.localOptions,
        {
          id: `opt-${Date.now()}-${Math.random()}`,
          label: '',
          weight: 1,
        }
      ];
    },
    removeOption(idx) {
      this.localOptions = this.localOptions.filter((_, i) => i !== idx);
      this.emitUpdate();
    },
    emitUpdate() {
      const valid = this.localOptions.every(o => o.label.trim() !== '' && o.weight > 0);
      if (valid && this.onUpdate) {
        this.onUpdate(this.localOptions);
      }
    },
  },
  watch: {
    options: {
      handler(newVal) {
        this.localOptions = JSON.parse(JSON.stringify(newVal || []));
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
