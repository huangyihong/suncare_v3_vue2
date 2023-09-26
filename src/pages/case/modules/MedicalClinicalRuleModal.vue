<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-form v-bind="formItemLayout" :form="form">
      <a-form-item
        label="疾病名称" :labelCol="{xs: { span: 24 },sm: { span: 3 },}" :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
        <m-multi-select-tag placeholder="请选择(多选)" :options="kindDict['5']" :loading="kindDictLoading"
                            v-decorator="['diseaseCodes', {}]" @change="diseaseChange"></m-multi-select-tag>
      </a-form-item>
      <a-form-item
        label="就诊类型" :labelCol="{xs: { span: 24 },sm: { span: 3 },}" :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
        <m-dict-select-tag placeholder="请选择(单选)" dictCode="JZLX" v-decorator="['jzlx', {}]" :triggerChange="true"></m-dict-select-tag>
      </a-form-item>
      <h3>限定范围</h3>
      <div class="fieldset-box">
        <a-form-item label="住院天数">
          <a-row>
            <a-col :span="2">
              <a-switch v-model="limitGroup['15'].switch" @change="inhospitalSwitch"></a-switch>
            </a-col>
            <a-col :span="22">
              <a-row v-if="limitGroup['15'].switch">
                <a-col :span="12">
                  <a-form-item label="上限" v-bind="formItemLayoutHalf" class="form-item-inline">
                    <a-input placeholder="请输入" v-decorator="['inhospitalMax', validatorRules.required]"></a-input>
                    <!--v-model="model.inhospitalMax" -->
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="下限" v-bind="formItemLayoutHalf" class="form-item-inline">
                    <a-input placeholder="请输入" v-decorator="['inhospitalMin', validatorRules.required]"></a-input>
                    <!--v-model="model.inhospitalMin"-->
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="诊疗项目">
          <a-row>
            <a-col :span="2">
              <a-switch v-model="limitGroup['17'].switch"></a-switch>
            </a-col>
            <a-col :span="22" v-if="limitGroup['17'].switch">
              <div style="text-align: right;">
                <a-button @click="addProjectGroupItem()">增加组</a-button>
              </div>
              <template v-for="(group,groupIndex) in projectExistGroup">
                <a-row>
                   <span style="font-size: 30px;vertical-align: middle;float: left; margin-left: -40px;">
                      <a-icon type="minus-square" theme="twoTone"
                              @click="decProjectGroupItem(groupIndex)"></a-icon>
                    </span>
                  <template v-for="(item,itemIndex) in group">
                    <a-col :span="12">
                      <a-form-item :label="item.name" v-bind="formItemLayoutHalf" class="form-item-inline">
                        <m-multi-select-tag placeholder="请选择(多选)" :options="projectOptions"
                                            v-model="item.value" :loading="projectDictLoading"></m-multi-select-tag>
                      </a-form-item>
                    </a-col>
                  </template>
                </a-row>
              </template>
            </a-col>

          </a-row>

        </a-form-item>
        <a-form-item label="入院前天数">
          <a-row>
            <a-col :span="2">
              <a-switch v-model="limitGroup['16'].switch"></a-switch>
            </a-col>
            <a-col :span="22" v-if="limitGroup['16'].switch">
              <a-form-item label="天数" class="form-item-inline">
                <a-input placeholder="请输入入院前天数" v-decorator="['beforeInhospital', validatorRules.required]"
                         style="width: calc(100% - 80px)"></a-input>
                <div style="text-align: right;width: 80px;display: inline-block">
                  <a-button @click="addBeforeInhospitalGroupItem()">增加组</a-button>
                </div>
              </a-form-item>
              <template v-for="(group,groupIndex) in beforeInhospitalExistGroup">
                <a-row>
                  <span style="font-size: 30px;vertical-align: middle;float: left; margin-left: -40px;">
                      <a-icon type="minus-square" theme="twoTone"
                              @click="decBeforeInhospitalGroupItem(groupIndex)"></a-icon>
                    </span>
                  <template v-for="(item,itemIndex) in group">
                    <a-col :span="12">
                      <a-form-item :label="item.name" v-bind="formItemLayoutHalf" class="form-item-inline">
                        <m-multi-select-tag placeholder="请选择(多选)" :options="projectOptions"
                                            v-model="item.value" :loading="projectDictLoading"></m-multi-select-tag>
                      </a-form-item>
                    </a-col>
                  </template>
                </a-row>
              </template>
            </a-col>
          </a-row>

        </a-form-item>
      </div>
      <a-form-item
        label="提示信息" :labelCol="{xs: { span: 24 },sm: { span: 3 },}" :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
        <a-input placeholder="请输入提示信息" v-decorator="['message', {}]"></a-input>
      </a-form-item>
    </a-form>
    <div class="bottom-area">
      <a-button type="primary" @click="handleOk" :loading="confirmLoading">确定</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { queryDistinctDictByKinds,queryItemsByGroup } from '@/api-sv3/api-medical'
  import pick from 'lodash/pick'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"

  export default {
    name: "MedicalDrugRuleModal",
    components: {
      MDictSelectTag,
      MMultiSelectTag,
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        commonParam: { ruleType: '3' },
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        },
        formItemLayoutHalf: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        confirmLoading: false,
        kindDictLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalDrugRule/saveMedicalDrugRule",
          edit: "/medical/medicalDrugRule/updateMedicalDrugRule",
        },
        kindDict: {},
        limitGroup: {
          '15': { switch: false },
          '16': { switch: false },
          '17': { switch: false },
        },

        projectExistGroup: [],
        beforeInhospitalExistGroup: [],
        projectOptions: [],
        projectOptionsDict: {},
        projectSelectFirst: '',
        projectSelect: '',
        projectDictLoading: false,
        inhospitalDays: []
      }
    },
    beforeMount() {
    },
    computed: {
      limitOptions() {
        return Array.from(this.limitGroup, item => item.name)
      }
    },
    methods: {
      inhospitalSwitch(switchVal){
        if(switchVal && this.inhospitalDays.length > 0){
          this.$nextTick(()=>{
            this.form.setFieldsValue({inhospitalMax: this.inhospitalDays[1],inhospitalMin: this.inhospitalDays[0]})
          })
        }
      },
      loadKindDict() {
        this.kindDictLoading = true
        queryDistinctDictByKinds({ kinds: "5" }).then(res => {
          if (res.success) {
            let data = res.result
            let obj = {}
            for (let i in data) {
              // 防止返回数据被格式化成数字格式
              obj[i.toString()] = Array.from(data[i], item => {
                return { code: item.groupCode, value: item.groupName  }
              })
            }
            this.kindDict = obj
          } else {
            this.kindDictLoading = false
            this.$message.warning(res.message);
          }
        })
      },
      loadProjectDictOption(groupTypes) {
        // 过滤以获取过的
        let array = []
        let options = []
        for(let type of groupTypes){
          if(!this.projectOptionsDict[type]){
            array.push(type)
          } else {
            options.push(...this.projectOptionsDict[type])
          }
        }
        if(array.length === 0){
          // 设置选择项
          this.projectOptions = options
          return
        }

        this.projectDictLoading = true
        queryItemsByGroup({ kind: "8",groupCode: array.join(",")  }).then(res => {
          if (res.success) {
            let data = res.result.records
            let obj = {}
            for(let type of array){
              obj[type] = []
            }
            for(let item of data){
              obj[item.groupCode].push(item)
            }
            // 设置选择项
            for(let type of array){
              options.push(...obj[type])
            }
            this.projectOptions = options
            // 合并新旧对象字典
            this.projectOptionsDict = Object.assign(this.projectOptionsDict,obj)

            console.log('options.length',options.length)
            console.log('data.length',data.length)

          } else {
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.projectDictLoading = false
        })
      },
      loadInhospitalDay(code) {
        queryItemsByGroup({ code,groupCode: 'INHOSPITAL_DAY'  }).then(res => {
          if (res.success) {
            let data = res.result.records
            if(data.length > 0){
              let value = data[0].value
              if(value && value.length > 0){
                let array = data[0].value.split('-')
                if(array.length === 2)
                  this.inhospitalDays = array
                else {
                  this.inhospitalDays = []
                }
              } else {
                this.inhospitalDays = []
              }

            }
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      diseaseChange(codes){
        console.log('diseaseChange', codes)
        if(codes.length === 0){
          this.projectOptions = []
        } else {
          let selectStr = codes
          if(selectStr !== this.projectSelect){
            let codeArray = codes.split(",")
            this.projectSelect = selectStr
            this.loadProjectDictOption(codeArray)
            if(this.projectSelectFirst !== codeArray[0]){
              this.projectSelectFirst = codeArray[0]
              this.loadInhospitalDay(this.projectSelectFirst)
            }
          }
        }
      },
      addProjectGroupItem() {
        this.projectExistGroup.push([{ name: '存在', value: '' }, { name: '不存在', value: '' }])
      },
      decProjectGroupItem(index) {
        this.projectExistGroup.splice(index, 1)
      },
      addBeforeInhospitalGroupItem() {
        this.beforeInhospitalExistGroup.push([{ name: '存在', value: '' }, { name: '不存在', value: '' }])
      },
      decBeforeInhospitalGroupItem(index) {
        this.beforeInhospitalExistGroup.splice(index, 1)
      },
      add(record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.ruleId
        } else {
          newRecord = {}
        }
        this.edit(newRecord);
      },
      edit(record) {
        if(Object.keys(this.kindDict).length === 0){
          this.loadKindDict()
        }
        this.form.resetFields();
        this.model = Object.assign(record, this.commonParam);
        this.visible = true;
        // 选择项目列表

        // 限定范围值
        let switchLimitCodes = []
        if(this.model.limitScope){
          switchLimitCodes = this.model.limitScope.trim().split(",")
        }
        for (let code in this.limitGroup) {
          if (switchLimitCodes.indexOf(code) > -1) {
            this.limitGroup[code].switch = true
          } else {
            this.limitGroup[code].switch = false
          }
        }

        // projectExistGroup
        this.projectExistGroup = []
        if(this.model.clinicProjects){
          let clinicProjects = this.model.clinicProjects.trim()
          if (clinicProjects.length > 0) {
            let groups = clinicProjects.split("|")
            console.log(clinicProjects,groups)
            for (let groupStr of groups) {
              let exists = []
              let noExists = []
              let group = groupStr.split(",")
              for (let item of group) {
                if (item.length === 0)
                  continue
                if (item.charAt(0) === '1') {
                  exists.push(item.substring('2'))
                } else {
                  noExists.push(item.substring('2'))
                }
              }
              this.projectExistGroup.push([
                { name: '存在', value: exists.join(",") },
                { name: '不存在', value: noExists.join(",") }])
            }
          }
        } else {
          this.projectExistGroup.push([
            { name: '存在', value: '' },
            { name: '不存在', value: ''}])
        }


        // beforeInhospitalExistGroup
        this.beforeInhospitalExistGroup = []
        if(this.model.beforeProjects){
          let beforeProjects = this.model.beforeProjects.trim()
          if (beforeProjects.length > 0) {
            let groups = beforeProjects.split("|")
            console.log(beforeProjects,groups)
            for (let groupStr of groups) {
              let exists = []
              let noExists = []
              let group = groupStr.split(",")
              for (let item of group) {
                if (item.length === 0)
                  continue
                if (item.charAt(0) === '1') {
                  exists.push(item.substring('2'))
                } else {
                  noExists.push(item.substring('2'))
                }
              }
              this.beforeInhospitalExistGroup.push([
                { name: '不存在', value: noExists.join(",") },
                { name: '存在', value: exists.join(",") }
              ])
            }
          }
        } else {
          this.beforeInhospitalExistGroup.push([
            { name: '不存在', value: ''},
            { name: '存在', value: '' },
          ])
        }
        let diseaseCodes = this.model.diseaseCodes
        if(diseaseCodes && diseaseCodes.length > 0){
          this.diseaseChange(diseaseCodes)
        }

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'diseaseCodes', 'message', 'jzlx', 'inhospitalMax', 'inhospitalMin', 'beforeInhospital'))
        });

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
            let httpurl = '';
            let method = '';
            if (!this.model.ruleId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            // 构造提交表单
            let formData = Object.assign(this.model, values);
            // diseaseCodes已存在，拼接diseaseNames
            let dictArray = this.kindDict['5']
            let diseaseCodes = formData.diseaseCodes
            if(diseaseCodes && diseaseCodes.length > 0){
              let names = diseaseCodes.split(",").map(code => dictArray.find(dict => dict.code === code).value)
              formData.diseaseNames = names.join(",")
            }

            let limitScope = []
            for (let code in this.limitGroup) {
              let item = this.limitGroup[code]
              if (!item.switch) {
                continue
              }
              limitScope.push(code)
            }
            if(limitScope.length === 0){
              this.$notification.error({message: '提示',description: '请选择限定范围'})
              return
            } else {
              formData.limitScope = limitScope.join(",")
            }
            if(limitScope.indexOf('15') === -1) {
              formData.inhospitalMax = ''
              formData.inhospitalMin = ''
            }

            if(limitScope.indexOf('17') > -1){
              let clinicProjects = []
              for(let group of this.projectExistGroup){
                let groupProjects = []

                for(let [index, item] of group.entries()){
                  let typeNo = Math.abs(index - 1)
                  let value = item.value.trim()
                  if(value.length > 0){
                    value.split(",").forEach(code => groupProjects.push(`${typeNo}#${code}`))
                  }
                }
                if(groupProjects.length > 0){
                  clinicProjects.push(groupProjects.join(","))
                }
              }
              console.log(',clinicProjects',clinicProjects)
              if(clinicProjects.length > 0){
                formData.clinicProjects = clinicProjects.join("|")
              } else {
                this.$notification.error({message: '提示',description: '请选择【诊疗项目】临床路径项目'})
                return
              }
            } else {
              formData.clinicProjects = ''
            }
            if(limitScope.indexOf('16') > -1) {
              let beforeProjects = []
              for (let group of this.beforeInhospitalExistGroup) {
                let groupProjects = []
                for (let [index, item] of group.entries()) {
                  let value = item.value.trim()
                  if (value.length > 0) {
                    value.split(",").forEach(code => groupProjects.push(`${index}#${code}`))
                  }
                }
                if (groupProjects.length > 0) {
                  beforeProjects.push(groupProjects.join(","))
                }
              }
              console.log(',beforeProjects',beforeProjects)

              if (beforeProjects.length > 0) {
                formData.beforeProjects = beforeProjects.join("|")
              } else {
                this.$notification.error({message: '提示',description: '请选择【住院前】临床路径项目'})
                return
              }
            } else {
              formData.beforeProjects = ''
            }
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
        })
      },
      handleCancel() {
        this.close()
      },

      selecOK(data) {
        this.selectData = data
      }
    }
  }
</script>

<style lang="less" scoped>
  /** Button按钮间距 */
  .bottom-area {
    margin-top: 30px;

    .ant-btn {
      margin: 0 30px 30px 0;
      float: right;
    }
  }

  .form-item-inline {
    margin-bottom: 0
  }
</style>