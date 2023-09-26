<template>
  <a-drawer
    :title="title"
    :width="900"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="labelName+'组编码'">
          <a-input placeholder="请输入分组编码" v-decorator="['groupCode', validatorRules.required]"
                   :readOnly="!!model.groupId"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="labelName+'组名称'">
          <a-input placeholder="请输入分组名称" v-decorator="['groupName', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序号">
          <a-input-number :min="0" :max="1000" :step="1"
                          v-decorator="['isOrder', {initialValue: 1,...validatorRules.requiredOnly}]"/>
        </a-form-item>
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述">
        <a-input placeholder="请输入描述" v-decorator="['remark', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所包含的子项"
          extra="拖动项目更改排列顺序">
          <a-row :gutter="24">
            <a-col :span="24">
              <span style="color:#1890ff;margin-left:10px">包含子项{{selectData.length}}个</span>
            </a-col>
            <a-col :span="24">
              <template v-for="(item,index) in selectInfo.tableTypeArr">
                <a-button  type="primary" @click="openSelect(item.tableType)" style="margin-right:10px">{{item.title}}选择({{item.tableType |getNum(selectData)}}个)</a-button>
              </template>
            </a-col>
            <a-col :span="24">

              <a-row class="title">
                <a-col :span="10">子项代码</a-col>
                <a-col :span="10">子项名称</a-col>
                <a-col :span="4">操作</a-col>
              </a-row>

              <draggable :options="{animation: 300}" v-model="selectData">
                <a-row v-for="(item,index) in selectData" :key="item.key" :gutter="8" class="list-item">
                  <a-col :span="10">{{item.code}}</a-col>
                  <a-col :span="10">{{item.name}}</a-col>
                  <a-col :span="4">
                    <a @click="() => rowDel(index)">移除</a>
                  </a-col>
                </a-row>
              </draggable>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新增人">
          <a-input placeholder="请输入新增人" v-decorator="['createStaffName', {}]" readOnly/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新增时间">
          <a-input placeholder="请输入新增时间" v-decorator="['createTime', {}]" readOnly/>
        </a-form-item>
        <template v-if="model.groupId">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="修改人">
          <a-input placeholder="请输入修改人" v-decorator="['updateStaffName', {}]" readOnly/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="修改时间">
          <a-input placeholder="请输入修改时间" v-decorator="['updateTime', {}]" readOnly/>
        </a-form-item>
        </template>
      </a-form>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
    <m-modal centered
      :title="'选择'+selectInfo.title"
      :width="'85%'"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="selectVisible=false"
      cancelText="关闭">
      <component :is="selectInfo.component" ref="selectRef" v-bind="selectInfo.params||{}"
                 :selected="openSelectData" :fixedParam="selectInfo.fixedParam"></component>
    </m-modal>
  </a-drawer>
</template>


