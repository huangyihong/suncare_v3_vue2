<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :destroyOnClose="true"
    :visible="visible">

    <a-form :form="form">
      <a-row :gutter="8">
        <a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="任务批次">
            <a-input placeholder="请输入批次名称" v-decorator="['batchName', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="风控月份">
            <a-month-picker placeholder="选择月份" v-decorator="[ 'month', validatorRules.requiredOnly]"
                            :disabled="readonly" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <!--<a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="负责人">
            <a-input placeholder="请输入负责人" v-decorator="['picId', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>-->

        <a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="数据来源">
            <m-dict-select-tag placeholder="选择数据来源" dictCode="ETL_SOURCE"
                               v-model="model.etlSource" :disabled="readonly"
                               @change="val => {if(val !== 'A03'){model.outSource = undefined}}"
            ></m-dict-select-tag>
          </a-form-item>
        </a-col>

        <a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="输出结果">
            <m-dict-select-tag placeholder="选择输出结果" dictCode="ETL_SOURCE" :filter="r => r.code !== 'A02'"
                               v-model="model.outSource" :disabled="model.etlSource !== 'A03' || readonly"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col  :xs="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="数据时间">
            <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="12" :xs="24">
          <a-form-item
            :labelCol="labelColHalfMin"
            :wrapperCol="wrapperColHalfMin"
            label="医保基金支付金额去除0">
            <m-dict-select-tag dictCode="YESNO" type="radio"
                               v-decorator="['ybFundRm0',{}]" :disabled="readonly"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col  :xs="24">
          <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="机构选择">
            <input-medical-org-dwb v-decorator="['customFilter',{}]" multi :maxTag="50" :readOnly="readonly"></input-medical-org-dwb>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item
                  :labelCol="labelColHalf"
                  :wrapperCol="wrapperColHalf"
                  label="开始时间">
            <a-input :value="execInfo.startTime"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24" v-if="execInfo.status !== 'active'">
          <a-form-item
                  :labelCol="labelColHalf"
                  :wrapperCol="wrapperColHalf"
                  label="结束时间">
            <a-input :value="execInfo.endTime"></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" v-if="model.batchId">
          <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="进度">
            <a-progress
                    :stroke-color="{from: '#108ee9',to: '#87d068'}"
                    :percent="execInfo.endNum* 100.0/(execInfo.endNum + execInfo.runNum)"
                    :status="execInfo.status"
                    :format="percent => `${percent.toFixed(2)}%`"
                    style="width: calc(100% - 160px)"/>
            <div class="t-r" style="display:inline-block;width: 160px" >{{execInfo.endNum}} / {{execInfo.endNum + execInfo.runNum}} <a v-if="model.batchId && model.step !== 0 && model.ruleTypes.indexOf('11')==-1 && model.ruleTypes.indexOf('01')==-1" @click="viewProgress(model.batchId)">查看</a></div>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24" v-if="model.batchId">
          <a-form-item
            :labelCol="labelColHalf"
            :wrapperCol="wrapperColHalf"
            label="创建人">
            <a-input v-decorator="['createUserName',{}]" :readOnly="readonly" v-if="readonly"/>
            <a-input readOnly :value="nickname" v-else/>
          </a-form-item>
        </a-col>
        <template v-if="!readonly && !model.batchId">
          <a-col :xs="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="从历史批次复制">
              <batch-select @select="batchSelect"></batch-select>
            </a-form-item>
          </a-col>
          <!--<a-col v-bind="labelCol" v-if="batchId">
          </a-col>
          <a-col v-bind="wrapperCol" style="margin-bottom: 24px" v-if="batchId">
            <a-radio-group v-model="ruleFrom">
              <a-radio value="2">复制所选择批次的历史版本数据</a-radio>
              <a-radio value="1">复制所选择批次所最新的配置数据</a-radio>
            </a-radio-group>
          </a-col>-->
        </template>
        <!-- <a-col :xs="24" v-if="!readonly && ruleFrom === '2'">
           <a-form-item
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             has-feedback
             label="从历史批次复制"
            >&lt;!&ndash; v-bind="batchId?{validateStatus:'success',help:'提示：从历史批次复制时，只复制该批次包含的业务组信息和临床路径信息。业务组包含哪些模型及模型的详细配置，取当前系统的最新配置。（绿色圆点表示最新）'}
             :{}"&ndash;&gt;
             <batch-select @select="batchSelect"></batch-select>
           </a-form-item>
         </a-col>-->
      </a-row>
      <div class="fieldset-box">
        <a-tabs v-bind="grid < 2?{tabPosition:'top'}:{tabPosition:'left',tabBarGutter:30}">
          <template v-for="(tab,index) in tabs">
            <a-tab-pane  :key="tab.type" :forceRender="tab.render"
                        v-if="ruleTypes.indexOf(tab.type) > -1">
              <span slot="tab">
                {{tab.title}}
                <a v-if="tab.data&&tab.data.length">({{tab.data.length}})</a>
              </span>
              <task-batch-break-rule-select ref="ruleSelectRef"
                                            :ruleType="tab.type"
                                            :batchId="batchId || model.batchId"
                                            :notHis="model.step === 0"
                                            :readonly="readonly" @change="val=> $set(tab, 'data', val)">

                <!--<task-batch-break-rule-select ref="ruleSelectRef"
                                              :ruleType="tab.type"
                                              :batchId="batchId || model.batchId"
                                              :onBatch="!batchId && model.batchId"
                                              :notHis="ruleFrom==='1' || !batchId && model.step === 0"
                                              :readOnly="readonly">-->

              </task-batch-break-rule-select>
            </a-tab-pane>
          </template>
          <!--<a-button style="margin-top: 30px"
                    @click="$util.openTab('/formal/modelConfig/behaviorModel/behaviorModelList',{batchId:model.batchId})"
                    slot="tabBarExtraContent" v-if="!onCreate">{{model.step<3?'配置':'查看'}}不合规行为
          </a-button>-->
        </a-tabs>
      </div>
    </a-form>

    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk" :loading="confirmLoading" v-if="onCreate||onStep">保存</a-button>
      <a-popconfirm title="确定执行吗?" @confirm="handleExec">
        <a-button type="danger" :loading="confirmLoading" v-if="!onCreate&&onStep">执行</a-button>
      </a-popconfirm>
    </div>
    <task-batch-break-rule-log-modal ref="progressModal" :progressBatchId="progressBatchId"></task-batch-break-rule-log-modal>
  </a-drawer>
