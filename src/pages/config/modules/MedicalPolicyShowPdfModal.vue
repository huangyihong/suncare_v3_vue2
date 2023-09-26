<template>
  <a-drawer
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策编号">
            <a-input placeholder="" v-decorator="['policyCode', validatorRules.required]"
                     :readOnly="readonly || readonly2"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="发文机关" style="height:30px">
            <a-textarea placeholder="" v-decorator="['issuingOffice', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>


        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="政策名称">
            <a-input placeholder="" v-decorator="['policyName', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="效力级别">
            <a-input placeholder="" v-decorator="['effectLevelName', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>


        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="适用人群" style="height:30px">
            <a-textarea placeholder="" v-decorator="['applyPeople', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
        <a-form-item id="filenames"
                     :labelCol="labelCol2"
                     :wrapperCol="wrapperCol2"
                     label="原始附件">
          <j-upload :disabled="true" :multiple="false" :maxUploadFileCount="1" v-decorator="['filenames', {}]" bizPath="medicalPolicyBasis"></j-upload>
        </a-form-item>
      </a-col>

      <a-col :md="24" :sm="24">
        <a-form-item id="textFilenames"
                     :labelCol="labelCol2"
                     :wrapperCol="wrapperCol2"
                     label="转换后附件">
          <j-upload :disabled="true" :multiple="false" :maxUploadFileCount="1" v-decorator="['textFilenames', {}]" bizPath="medicalPolicyBasis"></j-upload>
        </a-form-item>
      </a-col>

        <a-col :span="24">
          <div :class="{'full-screen':fullScreen1}">
            <div id="dayAndPay" class="m-b-6" style="font-size: 18px;font-weight: bold;line-height: 32px">政策内容
              <a-button @click="zoom" class="fr m-r-15">
                {{ fullScreen1 ? '取消全屏' : '全屏展示' }}
              </a-button>
              <div style="clear: both"></div>
            </div>
            <a-row class="fieldset-box box-padding" :gutter="24">
              <a-col :md="8" :sm="24">
                <a-input-search v-model="searchText" placeholder="请输入检索内容" enter-button
                                @search="onContentSearch"/>
                <br/><br/>
                <div v-if="searchDocResults.length ==0">
                  没有符合条件的检索内容
                </div>
                <div style="overflow-y: auto;height: 600px ">
                  <template v-for="(item,index) in searchDocResults">
                    <a @click="showPdfByPageNo(item.page)">第{{ item.page }}页:{{ item.content }}</a><br/>
                  </template>
                </div>


              </a-col>

              <a-col :md="16" :sm="24" style="border-left: 1px solid #eee">
                <div v-if="pdfViewShow==false">
                  当前没有图像信息
                </div>
                <pdf-view ref="pdfView" :height="pdfHeight + 'px'" :isShowFullScreenButton="false" v-show="pdfViewShow"></pdf-view>
              </a-col>
            </a-row>
          </div>
        </a-col>


      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">

      <a-button @click="handleCancel">取消</a-button>
    </div>

  </a-drawer>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash/pick'
import moment from 'moment'
import JUpload from '@/components/jeecg/JUpload'
import OtherDictSelectTag from './OtherDictSelectTag'
import OtherDictTreeSelect from './OtherDictTreeSelect'
import PdfView from '@/pages/case/plugin/PdfView'

export default {
  name: 'medicalPolicyShowPdfModal',
  components: {
    OtherDictSelectTag,
    OtherDictTreeSelect,
    PdfView,
    JUpload
  },
  data() {
    return {
      title: '操作',
      fullScreen1: false,
      visible: false,
      model: {},
      searchText: '',
      searchDocResults: [],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] }
      },
      url: {
        add: '/config/medicalPolicy/add',
        edit: '/config/medicalPolicy/edit',
        queryDocContent: '/config/medicalPolicy/queryDocContent'
      },
      disableSubmit: false,
      readonly: false,//只读
      readonly2: false,
      dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
      policyTypeSelect: {},
      policyServiceClassSelect: {},
      pdfHeight: 600
    }
  },
  beforeMount() {
  },
  methods: {


    showPdfDetail(record) {
      this.readonly = false
      this.readonly2 = true
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.searchText = ''
      this.searchDocResults = []

      this.dateTimes = [moment(record.effectStartdate || '2000-01-01'), moment(record.effectEnddate || '2099/12/31')]
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'policyCode', 'effectLevelName', 'policyName', 'policyNumber', 'issuingOffice',
          'applyArea', 'applyPeople', 'remark', 'issuingDate', 'policyDocNumber',
          'docOriginalUrl', 'filenames', 'textFilenames'))
        this.policyTypeSelect = { key: this.model.policyTypeCode ? this.model.policyTypeCode : '' }
        this.policyServiceClassSelect = { key: this.model.policyServiceClassCode ? this.model.policyServiceClassCode : '' }


        this.showPdfByPageNo(1)

      })


    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    showPdfByPageNo(pdfPageNo) {
      if (this.model.textFilenames != null && this.model.textFilenames != '') {
        this.loadPdf(this.model.textFilenames, pdfPageNo)
      } else if (this.model.filenames != null && this.model.filenames != '') {
        this.loadPdf(this.model.filenames, pdfPageNo)
      } else {
        this.loadPdf('', 1)
      }
    },

    loadPdf(filenames, pageNo) {
      if (filenames == '' || filenames == null) {
        this.pdfViewShow = false
        return
      }

      let suffix = filenames.substring(filenames.lastIndexOf('.') + 1)
      if (suffix === 'png' || suffix === 'jpeg' || suffix === 'bmp' || suffix === 'jpg') {
        this.pdfViewShow = true
        this.$refs.pdfView.loadImg('/sys/common/view/' + filenames)
      } else if (suffix === 'doc' || suffix === 'docx') {
        this.pdfViewShow = true

        this.$refs.pdfView.loadData('/sys/common/wordPreview/' + filenames, pageNo)
      } else if (suffix === 'pdf') {
        this.pdfViewShow = true
        this.$refs.pdfView.loadData('/sys/common/download/' + filenames, pageNo)
      } else {
        this.$message.warning('附件格式不支持显示')
      }
    },

    onContentSearch() {
      let formData = {
        id: this.model.id,
        searchContent: this.searchText
      }

      getAction(this.url.queryDocContent, formData).then((res) => {
        if (res.success) {
          this.searchDocResults = res.result
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })


    },
    handleCancel() {
      this.close()
    },

    getSelectText() {
      if (this.policyTypeSelect) {
        this.model.policyTypeCode = this.policyTypeSelect.key
        if (this.policyTypeSelect.label) {
          this.model.policyTypeName = this.policyTypeSelect.label
        }
      }

      if (this.policyServiceClassSelect) {
        this.model.policyServiceClassCode = this.policyServiceClassSelect.key
        if (this.policyServiceClassSelect.label) {
          this.model.policyServiceClassName = this.policyServiceClassSelect.label
        }
      }
    },

    //选中项目地
    onSelectApplyArea(value, obj) {
      this.model.applyArea = obj.value
      this.model.applyAreaId = obj.id
    },
    zoom(){
      this.fullScreen1 = !this.fullScreen1
      this.$nextTick(()=> {
        let elm = this.$refs.pdfView.$el
        // -12底部空白 - 60 页码高度
        this.pdfHeight = this.$store.getters.height - elm.getBoundingClientRect().top - 12 - 60
        if(this.pdfHeight < 600){
          this.pdfHeight = 600
        }
      })
    },

  },
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