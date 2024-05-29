<!-- TaiwanStockSummary.vue -->
<template>
  <shared-stock-summary market="tw" title="台股回測"></shared-stock-summary>
</template>

<script>
module.exports = {
  components: {
    'shared-stock-summary': httpVueLoader(`./SharedStockSummary.vue`),
  },
}
</script>