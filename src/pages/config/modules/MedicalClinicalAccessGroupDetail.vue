<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    closable
    @close="close"
    :visible="visible"
  >
    <h3>条件组信息</h3>
    <div class="fieldset-box box-padding">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item
          label="准入条件组名称">
          <a-col :span="8">
            <a-input placeholder="请输入条件组名称" v-decorator="['groupName', validatorRules.required]"/>
          </a-col>
          <a-col :span="16">
            <a-form-item style="margin-bottom: 0"
                         :labelCol="{span:12}"
                         :wrapperCol="{span:12}"
                         label="就诊医疗机构隶属关系">
              <m-dict-select-tag placeholder="请选择隶属关系" dictCode="StartupCorp" v-decorator="['hospBelongTo', {}]"/>
            </a-form-item>
          </a-col>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol.sm"
          :wrapperCol="wrapperCol.sm"
          label="患者年龄范围">
          <a-col :span="8">
            <a-input-number placeholder="最小" v-decorator="['patientAgeMin', {}]" :min="0" :max="200"
                            :readOnly="readonly"/>
            -
            <a-input-number placeholder="最大" v-decorator="['patientAgeMax', {}]" :min="0" :max="200"
                            :readOnly="readonly"/>
          </a-col>
          <a-col :span="16">
            <a-form-item style="margin-bottom: 0"
                         :labelCol="{span:12}"
                         :wrapperCol="{span:12}"
                         label="年龄单位">
              <m-dict-select-tag placeholder="请选择年龄单位" dictCode="AGE_UNIT" required valueEqName
                                 v-decorator="['patientAgeUnit', {}]"/>
            </a-form-item>
          </a-col>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
      <template v-for="(item,type) in selectInfoObj">
        <a-card size="small" :title="item.title" v-bind="cardAttr">
          <a-button type="primary" slot="extra" @click="openSelectModal(type)">选择</a-button>
          <a-table :columns="item.col" :dataSource="item.data" v-if="item.data.length > 0"
                   bordered>
            <span slot="action" slot-scope="text, record,index">
          <!--<a @click="handleEdit(record)">编辑</a>-->
              <!--     <a-tag :color="primaryColor" @click="handleEdit(record,'2')">准入</a-tag>
                   <a-tag :color="primaryColor" @click="handleEdit(record,'3')">药品</a-tag>
                   <a-tag :color="primaryColor" @click="handleEdit(record,'4')">项目</a-tag>
                   <a-tag :color="primaryColor" @click="handleEdit(record,'1','moreInfo')">资料</a-tag>
                   <a-divider type="vertical"/>-->
              <a @click="item.data.splice(index,1)">移除</a>
            </span>
            <template slot="edit" slot-scope="text, record,index">
              <a-textarea placeholder="请输入" allowClear autosize v-model="record.desc"/>
            </template>
          </a-table>
        </a-card>
      </template>
    </a-spin>
    <m-modal
      :title="`选择${selectInfo.title}`"
      v-model="selectModalVisible"
      @ok="handleSelected">
      <component :is="selectInfo.components" ref="selectModal" v-bind="selectInfo.params||{}"
                 :selected="selectInfo.data"></component>
    </m-modal>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalGroup from '@/pages/selectMulti/MedicalGroup'
  import MedicalOperation from '@/pages/selectMulti/MedicalOperation'
  import MedicalTreatProject from '@/pages/selectMulti/MedicalTreatProject'
  import MedicalPathology from '@/pages/selectMulti/MedicalPathology'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "MedicalClinicalModal",
    components: {
      MedicalGroup,
      MedicalOperation,
      MedicalTreatProject,
      MedicalPathology,
      MDictSelectTag
    },
    data() {
      const diseaseColumns = [
        {
          title: '疾病编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: '疾病名称',
          align: "center",
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ]
      const operationColumns = [
        {
          title: '手术编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: '手术名称',
          align: "center",
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ]
      const checkItemColumns = [
        {
          title: '项目编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: '项目名称',
          align: "center",
          dataIndex: 'name',
        },
        {
          title: '检查检验结果',
          dataIndex: 'edit',
          width: 200,
          scopedSlots: { customRender: 'edit' },
        },
        {
          title: '操作',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ]
      /*const labWorkColumns = [
        {
          title: '化验项目编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: '化验项目名称',
          align: "center",
          dataIndex: 'name',
        },
        /!* {
           title: '描述',
           dataIndex: 'remark',
         },*!/
      ]*/
      const drugColumns = [
        {
          title: '药品组编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: '药品组名称',
          align: "center",
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ]
      const pathologyColumns = [
        {
          title: 'YX形态学编码',
          align: "center",
          dataIndex: 'code',
        },
        {
          title: 'YX形态学名称',
          align: "center",
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'descript',
          align: "center",
        },
        {
          title: '操作',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ]
      return {
        title: "配置准入条件组",
        visible: false,
        selectModalVisible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        cardAttr: {
          headStyle: { fontSize: '16px', padding: 0, border: 'none' },
          bodyStyle: { padding: 0 },
          style: { border: 'none' }
        },
        selectInfoObj: {
          'diseaseGroups': {
            title: '疾病组', components: 'MedicalGroup', params: { kind: '5' }, data: [], col: diseaseColumns
          },
          'operations': {
            title: '手术或操作编码/名称', components: 'MedicalOperation', params: {}, data: [], col: operationColumns
          },
          'checkItems': {
            title: '检查化验项目', components: 'MedicalTreatProject', params: {}, data: [], col: checkItemColumns
          },
          /*'labworkItems': {
            title: '化验项目', components: 'MedicalTreatProject', params: {}, data: [], col: labWorkColumns
          },*/
          'drugGroups': {
            title: '药品组', components: 'MedicalGroup', params: { kind: '7' }, data: [], col: drugColumns
          },
          'pathologys': {
            title: '病理形态编码/名称', components: 'MedicalPathology', params: {}, data: [], col: pathologyColumns
          }
        },
        selectInfo: {},
        diseaseData: [],
        diseaseColumns,
        operationData: [],
        operationColumns,
        checkItemData: [],
        checkItemColumns,
        labWorkData: [],
        // labWorkColumns,
        drugData: [],
        drugColumns,
      }
    },
    beforeMount() {
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({ dataStatus: '1', publicStatus: '1' }, record);
        // 清空赋值选择项
        let list = this.model.list || []
        for (let type in this.selectInfoObj) {
          let item = list.find(item => item.field === type)
          let obj = this.selectInfoObj[type]
          obj.data = []
          console.log(type, item)
          if (item && item.data && item.data.length > 0) {
            console.log(type, item.data)
            obj.data.push(...item.data)
          }
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'groupName', 'patientAgeMin', 'patientAgeMax', 'hospBelongTo'))
        });

      },
      openSelectModal(type) {
        this.selectInfo = this.selectInfoObj[type]
        this.selectModalVisible = true
      },
      handleSelected() {
        let array = this.$refs.selectModal.getSelect()
        const oldSelect = this.selectInfo.data
        this.selectInfo.data = array.map(item => {
          return oldSelect.find(oldItem => oldItem.code === item.code)
            || {
              code: item.code,
              name: item.name,
              remark: item.remark
            }
        })
        this.selectModalVisible = false

      },
      close() {
        this.handleOk()
      },
      onChange() {

      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            let formData = Object.assign(this.model, values);
            let list = formData.list = []
            for (let type in this.selectInfoObj) {
              let obj = this.selectInfoObj[type]
              console.log(type, obj.data)
              if (obj.data.length > 0) {
                list.push({ field: type, title: obj.title, data: [...obj.data] })
              }
            }
            console.log('formData', formData)
            this.$emit('close', formData);
            this.visible = false;
          }
        })
      },
      handleCancel() {
        this.close()
      },
    }
  }
</script>

<style lang="less" scoped>
  .box-padding {
    padding: 16px 16px 0 16px;
  }
</style>