<script>
  import { postAction, putAction, getAction } from '@/api-sv3/manage'

  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import MedicalChineseDrug from "@/pages/selectMulti/MedicalChineseDrug"
  import MedicalOtherDict from "@/pages/selectMulti/MedicalOtherDict"
  import MedicalTreatProject from "@/pages/selectMulti/MedicalTreatProject"
  import MedicalEquipment from "@/pages/selectMulti/MedicalEquipment"
  import MedicalDiseaseDiag from "@/pages/selectMulti/MedicalDiseaseDiag"
  import MedicalPathology from "@/pages/selectMulti/MedicalPathology"
  import MedicalOperation from "@/pages/selectMulti/MedicalOperation"
  import MedicalStdAtc from "@/pages/selectMulti/MedicalStdAtc"
  import draggable from 'vuedraggable'
  import { mapGetters } from 'vuex'

  export default {
    name: "MedicalGroupModal",
    components: {
      MedicalDrug,
      MedicalChineseDrug,
      MedicalOtherDict,
      MedicalTreatProject,
      MedicalEquipment,
      MedicalDiseaseDiag,
      MedicalPathology,
      MedicalOperation,
      MedicalStdAtc,
      draggable,
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        wrapperCollHalf2: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {},
        selectData: [],
        openSelectData:[],
        selectInfos: {
          /*'1': { title: '医疗服务项目组(诊疗项目)', component: 'MedicalTreatProject', tableNameUrl:'medicalProjectGroup',labelName:'医疗服务项目' },*/
          '1': { title: '医疗服务项目组(医疗服务项目+医疗器械)', component: 'MedicalTreatProject', tableNameUrl:'medicalProjectGroup',labelName:'医疗服务项目',
            tableTypeArr:[
              {tableType:'STD_TREATMENT',title:'医疗服务项目',component: 'MedicalTreatProject',num:0,fixedParam:null},
              {tableType:'STD_MEDICAL_EQUIPMENT',title:'医疗器械',component: 'MedicalEquipment',num:0,fixedParam:null},
            ]
          },
          '5': { title: '疾病组(疾病诊断)', component: 'MedicalDiseaseDiag', tableNameUrl:'medicalDiseaseGroup',labelName:'疾病',
            tableTypeArr:[
              {tableType:'STD_ICD',title:'ICD国际疾病',component: 'MedicalDiseaseDiag',num:0,fixedParam:null},
              {tableType:'STD_PATHOLOGY',title:'形态学编码',component: 'MedicalPathology',num:0,fixedParam:null},
              {tableType:'STD_ICD_SURGERY',title:'手术及操作',component: 'MedicalOperation',num:0,fixedParam:null},
              {tableType:'TCM_DIAG',title:'中医病症与分类',component: 'MedicalOtherDict',num:0,fixedParam:{ dictEname: 'TCM_Diag', state: '1' }},
            ]
          },
          '7': { title: '药品组(药品信息)', component: 'MedicalDrug', tableNameUrl:'medicalDrugGroup',labelName:'药品' ,
            tableTypeArr:[
              {tableType:'STD_ATC',title:'ATC分类药品',component: 'MedicalStdAtc',num:0,fixedParam:{ state: '1' }},
              {tableType:'STD_HERB',title:'中草药',component: 'MedicalChineseDrug',num:0,fixedParam:null}
            ]
          },
        },
        selectInfo: {},
        selectVisible: false,
        tableNameUrl:'medicalDrugGroup',
        labelName:'药品组',
        userInfoBean: null,//登录用户信息
        tableType:'',
      }
    },
    beforeMount() {
      this.userInfoBean = this.userInfo()
    },
    methods: {
      ...mapGetters(["userInfo"]),
      openSelect(tableType) {
        this.tableType = tableType
        let tableTypeInfo = this.selectInfo.tableTypeArr.filter(item => item.tableType==tableType)
        if(tableTypeInfo.length>0){
          this.selectInfo.component = tableTypeInfo[0].component
          this.selectInfo.title = tableTypeInfo[0].title
          this.selectInfo.fixedParam = tableTypeInfo[0].fixedParam
        }
        this.openSelectData = this.selectData.filter(item => item.tableType==tableType).map(item => {
          if(this.tableType=='STD_MEDICAL_EQUIPMENT'){
            item.productcode = item.code
            item.productname = item.name
          }
          return item
        })
        this.selectVisible = true
      },
      kindChange(kind) {
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.selectInfo = info

          }
        }
        this.selectData = []
      },
      kindChangeUrl(kind){
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.tableNameUrl = info.tableNameUrl
            this.labelName = info.labelName
            this.url = {
              add: `/config/${this.tableNameUrl}/add`,
              edit: `/config/${this.tableNameUrl}/edit`,
              listAll: `/config/${this.tableNameUrl}Item/listAll`,
              isExistName: `/config/${this.tableNameUrl}/isExistName`,
            }
          }
        }
      },
      handleSelectOk() {
        this.selectData = this.selectData.filter(item => item.tableType!=this.tableType)
        this.openSelectData = this.$refs.selectRef.getSelect().map(item => {
          item.tableType = this.tableType
          if(this.tableType=='STD_MEDICAL_EQUIPMENT'){
            item.code = item.productcode
            item.name = item.productname
          }
          console.dir(item)
          return item
        })
        this.selectData = [...this.selectData,...this.openSelectData]
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.beforSetEdit();
        this.visible = true;
        this.kindChangeUrl(this.model.kind);
        this.loadItemData(this.model.groupId)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'groupCode', 'groupName', 'code', 'value', 'isOrder', 'remark', 'orgId','createStaff','createStaffName','updateStaff','updateStaffName'))
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.kindChange(this.model.kind)
        });

      },
      loadItemData(groupId) {
        if (!groupId || groupId.length === 0)
          return
        this.confirmLoading = true
        getAction(this.url.listAll,{ groupId: groupId }).then(res => {
          if (res.success) {
            this.selectData = res.result.map((item, index) => {
              return { code: item.code, name: item.value, key: index + '',tableType:item.tableType }
            })
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let httpAction;
            if (!this.model.groupId) {
              httpurl += this.url.add;
              httpAction = postAction
            } else {
              httpurl += this.url.edit;
              httpAction = putAction
            }
            let formData = Object.assign(this.model, values);
            // 选择项
            // this.selectData = this.selectData.filter(item => !item.editable)
            // this.selectData = this.selectData.filter(item => !!item.code && !!item.name)
            if (this.selectData.length > 0) {
              formData.codes = this.selectData.map(item => item.code).join(",")
              formData.names = this.selectData.map(item => item.name).join(",")
              formData.tableTypes = this.selectData.map(item => item.tableType).join(",")
            }
            formData.groupCode = formData.groupCode.trim()
            formData.groupName = formData.groupName.trim()

            let param = {};
            param.groupCode = formData.groupCode
            param.groupName = formData.groupName
            param.groupId = that.model.groupId;

            delete formData.createStaff
            delete formData.createStaffName
            delete formData.createTime
            delete formData.updateStaff
            delete formData.updateStaffName
            delete formData.updateTime
            getAction(this.url.isExistName,param,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.confirmLoading = false;
                  that.$message.warning('分组代码或者分组名称已存在，请重新输入');
                }else{
                  httpAction(httpurl, formData).then((res) => {
                    if (res.success) {
                      that.$message.success(res.message);
                      that.$emit('ok');
                    } else {
                      that.$message.warning(res.message);
                    }
                  }).finally(() => {
                    that.confirmLoading = false;
                    that.close();
                  })
                }
              }else{
                that.$message.warning(data.message);
              }
            })

          }
        })
      },
      handleCancel() {
        this.close()
      },
      rowDel(index) {
        this.selectData.splice(index, 1)
      },
      //设置新增字段信息
      setCreatField(){
        this.model.createStaffName = this.userInfoBean.realname;
        this.model.createStaff = this.userInfoBean.id;
        this.model.createTime = new Date();
      },
      //修改赋值之前设值
      beforSetEdit(){
        if (!this.model.groupId) {
          this.setCreatField();
        }
      },
    },
    filters: {
      getNum: function (tableType,selectData) {
        return selectData.filter(item => item.tableType==tableType).length
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

  .list-item {
    /*border-bottom: 1px solid #e8e8e8;*/
  }
</style>