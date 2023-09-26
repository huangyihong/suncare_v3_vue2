<template>
  <m-modal
    centered
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭" :footer="null">
    <div>
      <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>
      <a-upload-dragger
        name="file"
        :fileList="fileList"
        :headers="tokenHeader"
        multiple
        :beforeUpload="beforeUpload"
        :action="actionUrl"
        @change="handleChange">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox"/>
        </p>
        <p class="ant-upload-text">点击选择或拖动文件到此处（多选）</p>
        <!-- <p class="ant-upload-hint" style="width: 100%">
           <a @click="uploadFile">Excel模板下载</a>
         </p>-->
      </a-upload-dragger>
    </div>
  </m-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "ImportModal",
    props: {
      tip: String,
    },
    components: {},
    data() {
      return {
        title: '导入',
        visible: false,
        urlDownload:this.$config['domianURL'] + "/sys/common/download/",
        importUrl: '',
        actionType: 'add',
        tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
        fileList: []
      }
    },
    computed: {
      actionUrl: function() {
        return `${this.$config['domianURL']}/${this.importUrl}?actionType=${this.actionType}`;
      },
    },
    methods: {
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      loadData(param) {
        this.fileList = []
        this.visible = true;
        this.title = param.title;
        this.importUrl = param.importUrl;
        this.actionType = param.actionType;
        this.uploadFileName = param.uploadFileName;
        this.message = '';
      },
      /* 导入 */
      handleChange(info) {
        let fileList = info.fileList
        let {status,response: res} = info.file
        if (status === 'done') {
          let uid = info.file.uid
          let fileItem = fileList.find(item => item.uid === uid)
          if (res.success) {
            fileItem.url = this.urlDownload + res.message;
          } else {
            fileItem.status = 'error'
            fileItem.response = res.message
          }
        } else if (status === 'error') {
        } else if (status === 'removed') {
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        if (status === 'done' || status === 'removed') {
          // this.handlePathChange()
          console.log('导入成功', info)
          this.$emit('ok');
        }
      },
      beforeUpload() {
      },
      handleDelete(file) {
        //如有需要新增 删除逻辑
        console.log('删除', file)
      },
    }
  }
</script>

<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>