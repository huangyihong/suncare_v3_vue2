<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-spin :spinning="confirmLoading" ref="rootDom">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分组编码">
          <a-input placeholder="请输入分组编码" v-decorator="['groupCode', validatorRules.required]"
                   :readOnly="!!model.groupId"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分组名称">
          <a-input placeholder="请输入分组名称" v-decorator="['groupName', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序号">
          <a-input-number :min="0" :max="1000" :step="1"
                          v-decorator="['isOrder', {initialValue: 1,...validatorRules.requiredOnly}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-input placeholder="请输入描述" v-decorator="['remark', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典类型"
          extra="拖动图标更改排列顺序">
          <a-row :gutter="24">
            <a-col :span="19">
              <m-dict-select-tag placeholder="字典类型" dictCode="DRUG_GROUP_KIND" :showKey="true"
                                 v-decorator="['kind', validatorRules.required]" :triggerChange="true"
                                 @change="kindChange"></m-dict-select-tag>
            </a-col>
            <a-col :span="5">
              <a-affix :offset-top="10" :target="modalBody">
                <a-button type="primary" @click="openSelect" v-if="itemTagType === '1'">选择字典
                </a-button>
                <a-button type="primary" @click="addSelectItem" v-else-if="itemTagType === '2'">增加字典
                </a-button>
              </a-affix>
            </a-col>
            <a-col :span="24">

              <a-row class="title">
                <a-col :span="10">编码</a-col>
                <a-col :span="10">名称</a-col>
                <a-col :span="4" class="t-c">操作</a-col>
              </a-row>

              <draggable :options="{animation: 300}" v-model="selectData" handle=".move-item">
                <a-row v-for="(item,index) in selectData" :key="item.itemId" :gutter="8" class="list-item">
                  <a-col :span="10">
                    <a-input v-model.trim="item.code"></a-input>
                  </a-col>
                  <a-col :span="10">
                    <a-input v-model.trim="item.value" ></a-input>
                  </a-col>
                  <a-col :span="4" class="t-c">
                    <a-icon type="drag" class="move-item" style="font-size: 20px;cursor: pointer" title="拖动"/>
                    <a-divider type="vertical"/>
                      <a-popconfirm title="确定删除吗?" @confirm="() => rowDel(index)">
                      <a>删除</a>
                      </a-popconfirm>
                  </a-col>
                </a-row>
              </draggable>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
    <m-modal
      centered
      :title="'选择'+selectInfo.title"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="selectVisible=false"
      cancelText="关闭">
      <component :is="selectInfo.component" ref="selectRef" v-bind="selectInfo.params||{}"
                 :selected="selectData" :fixedParam="selectInfo.fixedParam"></component>
    </m-modal>
  </a-drawer>
</template>

<script>
  import { postAction, putAction } from '@/api-sv3/manage'
  import { queryDictItemsByCode } from '@/api-sv3/api-medical'

  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import MedicalTreatProject from "@/pages/selectMulti/MedicalTreatProject"
  import MedicalOperation from "@/pages/selectMulti/MedicalOperation"
  import MedicalDict from "@/pages/selectMulti/MedicalDict"
  import MedicalDiseaseDiag from "@/pages/selectMulti/MedicalDiseaseDiag"
  import draggable from 'vuedraggable'

  export default {
    name: "MedicalDictModal",
    components: {
      MDictSelectTag,
      MedicalDrug,
      MedicalTreatProject,
      MedicalOperation,
      MedicalDict,
      MedicalDiseaseDiag,
      draggable
    },
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
          add: "/config/medicalDict/add",
          edit: "/config/medicalDict/edit",
        },
        columns: [
          { title: '字典编码', dataIndex: 'code', width: '30%', scopedSlots: { customRender: 'code' }, },
          { title: '字典名称', dataIndex: 'name', width: '40%', scopedSlots: { customRender: 'name' }, },
          { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, align: "center", },
          { title: '顺序', dataIndex: 'order', scopedSlots: { customRender: 'order' }, align: "center", },],
        itemTagType: '',
        selectData: [],
        cacheData: {},
        selectInfos: {
          '1': { title: '治疗项目(诊疗项目)', component: 'MedicalTreatProject' },
          '2': { title: '治疗方式(手术编码)', component: 'MedicalOperation' },
          '3': { title: '重复用药(药品信息)', component: 'MedicalDrug' },
          '4': { title: '二线用药(药品信息)', component: 'MedicalDrug' },
          '5': { title: '适应症(疾病诊断)', component: 'MedicalDiseaseDiag' },
          '6': { title: '重复诊疗(诊疗项目)', component: 'MedicalTreatProject' },
          '7': { title: '治疗用药(药品信息)', component: 'MedicalDrug' },
          '8': { title: '疾病-项目(治疗项目分组)', component: 'MedicalDict', params: { kind: '1' } },
        },
        selectInfo: {},
        selectVisible: false,
      }
    },
    beforeMount() {

    },
    methods: {
      openSelect() {
        this.selectVisible = true
      },
      kindChange(kind) {
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.itemTagType = '1'
            this.selectInfo = info
          } else {
            this.itemTagType = '2'
          }
        } else {
          this.itemTagType = ''
        }
        this.selectData = []
        this.cacheData = {}
      },
      handleSelectOk() {
        this.selectData = this.$refs.selectRef.getSelect().map(record => {
          return { ...record, value: record.name }
        })
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        console.log('record', record)
        this.loadDelData(this.model.groupCode)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'groupCode', 'groupName', 'code', 'value', 'isOrder', 'remark', 'orgId', 'kind'))
          this.kindChange(this.model.kind)
        });

      },
      loadDelData(groupCode) {
        if (!groupCode || groupCode.length === 0)
          return
        this.confirmLoading = true
        queryDictItemsByCode({ type: groupCode }).then(res => {
          if (res.success) {
            this.selectData = res.result
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        this.selectData = this.selectData.filter(r => r.code && r.code.length > 0 && r.value && r.value.length)
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            let httpurl = '';
            let httpAction;
            if (!this.model.groupId) {
              httpurl += this.url.add;
              httpAction = postAction
            } else {
              httpurl += this.url.edit;
              httpAction = putAction
            }
            let formData = Object.assign(this.model, values);
            // 选择项
            // this.selectData = this.selectData.filter(item => !item.editable)
            // this.selectData = this.selectData.filter(item => !!item.code && !!item.name)
            if (this.selectData.length > 0) {
              // this.selectData = this.selectData.reverse()
              formData.codes = this.selectData.map(item => item.code).join(",")
              formData.names = this.selectData.map(item => item.value).join(",")
            }

            console.log(formData)
            that.confirmLoading = true;
            httpAction(httpurl, formData).then((res) => {
              if (res.success) {
                if(this.model.groupId && this.model.kind === '99'){
                  // 清除缓存
                  this.$util.clearCache('MDict_' + this.model.groupCode)
                }
                that.$message.success(res.message);
                that.$emit('ok');
                that.close();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })


          }
        })
      },
      handleCancel() {
        this.close()
      },
      addSelectItem() {
        this.selectData.push({ code: '', name: '', itemId: Math.random() + '' })},
      rowDel(index) {
        this.selectData.splice(index, 1)
      },
      modalBody() {
        if(this.scrollDom){
          return this.scrollDom
        }
        let dom = this.$refs.rootDom.$el
        while(!dom.classList.contains('ant-drawer-wrapper-body')){
          dom = dom.parentElement
        }
        this.scrollDom = dom
        return dom
        // return document.getElementById('content');
      },
    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

  .list-item {
    /*border-bottom: 1px solid #e8e8e8;*/
  }
</style>
