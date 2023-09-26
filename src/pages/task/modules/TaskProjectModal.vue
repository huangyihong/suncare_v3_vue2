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
                <h3>基础信息</h3>
                <div class="fieldset-box">
                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="项目名称">
                        <a-input placeholder="请输入项目名称" v-decorator="['projectName', validatorRules.required]"/>
                    </a-form-item>
                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="项目地">
                        <a-input placeholder="请输入项目地点" v-decorator="['projectSite', {}]"/>
                    </a-form-item>
                    <!--  <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="项目备注">
                        <a-input placeholder="请输入项目备注" v-decorator="['remark', {}]"/>
                      </a-form-item>-->
                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="项目开始时间">
                        <a-date-picker v-decorator="[ 'startTime', {}]"/>
                    </a-form-item>


                  <!--  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="输出结果">
                    <m-dict-select-tag placeholder="选择输出结果" dictCode="ETL_SOURCE"
                                       v-decorator="['outSource']" :disabled="model.projectId"></m-dict-select-tag>
                  </a-form-item>
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="项目进度维护">
                    <a-input-number :min="0" v-decorator="['schedule', {initialValue: '0',...validatorRules.requiredOnly}]"/>
                  </a-form-item>-->
                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="项目客户">
                        <a-input placeholder="请输入项目客户" v-decorator="['customer', {}]"/>
                    </a-form-item>
                    <!-- <a-form-item
                             :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="医院级别报销比例">
                         <a-col :span="12">
                           <a-form-item
                                   :labelCol="labelCol"
                                   :wrapperCol="wrapperCol" class="m-b-6"
                                   label="一级">
                             <a-input-number :step="1" :min="1" :max="100"
                                             :formatter="value => `${value}%`"
                                             :parser="value => value.replace('%', '')"
                                             v-decorator="['hospLv1PayRate', validatorRules.requiredOnly]"></a-input-number>
                           </a-form-item>
                         </a-col>
                         <a-col :span="12">
                           <a-form-item
                                   :labelCol="labelCol"
                                   :wrapperCol="wrapperCol" class="m-b-6"
                                   label="二级">
                             <a-input-number :step="1" :min="1" :max="100"
                                             :formatter="value => `${value}%`"
                                             :parser="value => value.replace('%', '')"
                                             v-decorator="['hospLv2PayRate', validatorRules.requiredOnly]"></a-input-number>
                           </a-form-item>
                         </a-col>
                         <a-col :span="12">
                           <a-form-item
                                   :labelCol="labelCol"
                                   :wrapperCol="wrapperCol" class="m-b-6"
                                   label="三级">
                             <a-input-number :step="1" :min="1" :max="100"
                                             :formatter="value => `${value}%`"
                                             :parser="value => value.replace('%', '')"
                                             v-decorator="['hospLv3PayRate', validatorRules.requiredOnly]"></a-input-number>
                           </a-form-item>
                         </a-col>
                         <a-col :span="12">
                           <a-form-item
                                   :labelCol="labelCol"
                                   :wrapperCol="wrapperCol" class="m-b-6"
                                   label="未评级">
                             <a-input-number :step="1" :min="1" :max="100"
                                             :formatter="value => `${value}%`"
                                             :parser="value => value.replace('%', '')"
                                             v-decorator="['hospLv0PayRate', validatorRules.requiredOnly]"></a-input-number>
                           </a-form-item>
                         </a-col>
                     </a-form-item>-->
                    <!--<a-form-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="客户账号">
                      <a-row :gutter="8">
                        <a-col :span="20">
                          <a-select
                            mode="tags"
                            placeholder="请选择客户账号"
                            v-model="clientIds"
                            :open="false"
                            :loading="clientsLoading"
                            @deselect="delSelect"
                            style="width: 100%;">
                            <a-select-option v-for="item in clients" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                          </a-select>
                        </a-col>

                        <a-col :span="4">
                          <a-button type="primary" icon="search" @click="selectClientVisible=true">选择</a-button>
                        </a-col>
                      </a-row>
                    </a-form-item>-->
                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="创建人">
                        <a-input readOnly :value="nickname"/>
                    </a-form-item>
                </div>

              <h3>数据准入条件</h3>
              <div class="fieldset-box">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="数据来源">
                  <m-dict-select-tag placeholder="选择数据来源" dictCode="ETL_SOURCE"
                                     v-decorator="['etlSource']" :disabled="model.projectId"></m-dict-select-tag>
                </a-form-item>

                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="数据时间">
                  <a-range-picker v-model="dataDateTimes" :allowClear="false" :disabled="model.projectId"/>
                </a-form-item>
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="机构录入方式" v-if="!model.projectId">
                  <a-radio-group  v-model="orgSelectType" @change="onChange">
                    <a-radio value="select">机构选择</a-radio>
                    <a-radio value="import">机构导入</a-radio>
                  </a-radio-group>
                </a-form-item>

                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="机构选择">
                  <input-medical-org-dwb v-decorator="['dataOrgFilter',{}]" multi :maxTag="50" :disabled="model.projectId" :hideButton="orgSelectType==='import'"></input-medical-org-dwb>
                  <a-button  type="primary" @click="handleImportExcel" v-show="orgSelectType==='import'">导入</a-button>
                </a-form-item>
              </div>
                <h3>数据排除条件</h3>
                <div class="fieldset-box">
                    <task-common-condition-set ref="conditionSet"
                                               :formProp="{labelCol, wrapperCol}"
                                               :options="conditionSet"></task-common-condition-set>
                </div>
            </a-form>

        </a-spin>

        <div class="drawer-bottom">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
        </div>
