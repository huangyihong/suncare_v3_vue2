<template>
  <login-search v-if="systemCode=='search'"></login-search>
  <login-insight v-else-if="systemCode=='insight'"></login-insight>
  <login-suncare  v-else></login-suncare>

</template>

<script>
import loginSearch from '@/pages/user/loginSearch'
import loginSuncare from '@/pages/user/loginSuncare'
import loginInsight from '@/pages/user/loginInsight'
export default {
  components: {
    loginSearch,
    loginSuncare,
    loginInsight
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
