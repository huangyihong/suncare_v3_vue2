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
        <a-col :md="24" :sm="24">
          <!--<a-select  mode="multiple"  :max-tag-count="1" v-decorator="['orgs', {}]" v-show="false"></a-select>-->
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="医疗机构范围">
            <a-select
              show-search
              allowClear
              mode="multiple"
              labelInValue
              v-decorator="['selectOrgsArr', {}]"
              placeholder="不选代表适用全部"
              :dropdownMatchSelectWidth="false"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchOrg"
              @change="handleChangeOrg"
              :style="{width:'calc(100% - 80px) !important'}"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in selectOrgList" :key="d.value">{{d.text}}</a-select-option>
            </a-select>
            <a-button @click="selectOrg" class="m-l-6">选择</a-button>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="分组数据入院日期">
            <a-range-picker v-decorator="['dateTimes', validatorRules.requiredOnly]" :allowClear="true" :disabled="readonly"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="DRG目录版本">
            <a-select
              show-search
              allowClear
              v-decorator="['drgCatalogV', validatorRules.requiredOnly]"
              placeholder="请选择DRG目录版本"
              :dropdownMatchSelectWidth="false"
            >
              <a-select-option  v-for="(item,index) in drgVList" :value="item.versionCode" :key="item.versionCode">{{item.versionName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="DRG分组逻辑版本">
            <m-dict-select-tag placeholder="请选择逻辑版本" dictCode="DRG_LOGIC_V"
                               v-decorator="['logicV', validatorRules.required]" ></m-dict-select-tag>
          </a-form-item>
        </a-col>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" >
      <a-button type="primary" @click="handleOk(1)"  style="margin-right: .8rem" v-show="!disableSubmit">保存并运行</a-button>
      <a-button type="primary" @click="handleOk(0)"  style="margin-right: .8rem" v-show="!disableSubmit">保存</a-button>
      <a-button  @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>

    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>

  </a-drawer>
</template>

<script>
import { httpAction,getAction } from '@/api/manage'
import pick from 'lodash/pick'
import moment from "moment"
import debounce from 'lodash/debounce'

import OdsCheckorgList from "@/pages/ybChargeSearch/plugin/OdsCheckorgListForm"
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

export default {
  name: "RuleModal",
  components: {
    OdsCheckorgList,
    MDictSelectTag
  },
  data () {
    this.lastFetchId = 0;
    this.fetchOrg = debounce(this.fetchOrg, 800);
    return {
      title:"操作",
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },
      url: {
        add: "/drg/drgTask/add",
        edit: "/drg/drgTask/edit",
        getOrgPageList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgPageList",
        drgVList: "/drg/drgCatalog/list",

      },
      fetching: false,
      selectOrgsArr:[],//机构选中的数据
      selectOrgList:[],//机构下拉选项
      drgVList:[],//DRG目录版本列表
      dateTimes: [moment('2020-01-01'), moment('2023-12-31')],
    }
  },
  beforeMount () {

  },
  methods: {
    add () {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.dateTimes =  [moment(record.startdate||'2020-01-01'), moment(record.enddate||'2023-12-31')]
      this.selectOrgsArr = []
      if(record.orgs&&record.orgids){
        let orgsArr = record.orgs.split(',')
        let orgidsArr = record.orgids.split(',')
        let that = this
        if(orgsArr.length==orgidsArr.length){
          orgsArr.forEach(function(item,index,arr){
            that.selectOrgsArr.push({
              label: item,
              key: orgidsArr[index]
            })
          })
        }
      }
      this.model.dateTimes = this.dateTimes
      this.model.selectOrgsArr = this.selectOrgsArr
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'selectOrgsArr','drgCatalogV', 'logicV','dateTimes'))
      });
      this.fetchOrg()
      this.getDrgVList()
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk (isRun=0) {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if(!this.model.id){
            httpurl+=this.url.add;
            method = 'post';
          }else{
            httpurl+=this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化
          formData.startdate = this.dateTimes[0].format("YYYY-MM-DD");
          formData.enddate = this.dateTimes[1].format("YYYY-MM-DD");
          if(this.selectOrgsArr.length>0){
            formData.orgs = this.selectOrgsArr.map(t=>t.label).join(',')
            formData.orgids = this.selectOrgsArr.map(t=>t.key).join(',')
          }else{
            formData.orgs = ''
            formData.orgids = ''
          }

          formData.isRun = isRun
          console.log(formData)
          httpAction(httpurl,formData,method).then((res)=>{
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
    fetchOrg(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.selectOrgList = [];
      this.fetching = true;
      getAction(this.url.getOrgPageList, {orgname:value,pageSize:50}).then((res) => {
        if (res.success) {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = res.result.records.map(item => ({
            text:item.orgname,
            value:item.orgid,
          }));
          this.selectOrgList = data;
          this.fetching = false;
        }else{
          this.$message.warning(res.message);
        }
      })

    },
    handleChangeOrg(value) {
      Object.assign(this, {
        selectOrgsArr:value,
        fetching: false,
      });
    },

    selectOrg(){
      this.$refs.odsCheckorgList.show()
    },

    setOrgsData(){
      this.orgsData=this.$refs.odsCheckorgList.orgsData
      this.selectOrgsArr =this.orgsData.map(item => ({
        label: item.orgname,
        key: item.orgid,
      }))
      this.form.setFieldsValue({selectOrgsArr:this.selectOrgsArr})

    },

    getDrgVList(){
      getAction(this.url.drgVList, {catalogType:'DRG_V',examineStatus:'1',pageSize:99999,column:'versionCode',order: 'desc'}).then((res) => {
        if (res.success) {
          this.drgVList = res.result.records
        }else{
          this.$message.warning(res.message);
        }
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

  .drawer-bootom-button-left {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: left;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>