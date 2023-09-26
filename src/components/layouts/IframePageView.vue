<template>
  <a-spin :spinning="loading" size="large" tip="正在加载...">
    <iframe  :id="id" :src="url" frameborder="0" width="100%" :height="height" scrolling="auto" ref="iframeRef"></iframe>
  </a-spin>
</template>

<script>
  import PageLayout from '../page/PageLayout'
  import RouteView from './RouteView'

  export default {
    name: "IframePageContent",
    inject:['closeCurrent'],
    data () {
      return {
        url: "",
        id:"",
        loading: false
      }
    },
    computed:{
      height(){
        return this.$store.getters.height - 59 + 'px'
      }
    },
    mounted () {
      this.goUrl()
    },
  /*  updated () {
      this.goUrl()
    },*/
    watch: {
      $route(to, from) {
        this.goUrl();
      }
    },
    methods: {
      goUrl () {
        console.log('this.$route.meta',this.$route.meta)
        let url = this.$route.meta.url
        let id = this.$route.path
        this.id = id
        //url = "http://www.baidu.com"
        console.log("------url------"+url)
        if (url !== null && url !== undefined) {
          console.log('loading')
          this.url = url;
          this.loading = true
          let that = this
          let iframe = this.$refs.iframeRef
          if (iframe.attachEvent){
            iframe.attachEvent("onload", function(){
              that.loading = false
              console.log('loaded')
            });
          } else {
            iframe.onload = function(){
              that.loading = false
              console.log('loaded')
            };
          }

          /*update_begin author:wuxianquan date:20190908 for:判断打开方式，新窗口打开时this.$route.meta.internalOrExternal==true */
          if(this.$route.meta.internalOrExternal != undefined && this.$route.meta.internalOrExternal==true){
            this.closeCurrent();
            window.open(this.url);
          }
          /*update_end author:wuxianquan date:20190908 for:判断打开方式，新窗口打开时this.$route.meta.internalOrExternal==true */

        }
      }
    }
  }
</script>

<style>
</style>