<!--        <m-modal centered
                 :title="'选择用户'"
                 :width="'80%'"
                 :visible="selectClientVisible"
                 @ok="handleSelectOk"
                 @cancel="handleSelectClose"
                 :closable="true"
                 cancelText="关闭">
            <user-select ref="selectRef" :selected="clients"></user-select>
        </m-modal>-->
      <!--导入-->
      <import-modal ref="importModel" @ok="(datas)=>importOrgOk(datas)"></import-modal>
    </a-drawer>


</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { queryClientsByProject } from '@/api-sv3/api'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import UserSelect from '@/pages/selectMulti/UserList'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalDiseaseDiag from "@/pages/selectInput/MedicalDiseaseDiag"
  import Multi from '@/pages/selectInput/multi'
  import TaskCommonConditionSet from '@/pages/task/plugin/TaskCommonConditionSet'
  import InputMedicalOrgDwb from "@/pages/selectInput/MedicalOrgDwb"
  import ImportModal from '@/components/ImportModal'

  moment.locale('zh-cn')

  export default {
    name: "TaskProjectModal",
    components: {
      UserSelect,
      MDictSelectTag,
      InputMedicalOtherDict,
      InputMedicalDiseaseDiag,
      Multi,
      TaskCommonConditionSet,
      InputMedicalOrgDwb,
      ImportModal
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        dataDateTimes: [moment('2000-01-01'), moment('2099-12-31')],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/task/taskProject/add",
          edit: "/task/taskProject/edit",
          queryConditionByRuleId: "/task/taskCommonConditionSet/queryByRuleId",
          importExcelUrl: "/task/taskProject/importOrgExcel",
        },
        selectClientVisible: false,
        clientsLoading: false,
        clients: [],
        conditionSet: [{
          field: 'visittype',
          component: 'InputMedicalOtherDict',
          title: '就诊类型',
          logic: 'AND',
          compare: '=',
          param: { dict: 'VisitType', multi: true, separator: ',' },
          required: false,
        },
          {
            field: 'payway',
            component: 'InputMedicalOtherDict',
            title: '支付方式',
            logic: 'AND',
            compare: '=',
            param: { dict: 'PayWay', multi: true, separator: ',' },
            required: false,
          },
          {
            field: 'funSettleway',
            component: 'InputMedicalOtherDict',
            title: '结算方式',
            logic: 'AND',
            compare: '=',
            param: { dict: 'fun_settleway', multi: true, separator: ',' },
            required: false,
          },
          {
            field: 'diseaseDiag',
            component: 'InputMedicalDiseaseDiag',
            title: '疾病诊断',
            logic: 'AND',
            compare: '=',
            param: {multi: true, separator: ',' },
            required: false,
          },
          {
            field: 'diseaseMappingFilter',
            component: 'MDictSelectTag',
            title: '疾病映射不全过滤',
            logic: 'AND',
            compare: '=',
            param: { type: 'radio', dictCode: 'YESNO' },
            required: true,
          },/* {
            field: 'ybjjzfjeqc0',
            component: 'MDictSelectTag',
            title: '医保基金支付金额去除0',
            logic: 'AND',
            compare: '=',
            param: { type: 'radio', dictCode: 'YESNO' },
            required: true,
          }*/
        ],
        orgSelectType:'select',
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({diseaseMappingFilter: '1',}, record);
        this.visible = true;
        this.dataDateTimes =  [moment(record.dataStartTime||'2000-01-01'), moment(record.dataEndTime||'2099/12/31')]
        this.clients = []
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'projectId', 'projectName', 'projectSite', 'etlSource', 'outSource', 'remark', 'schedule', 'customer', 'createUser'
            , 'hospLv1PayRate', 'hospLv2PayRate', 'hospLv3PayRate','dataOrgFilter', 'hospLv0PayRate', 'diseaseMappingFilter',))
          //时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
          if (this.model.projectId) {
            // this.loadClients(this.model.projectId)
            this.$refs.conditionSet.loadData(this.model.projectId, obj => {
              this.form.setFieldsValue(obj)
            })
          }
        });

      },
      loadClients(projectId){
        this.clientsLoading = true
        queryClientsByProject({ projectId}).then(res => {
          if (res.success) {
            let users = res.result
            this.clients = users.map(user => {
              return {
                id: user.id,
                code: user.username,
                name: user.realname,
              }
            })
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clientsLoading = false
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
          try {


          if (!err) {

            let httpurl = '';
            let method = '';
            if (!this.model.projectId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.startTime = formData.startTime ? formData.startTime.format() : null;
            formData.endTime = formData.endTime ? formData.endTime.format() : null;

            formData.dataStartTime = this.dataDateTimes[0].format("YYYY-MM-DD");
            formData.dataEndTime = this.dataDateTimes[1].format("YYYY-MM-DD");

            formData.clientIds = that.clientIds.join(",")
            formData.conditionSets = this.$refs.conditionSet.getData(formData)
            console.log('formData',formData)
            that.confirmLoading = true;
            httpAction(httpurl, formData, method).then((res) => {
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
          }catch (e) {
            console.error(e)
          }
        })
      },
      handleCancel() {
        this.close()
      },
      handleSelectOk() {
        this.clients = this.$refs.selectRef.getSelect()
        console.log('this.clients', this.clients)
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectClientVisible = false
      },
      delSelect(id) {
        this.clients.splice(this.clients.findIndex(item => item.id === id), 1)
      },
      //导入
      handleImportExcel() {
        let param = {
          title: '医疗机构导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'TASK_PROJECT_ORG.xlsx'
        }
        this.$refs.importModel.loadData(param);
      },
      //导入成功
      importOrgOk(datas){
        this.$refs.importModel.handleCancel()
        this.model.dataOrgFilter  = datas.map(item=>item.code).join(",")
//        this.model.dataOrgFilter = dataOrgFilter
        //let dataOrgFilter = this.model.dataOrgFilter
        this.form.setFieldsValue({dataOrgFilter:this.model.dataOrgFilter})
      },
      onChange(e) {
        this.model.dataOrgFilter = null
        this.$nextTick(() => {
          this.form.setFieldsValue({dataOrgFilter:this.model.dataOrgFilter})
        })
      },

    },
//    watch:{
//      orgSelectType:{
//        immediate: true,
//        handler(value) {
//          this.model.dataOrgFilter = ''
//          this.$nextTick(() => {
//            this.form.setFieldsValue({dataOrgFilter:this.model.dataOrgFilter})
//          })
//
//        }
//      }
//    },
    computed: {
      ...mapGetters(["nickname"]),
      clientIds() {
        return this.clients.map(item => item.id)
      },
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
  }
</script>

<style lang="less" scoped>

</style>
