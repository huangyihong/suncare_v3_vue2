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
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="父级名称">
              <j-tree-select
                style="width:100%"
                v-decorator="['parentCode', validatorRules.required]"
                dict="medical_other_dict,value,code"
                pid-field="parent_code" condition='{"dict_ename":"ybdrug_category","state":"1"}'
                placeholder="请选择父级名称" @change="selectParentCode" v-if="!readonly" >
              </j-tree-select>
              <a-input placeholder="请选择父级名称" v-decorator="['parentName', validatorRules.required]" readOnly="true" v-if="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="父级编码">
              <a-input placeholder="请输入父级编码" v-decorator="['parentCodeText',validatorRules.required]" readOnly="true"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="规则级别">
              <a-select placeholder="请选择规则级别" v-decorator="['ruleGrade', {}]" :readOnly="disableSubmit" :disabled="disableSubmit">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="1级">1级</a-select-option>
                <a-select-option value="2级">2级</a-select-option>
                <a-select-option value="3级">3级</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="级别备注">
              <a-input placeholder="请输入级别备注" v-decorator="['ruleGradeRemark',{}]" :readOnly="disableSubmit"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="描述">
              <a-textarea placeholder="请输入描述" v-decorator="['remark', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="关联药品"
              extra="拖动项目更改排列顺序">
              <a-row :gutter="24">
                <a-col :span="24">
                  <span style="color:#1890ff;margin-left:10px">包含药品{{selectData.length}}个</span>
                </a-col>
                <a-col :span="24" v-if="!disableSubmit">
                  <template v-for="(item,index) in selectInfo.tableTypeArr">
                    <a-button  type="primary" @click="openSelect(item.tableType)" style="margin-right:10px">{{item.title}}选择({{item.tableType |getNum(selectData)}}个)</a-button>
                  </template>
                </a-col>
                <a-col :span="24">

                  <a-row class="title">
                    <a-col :span="7">药品代码</a-col>
                    <a-col :span="7">药品名称</a-col>
                    <a-col :span="6">剂型</a-col>
                    <a-col :span="4">操作</a-col>
                  </a-row>

                  <draggable :options="{animation: 300}" v-model="selectData" @start="startChangeOrder" @change="changeOrder">
                    <a-row v-for="(item,index) in selectData" :key="item.key" :gutter="8" class="list-item">
                      <a-col :span="7">{{item.code}}</a-col>
                      <a-col :span="7">{{item.name}}</a-col>
                      <a-col :span="6">
                        <other-dict-select-tag  placeholder="请选择剂型" v-model="dosageCodeSelect[index].value"   dictEname="DosageForm" :labelInValue="true" :readOnly="disableSubmit" :disabled="disableSubmit"/>
                      </a-col>
                      <a-col :span="4" v-if="!disableSubmit">
                        <a @click="() => rowDel(index)">移除</a>
                      </a-col>
                    </a-row>
                  </draggable>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>





      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
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
import ACol from "ant-design-vue/es/grid/Col"
import JTreeSelect from '@/components/jeecg/JTreeSelect'
import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
import MedicalStdAtc from "@/pages/selectMulti/MedicalStdAtc"
import OtherDictSelectTag from "./OtherDictSelectTag"
import draggable from 'vuedraggable'

