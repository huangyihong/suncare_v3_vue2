<template>
    <div class="breadcrumb-container m-b-8">
      <a-breadcrumb style="display: inline-block">
        <template v-for="(item,index) in data">
          <a-breadcrumb-item>
            <span v-if="index === data.length - 1">{{item.title}} {{info?`(${info})`:''}}</span>
            <span v-else-if="!item.path">{{item.title}}</span>
            <router-link :to="{ path:item.path}" v-else>
              {{item.title}}
            </router-link>
          </a-breadcrumb-item>
        </template>
      </a-breadcrumb>
        <a style="font-size: 12px" :style="{marginLeft: data.length>0?'10px':'0'}" v-if="haveBack" @click="back">
          返回上一级
        </a>
      <span style="float: right">
        <slot name="right"></slot>
      </span>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Breadcrumb',
    components: {},
    props: {
      current:Object,
      parent: Object,
      info:String
    }, // 跟route对象合并
    data() {
      return {
        data: [],
        haveBack: true
      }
    },
    watch:{
      info(val, oldVal){
        console.log('info',val, oldVal)
      }
    },
    beforeMount: function() {
      this.init2()
    },
    methods: {
      init2() {
        let routes = []
        // 本页面
        let route = this.treeObj[this.$route.path]
        if (this.current) {
          route = { ...route, ...this.current }
        }
        routes.push(route)
        if (this.parent) {
          if(this.parent.path){
            route.parent = this.treeObj[this.parent.path]
          } else {
            route.parent = { ...route.parent, ...this.parent }
          }
        }
        this.haveBack = true
        if(route.parent){
          routes.push(route.parent)
        }

        for (let route of routes) {
          let obj = { title: route.meta.title, path: route.children && !route.redirect ? undefined : route.path }
          this.data.unshift(obj)
          if (route.hidden) {
            if(this.parent && this.parent.path){
              this.data.splice(1, this.data.length - 2)
            } else {
              this.data.splice(0, this.data.length - 1)
            }
          }
        }
      },
      back(){
        if(this.$store.state.app.multipage){
          this.closeCurrent(true)
          if(this.data.length > 1){
            this.$router.replace({path:this.data[this.data.length - 2].path})
          }
        } else {
          if(window.history.length < 3 && this.data.length > 1){
            this.$router.replace({path:this.data[this.data.length - 2].path})
          } else {
            this.$util.goBack()
          }
        }

      },
      init() {
        this.data = []
        // 本页面
        let route = this.treeObj[this.$route.path]
        // 父页面
        if (!this.$navigator.from.name) {
          this.haveBack = false
        } else {
          this.haveBack = true
          route.parent = this.treeObj[this.$navigator.from.path]
        }
        if (this.current) {
          route = { ...route, ...this.current }
        }
        if (this.parent) {
          route.parent = { ...route.parent, ...this.parent }
        }
        // 循环菜单父页面
        do {
          let obj = { title: route.meta.title, path: route.children && !route.redirect ? undefined : route.path }
          this.data.unshift(obj)
          if (route.hidden) {
            this.data.splice(0, this.data.length - 1)
          }
          route = route.parent
        } while (route)
      },
    },
    inject: ['closeCurrent'],
    computed: {
      ...mapState({
        // 主路由
        treeObj: state => state.permission.treeObj,
      })
    }
  }
</script>
<style scoped>
  .breadcrumb-container{
    line-height: 40px;height: 40px
  }

</style>