</template>

<script>
  import { postAction, putAction, getAction } from '@/api-sv3/manage'
  import { taskProjectBatchExec } from '@/api-sv3/api'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import TaskBatchBreakRuleSelect from './TaskBatchBreakRuleSelect'
  import BatchSelect from '../plugin/BatchSelect'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalOrgDwb from "@/pages/selectInput/MedicalOrgDwb"
  import TaskBatchBreakRuleLogModal from './TaskBatchBreakRuleLogModal'

  moment.locale('zh-cn')
  export default {
    name: "TaskProjectBatchModal",
    components: { TaskBatchBreakRuleSelect, BatchSelect,MDictSelectTag, InputMedicalOrgDwb,TaskBatchBreakRuleLogModal },
    data() {
      this.progressStatusMap = {
        'running': 'active',
        'abnormal': 'exception',
        'wait': 'normal',
        'normal': 'success'
      }
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 4 },
          md: { span: 8 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 20 },
          md: { span: 16 },
        },
        labelColHalfMin: {
          xs: { span: 24 },
          sm: { span: 8 },
          md: { span: 12 },
        },
        wrapperColHalfMin: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 12 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/task/taskProjectBatch/add",
          edit: "/task/taskProjectBatch/edit",
          queryById: "/task/taskProjectBatch/queryById",
          queryExecInfoById: "/task/taskProjectBatch/queryExecInfoById",
        },
        steps: [],
        tabs: [
          { title: "违反模型", type: '11' },
          // { title: "药品合规", type: '02' },
          { title: "收费合规", type: '09' },
          // { title: "合理诊疗", type: '07' },
          { title: "合理用药", type: '08' },
          // { title: "临床路径不合规", type: '04' },
          // {title:"违反KPI", type: '05'}
          { title: "临床路径", type: '06' },
          { title: "合理诊疗", type: '10' },
          { title: "药品合规", type: '12' },
          { title: "违反业务组", type: '01' },
          // { title: "收费合规(旧)", type: '03' },
        ],
        ruleTypes: [],
        batchId: undefined,
        progressBatchId: '',
        step: 0,
        onStep: false,
        onCreate: false,
        ruleFrom: '2',
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
        execInfo:{}

      }
    },
    beforeMount() {
      this.confirmLoading = true
      this.$util.initDict('BATCH_STEP').then(data => {
        this.steps = data
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    methods: {
      moment,
      add(projectId) {
        this.edit({ projectId });
      },
      edit(record) {
        this.form.resetFields();
        let model = this.model = Object.assign({ step: 0,etlSource:undefined, outSource: undefined,autoRerun: 'stop' }, record);
        this.onStep = (this.model.step === this.step)
        this.readonly = !this.onStep
        this.onCreate = !model.batchId
        this.batchId = undefined
        this.ruleFrom = '2'
        this.dateTimes =  [moment(record.startTime||'2000-01-01'), moment(record.endTime||'2099/12/31')]
        this.ruleTypes = model.step === 0 || !model.ruleTypes?this.tabs.map(r => r.type): model.ruleTypes.split(',')
        this.visible = true;

        if(!this.onCreate && (!model.step1Status || model.step1Status !== 'wait')){
          this.execInfo = {status: model.step1Status?this.progressStatusMap[model.step1Status]: 'normal'}
          this.loadExecInfo(model.batchId)
        } else {
          this.execInfo = {}
        }

        this.$nextTick(() => {
          let obj = pick(this.model, 'batchId', 'batchName', 'month', 'step', 'picId', 'projectId', 'createUser', 'createUserName'
                  ,'customFilter', 'ybFundRm0'
          )
          obj.month = moment(obj.month)
          this.form.setFieldsValue(obj)
          //时间格式化
        });

      },
      loadExecInfo(batchId){
        getAction(this.url.queryExecInfoById, {batchId}).then(res => {
          if (res.success) {
            let data = res.result
            this.execInfo = {...this.execInfo, ...data}

          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {

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
          console.log(err,values)
          if (!err) {
            try {


            that.confirmLoading = true;
            let httpurl = '';
            let httpAction;
            if (!this.model.batchId) {
              httpurl += this.url.add;
              httpAction = postAction
            } else {
              httpurl += this.url.edit;
              httpAction = putAction
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.month = formData.month.format("YYYY-MM");
            formData.startTime = this.dateTimes[0].format("YYYY-MM-DD");
            formData.endTime = this.dateTimes[1].format("YYYY-MM-DD");
            let ruleData = []
            let ruleTypes = []
            for (let item of this.$refs.ruleSelectRef) {
              ruleTypes.push(item.ruleType)
              ruleData.push(...item.getData())
            }
            formData.ruleData = JSON.stringify(ruleData)
            formData.editRuleTypes = ruleTypes.join(",")
            console.log(formData)
            httpAction(httpurl, formData).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.handleOK();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

            }catch (e) {
              console.error(e)
            }
          }
        })
      },
      handleCancel() {
        this.close()
      },
      handleOK() {
        this.$emit('ok', this.model.projectId);
      },
      handleExec() {
        this.confirmLoading = true
        postAction(this.$suncare_v3 + "/apiTask/taskProjectBatch/execBatch",{ batchId: this.model.batchId }).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.handleCancel()
            this.handleOK()
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      batchSelect(val) {
        console.log('batchSelect', val)
        this.batchId = val
        if (val) {
          for (let item of this.tabs) {
            item.render = true
          }
        } else {
          this.$refs.ruleSelectRef.forEach(item => {
            item.clear()
          })
        }
        getAction(this.url.queryById, {id: val}).then(res => {
          if(res.success){
            let record = res.result
            let obj = pick(record,  'month','customFilter')
            obj.month = moment(obj.month)
            this.form.setFieldsValue(obj)
            this.model.etlSource = record.etlSource || undefined
            this.model.outSource = record.outSource || undefined
            this.dateTimes =  [moment(record.startTime||'2000-01-01'), moment(record.endTime||'2099/12/31')]
          }else{
            this.$message.warning(res.message);
          }
        })


      },
      viewProgress(batchId) {
        this.progressBatchId = batchId;
        this.$nextTick(() => {
          this.$refs.progressModal.query();
        })
      },
    },
    computed: {
      ...mapGetters(["nickname", "grid"]),
    },
  }
</script>

<style lang="less" scoped>
</style>
