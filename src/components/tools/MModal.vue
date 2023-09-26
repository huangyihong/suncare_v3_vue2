<template>
  <a-modal
    :centered="centered"
    class="m-model-style"
    :width="width"
    :class="{'full-screen': isMax, 'no-footer':footer === null, 'min-width-0': width < 800}"
    :bodyStyle="bodyStyle"
    :visible="visible || value"
    @ok="handleOk"
    @cancel="handleClose"
    :closable="closable"
    :destroyOnClose='destroyOnClose'
    :maskClosable="maskClosable"
    :okText="okText"
    :cancelText="cancelText"
    v-bind="footer === null?{footer: footer}:{}">

    <div slot="title">
      <slot name="title">{{title}}</slot>
      <span class="ant-modal-close" :style="{right:closable?'50px':'0'}">
        <a @click="maxModal" class="ant-modal-close-x" style="color: inherit" v-if="showMax">
          <a-icon :type="isMax?'fullscreen-exit':'fullscreen'"/>
        </a>
      </span>
    </div>
    <slot></slot>
    <template slot="footer" v-if="footer !== null">
      <slot name="footer"></slot>
    </template>

  </a-modal>
</template>

<script>

  export default {
    name: 'MModal',
    components: {},
    props: {
      centered: {
        type: Boolean,
        default: true
      },
      value: {
        type: Boolean,
        required: false
      },
      title: {
        type: String,
        default: '标题'
      },
      width: {
        default: '80%',
      },
      visible: Boolean,
      closable: {
        type: Boolean,
        default: true
      },
      destroyOnClose: {
        type: Boolean,
        default: false
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: '关闭'
      },
      okText: {
        type: String,
        default: '确定'
      },
      bodyStyle: {
        type: Object,
        default: {}
      },
      footer: String,
      showMax: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        isMax: false,
        animTime: 300
      }
    },
    methods: {
      handleOk() {
        this.$emit('ok')
      },
      handleClose() {
        this.$emit('cancel')
        this.$emit('input', false)
        if(this.isMax){
          this.maxModal()
          this.$nextTick(()=>{
            this.$store.commit('SET_MODAL_MAX',false)
          })
        }
      },
      maxModal() {

        this.isMax = !this.isMax
        // this.$emit('maxStart', this.isMax)
        // 动画完毕后触发
        // setTimeout(() => {
        this.$emit('max', this.isMax)
        this.$store.commit('SET_MODAL_MAX',this.isMax)

        // }, this.animTime)

      },
      max(isMax) {
        this.isMax = !isMax
        this.maxModal()
      },
    },
  }
</script>
<style lang="less">
  .m-model-style {
    padding-bottom: 0;
    /*.ant-modal {
      transition: width 300ms;
    }
    .ant-modal-body{
      transition: height 300ms;
    }*/
    &.full-screen {
      .ant-modal{
        width: 100%!important;
        padding-bottom: 0;
      }
      .ant-modal-content {
        height: 100vh;
        overflow: hidden;
        border-radius: 0;

        .ant-modal-body {
          height: calc(100% - 110px);
          overflow: auto;
        }
      }

      &.no-footer .ant-modal-content {
        .ant-modal-body {
          height: calc(100% - 55px);
        }
      }
    }
  }

</style>
