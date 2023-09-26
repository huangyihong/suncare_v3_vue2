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
        <div class="table-page-search-wrapper m-t-10">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="12" :sm="12" >
                <a-form-item label="上传方式">
                  <a-select v-model="fnType" >
                    <a-select-option value="import" v-if="actionUrl=='/fj/clue/onsite/'">线索上传</a-select-option>
                    <a-select-option value="cover">重新上传覆盖</a-select-option>
                    <a-select-option value="append">线索明细追加</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>


        <a-upload-dragger
          name="file"
          :showUploadList="false"
          accept=".xls,.xlsx,.csv"
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
          <p class="ant-upload-hint" style="width: 100%">
            <a @click.stop="uploadTemplate">Excel模板下载</a>
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
import {downFile} from '@/api/manage'
import pick from 'lodash/pick'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

export default {
  name: "batchEditModal",
  components: {
    MDictSelectTag
  },
  data() {
    return {
      title: '批量修改',
      tip:'上传方式为‘重新上传覆盖’或‘线索明细追加’时,需在线索总览页面选中一条记录进行操作',
      visible: false,
      confirmLoading: false,
      importUrl: '/fj/clue/cover',
      param: undefined,
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      successStyle: 'color:blue;',
      errorStyle: 'color:red;',
      messageStyle: '',
      message: '',
      uploadFileName: '线索提交及统计汇总表.xlsx',
      templateUrl:'/fj/clue/download/clue',
      actionUrl:'/fj/clue/',
      fnType:'import',
      clueId:'',
      projectOrgId:'',


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
      this.visible = true;
      this.title = param.title
      this.fnType = param.fnType
      this.clueId = param.clueId
      this.projectOrgId = param.projectOrgId
      this.uploadFileName = param.uploadFileName
      this.templateUrl = param.templateUrl
      this.actionUrl = param.actionUrl
      this.message = '';
    },
    beforeUpload() {
      if(this.fnType!='import'&&!this.clueId){
        this.$message.error(this.tip)
        return false
      }
      this.param ={clueId:this.clueId,projectOrgId:this.projectOrgId}
      this.importUrl = this.actionUrl+this.fnType
      this.confirmLoading = true;
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
          this.$message.success(`${this.message}`);
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
    uploadTemplate(){
      let fileName = this.uploadFileName
      downFile(this.templateUrl, {}, 'get').then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if(data.size == 0 ){
          this.$message.warning('文件不存在')
          return
        }
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
