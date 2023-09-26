<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="机构名称"
          :hidden="false"
          hasFeedback >
          <a-input id="departName" placeholder="请输入机构/部门名称" v-decorator="['departName', validatorRules.departName ]"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="seen" label="上级部门" hasFeedback>
        <a-tree-select
          style="width:100%"
          :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
          :treeData="departTree"
          v-model="model.parentId"
          placeholder="请选择上级部门"
          :disabled="condition">
        </a-tree-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="机构类型">
          <template v-if="seen">
          <a-radio-group v-decorator="['orgCategory',validatorRules.orgCategory]" placeholder="请选择机构类型">
            <a-radio value="1">
              公司
            </a-radio>
          </a-radio-group>
          </template>
          <template v-else>
            <a-radio-group v-decorator="['orgCategory',validatorRules.orgCategory]" placeholder="请选择机构类型">
              <a-radio value="2">
                部门
              </a-radio>
              <a-radio value="3">
                岗位
              </a-radio>
            </a-radio-group>
          </template>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="电话">
          <a-input placeholder="请输入电话" v-decorator="['mobile',validatorRules.mobile]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="传真">
          <a-input placeholder="请输入传真" v-decorator="['fax', {}]"  />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="省市县">
          <a-cascader :options="options" :field-names="{ label: 'itemName', value: 'itemNo', children: 'items' }" v-model="defaultArea" placeholder="请选择省市县" @change="onChange" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户报告类别">
          <a-select
              v-decorator="['roleType',{}]"
              placeholder="请选择用户报告类别"
              style="width:100%"
              mode="multiple"
              :getPopupContainer="
                triggerNode =>{
                  return triggerNode.parentNode || document.body;
                }"
            >
            <a-select-option
              v-for="item in reportTypes"
              :key="item.value"
              :value="item.value"
            >{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分析模板名称">
          <a-select
              v-decorator="['templateIds', {}]"
              placeholder="请选择分析模板名称"
              mode="multiple"
              style="width:100%"
              :getPopupContainer="
                triggerNode =>{
                  return triggerNode.parentNode || document.body;
                }"
            >
            <a-select-option
              v-for="item in templateList"
              :key="item.templateId"
              :value="item.templateId"
            >{{ item.templateName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="地址">
          <a-input placeholder="请输入地址" v-decorator="['address', {}]"  />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-decorator="[ 'departOrder',{'initialValue':0}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="['memo', {}]"  />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import { httpAction,getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/riskportalJeecgListMixin'
  import { httpAction, getAction, deleteAction } from '@/api/riskportalManage'
 
  import { queryIdTree } from '@/api/api'
  import pick from 'lodash/pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "SysDepartModal",
    components: { ATextarea },
    data () {
      return {
        departTree:[],
        orgTypeData:[],
        phoneWarning:'',
        departName:"",
        title:"操作",
        seen:false,
        visible: false,
        condition:true,
        disableSubmit:false,
        model: {},
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        departName:{rules: [{ required: true, message: '请输入机构/部门名称!' }]},
        orgCode:{rules: [{ required: true, message: '请输入机构编码!' }]},
         mobile:{rules: [{validator:this.validateMobile}]}
        },
        url: {
          add: "/sys/sysDepart/add",
          queryAllAreaList:"/dur/durAreaInfo/queryAllAreaList",
          queryTemplateList: "/dur/durReportInfo/queryTemplateList",
        },
        dictDisabled:true,
        options:[],
        defaultArea:[],//初始省市县
        templateList:[],
        reportTypes:[],
      }
    },
    beforeMount() {
      this.queryTemplateList()
      this.initRoleTypeConfig()
    },
    methods: {
      initRoleTypeConfig() {//获取数据字典值 用户报告类别
        initDictOptions('dur_role_type').then((res) => {
          if (res.success) {
            this.reportTypes = res.result;
            console.log('reportTypes',this.reportTypes)
          }
        });
      },
      queryTemplateList() {//数据用户报告-数据报告管理-模板列表
        getAction(this.url.queryTemplateList, {status:'1'}).then(res => {
          if (res.success) {
            this.templateList = res.result;
            //console.log('templateList',this.templateList)
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      queryAllAreaList() {
        getAction(this.url.queryAllAreaList,"").then(res=>{
          if(res.success){
            this.options = res.result;
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      loadTreeData(){
        var that = this;
        queryIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          }

        })
      },
      add (depart) {
        if(depart){
          this.seen = false;
          this.dictDisabled = false;
        }else{
          this.seen = true;
          this.dictDisabled = true;
        }
        //查询省市县
        this.queryAllAreaList();
        this.edit(depart);
      },
      edit (record) {
          
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          this.loadTreeData();
          this.model.parentId = record!=null?record.toString():null;
          if(this.seen){
            this.model.orgCategory = '1';
          }else{
            this.model.orgCategory = '2';
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'orgCategory','departName','departNameEn','departNameAbbr','departOrder','description','orgType','orgCode','mobile','fax','address','memo','status','delFlag'))
          });
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //解析省市县
            if(this.defaultArea.length>0){
              formData.province = this.defaultArea[0];
              formData.city = this.defaultArea[1];
              formData.county = this.defaultArea[2];
            }
            //解析分析模板名称
            if(values.templateIds){
              formData.templateIds = values.templateIds.join(',');
            }
            if(values.roleType){
              formData.roleType = values.roleType.split(',');
            }
            //时间格式化
            console.log('formData',formData)
            httpAction(this.url.add,formData,"post").then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadTreeData();
                that.$emit('ok');
              }else{
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
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手机号码格式不正确!");
        }

      }
    }
  }
</script>

<style scoped>

</style>