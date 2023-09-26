<template>
  <a-spin :spinning="confirmLoading" ref="rootDom">
    <a-anchor showInkInFixed :offsetTop="50" :wrapperStyle="{position: 'absolute',right: 0,paddingRight: '10px',zIndex:2}"
              @click="handleClick" :getContainer="modalBody">
      <a-anchor-link href="#baseInfo" title="基础信息" />
      <a-anchor-link href="#dayAndPay" title="天数和费用" />
      <a-anchor-link href="#moreInfo" title="资料信息">
        <a-anchor-link href="#diagnosis" title="诊断依据" />
        <a-anchor-link href="#otherInfo" title="其他信息" />
        <a-anchor-link href="#clinicalFile" title="附件" />
      </a-anchor-link>
    </a-anchor>
    <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol" >
      <h3 id="baseInfo">基础信息</h3>
      <div class="fieldset-box box-padding">
        <a-form-item
          label="临床路径名称">
          <a-input placeholder="请输入临床路径名称" v-decorator="['clinicalName', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          label="临床路径编码">
          <a-input placeholder="请输入临床路径编码" v-decorator="['clinicalCode', validatorRules.required]"/>
        </a-form-item>
      <!--  <a-form-item
          label="序号">
          <a-input-number :min="0" :max="1000" :step="0.01"
                          v-decorator="['orderNo', {initialValue: 1,...validatorRules.requiredOnly}]"/>
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol.sm"
          :wrapperCol="wrapperCol.sm"
          label="发布状态">
          <a-col :span="12">
            <a-switch :checked="model.publicStatus==='1'" @change="val=>model.publicStatus=val?'1':'0'"/>
          </a-col>
          <a-col :span="12">
            <a-form-item style="margin-bottom: 0"
                         :labelCol="{span:12}"
                         :wrapperCol="{span:12}"
                         label="有效性">
              <a-switch :checked="model.dataStatus==='1'" @change="val=>model.dataStatus=val?'1':'0'"/>
            </a-form-item>
          </a-col>
        </a-form-item>
        <a-form-item
          label="数据时间">
          <a-range-picker v-model="dateTimes" :allowClear="false"/>
        </a-form-item>
        <a-form-item label="不合规行为">
          <input-medical-action-dict v-decorator="['actionId',validatorRules.required]"
                                     @select="([val]) => model.actionName = val && val.name || '' " hideButton>
          </input-medical-action-dict>
          <!-- <m-dict-select-tag-edit dictCode="ACTION_LIST" v-decorator="['actionId',validatorRules.required]" autoIncrease search>
           </m-dict-select-tag-edit>-->
        </a-form-item>
        <a-form-item label="不合规行为类型">
          <m-dict-select-tag dictCode="ACTION_TYPE" v-model="model.actionType"  disabled>
          </m-dict-select-tag>
          <!--<m-dict-select-tag-edit dictCode="ACTION_TYPE" v-decorator="['actionType',validatorRules.required]" search>
          </m-dict-select-tag-edit>-->
        </a-form-item>
        <template v-if="!model.clinicalId">
          <a-form-item label="录入时间">
            <a-input  v-decorator="['createTime', {}]" readOnly/>
          </a-form-item>
          <a-form-item label="创建人">
            <a-input v-decorator="['createUsername', {}]" readOnly/>
          </a-form-item>
        </template>
        <template v-if="model.clinicalId">
          <a-form-item label="修改原因">
            <a-input placeholder="请输入修改原因" :readOnly="disableSubmit"
                     v-decorator="['updateReason', {}]"/>
          </a-form-item>
          <a-form-item label="修改时间">
            <a-input v-decorator="['updateTime', {}]" readOnly/>
          </a-form-item>
          <a-form-item label="修改人">
            <a-input v-decorator="['updateUsername', {}]" readOnly/>
          </a-form-item>
        </template>
      </div>
      <h3 id="dayAndPay">天数和费用</h3>
      <div class="fieldset-box box-padding">
        <a-form-item
          label="住院天数(最大值)">
          <a-input placeholder="请输入住院天数(最大值)" v-decorator="['inhospDaysMax', {}]"/>
        </a-form-item>
        <a-form-item
          label="住院天数(最小值)">
          <a-input placeholder="请输入住院天数(最小值)" v-decorator="['inhospDaysMin', {}]"/>
        </a-form-item>
        <a-form-item
          label="住院费用(最大值)">
          <a-input placeholder="请输入住院费用(最大值)" v-decorator="['inhospPayMax', {}]"/>
        </a-form-item>
        <a-form-item
          label="住院费用(最小值)">
          <a-input placeholder="请输入住院费用(最小值)" v-decorator="['inhospPayMin', {}]"/>
        </a-form-item>
      </div>
      <h3 id="moreInfo">资料信息</h3>
      <div class="fieldset-box box-padding">
       <!-- <h4>信息模板</h4>
        <div class="fieldset-box box-padding">
          <a-form-item
            label="文字模板">
            <a-input placeholder="请输入信息文字模板" v-decorator="['templWord', {}]"/>
          </a-form-item>
          <a-form-item
            label="编码规则提示模板">
            <a-input placeholder="请输入编码规则提示模板" v-decorator="['templPrompt', {}]"/>
          </a-form-item>
        </div>-->
        <h4 id="diagnosis">诊断依据</h4>
        <div class="fieldset-box box-padding">
          <a-form-item
            label="适用对象">
            <a-input placeholder="请输入适用对象" v-decorator="['basisTarget', {}]"/>
          </a-form-item>
          <a-form-item
            label="症状体征">
            <a-input placeholder="请输入症状体征依据" v-decorator="['basisSymptom', {}]"/>
          </a-form-item>
          <a-form-item
            label="影像学检查">
            <a-input placeholder="请输入影像学检查依据" v-decorator="['basisCtmri', {}]"/>
          </a-form-item>
          <a-form-item
            label="实验室检查">
            <a-input placeholder="请输入实验室检查依据" v-decorator="['basisLabExam ', {}]"/>
          </a-form-item>
          <a-form-item
            label="病理">
            <a-input placeholder="请输入病理依据" v-decorator="['basisPathology', {}]"/>
          </a-form-item>
        </div>
        <h4 id="otherInfo">其他信息</h4>
        <div class="fieldset-box box-padding">
          <a-form-item
            label="临床路径来源">
            <a-input placeholder="请输入临床路径来源" v-decorator="['clinicalSource', {}]"/>
          </a-form-item>
          <a-form-item
            label="公示年份和版本">
            <a-input placeholder="请输入公示年份和版本" v-decorator="['publicYear', {}]"/>
          </a-form-item>
          <a-form-item
            label="标准住院日">
            <a-input placeholder="请输入标准住院日" v-decorator="['standerdInhosDays', {}]"/>
          </a-form-item>
          <a-form-item
            label="进入路径标准">
            <a-input placeholder="请输入进入路径标准" v-decorator="['conformStanderd', {}]"/>
          </a-form-item>
          <a-form-item
            label="必须的检查项目">
            <a-input placeholder="请输入必须的检查项目" v-decorator="['requiredCheckItem', {}]"/>
          </a-form-item>
          <a-form-item
            label="可选的检查项目">
            <a-input placeholder="请输入可选的检查项目" v-decorator="['optionalCheckItem', {}]"/>
          </a-form-item>
          <a-form-item
            label="治疗方案的选择">
            <a-input placeholder="请输入治疗方案的选择" v-decorator="['treatmentOptions', {}]"/>
          </a-form-item>
          <a-form-item
            label="出院标准">
            <a-input placeholder="请输入出院标准" v-decorator="['dischargeStandard', {}]"/>
          </a-form-item>
          <a-form-item
            label="变异及原因分析">
            <a-input placeholder="请输入变异原因及分析" v-decorator="['variationCauseAnalyse', {}]"/>
          </a-form-item>
          <a-form-item
            label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
          </a-form-item>
          <a-form-item id="clinicalFile"
            label="临床路径附件">
            <j-upload :disabled="readonly" v-decorator="['clinicalFile', {}]" bizPath="medicalClinical"></j-upload>
          </a-form-item>
        </div>
      </div>
    </a-form>


  </a-spin>

