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
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查编号">
              <a-input placeholder="请输入检查编号" v-decorator="['projectNo', validatorRules.required]" :readOnly="!!model.projectId"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查名称">
              <a-input placeholder="请输入检查名称" v-decorator="['projectName', validatorRules.required]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="检查负责机构">
              <a-input placeholder="请输入检查负责机构" v-decorator="['actionOrg', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查所属行动">
              <a-input placeholder="请输入检查所属行动" v-decorator="['actionTitle', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查小组">
              <a-input placeholder="请输入检查小组" v-decorator="['actionTeam', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查负责人">
              <a-input placeholder="请输入检查负责人" v-decorator="['actionFzr', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="负责人联系方式">
              <a-input placeholder="请输入负责人联系方式" v-decorator="['actionFzrPhone', validatorRules.isMobile]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="紧急程度">
              <m-dict-select-tag placeholder="请选择紧急程度" dictCode="URGENT_LEVEL"
                                 v-decorator="['urgentLevel', {}]"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="检查开始日期">
              <a-date-picker style="width: 100%" placeholder="请选择检查开始日期" format='YYYY-MM-DD' v-decorator="[ 'actionDate', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="检查时间范围">
              <a-date-picker style="width: 48%" placeholder="请选择检查时间范围" v-decorator="['checkStartdate', {}]"
                             class="search-divider-item2"></a-date-picker>
              <div class="search-divider" style="width: 4%">~</div>
              <a-date-picker style="width: 48%" placeholder="请选择检查时间范围" v-decorator="['checkEnddate', {}]"
                             class="search-divider-item2"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="">
              <span style="display:block;width:136px;" class="t-r">被检单位管理：</span>
              <a-button type="primary" @click="selectVisible = true" class="m-l-40">选择医疗机构</a-button>
              <!--<a-button type="primary" @click="handleAdd1" class="m-l-20">医院信息上传</a-button>-->
              <div class="m-t-20 m-l-40">
                <a-table size="small" rowKey="id"
                         :columns="columns"
                         :data-source="selectData" :showHeader="true" bordered :pagination="false" :hideTools="true">
                  <span slot="action" slot-scope="text, record, index">
                      <div class="ft-12 delBtn" @click="removeOrg(index)">移除</div>
                  </span>
                </a-table>
              </div>

            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>

    <m-modal centered
             title="选择医疗机构"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-fj-org ref="selectRef" :selected="selectData"></select-fj-org>
    </m-modal>
  </a-drawer>
</template>

<script>
import { httpAction,getAction } from '@/api/manage'
import pick from 'lodash/pick'
import moment from "moment"

import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import SelectFjOrg from "@/pages/selectMulti/YbFjOrgList"

export default {
  name: "inspectionModule",
  components: {
    MDictSelectTag,
    SelectFjOrg
  },
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
        sm: { span: 19 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        isMobile: { rules: [{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号!' }] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/fj/project/add",
        edit: "/fj/project/edit",
        orgList: "/fj/project/orgList",
      },
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: '60px',
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '医疗机构名称',
          align: "left",
          width: '150px',
          dataIndex: 'orgName'
        },
        {
          title: '医院负责人',
          align: "left",
          width: '100px',
          dataIndex: 'responsible'
        },
        {
          title: '负责人联系方式',
          align: "left",
          width: '100px',
          dataIndex: 'responsiblePhone'
        },
        {
          title: '医疗机构地址',
          dataIndex: 'orgAddress',
          align: "left",

        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          width: '60px',
          scopedSlots: {customRender: 'action'}

        },

      ],
      dataSource:[],
      selectVisible: false,//显示选择医疗机构窗口
      selectData: [],//选中医疗机构的值

    }
  },
  created () {
  },
  methods: {
    add () {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.selectData = []
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'projectNo','projectName','actionOrg','actionTitle','actionTeam','actionFzr','actionFzrPhone','urgentLevel'))
        //时间格式化
        this.form.setFieldsValue({checkEnddate: this.model.checkEnddate ? moment(this.model.checkEnddate) : null})
        this.form.setFieldsValue({checkStartdate: this.model.checkStartdate ? moment(this.model.checkStartdate) : null})
        this.form.setFieldsValue({actionDate: this.model.actionDate ? moment(this.model.actionDate) : null})
      });

      if(this.model.projectId){
        //获取医疗机构
        this.loadOrgData(this.model.projectId)
      }

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
          if(!this.model.projectId){
            httpurl+=this.url.add;
            method = 'post';
          }else{
            httpurl+=this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          formData.checkEnddate = formData.checkEnddate ? formData.checkEnddate.format('YYYY-MM-DD') : null;
          formData.checkStartdate = formData.checkStartdate ? formData.checkStartdate.format('YYYY-MM-DD') : null;
          formData.actionDate = formData.actionDate ? formData.actionDate.format('YYYY-MM-DD') : null;
          //医疗机构
          formData.orgIds = this.selectData.map(r => r.orgId).join(',')
          console.log(formData)
          httpAction(httpurl,formData,method).then((res)=>{
            if(res.success){
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
      })
    },
    handleCancel () {
      this.close()
    },

    //选择医疗机构确定
    handleSelectOk() {
      this.selectData = this.$refs.selectRef.getSelect()
      this.handleSelectClose()
    },
    //关闭选择医疗机构
    handleSelectClose() {
      this.selectVisible = false
    },
    loadOrgData(projectId) {
      if(!projectId){
        this.selectData = []
        return
      }
      getAction(this.url.orgList, { projectId }).then(res => {
        if (res.success) {
          this.selectData = res.result.records
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    removeOrg(index){
      this.selectData.splice(index, 1)
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
  .delBtn {
    color: #f3191c;
    cursor: pointer;
  }
</style>
