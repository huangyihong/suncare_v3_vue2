<template>
  <div class="logo" :style="{width:logoWidth+'px' }">
    <router-link :to="{path:'/'}">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <div class="img-container">
        <img  src="~@/assets/logo-white.png" alt="logo">
      </div>
      <!-- <img v-else src="~@/assets/logo.svg" alt="logo"> -->
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->

      <h1 v-if="showTitle && !collapsed">{{ logoTitle }}</h1>
      <!--伸缩侧边栏-->
      <!--<div class="fr t-white pointer" @click.prevent="$emit('toggle')" v-if="layoutMode == 'sidemenu'">
        <a-icon :type="collapsed?'right':'left'" />
      </div>-->
    </router-link>

  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      },
      collapsed: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      logoWidth(){
        return this.$config.logoTitle.length*20+36
      }
    },
    data() {
      return {
        logoTitle:this.$config.logoTitle
      }
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 48px;

  /*.sider {*/
  .ant-layout-header {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;
      padding-left: 12px;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .img-container {
          display: inline-block;
          width: 36px;
          height: 36px;
          vertical-align: middle;
          img {
            display: inline-block;
            height: 32px;
            /*margin: 2px;*/
            vertical-align: top;
          }
        }


        h1 {
          color: #fff;
          display: inline-block;
          vertical-align: top;
          font-size: 16px;
          margin: 0 0 0 8px;
          /*font-weight: bolder;*/
        }
      }
    }

    &.light .logo {
      background-color: #1890ff;
    }
  }

</style>
