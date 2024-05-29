<!-- USStockSummary.vue -->
<template>
  <shared-stock-summary market="us" title="美股回測"></shared-stock-summary>
</template>

<script>
module.exports = {
  components: {
    'shared-stock-summary': httpVueLoader(`./SharedStockSummary.vue`),
  },
}
</script>