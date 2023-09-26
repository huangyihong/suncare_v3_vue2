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
        <a-col :md="readonly?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="亚信项目编码">
            <a-input placeholder="请选择" v-decorator="['itemcode', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="readonly?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="亚信项目名称">
            <a-input placeholder="请选择" v-decorator="['itemname', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="4" :xs="24" class="t-r" v-show="!disableSubmit">
          <a-button type="primary" @click="selectVisible = true">选择项目
          </a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="财务分类编码(原始)">
            <a-input placeholder="请输入财务分类编码(原始)" v-decorator="['chargeclassIdSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="财务分类名称(原始)">
            <a-input placeholder="请输入财务分类名称(原始)" v-decorator="['chargeclassSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="目录原始项目编码">
            <a-input placeholder="请输入目录原始项目编码" v-decorator="['itemcodeSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="目录原始项目名称">
            <a-input placeholder="请输入目录原始项目名称" v-decorator="['itemnameSrc', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目内涵">
            <a-textarea placeholder="请输入项目内涵" v-decorator="['itemContent', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="除外内容">
            <a-textarea placeholder="请输入除外内容" v-decorator="['exceptContent', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="计价单位">
            <a-input placeholder="请输入计价单位" v-decorator="['chargeunit', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="省级价格(元)">
            <a-input-number :step="1" :min="0"  placeholder="请输入价格" v-decorator="['itempriceProvince', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="市一级价格(元)">
            <a-input-number :step="1" :min="0" placeholder="请输入价格" v-decorator="['itemprice1', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="市二级价格(元)">
            <a-input-number :step="1" :min="0"  placeholder="请输入价格" v-decorator="['itemprice2', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="市三级价格(元)">
            <a-input-number :step="1" :min="0"  placeholder="请输入价格" v-decorator="['itemprice3', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="县一级价格(元)">
            <a-input-number :step="1" :min="0" placeholder="请输入价格" v-decorator="['itempricecounty1', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="县二级价格(元)">
            <a-input-number :step="1" :min="0"  placeholder="请输入价格" v-decorator="['itempricecounty2', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="县三级价格(元)">
            <a-input-number :step="1" :min="0"  placeholder="请输入价格" v-decorator="['itempricecounty3', {}]" :readOnly="readonly" style="width:100%"></a-input-number>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目说明">
            <a-textarea placeholder="请输入项目说明" v-decorator="['itemnote', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目规格">
            <a-input placeholder="请输入项目规格" v-decorator="['specificaion', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目包装">
            <a-input placeholder="请输入项目包装" v-decorator="['pack', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目生产企业编码">
            <a-input placeholder="请输入项目生产企业编码" v-decorator="['manufactorCode', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目生产企业名称">
            <a-input placeholder="请输入项目生产企业名称" v-decorator="['manufactor', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目父级编码">
            <a-input placeholder="请输入项目父级编码" v-decorator="['parentcode', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="项目父级名称">
            <a-input placeholder="请输入项目父级名称" v-decorator="['parentname', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="项目地">
            <other-dict-tree-select  placeholder="请选择项目地" dictEname="region" :defaultValue="model.projectArea" @select="onSelectProjectArea"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="所有制形式">
            <other-dict-select-tag  placeholder="请选择所有制形式" v-model="owntypeSelect"  mode="multiple" dictEname="ownType" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="有效起始日期">
            <a-range-picker v-model="dateTimes" :allowClear="false"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="政策文件名称">
            <a-textarea placeholder="请输入政策文件名称" v-decorator="['fileName', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="新增人">
            <a-input placeholder="请输入新增人" v-decorator="['createStaffName', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="新增时间">
            <a-input placeholder="请输入新增时间" v-decorator="['createTime', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <template v-if="model.id">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="修改人">
              <a-input placeholder="请输入修改人" v-decorator="['updateStaffName', {}]" readOnly/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="修改时间">
              <a-input placeholder="请输入修改时间" v-decorator="['updateTime', {}]" readOnly/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="修改原因">
              <a-textarea placeholder="请输入修改原因" v-decorator="['updateReason', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
        </template>
        <a-col :md="24" :sm="24" style="margin-bottom: 30px"></a-col>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>
    <m-modal centered
             title="选择项目信息"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-medical-treat-project-equipment ref="selectRef" :selected="selectData" selectType="radio"
                                              :fixedParam="{ state: '1' }"></select-medical-treat-project-equipment>
    </m-modal>

  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import ACol from "ant-design-vue/es/grid/Col";
  const SelectMedicalTreatProjectEquipment = () => import("@/pages/selectMulti/MedicalTreatProjectEquipment")
  import OtherDictTreeSelect from "./OtherDictTreeSelect"
  import OtherDictSelectTag from "./OtherDictSelectTag"

  export default {
    name: "stdWjItemcatalog",
    components: {
      ACol,
      SelectMedicalTreatProjectEquipment,
      OtherDictTreeSelect,
      OtherDictSelectTag,
    },
    data () {
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
          add: "/config/stdWjItemcatalog/add",
          edit: "/config/stdWjItemcatalog/edit",
        },
        readonly:false,//只读
        userInfoBean: null,//登录用户信息
        selectVisible: false,//显示选择项目窗口
        selectData: [],//选中项目值
        owntypeSelect:[],
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
      }
    },
    beforeMount(){
      this.userInfoBean = this.userInfo()
    },
    methods: {
      ...mapGetters(["userInfo"]),
      //设置新增字段信息
      setCreatField(record){
        record.createStaffName = this.userInfoBean.realname;
        record.createStaff = this.userInfoBean.id;
        record.createTime = new Date();
        return record;
      },
      add (record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.id
          delete newRecord.updateStaffName
          delete newRecord.updateStaff
          delete newRecord.updateTime
        } else {
          newRecord = {}
        }
        newRecord = this.setCreatField(newRecord)
        this.edit(newRecord);
      },
      edit (record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.dateTimes =  [moment(record.startdate||'2000-01-01'), moment(record.enddate||'2099/12/31')]
        console.log('this.model',this.model)
        this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'itemcode','itemname','chargeclassIdSrc','chargeclassSrc','itemcodeSrc','itemnameSrc',
              'itemContent','exceptContent','chargeunit','itempriceProvince','itemprice1','itemprice2','itemprice3','itempricecounty1','itempricecounty2','itempricecounty3',
              'itemnote','specificaion','pack', 'manufactorCode','manufactor','parentcode','parentname','fileName','createStaffName','updateStaffName','updateReason'))
            //时间格式化
            this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
            this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
        });
        this.setSelectValue();
      },
      setSelectValue(){
        this.owntypeSelect = []
        let that = this
        if(this.model.owntype){
          this.model.owntype.split(',').forEach(function(val,index){
            that.owntypeSelect[index] = {key:val}
          });
        }
        if(this.model.owntypeName){
          this.model.owntypeName.split(',').forEach(function(val,index){
            let item = {}
            if(that.owntypeSelect[index]){
              item = that.owntypeSelect[index]
            }
            item.label = val
            that.owntypeSelect[index] = item
          });
        }
      },
      getSelectText() {
        let owntype = []
        let owntypeName = []
        this.owntypeSelect.forEach(function(val,index){
          owntype.push(val.key)
          owntypeName.push(val.label)
        });
        this.model.owntype = owntype.join(',')
        this.model.owntypeName = owntypeName.join(',')
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
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
            this.getSelectText()
            delete formData.createStaff
            delete formData.createStaffName
            delete formData.createTime
            delete formData.updateStaff
            delete formData.updateStaffName
            delete formData.updateTime
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
      //选择项目确定
      handleSelectOk() {
        let selectData = this.$refs.selectRef.getSelect()
        if (selectData.length > 0) {
          this.setSelectObj(selectData[0])
        }
        this.handleSelectClose()
      },
      //关闭选择项目
      handleSelectClose() {
        this.selectVisible = false
      },
      //选择项目
      setSelectObj(obj) {
        if (obj.code && obj.code.length > 0) {
          this.selectData = [obj]
        } else {
          this.selectData = []
        }
        this.form.setFieldsValue({ itemcode: obj.code, itemname: obj.name })
      },
      //选中项目地
      onSelectProjectArea(value, obj){
        this.model.projectArea = obj.value;
        this.model.projectAreaId = obj.id;
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