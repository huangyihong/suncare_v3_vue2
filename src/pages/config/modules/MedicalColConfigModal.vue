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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="归属表名">
          <m-dict-select-tag placeholder="请选择归属表名" dictCode="DATA" showKey required
                             v-model="model.tabName" search></m-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请输入字段名">
          <a-input placeholder="请输入字段名" v-decorator="['colName', validatorRules.colName ]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字段中文名">
          <a-input placeholder="请输入字段中文名" v-decorator="['colChnName', validatorRules.colChnName]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字段类型">
          <m-dict-select-tag placeholder="请选择" dictCode="COL_TYPE" required
                             v-model="model.colType" search></m-dict-select-tag>
        </a-form-item>
          <!--
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="指标取值表达式">
            <a-input placeholder="请输入指标取值表达式" v-decorator="['colValueExpression', {}]" />
          </a-form-item>
          -->
          <!--<a-form-item-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--label="SQL指标取值表达式">-->
            <!--<a-input placeholder="SQL指标取值表达式(单记录计算)" v-decorator="['colValueExpression2', {}]" />-->
          <!--</a-form-item>-->

          <a-form-item  v-show="model.colType ==='2'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="Solr指标取值表达式">
            <a-input placeholder="Solr指标取值表达式(单记录计算)" v-decorator="['colValueExpressionSolr', {}]"/>
          </a-form-item>
          <!--
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="在SOLR中的表达式2">
            <a-input placeholder="请输入在SOLR中的表达式2" v-decorator="['colValueExpression2Solr', {}]" />
          </a-form-item>
          -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是条件过滤字段">
          <a-radio-group  v-decorator="['isWhereCol', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是数据分组字段">
          <a-radio-group :value="isMasterInfo?model.isGroupbyCol:0" @input="val=>modelPropChange('isGroupbyCol',val)" :disabled="!isMasterInfo">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          （所属DWB_MASTER_INFO表）
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是指标(评分)字段">
          <a-radio-group :value="gradeEnable?model.jklx:'0'" @input="val=>modelPropChange('jklx',val)" :disabled="!gradeEnable">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
          （所属DWB_MASTER_INFO表并且数值类型）
          <!--
          <a-checkbox-group  style="width: 100%;" v-decorator="['jklx', {}]">
            <a-checkbox value="1">单病例</a-checkbox>
            <a-checkbox value="2">病人监控</a-checkbox>
            <a-checkbox value="3">医生监控</a-checkbox>
            <a-checkbox value="4">科室监控</a-checkbox>
            <a-checkbox value="5">医院监控</a-checkbox>
          </a-checkbox-group>
          -->
        </a-form-item>
        <!--
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否可为详情页字段">
          <a-radio-group  v-decorator="['isDetailCol', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是结果显示字段">
          <a-radio-group :value="isMasterInfo||isDwsDisplay?model.isDisplayCol:0" @input="val=>modelPropChange('isDisplayCol',val)" :disabled="!(isMasterInfo||isDwsDisplay)">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <!--
          <a-radio-group :value="isDwsDisplay?model.isDisplayCol:0" @input="val=>modelPropChange('isDisplayCol',val)" :disabled="!isDwsDisplay">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          -->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是出院统计指标">
          <a-radio-group :value="isDwsDisplay?model.isLeaveHospCol:0" @input="val=>modelPropChange('isLeaveHospCol',val)" :disabled="!isDwsDisplay">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <!--
          <a-radio-group :value="isDwsDisplay?model.isDisplayCol:0" @input="val=>modelPropChange('isDisplayCol',val)" :disabled="!isDwsDisplay">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          -->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字段业务分类">
          <a-select placeholder="请选择字段业务分类" v-decorator="['colValueType', {}]">
            <template v-for="item in colValueTypeDict">
              <a-select-option  :value="item">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="输入方式">
          <m-dict-select-tag placeholder="请选择输入方式" dictCode="WHERE_INPUT_TYPE"
            v-model="model.whereInputType"></m-dict-select-tag>
        </a-form-item>
        <a-form-item v-if="model.whereInputType === '1'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下拉字典项">
          <a-input placeholder="请选择下拉字典项" v-decorator="['selectType', validatorRules.selectType]" readOnly="readOnly" @click="openDictSelect()" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数据类型" v-if="model.whereInputType === '0'">
          <!--<a-select placeholder="请选择输入方式" v-decorator="['dataType', {}]" @change="val=>dataType=val">-->
          <a-select placeholder="请选择输入方式" v-model="model.dataType">
            <a-select-option value="VARCHAR">字符串</a-select-option>
            <a-select-option value="NUMBER">数值</a-select-option>
            <a-select-option value="DATE">日期</a-select-option>
          </a-select>
          <!-- <a-input placeholder="请输入数据类型" v-decorator="['dataType', {}]" /> -->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序号">
          <a-input-number placeholder="请输入排序号(支持小数)" :step="0.01" style="width: 200px" v-decorator="['colOrder', validatorRules.colOrder]" />
        </a-form-item>

        <!--
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="格式化">
          <a-input placeholder="请输入格式化" v-decorator="['format', {}]" />
        </a-form-item>
        -->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入详细描述" v-decorator="['colDesc', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button @click="handleCancel">取消</a-button>
    <medical-dict-select ref="dictSelectRef" @ok="dictSelected" kind="99"></medical-dict-select>
  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { querySysDictByType,querySysDictByTypes } from '@/api-sv3/api'
  import MedicalDictSelect from "@/pages/selectSingle/MedicalDict"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { queryColConfigById } from '@/api-sv3/api-flow'

  export default {
    name: "MedicalColConfigModal",
    components: {MedicalDictSelect,MDictSelectTag},
    data () {
      return {
        title:"操作",
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          tabName:{rules: [{ required: true, message: '请选择归属表名!' }]},
          colName:{rules: [{ required: true, message: '请输入字段名!' }]},
          colType:{rules: [{ required: true, message: '请选择字段类型!' }]},
          colChnName:{rules: [{ required: true, message: '请输入字段中文名!' }]},
          selectType:{rules: [{ required: true, message: '请选择字典项!' }]},
          colOrder:{rules: [{ required: true, message: '请输入排序号!' }]},
        },
        url: {
          add: "/config/medicalColConfig/add",
          edit: "/config/medicalColConfig/edit",
          isExist: "/config/medicalColConfig/isExist",
        },
        tabNameDict: [],//归属表名的医疗字典数据
        tabNameDictType:'DATA',
        colValueTypeDict: [],//字段分类的医疗字典数据
        colValueTypeDictTypes:['RULE_COL_VALUE_TYPE_WHERE','RULE_COL_VALUE_TYPE_HAVING']
      }
    },
    beforeMount() {
      this.initMedicalDictList()
    },
    mounted(){
    },
    computed:{
      gradeEnable(){
        return this.model.tabName && this.model.tabName === 'DWB_MASTER_INFO' && this.model.whereInputType === '0' && this.model.dataType === 'NUMBER'
      },
      isDwsDisplay(){
        return this.model.tabName && this.model.tabName.startsWith("DWS")
      },
      isMasterInfo(){
        return this.model.tabName && this.model.tabName === 'DWB_MASTER_INFO'
      }
    },
    methods: {
      add () {
        this.edit({colOrder:10,colType:1,whereInputType:0, dataType:'VARCHAR',jklx:1,isDisplayCol: 0,isLeaveHospCol: 0});
      },
      edit (record) {
        this.visible = true;
        if(typeof record =='string'){
          this.getRecord(record)
          return
        }
        console.log('model',record)
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.colType = this.model.colType.toString()
        this.model.whereInputType= this.model.whereInputType.toString()
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,
            'colName',
            'colChnName',
            'colDesc',
            'colValueExpression',
            'isWhereCol',
            'isGroupbyCol',
            'selectType',
            'colOrder',
            'isDetailCol',
            'format',
            'colValueExpression2',
            'jklx',
            'colValueExpressionSolr',
            'colValueExpression2Solr',
            'colValueType'))
        });

      },
      getRecord(id){
        this.confirmLoading = true
        queryColConfigById({id}).then(res=>{
          if (res.success) {
            let record = res.result
            this.edit(record);
            this.title = `编辑字段(${record.colChnName})`;
          }else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('err, values',err, values)
          if (!err) {
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
//            if(this.model.jklx.length>0){
//              formData.jklx=this.model.jklx.join(',');
//            }
            console.log(formData)
            that.confirmLoading = true;
            getAction(this.url.isExist,formData,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.$message.warning('表名为'+this.model.tabName+'字段名'+this.model.colName+'的记录已存在，请修改为其他字段');
                  that.confirmLoading = false;
                }else{
                  httpAction(httpurl,formData,method).then((res)=>{
                    if(res.success){
                      that.$store.commit('RESET_COL_CONFIG')
                      that.$message.success(res.message);
                      that.$emit('ok');
                    }else{
                      that.$message.warning(res.message);
                    }
                  }).finally(() => {
                    that.confirmLoading = false;
                    that.close();
                  })
                }
              }else{
                that.$message.warning(data.message);
                that.confirmLoading = false;
              }
            })




          }
        })
      },
      modelPropChange(field,val){
        console.log(field,val)
        this.model[field] = val
      },
      handleCancel () {
        this.close()
      },
      openDictSelect(){
        this.$refs.dictSelectRef.show()
      },
      dictSelected({code, name}){
        this.form.setFieldsValue({selectType:code})
        // this.model.selectTypeName = name
      },
      //初始医疗字典数据
      initMedicalDictList(){
        this.confirmLoading = true
        this.$util.initDict(this.colValueTypeDictTypes).then(obj => {
          let arr = [];
          for(let type of this.colValueTypeDictTypes){
            arr.push(...obj[type].map(item => item.code))
          }
          this.colValueTypeDict = Array.from(new Set(arr));
        }).finally(()=>{
          this.confirmLoading = false

        })
      },

    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>