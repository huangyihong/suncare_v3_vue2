<template>
  <a-modal
    class="announcementCustomModal"
    :width="modelStyle.width"
    :visible="visible"
    :bodyStyle ="bodyStyle"
    @cancel="handleCancel"
    destroyOnClose
    :footer="null">
    <template slot="title">
      <a-button icon="fullscreen" class="custom-btn" @click="handleClickToggleFullScreen"/>
    </template>
    <a-card class="daily-article" :loading="loading">
      <a-card-meta
        :title="record.titile"
        :description="'发布人：'+record.sender + ' 发布时间： ' + record.sendTime">
      </a-card-meta>
      <a-divider />
      <span v-html="record.msgContent" class="article-content"></span>
    </a-card>
  </a-modal>
</template>

<script>
  export default {
    name: "SysAnnouncementModal",
    components: {
    },
    data () {
      return {
        title:"通知消息",
        record: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        loading: false,
        bodyStyle:{
          padding: "0",
          height:(window.innerHeight*0.8)+"px",
          "overflow-y":"auto",

        },
        modelStyle:{
          width: '60%',
          style: { top: '20px' },
          fullScreen: false
        }
      }
    },
    methods: {
      detail (record) {
        this.visible = true;
        this.record = record;
      },
      handleCancel () {
        this.visible = false;
      },
      /** 切换全屏显示 */
      handleClickToggleFullScreen() {
        let mode = !this.modelStyle.fullScreen
        if (mode) {
          this.modelStyle.width = '100%'
          this.modelStyle.style.top = '20px'
        } else {
          this.modelStyle.width = '60%'
          this.modelStyle.style.top = '50px'
        }
        this.modelStyle.fullScreen = mode
      }
    }
  }
</script>

<style lang="less">
  .announcementCustomModal{
    .ant-modal-header {
      border: none;
      display: inline-block;
      position: absolute;
      z-index: 1;
      right: 56px;
      padding: 0;
      .ant-modal-title{
        .custom-btn{
          width: 56px;
          height: 56px;
          border: none;
          box-shadow: none;
        }
      }
    }
    .daily-article{
      border-bottom: 0;
    }
  }
</style>
<style scoped lang="less">
  .daily-article {
    .article-button {
      font-size: 1.2rem !important;
    }
    .ant-card-body {
      padding: 18px !important;
    }
    .ant-card-head {
      padding: 0 1rem;
    }
    .ant-card-meta {
      margin-bottom: 1rem;
    }
    .article-content {
      p {
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: initial;
        white-space: normal;
        font-size: .9rem !important;
        margin-bottom: .8rem;
      }
    }
  }
</style>
