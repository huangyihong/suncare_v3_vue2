<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <a-locale-provider :locale="locale">
    <a-config-provider>
      <template v-slot:renderEmpty>
        <a-empty>
          <!--<span slot="image"> <img :src="blankImg" alt="空白页"> </span>
          <span slot="description"> 暂无数据 </span>-->
        </a-empty>
      </template>
    <div id="app">
      <!--<navigation>-->
        <router-view/>
      <!--</navigation>-->
    </div>

    </a-config-provider>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  // import enquireScreen from '@/utils/device'

  export default {
    data () {
      return {
        locale: zhCN,
        // blankImg: require('@/assets/image/blank.png')
      }
    },
    beforeMount () {
      let that = this
      /*enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })*/
    }
  }
</script>
<style>
  #app {
   /* position: fixed;
    top: 0;
    left: 0;*/
    width: 100%;
    height: 100%;
    /*min-height: 600px;*/
    min-width: 800px;
  }
  body{
    overflow: auto!important;
  }
  .ant-notification{
    white-space: pre-wrap!important;
  }
</style>