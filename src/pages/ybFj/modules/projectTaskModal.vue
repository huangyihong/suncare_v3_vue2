<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24" v-if="fnType=='audit'||fnType=='view'">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol" >
              <a-icon type="form" style="font-size:20px;color:#1890ff" class="m-l-10 m-r-10"></a-icon><span>任务名称：{{model.taskName}}</span>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-icon type="form" style="font-size:20px;color:#1890ff" class="m-l-10 m-r-10"></a-icon><span>提交人：{{model.createUsername}}</span>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-icon type="form" style="font-size:20px;color:#1890ff" class="m-l-10 m-r-10"></a-icon><span>创建时间：{{model.createTime}}</span>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-icon type="form" style="font-size:20px;color:#1890ff" class="m-l-10 m-r-10"></a-icon><span>审批说明：{{model.taskRemark}}</span>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" v-else>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="任务名称">
              <a-input placeholder="请输入任务名称" v-decorator="['taskName',validatorRules.required]" :readOnly="fnType=='audit'||fnType=='view'"/>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="线索审核人" v-if="processStep=='task'">
              <a-input-search
                placeholder="点击右侧按钮选择用户"
                v-decorator="['auditUserName',validatorRules.required]"
                readOnly
                @search="()=> $refs.userSelectRef.show()" v-if="fnType!='audit'&&fnType!='view'">
                <a-button slot="enterButton" type="primary" icon="search" >选择</a-button>
              </a-input-search>
              <a-input readOnly v-model="model.auditUserName" v-else></a-input>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="任务说明" >
              <a-textarea placeholder="请输入任务说明" :rows="3" v-decorator="['taskRemark', {}]" :readOnly="fnType=='audit'||fnType=='view'"/>
            </a-form-item>
          </a-col>

          <a-divider />
          <a-col :md="12" :sm="24">
            <a-form-item
              label="优先级" v-if="processStep=='task'">
              <m-dict-select-tag placeholder="请选择紧急程度" dictCode="URGENT_LEVEL"
                                 v-decorator="['urgentLevel', {}]" :disabled="fnType=='audit'||fnType=='view'"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="期望审批时间" v-if="processStep=='task'">
              <a-date-picker style="width: 100%" placeholder="请选择期望审批时间" format='YYYY-MM-DD' v-decorator="[ 'hopedAuditTime', {}]" :disabled="fnType=='audit'||fnType=='view'"/>
            </a-form-item>
          </a-col>
          <a-divider v-if="processStep=='task'" />
          <a-col :md="12" :sm="24">
            <a-form-item
              label="线索明细数">
              <a-input-number placeholder="请输入线索明细数" :min="1" :step="1"  style="width: 100%"
                              v-decorator="['caseAmount',validatorRules.initNumberReg]" :disabled="fnType=='audit'||fnType=='view'"/>

            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="线索金额(元)">
              <a-input-number placeholder="请输入线索金额" :step="0.01"  style="width: 100%"
                              v-decorator="['caseFee',validatorRules.caseFee]" :disabled="fnType=='audit'||fnType=='view'"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" >
            <a-form-item
              label="线索附件" v-if="model.taskId||fnType=='createByClue'">
              <div class="fileBox">
                <template v-if="taskClueVo.fileList&&taskClueVo.fileList.length>0">
                  <div class="fileLine" v-for="(item, index) in taskClueVo.fileList">
                  <span>
                    <img src="~@/assets/image/iconImg/xls.png" class="imgBox" v-if="item.fileType==='excel'"/>
                    <img src="~@/assets/image/iconImg/word.png" class="imgBox" v-else-if="item.fileType==='doc'"/>
                    <img src="~@/assets/image/iconImg/pdf.png" class="imgBox" v-else-if="item.fileType==='pdf'"/>
                    <img src="~@/assets/image/iconImg/jpg.png" class="imgBox" v-else-if="item.fileType == 'img'"/>
                    <img src="~@/assets/image/iconImg/other.png" class="imgBox" v-else/>
                  </span>
                    <span class="fileName">{{item.fileSrcname}}<span style="color:#CCCCCC;padding-left:10px">{{item.fileSize/1000}}KB</span></span>
                    <span @click="downloadFile(item.filePath,item.fileSrcname)" class="curpoint m-r-10" style="width:50px;color:#1890ff">下载</span>
                    <!--<span @click="perview(item)" class="curpoint m-r-10" style="width:100px;color:#1890ff">在线预览</span>-->
                    <span @click.stop="delTaskFileList(index,item.fileId)" class="curpoint" style="color:darkgrey" v-if="fnType!='audit'&&fnType!='view'"><a-icon type="delete" /></span>
                  </div>
                </template>
                <div class="fileLine" v-else>
                  <span>无</span>
                </div>
              </div>
            </a-form-item>
          </a-col>
          <a-divider />
          <a-col :md="24" :sm="24" >
            <a-form-item
              label="附件上传" v-if="fnType!='createByClue'&&fnType!='view'">
              <a-upload-dragger  multiple :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox"/>
                </p>
                <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p class="ant-upload-hint">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
              </a-upload-dragger>
            </a-form-item>
          </a-col>
          <template v-if="fnType=='audit'||fnType=='view'">
           <!-- <a-col :md="12" :sm="24">
              <a-form-item
                label="审批状态" >
                <a-radio-group v-decorator="['auditState',validatorRules.requiredOnly]" class="w-b-100">
                  <a-radio value="finish" :disabled="fnType=='view'&&model.auditState!='finish'">通过</a-radio>
                  <a-radio value="fail" :disabled="fnType=='view'&&model.auditState!='fail'">不通过</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>-->
            <a-col :md="24" :sm="24">
              <a-form-item
                label="回复说明" >
                <a-textarea placeholder="请输入回复说明" :rows="3" v-decorator="['auditOpinion', {}]" :readOnly="fnType=='view'"/>
              </a-form-item>
            </a-col>
            <a-divider />

          </template>






          <a-col :md="24" :sm="24">
            <a-form-item
              label="流程">
              <a-steps direction="vertical" size="small" progress-dot :current="model.auditTime?1:0" class="m-l-50" style="width:200px">
                <a-step :description="model.createTime?model.createTime:createTime">
                  <template slot="title">
                    <span v-if="processStep=='task'">任务提交</span>
                    <span v-if="processStep=='taskHosp'||processStep=='taskHospOrg'">线索反馈</span>
                    <span v-if="processStep=='taskCut'||processStep=='taskCutOrg'">线索申诉</span>
                  </template>
                </a-step>
                <a-step  :description="model.auditTime?model.auditTime:''">
                  <template slot="title">
                    <span v-if="processStep=='task'">审批人回复</span>
                    <span v-if="processStep=='taskHosp'||processStep=='taskHospOrg'">医院回复</span>
                    <span v-if="processStep=='taskCut'||processStep=='taskCutOrg'">收到核减材料</span>
                  </template>
                </a-step>
              </a-steps>

            </a-form-item>
          </a-col>



        </a-row>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>

    <user-list ref="userSelectRef" @ok="userSelected"></user-list>
  </a-drawer>
