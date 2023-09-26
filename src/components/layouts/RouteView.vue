<template>
  <!--<keep-alive    v-if="keepAlive">-->
    <!--<router-view  />-->
  <!--</keep-alive  >-->
    <!--<router-view v-else/>-->
  <!--<global-keep-alive>-->
    <router-view/>
  <!--</global-keep-alive>-->

  <!--<router-view v-if="!keepAlive" />-->
</template>

<script>
  export default {
    name: "RouteView",
    computed: {
      keepAlive () {
        return this.$route.meta.keepAlive || this.$store.state.app.multipage
        // return false
      },
    },
  }
</script>
