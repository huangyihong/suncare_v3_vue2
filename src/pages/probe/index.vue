<template>
  <div>
    <!--导航区域-->
   <!-- <div>
      <a-tabs :tabBarStyle="{margin: 0}" @change="tabs.callback" :activeKey="tabs.active()">
        <a-tab-pane v-for="(item,index) in tabs.items" :tab="item" :key="index"></a-tab-pane>
      </a-tabs>
    </div>-->
    <router-view />
  </div>
</template>

<script>
  // import RouteView from "@/components/layouts/RouteView"

  export default {
    name: "index",
    components: {
      // RouteView
    },
    data () {
      return {
        tabs: {
          items: ['模型探查','模型归纳'],
          itemUrls: ['/search/flowchart',''],
          active: () => {
            return this.tabs.itemUrls.indexOf(this.$route.path)
          },
          callback: (key) => {
            console.log(key,this.tabs.items[key])
            this.$router.push(this.tabs.itemUrls[key])
          }
        },
      }
    },
    methods: {
    }
  }
</script>
<style scoped>

</style>