export default {
  name: "MedicalYbDrugModal",
  components: {
    ACol,
    JTreeSelect,
    MedicalDrug,
    MedicalStdAtc,
    OtherDictSelectTag,
    draggable,
  },
  data () {
    return {
      title:"操作",
      visible: false,
      model: {},
      drawerWidth:800,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },
      url: {
        add: '/config/medicalYbDrug/add',
        edit: '/config/medicalYbDrug/edit',
        listAll: '/config/medicalYbDrug/listAll',
      },
      readonly:false,
      parentCodeText:'',
      selectData: [],
      openSelectData:[],
      selectInfo:{ title: '重复用药', component: 'MedicalYbDrug', tableNameUrl:'medicalYbDrug',labelName:'药品',
        tableTypeArr:[
          {tableType:'STD_ATC',title:'STD_ATC',component: 'MedicalStdAtc',num:0,fixedParam:{ state: '1' }},
          {tableType:'STD_DRUG_INFO',title:'STD_DRUG_INFO',component: 'MedicalDrug',num:0,fixedParam:{ state: '1' }},
        ]
      },
      selectVisible: false,
      tableType:'',
      dosageCodeSelect:[],
    }
  },
  beforeMount () {
  },
  methods: {
    add() {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true
      if(this.model.id){
        this.readonly = true
      }
      this.loadItemData(this.model.parentCode)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'remark','parentName','ruleGrade','ruleGradeRemark'))
        if(this.model.parentCode){
          this.form.setFieldsValue({parentCodeText:this.model.parentCode});
          this.form.setFieldsValue({parentCode:this.model.parentCode});
        }
      });

    },
    detail(parentCode){
      this.edit({parentCode})
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = this.url.edit
          let formData = Object.assign(this.model, values);
          // 选择项
          if (this.selectData.length > 0) {
            formData.codes = this.selectData.map(item => item.code).join(",")
            formData.names = this.selectData.map(item => item.name).join(",")
            formData.tableTypes = this.selectData.map(item => item.tableType).join(",")
            //获取剂型数据
            formData = this.setFormDosage(formData)
          }else{
            that.$message.warning('关联药品不能为空，请选择药品')
            that.confirmLoading = false
            return
          }
          formData.parentCode = formData.parentCode.trim()
          console.log('formData',formData)
          putAction(httpurl, formData).then((res) => {
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
      })
    },
    handleCancel () {
      this.close()
    },

    //选择药品弹出框
    openSelect(tableType) {
      this.tableType = tableType
      let tableTypeInfo = this.selectInfo.tableTypeArr.filter(item => item.tableType==tableType)
      if(tableTypeInfo.length>0){
        this.selectInfo.component = tableTypeInfo[0].component
        this.selectInfo.title = tableTypeInfo[0].title
        this.selectInfo.fixedParam = tableTypeInfo[0].fixedParam
      }
      this.openSelectData = this.selectData.filter(item => item.tableType==tableType).map(item => {
        return item
      })
      this.selectVisible = true
    },
    //药品选择确定
    handleSelectOk() {
      let tableSelectData = this.selectData.filter(item => item.tableType==this.tableType)//当前已选过的
      this.selectData = this.selectData.filter(item => item.tableType!=this.tableType)
      this.openSelectData = this.$refs.selectRef.getSelect().map(item => {
        item.tableType = this.tableType
        let num = tableSelectData.findIndex((v) => {
          return v.code == item.code;
        });
        if(num<0){//不存在
          item.dosageCodeValue = '同上'
        }
        return item
      })
      this.selectData = [...this.selectData,...this.openSelectData]
      this.dosageCodeSelect = this.selectData.map((item, index) => {
        if(item.dosageValue){
          return { value: {key:item.dosageCodeValue,label:item.dosageValue} }
        }
        return { value: {key:item.dosageCodeValue} }
      })
      this.handleSelectClose()
    },
    handleSelectClose() {
      this.selectVisible = false
    },
    rowDel(index) {
      this.selectData.splice(index, 1)
      this.dosageCodeSelect.splice(index, 1)
    },
    //加载父级关联选择的药品
    loadItemData(parentCode) {
      if (!parentCode || parentCode.length === 0){
        this.selectData= []
        this.dosageCodeSelect = []
        return
      }
      this.confirmLoading = true
      getAction(this.url.listAll,{ parentCode: parentCode }).then(res => {
        if (res.success) {
          this.selectData = res.result.map((item, index) => {
            return { code: item.code, name: item.name, key: index + '',tableType:item.tableType,dosageCodeValue:item.dosageCode,dosageValue:item.dosage }
          })
          this.dosageCodeSelect = this.selectData.map((item, index) => {
            return { value: {key:item.dosageCodeValue,label:item.dosageValue} }
          })
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    //父级树选中
    selectParentCode(value,label){
      this.form.setFieldsValue({parentCodeText:value});
      this.model.parentName = label;
      this.loadItemData(value)
    },
    //获取剂型
    setFormDosage(formData){
      let dosageCodeArr = []
      let dosageArr = []
      for(let i=0;i<this.selectData.length;i++){
        let dosageCode = ''
        let dosage = ''
        if(this.dosageCodeSelect[i].value){
          dosageCode = this.dosageCodeSelect[i].value.key
          if(this.dosageCodeSelect[i].value.label){
            dosage = this.dosageCodeSelect[i].value.label
          }
          if(dosage=='请选择'){
            dosage=''
          }
        }
        if(dosageCode=='同上'){
          if(i==0){
            dosageCode = ''
            dosage = ''
          }else{
            dosageCode =dosageCodeArr[i-1]
            dosage =dosageArr[i-1]
          }
        }
        dosageCodeArr.push(dosageCode)
        dosageArr.push(dosage)
      }
      formData.dosageCodes = dosageCodeArr.join(",")
      formData.dosages = dosageArr.join(",")
      return formData
    },
    startChangeOrder(){
      for(let i=0;i<this.selectData.length;i++){
        let dosageCode = ''
        let dosage = ''
        if(this.dosageCodeSelect[i].value){
          dosageCode = this.dosageCodeSelect[i].value.key
          if(this.dosageCodeSelect[i].value.label){
            dosage = this.dosageCodeSelect[i].value.label
          }
          if(dosage=='请选择'){
            dosage=''
          }
        }
        this.selectData[i].dosageCodeValue = dosageCode
        this.selectData[i].dosageValue = dosage
      }
    },
    changeOrder(){
      this.dosageCodeSelect = this.selectData.map((item, index) => {
        if(item.dosageValue){
          return { value: {key:item.dosageCodeValue,label:item.dosageValue} }
        }
        return { value: {key:item.dosageCodeValue} }
      })
    }
  },
  filters: {
    getNum: function (tableType,selectData) {
      return selectData.filter(item => item.tableType==tableType).length
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
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

</style>