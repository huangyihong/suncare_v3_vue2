<template>
  <m-modal centered
           :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">

    <div>
      <a-spin :spinning="confirmLoading">
        <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>

          <!-- 选择文件:
       <a-upload name="file" :showUploadList="false" accept=".xls" :multiple="false" :headers="tokenHeader"
                   :beforeUpload="beforeUpload" :action="importExcelUrl" @change="handleImportExcel">
           <a-button type="primary" icon="import">导入</a-button>
         </a-upload>-->
          <a-upload-dragger
            name="file"
            :showUploadList="false"
            accept=".xls,.xlsx"
            :multiple="false"
            :headers="tokenHeader"
            :beforeUpload="beforeUpload"
            :action="importExcelUrl"
            :data="param"
            @change="handleImportExcel">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text">点击选择或拖动文件到此处</p>

            <p class="ant-upload-hint" style="width: 100%" v-if="templateUrl">
              <a @click.stop="uploadTemplate">Excel模板下载</a>
            </p>
            <p class="ant-upload-hint" style="width: 100%" v-else-if="uploadFileName">
              <a @click="uploadFile">Excel模板下载</a>
            </p>
          </a-upload-dragger>

        <br>
        <div :style="messageStyle">
          <pre>{{message}}</pre>
        </div>
      </a-spin>
    </div>
    <br>
  </m-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { downFile } from '@/api/manage'

  export default {
    name: "ImportModal",
    props: {
      tip: String
    },
    components: {},
    data() {
      return {
        title: '导入',
        visible: false,
        confirmLoading: false,
        importUrl: '',
        param: undefined,
        actionType: 'add',
        tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
        // tokenHeader: { 'X-Access-Token': '132' },
        uploadFileName: undefined,
        templateUrl: undefined,
        successStyle: 'color:blue;',
        errorStyle: 'color:red;',
        messageStyle: '',
        message: ''
      }
    },
    computed: {
      importExcelUrl: function() {
        if(!this.importUrl.startsWith('http')){
          return `${this.$config['domianURL']}/${this.importUrl}`
        }
        return this.importUrl;
      }
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
        const that = this;
        this.visible = true;
        this.title = param.title;
        this.importUrl = param.importUrl;
        this.actionType = param.actionType;
        this.uploadFileName = param.uploadFileName;
        this.templateUrl = param.templateUrl;
        this.param = param.param;
        this.message = '';
      },
      /* 导入 */
      handleImportExcel(info) {
        console.log('info',info)
        if (info.file.status !== 'uploading') {
          //console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            this.message = info.file.response.result
            this.messageStyle = this.successStyle;
            this.$emit('ok',info.file.response.result);
          } else {
            this.message = info.file.response.message
            this.messageStyle = this.errorStyle;
          }
          this.confirmLoading = false;
        } else if (info.file.status === 'error') {
          this.message = info.file.response.message
          this.messageStyle = this.errorStyle;
          this.$message.error(`文件上传失败: ${info.file.msg || this.message} `);
          this.confirmLoading = false;
        }
      },
      /* 文件下载 */
      uploadFile() {
        window.open(this.$config['domianURL'] + "/sys/common/download/" + this.uploadFileName);
      },
      uploadTemplate(){
        let fileName = this.uploadFileName
        downFile(this.templateUrl, {}, 'get').then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          const that = this
          if (data.size < 2001) {
            let reader = new FileReader()
            reader.onload = function(event) {
              let result = JSON.parse(reader.result)
              if (!result.success) {
                that.$message.error(result.message)
              } else {
                that.$message.success(result.result || result.message)
              }
            }
            reader.readAsText(data)
          } else {
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
              window.navigator.msSaveBlob(new Blob([data]), fileName)
            } else {
              let url = window.URL.createObjectURL(new Blob([data]))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', fileName)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link) //下载完成移除元素
              window.URL.revokeObjectURL(url) //释放掉blob对象
            }
            this.$message.success('文件下载成功')
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      beforeUpload() {
        this.confirmLoading = true;
      }

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
