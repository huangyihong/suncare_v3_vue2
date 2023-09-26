<template>
    <a-drawer
            :title="title"
            :width="800"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="表名">
                    <m-dict-select-tag placeholder="请选择" dictCode="DATA" showKey search
                                       v-decorator="['tableName', validatorRules.required ]"
                                       :loaded="data => {data.unshift({code: 'MEDICAL_UNREASONABLE_ACTION',value: '规则引擎结果表'}); return data}"
                                       @change="val => {form.setFieldsValue({colName: undefined}),model.tableName = val}"></m-dict-select-tag>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="字段名">

                    <a-input placeholder="请输入字段名" v-decorator="['colName', validatorRules.required]"
                             v-if="model.tableName === 'MEDICAL_UNREASONABLE_ACTION'"/>
                    <a-input placeholder="请选择字段名" v-decorator="['colName', validatorRules.required]"
                             @click="openFieldSelect" readOnly v-else/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="字段中文名">
                    <a-input placeholder="请输入字段中文名" v-decorator="['colCnname', validatorRules.required]"/>
                </a-form-item>
                <!--<a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="适用平台">
                    <m-dict-select-tag placeholder="请选择适用平台" dictCode="ACTION_FIELD_PALTFORM"
                                       v-decorator="['platform', validatorRules.required ]"/>
                </a-form-item>-->
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="状态">
                    <m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS"
                                       v-decorator="['status', validatorRules.required ]"/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="字段含义">
                    <a-textarea placeholder="请输入字段含义" v-decorator="['colDesc', {}]" :rows="3"/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="字段列宽">
                    <a-input-number :min="60" :max="500" :step="0.01" placeholder="请输入字段列宽" v-decorator="['colWidth', {}]" style="width: 200px"/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="列表对齐方式">
                    <a-select placeholder="请选择对齐方式" v-decorator="['colAlign', {} ]">
                        <a-select-option value="left">左对齐</a-select-option>
                        <a-select-option value="center">居中</a-select-option>
                        <a-select-option value="right">右对齐</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="是否DWS字段">
                    <m-dict-select-tag placeholder="请选择" dictCode="YESNO" type="radio"
                                       v-decorator="['dwsCol', validatorRules.required ]"
                                       @change="dwsColChange"/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="用作默认字段">
                    <m-dict-select-tag placeholder="请选择" dictCode="YESNO" type="radio"
                                       v-decorator="['defSelect', validatorRules.required ]" :disabled="isDwsCol"/>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="配置查询条件">
                    <m-dict-select-tag placeholder="请选择" dictCode="YESNO" type="radio"
                                       v-decorator="['toSearch', validatorRules.required ]"
                                       @change="toSearchChange"/>
                </a-form-item>
                <a-spin :spinning="colConfigLoading" v-if="model.toSearch === '1'">
                    <h3 id="baseInfo">查询条件配置</h3>
                    <div class="fieldset-box box-padding">
                        <a-row>
                            <a-col :sm="12" :xs="24">
                                <a-form-item
                                        :labelCol="labelColHalf"
                                        :wrapperCol="wrapperColHalf"
                                        label="输入方式">
                                    <!--<m-dict-select-tag placeholder="请选择输入方式" dictCode="WHERE_INPUT_TYPE"
                                                       v-decorator="['serInputType', validatorRules.required ]"
                                                       @change="inputTypeChange"
                                    ></m-dict-select-tag>-->
                                    <a-select placeholder="请选择输入方式"
                                              v-decorator="['serInputType', validatorRules.required ]"
                                              @change="inputTypeChange">
                                        <a-select-option value="0">文本框</a-select-option>
                                        <a-select-option value="1">下拉框</a-select-option>
                                        <a-select-option value="2">值范围</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :sm="12" :xs="24">
                                <a-form-item
                                        :labelCol="labelColHalf"
                                        :wrapperCol="wrapperColHalf"
                                        label="用作默认条件">
                                    <m-dict-select-tag placeholder="请选择" dictCode="YESNO" type="radio"
                                                       v-decorator="['defSearch', validatorRules.required ]"
                                                       :disabled="isDwsCol"/>

                                </a-form-item>
                            </a-col>
                        </a-row>
                        <template v-if="model.serInputType === '1'">
                            <a-form-item
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    label="下拉字典项编码">
                                <input-medical-dict-or-other
                                        v-decorator="['serSelectType', validatorRules.required ]"></input-medical-dict-or-other>
                            </a-form-item>
                            <a-form-item
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    label="字典值类型">
                                <a-select placeholder="请选择"
                                          v-model="serValueType">
                                    <a-select-option value="0">编码</a-select-option>
                                    <a-select-option value="1">名称</a-select-option>
                                </a-select>
                            </a-form-item>
                        </template>
                        <a-form-item
                                v-else-if="model.serInputType === '0' || model.serInputType === '2'"
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="数据类型">
                            <a-select placeholder="请选择数据类型"
                                      v-decorator="['serDataType', validatorRules.required ]">
                                <a-select-option value="VARCHAR">字符串</a-select-option>
                                <a-select-option value="NUMBER">数值</a-select-option>
                                <a-select-option value="DATE">日期</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </a-spin>


            </a-form>
        </a-spin>
        <div class="drawer-bottom">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
        </div>
        <field-select ref="fieldSelectRef" :uniqueVal="uniqueVal"></field-select>
    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import fieldSelect from "@/pages/probe/case/fieldSelect"
  import InputMedicalDict from "@/pages/selectInput/MedicalDict"
  import InputMedicalDictOrOther from "@/pages/selectInput/MedicalDictOrOther"

  export default {
    name: "TaskActionFieldColModal",
    components: { MDictSelectTag, fieldSelect, InputMedicalDict, InputMedicalDictOrOther },
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/task/taskActionFieldCol/add",
          edit: "/task/taskActionFieldCol/edit",
          queryConfigByCol: "/config/medicalColConfig/queryByCol",
          queryById: "/task/taskActionFieldCol/queryById",
        },
        isDwsCol: false,
        uniqueVal: new Date().getTime(),
        colConfigLoading: false,
        serValueType:'0'
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.visible = true;
        if(typeof record === 'string'){
          this.loadData(record)
          return
        }
        this.form.resetFields();
        let model = this.model = Object.assign({
          status: 'normal',
          platform: 'all',
          defSelect: '0',
          dwsCol: '0',
          toSearch: '0',
          defSearch: '0',
          colWidth: 80,
          colAlign: 'left'
        }, record);
        if(model.serInputType === '1'){
          let char = model.serSelectType.charAt(0)
          if(char === 'm' || char === 'o'){
            this.serValueType = '0'
          } else {
            this.serValueType = char
            model.serSelectType = model.serSelectType.substring(2)
          }
        console.log('model.serSelectType',model.serSelectType)
        console.log('this.serValueType',this.serValueType)
          /*this.serValueType = model.serSelectType.charAt(0)
          model.serSelectType = model.serSelectType.substring(2)*/
        }
        /*if(model.defSearch === '1'){
          model.toSearch = '1'
        }*/
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'colId', 'tableName', 'colName', 'colCnname', 'platform', 'status'
            , 'defSelect', 'dwsCol', 'toSearch', 'colDesc', 'colWidth', 'colAlign'
            , 'serInputType', 'serSelectType', 'serDataType', 'defSearch'))
          //时间格式化
        });
        if (model.toSearch === '1') {
          // this.loadColConfig(model.tableName, model.colName)
        } else {
        }


      },
      loadData(id){
        this.confirmLoading = true
        getAction(this.url.queryById, {id}).then(res => {
          if (res.success) {
            this.edit(res.result)
          } else {
            this.$message.warn(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      inputTypeChange(val) {
        this.model.serInputType = val
        if (val === '0' || val === '2') {
          let serDataType = this.form.getFieldValue('serDataType')
          if (!serDataType) {
            this.form.setFieldsValue({ serDataType: 'VARCHAR' })
          }
        } else if(val === '1'){
          this.serValueType = '0'
        }
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
            let method = '';
            if (!this.model.colId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            if(formData.serInputType === '1'){
              formData.serSelectType = this.serValueType + ':' + formData.serSelectType
            }

            console.log(formData)
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
      dwsColChange(val) {
        if (val === '1') {
          this.isDwsCol = true
          this.form.setFieldsValue({ defSelect: '0' })
        } else {
          this.isDwsCol = false
        }

      },
      toSearchChange(val) {
        this.model.toSearch = val
        if (val === '1') {
          let tableName = this.form.getFieldValue('tableName')
          let colName = this.form.getFieldValue('colName')
          if (tableName && colName) {
            this.loadColConfig(tableName, colName)
            this.$nextTick(() => {
              this.form.setFieldsValue({ defSearch: this.form.getFieldValue('defSearch')})
            })
          } else {
            this.model.serInputType = '0'
            this.$nextTick(() => {
              this.form.setFieldsValue({ serInputType: '0', serDataType: 'VARCHAR'
                , defSearch: this.form.getFieldValue('defSearch')})
            })
          }

        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ defSearch: '0' })
        })
      },
      handleCancel() {
        this.close()
      },
      openFieldSelect() {
        // this.$refs.fieldSelectRef.show()
        let tableName = this.form.getFieldValue('tableName')
        if (!tableName || tableName.length === 0) {
          this.$message.warn('请先选择表')
          return
        }
        let colName = this.form.getFieldValue('colName')
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          callback: col => {
            this.form.setFieldsValue({ colName: col.colName, colCnname: col.colChnName })
            this.toSearchChange(this.form.getFieldValue('toSearch'))
          },
          tableName,
          selectedObj: colName ? { colId: `${tableName}:${colName}`, tableName, colName } : undefined,
        })
      },
      loadColConfig(tableName, colName) {
        this.colConfigLoading = true
        getAction(this.url.queryConfigByCol, { tableName, colName }).then(res => {
          if (res.success) {
            let data = res.result || {}
            let serSelectType = data.selectType || '0'
            let serDataType = serSelectType === '0' && !data.dataType || data.dataType.indexOf('char') > -1 ? 'VARCHAR' : data.dataType
            this.model.serInputType = (data.whereInputType || '0') + ''

            this.$nextTick(() => {
              this.form.setFieldsValue({
                serInputType: this.model.serInputType,
                serSelectType, serDataType
              })
            })
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.colConfigLoading = false
        })
      }

    }
  }
</script>

<style lang="less" scoped>
</style>