</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalClinicalRangeGroup from '@/pages/config/modules/MedicalClinicalRangeGroup'
  import MedicalClinicalAccessGroup from '@/pages/config/modules/MedicalClinicalAccessGroup'
  import JUpload from '@/components/jeecg/JUpload'
  import { queryClinicalInfoById } from '@/api-sv3/api-medical'
  import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'

  import { mapGetters } from 'vuex'

  export default {
    name: "MedicalClinicalModal",
    components: {
      MedicalClinicalRangeGroup,
      MedicalClinicalAccessGroup,
      JUpload,
      MDictSelectTagEdit,
      MDictSelectTag,
      InputMedicalActionDict
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      scrollTo: String,
      readonly: {
        type: Boolean,
        required: false
      },
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalClinical/add",
          edit: "/medical/medicalClinical/edit",
        },
        scrollDom: undefined,
        dateTimes: [undefined,undefined]
      }
    },
    mounted() {

      if(this.scrollTo){
        this.$nextTick(() => {
          //  取滚动的根节点
          let node = document.getElementById(this.scrollTo)
          if(node){
            node.scrollIntoView({
              behavior: 'smooth',    //平滑滚动，爽，其他还有 instant
              block: 'start'  //元素到页面顶部，其他还有 end, center
            })
          }
        })
      }
    },
    watch:{
      data:{
        immediate:true,
        handler(val) {

          this.edit(val || {})
        },
      },

    },
    methods: {
      ...mapGetters(["userInfo"]),
      //设置新增字段信息
      setCreateField(record){
        this.userInfoBean = this.userInfo()
        record.createUsername = this.userInfoBean.realname;
        record.createUser = this.userInfoBean.id;
        record.createTime = new Date();
        return record;
      },
      edit(record) {
        // 临床路径几乎不会变动，不需要重新加载
        if(!record.clinicalId || record.clinicalId !== this.model.clinicalId){
          this.dateTimes =  [moment(record.startTime||'2000-01-01'), moment(record.endTime||'2099-12-31')]
          this.model = Object.assign({ dataStatus: '1', publicStatus: '1',actionType: 'CLINICAL' }, record);
          if(this.model.clinicalId){
            this.queryInfoData(this.model.clinicalId)
          }

          this.form.resetFields();
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'clinicalId', 'clinicalName', 'clinicalCode', 'orderNo', 'dataStatus', 'publicStatus'
              ,'inhospDaysMax','inhospDaysMin','inhospPayMax','inhospPayMin', 'actionId', 'actionType'))
          });
        }
        //修改  修改人时间
        if(this.model.clinicalId&&!this.disableSubmit){
          this.$nextTick(() => {
            this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
            this.form.setFieldsValue({updateUsername:this.model.updateUsername})
            this.form.setFieldsValue({updateReason:this.model.updateReason})
          });
        }
        //新增  新增人时间
        if(!this.model.clinicalId){
          this.model = this.setCreateField(this.model)
          this.$nextTick(() => {
            this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
            this.form.setFieldsValue({createUsername:this.model.createUsername})
          });
        }

        this.visible = true;
      },
      queryInfoData(clinicalId){
        this.confirmLoading = true
        queryClinicalInfoById({id:clinicalId}).then(res=>{
          if(res.success){
            this.form.setFieldsValue(pick(res.result,
              'templWord','templPrompt','basisSymptom','basisCtmri','basisLabExam ',
              'basisPathology','publicYear','standerdInhosDays','conformStanderd',
              'requiredCheckItem','optionalCheckItem','treatmentOptions','dischargeStandard',
              'variationCauseAnalyse','remark','clinicalFile','basisTarget','clinicalSource'
            ))
          }else{
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      getData() {
        const that = this;
        return new Promise((resolve,reject)=>{
          // 触发表单验证
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let formData = Object.assign(that.model, values);
              formData.startTime = that.dateTimes[0].format("YYYY-MM-DD");
              formData.endTime = that.dateTimes[1].format("YYYY-MM-DD");
              delete formData.createUser
              delete formData.createUsername
              delete formData.createTime
              delete formData.updateUser
              delete formData.updateUsername
              delete formData.updateTime
              console.log('formData',formData)
              resolve(formData)
            } else {
              console.log('err',err)
              reject(err)
            }
          })
        })

      },
      modalBody() {
        if(this.scrollDom){
          return this.scrollDom
        }
        let dom = this.$refs.rootDom.$el
        while(!dom.classList.contains('ant-drawer-wrapper-body')){
          dom = dom.parentElement
        }
        console.log('dom',dom)
        this.scrollDom = dom
        return dom

        // return document.getElementById('content');
      },
      handleClick(e, link) {
        e.preventDefault();
        console.log(link);
      },
    }
  }
</script>

<style lang="less" scoped>
  .box-padding {
    padding: 16px 16px 0 16px;
  }
</style>
