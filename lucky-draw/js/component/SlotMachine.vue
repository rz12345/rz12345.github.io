<template>
  <div class="bg-lucky-card rounded-lg border border-lucky-border p-6 shadow-lg">
    <h2 class="text-2xl font-bold text-lucky-gold mb-4 flex items-center gap-2">
      <i class="fas fa-spinner"></i> 抽獎機
    </h2>

    <!-- Slot reel display -->
    <div class="mb-6 bg-lucky-bg rounded-lg p-6 border-2 border-lucky-gold overflow-hidden">
      <div class="text-center">
        <div class="slot-reel-container h-24 flex items-center justify-center relative">
          <div
            class="slot-reel w-full"
            :style="{ transform: `translateY(${reelOffset}px)` }"
            ref="reel"
          >
            <div
              v-for="(item, idx) in reelItems"
              :key="idx"
              class="slot-item h-24 flex items-center justify-center text-lg font-bold text-slate-200 border-b border-lucky-border hover:bg-lucky-surface transition-colors"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="absolute inset-x-0 top-0 bottom-0 pointer-events-none bg-gradient-to-b from-lucky-card/40 via-transparent to-lucky-card/40"></div>
          <div class="absolute left-0 right-0 h-24 top-0 border-t-2 border-b-2 border-lucky-gold pointer-events-none shadow-inner"></div>
        </div>
      </div>
    </div>

    <!-- Result display -->
    <div v-if="lastResult" class="mb-6 text-center">
      <p class="text-sm text-lucky-muted mb-1">中獎結果</p>
      <p class="text-3xl font-bold text-lucky-gold">{{ lastResult.label }}</p>
    </div>

    <!-- Draw button -->
    <div class="mb-6 flex gap-3">
      <button
        @click="handleDraw"
        :disabled="isDrawing || poolSize === 0"
        class="flex-1 bg-lucky-gold hover:bg-amber-500 disabled:bg-lucky-muted disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors text-lg"
      >
        <i class="fas fa-dice-five mr-2"></i>{{ isDrawing ? '轉動中...' : '抽！' }}
      </button>
      <button
        @click="onToggleMode"
        :class="`px-4 py-3 rounded-lg font-medium transition-colors ${drawMode === 'repeat' ? 'bg-lucky-green text-white' : 'bg-lucky-red text-white'}`"
        title="點擊切換抽取模式"
      >
        {{ drawMode === 'repeat' ? '可重' : '不重' }}
      </button>
    </div>

    <!-- Pool info -->
    <div class="mb-4 p-3 bg-lucky-surface rounded-lg border border-lucky-border">
      <p class="text-sm text-lucky-muted">
        <i class="fas fa-list-check mr-2"></i>
        <span v-if="drawMode === 'repeat'">可抽選項：{{ options.length }}</span>
        <span v-else>剩餘選項：{{ poolSize }} / {{ options.length }}</span>
      </p>
      <p v-if="drawMode === 'unique' && poolSize === 0" class="text-sm text-lucky-red mt-2 font-medium">
        <i class="fas fa-check-circle mr-2"></i>已抽完！
        <button @click="onReset" class="ml-2 text-lucky-gold font-bold hover:underline">重置</button>
      </p>
    </div>

    <!-- History -->
    <div v-if="history.length > 0" class="p-3 bg-lucky-surface rounded-lg border border-lucky-border">
      <p class="text-sm font-medium text-slate-300 mb-2">
        <i class="fas fa-history mr-2"></i>最近抽獎
      </p>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <div
          v-for="(item, idx) in history.slice(0, 10)"
          :key="idx"
          class="text-sm text-slate-400 flex justify-between"
        >
          <span>{{ item.label }}</span>
          <span class="text-xs text-lucky-muted">{{ item.timestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    options: Array,
    drawMode: String,
    drawnIds: Array,
    history: Array,
    onToggleMode: Function,
    onReset: Function,
    onDraw: Function,
  },
  data() {
    return {
      isDrawing: false,
      reelOffset: 0,
      reelItems: [],
      lastResult: null,
    };
  },
  computed: {
    poolSize() {
      if (this.drawMode === 'unique') {
        return this.options.filter(o => !this.drawnIds.includes(o.id)).length;
      }
      return this.options.length;
    },
  },
  methods: {
    handleDraw() {
      this.draw();
    },
    draw() {
      if (this.isDrawing || this.poolSize === 0) return;

      this.isDrawing = true;
      this.reelOffset = 0;
      this.lastResult = null;

      const result = this.$parent.drawOnce();
      if (!result) {
        this.isDrawing = false;
        return;
      }

      this.buildReel(result);
      this.animateReel();
    },
    buildReel(winnerOption) {
      const pool = this.$parent.getPool();
      const shuffled = [...pool].sort(() => Math.random() - 0.5);

      // Create a long sequence + winner at end
      const sequence = [];
      for (let i = 0; i < 10; i++) {
        sequence.push(...shuffled);
      }
      sequence.push(winnerOption);

      this.reelItems = sequence;
    },
    animateReel() {
      const itemHeight = 96; // h-24 = 96px
      const itemCount = this.reelItems.length;
      const targetOffset = -(itemCount - 1) * itemHeight;

      const reel = this.$refs.reel;
      if (reel) {
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';

        setTimeout(() => {
          reel.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          reel.style.transform = `translateY(${targetOffset}px)`;
        }, 50);

        setTimeout(() => {
          this.isDrawing = false;
          if (this.reelItems.length > 0) {
            this.lastResult = this.reelItems[this.reelItems.length - 1];
            if (this.onDraw) {
              this.onDraw(this.lastResult);
            }
          }
        }, 3550);
      }
    },
  },
  watch: {
    history: {
      handler(newVal) {
        this.$forceUpdate();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.slot-reel-container {
  perspective: 1000px;
}

.slot-reel {
  transform: translateY(0);
  will-change: transform;
}

.slot-item {
  flex-shrink: 0;
  min-height: 96px;
}
</style>
