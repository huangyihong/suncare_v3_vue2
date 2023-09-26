<template>
  <home-search v-if="systemCode=='search'"></home-search>
  <home-insight v-else-if="systemCode=='insight'"></home-insight>
  <home-suncare v-else></home-suncare>
</template>

<script>
import homeSearch from '@/pages/homeSearch'
import homeSuncare from '@/pages/homeSuncare'
import homeInsight from '@/pages/homeInsight'
export default {
  components: {
    homeSearch,
    homeSuncare,
    homeInsight,
  },
  data() {
    return {
      systemCode:this.$config.systemCode
    }
  }
}
</script>

<style lang="less">

</style>
