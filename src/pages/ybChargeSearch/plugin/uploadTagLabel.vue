<template>

    <a-upload name="file"
              accept=".xls,.xlsx"
              :showUploadList="false"
              :multiple="false"
              :headers="tokenHeader"
              :data="param"
              :beforeUpload="beforeUpload"
              :action="importExcelUrl"
              @change="handleImportExcel">
      <a-spin :spinning="confirmLoading">
      <a-button><a-icon type="upload" /> 标注结果上传</a-button>
      </a-spin>
    </a-upload>

</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import {getAction,postAction } from '@/api/manage'

export default {
  name: "uploadTag",
  props: {
    taskType: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      description: '标注结果上传',
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      fileList:[],
      confirmLoading: false,
      importUrl: '/apiYbChargeTagLabel/ybChargeTagLabel/importExcel',
      importForUpdate: '/apiYbChargeTagLabel/ybChargeTagLabel/importForUpdate',
      param:{},
    }
  },
  computed: {
    importExcelUrl: function() {
      if(!this.importUrl.startsWith('http')){
        return `${this.$config['domianURL']}/${this.importUrl}`
      }
      return this.importUrl;
    },
  },
  watch: {
    taskType: {
      immediate: true,
      handler(val) {
        console.log(val)
       this.param.taskType = val
      }
    },
  },
  methods: {
    beforeUpload() {
      this.confirmLoading = true;
    },
    /* 导入 */
    handleImportExcel(info) {
      this.fileList = info.fileList
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        let res = info.file.response
        console.log(res)
        if (res.success) {
          this.$emit('ok');
          this.$message.success(`标注结果上传成功`);
        } else {
          if(res.result){
            let _this = this
            this.$confirm({
              title: '覆盖导入?',
              content: res.message+',确定覆盖导入?',
              onOk() {
                _this.confirmLoading = true;
                getAction(_this.importForUpdate, {filePath:res.result,taskType:_this.taskType}).then((res1) => {
                  _this.confirmLoading = false;
                  if (res1.success) {
                    _this.$emit('ok');
                    _this.$message.success(`标注结果上传成功`);
                  }else{
                    _this.$message.warning(res1.message);
                  }
                })
              }
            })
          }else{
            this.$notification.error({
              message: '标注结果上传校验失败',
              description:
                `${res.message} `,
              placement:'topLeft',
            });
          }
        }
        this.confirmLoading = false;
        this.fileList = []
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.response.message} `);
        this.confirmLoading = false;
      }

    },


  }
}
</script>
<style lang="less" scoped>
</style>