</template>

<script>
import { httpAction,getAction,postAction,deleteAction,downFile } from '@/api/manage'
import pick from 'lodash/pick'
import moment from "moment"
import { postAction as postAction_sv3} from '@/api-sv3/manage'

import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import UserList from "@/pages/selectSingle/UserList"


export default {
  name: "projectTaskModule",
  props: {
    processStep: {
      type: String
    },
  },
  components: {
    MDictSelectTag,
    UserList
  },
  data () {
    return {
      title:"线索审核",
      visible: false,
      disableSubmit:false,
      readonly:false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        caseFee:{rules:[{ required: true, message: '这是必填项!' },{ pattern: /^(0|[1-9])+(\.[0-9]{1,2}){0,1}$/,trigger: "blur", message: "只能输入整数或小数,小数位数不超过2"}]},
        initNumberReg: { rules: [{ pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      actionUrl:'/fj/project/task/',
      url: {
        add: `add`,
        edit: `edit`,
        audit: `audit`,
        createByClue: `/fj/project/task/createByClue`,
        queryProjectTaskFiles:`/fj/clue/file/queryProjectTaskFiles`,
      },
      fnType:'createByClue',
      clueIds:[],
      projectOrgId:'',
      taskClueVo:{},
      createTime:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      fileList: [],
      deleteFileId:[],


    }
  },
  created () {
  },
  methods: {
    add () {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.model.projectOrgId = this.projectOrgId
      this.formDataReset()
      this.visible = true;
      console.log(this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'taskName','auditUser','auditUserName','taskRemark','urgentLevel','caseAmount','caseFee'))
        this.form.setFieldsValue({hopedAuditTime: this.model.hopedAuditTime ? moment(this.model.hopedAuditTime) : null})
        if(this.model.auditOpinion=='null'){
          this.model.auditOpinion = ''
        }
        if(this.fnType == 'audit' || this.fnType == 'view'){
          this.form.setFieldsValue(pick(this.model,'auditState','auditOpinion'))
        }
      });
      if(this.model.taskId){
        this.queryProjectTaskFiles(this.model.taskId)
      }else{
        this.createByClue()
      }
    },
    formDataReset(){
      this.taskClueVo = {}
      this.fileList = []
      this.deleteFileId = []

      if(this.processStep=='taskHosp'||this.processStep=='taskHospOrg'){
        this.actionUrl = '/fj/project/task/hosp/'
        if(this.fnType == 'createByClue'){
          this.title = '线索反馈任务创建'
        }else if(this.fnType == 'createByUpload'){
          this.title = '发起线索反馈任务'
        }else if(this.fnType == 'edit'){
          this.title = '线索反馈任务修改'
        }else if(this.fnType == 'view'){
          this.title = '线索反馈任务查看'
        }else if(this.fnType == 'audit'){
          this.model.auditState = 'finish'
          this.title = '线索反馈任务回复'
        }
      }else if(this.processStep=='taskCut'||this.processStep=='taskCutOrg'){
        this.actionUrl = '/fj/project/task/cut/'
        if(this.fnType == 'createByClue'){
          this.title = '线索申诉核减任务创建'
        }else if(this.fnType == 'createByUpload'){
          this.title = '发起线索申诉核减任务'
        }else if(this.fnType == 'edit'){
          this.title = '线索申诉核减任务修改'
        }else if(this.fnType == 'view'){
          this.title = '线索申诉核减任务查看'
        }else if(this.fnType == 'audit'){
          this.model.auditState = 'finish'
          this.title = '线索申诉核减任务回复'
        }
      }else{
        this.actionUrl = ''
        if(this.fnType == 'createByClue'){
          this.title = '线索任务创建'
        }else if(this.fnType == 'createByUpload'){
          this.title = '发起线索审核任务'
        }else if(this.fnType == 'edit'){
          this.title = '线索任务修改'
        }else if(this.fnType == 'view'){
          this.title = '线索任务查看'
        }else if(this.fnType == 'audit'){
          this.model.auditState = 'finish'
          this.title = '线索任务审核'
        }
      }

    },

    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk: async function () {
      if(this.fnType=='createByUpload'&&this.fileList.length==0&&!this.model.taskId){
        this.$message.warning('请上传线索附件');
        return
      }
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let httpAction =postAction_sv3;
          if (!this.model.taskId) {
            httpurl = this.actionUrl+this.url.add;
          } else {
            httpurl = this.actionUrl+this.url.edit;
          }
          let formData = Object.assign(this.model, values);

          formData.hopedAuditTime = formData.hopedAuditTime ? formData.hopedAuditTime.format('YYYY-MM-DD HH:mm:ss') : null;
          formData.fileIds = this.deleteFileId.join(',')
          let postData = null;
          if(this.fnType=='createByUpload'||this.fnType=='edit'){
            httpAction = postAction;
            postData = new FormData()
            this.fileList.forEach(file => {
              postData.append('files', file);
            });
            postData.append('taskId',formData.taskId)
            postData.append('projectOrgId',formData.projectOrgId)
            postData.append('taskName',formData.taskName)
            postData.append('auditUser',formData.auditUser)
            postData.append('auditUserName',formData.auditUserName)
            postData.append('taskRemark',formData.taskRemark)
            postData.append('urgentLevel',formData.urgentLevel)
            postData.append('caseAmount',formData.caseAmount)
            postData.append('caseFee',formData.caseFee)
            postData.append('hopedAuditTime',formData.hopedAuditTime)
            postData.append('fileIds',formData.fileIds)
          }
          if(this.fnType=='createByClue'){
            formData.clueIds=this.clueIds.join(',')
            postData = Object.assign({}, formData);

          }
          if(this.fnType=='audit'){
            httpurl = this.actionUrl+this.url.audit;
            httpAction = postAction;
            postData = new FormData()
            this.fileList.forEach(file => {
              postData.append('files', file);
            });
            postData.append('taskId',formData.taskId)
            postData.append('auditState',formData.auditState)
            postData.append('auditOpinion',formData.auditOpinion)
          }
          httpAction(httpurl,postData).then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
              that.close();
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
    },
    handleCancel () {
      this.close()
    },

    userSelected(obj) {
      if (obj.code !== this.model.auditUser) {
        this.model.auditUser = obj.code
        this.form.setFieldsValue({ auditUserName: obj.name })
      }
    },

    createByClue() {
      if(!this.clueIds||this.clueIds.length==0){
        return
      }
      getAction(this.url.createByClue, { clueIds: this.clueIds.join(',')}).then(res => {
        if (res.success) {
          this.taskClueVo = res.result
          this.model.caseAmount = this.taskClueVo.caseAmount
          this.model.caseFee = this.taskClueVo.caseFee
          this.form.setFieldsValue(pick(this.model,'caseAmount','caseFee'))
        } else {
          this.$message.warning(res.message);
        }
      })
    },

    queryProjectTaskFiles(taskId) {
      if(!taskId){
        return
      }
      getAction(this.url.queryProjectTaskFiles, { taskId}).then(res => {
        if (res.success) {
          this.taskClueVo.fileList = res.result
          this.$forceUpdate()
        } else {
          this.$message.warning(res.message);
        }
      })
    },

    /* 下载 */
    downloadFile(filePath,fileName){
      downFile("/sys/common/download/" + filePath, {}, 'get').then((data) => {
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

    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    delTaskFileList(index,fileId) {
      this.taskClueVo.fileList.splice(index, 1)
      this.deleteFileId.push(fileId)
      this.$forceUpdate()
      console.log(this.deleteFileId.join(','))
    },
    perview(item){
      const typeArr = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx','excel']
      let fileType=item.fileType
      let url = "https://ybjg.lingwww.com/suncare_v4/sys/common/download/" + item.filePath
      if (typeArr.indexOf(fileType) !== -1) {
        // 使用微软的office online
        url='http://view.xdocin.com/xdoc?_xdoc='+url
      } else {
        url = url
      }
      // window.open()居中打开
      const width = 1000; const height = 800
      const top = (window.screen.availHeight - height) / 2
      const left = (window.screen.availWidth - width) / 2
      window.open(url, '', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left)
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

  .fileBox {
    background-color: rgba(247, 247, 247, 1);
    border-radius: 4px;
  }
  .fileLine{
    width: 100%;
    display: flex;
    justify-content: start;
    padding: 0 10px;
  }
  .imgBox {
    width: 28px;
    //height: 32px;
    display: block;
    margin-right: 12px;
    //margin-top: 2px;
  }
  .fileName {
    width: calc(100vh);
    color:#52c41a;
  }
  .curpoint {
    cursor: pointer;
  }
</style>
