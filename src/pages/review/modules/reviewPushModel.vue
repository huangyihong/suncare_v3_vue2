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
                        label="批次名称">
                    <a-input placeholder="请输入批次名称" v-model="projectBatch.batchName" readOnly/>
                </a-form-item>
                <a-form-item
                        label="推送范围"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                    <a-select v-model="assignType">
                        <a-select-option value="ALL">当前列表全部</a-select-option>
                        <a-select-option value="QUERY">当前条件全部</a-select-option>
                        <a-select-option value="SELECT">当前列表已选择</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                        label="复审判定范围"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                    <m-multi-select-tag dictCode="FIRST_REVIEW_STATUS"
                                        :filter="r => r.code !== 'white' && r.code !== 'init'"
                                        v-decorator="['secReviewStatus', validatorRules.required]"
                                        separator="|"></m-multi-select-tag>
                    <!--<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"></m-dict-select-tag>-->
                </a-form-item>
                <!--<a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="推送负责人">
                  <a-input placeholder="请输入推送负责人"  />
                </a-form-item>-->
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="风控报告周期">
                    <a-tree-select
                            :triggerChange="true" v-decorator="['issueId', validatorRules.required ]"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            :tree-data="newsTreeData"
                            placeholder="请选择风控报告周期"
                            @select="onSelectIssueId"
                            tree-default-expand-all
                            :getPopupContainer="
                      triggerNode =>{
                        return triggerNode.parentNode || document.body;
                      }"
                    >
                    </a-tree-select>
                </a-form-item>
                <!-- <a-form-item
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="推送时间">
                   <a-input placeholder="推送时间"  />
                 </a-form-item>-->
                <!-- <a-form-item
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备注">
                   <a-input placeholder="请输入备注" v-decorator="['remark', {} ]" />
                 </a-form-item>-->

            </a-form>
        </a-spin>

        <div class="drawer-bootom-button" v-show="!disableSubmit">
            <a-button type="primary" @click="handleOk" style="margin-right: .8rem">保存</a-button>
            <a-button @click="handleCancel">取消</a-button>
        </div>
    </a-drawer>
</template>

<script>
  import { httpAction, putAction } from '@/api-sv3/manage'
  import { getAction } from '@/api/riskportalManage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { queryBatchAndProjectById } from '@/api-sv3/api'
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"

  export default {
    name: "reviewModal",
    props: {
      batchId: {
        type: String,
        required: true
      },
    },
    components: {
      MMultiSelectTag
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          savePush: this.$suncare_v3 + "/apiReviewSec/pushRecord",
          // queryNewsTree: this.$riskportal_v3 + "/news/newsDetailPub/queryTree?pageType=5",
          queryNewsTree: "/news/newsDetailPub/queryTree?pageType=5",
        },
        ids: [],
        listParams: [],
        assignType: 'SELECT',
        newsTreeData: [],//风控报告周期树
        projectBatch: {},//批次信息
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
        this.model = Object.assign({}, record);
        this.visible = true;
        this.queryNewsTree()
        /* this.$nextTick(() => {
           this.form.setFieldsValue(pick(this.model,'reviewName','firReviewStatus','pushStatus','firReviewRemark'))
         });*/

      },
      close() {
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            // let {issueId, remark} = values
            // let formData = {remark}
            let { issueId,secReviewStatus } = values
            let formData = {secReviewStatus}
            if (this.assignType === 'SELECT') {
              if (this.ids.length === 0) {
                this.$message.warn("请至少勾选一条记录")
                return
              }
              formData.ids = this.ids.join(",");
              if (this.listParams.groupBys) {
                Object.assign(formData, this.listParams)
              }
            } else if (this.assignType === 'QUERY') {
              Object.assign(formData, this.listParams)
            } else {
              //全部
              if (this.listParams.secPushStatus) {
                formData.secPushStatus = this.listParams.secPushStatus
              } else {
                formData.secPushStatus != '-1'
              }

              formData.pushStatus = '1'
            }

            let reviewInfo = this.model

            //项目批次信息
            reviewInfo.xmmcId = this.project.projectId
            reviewInfo.xmmcName = this.project.projectName
            reviewInfo.taskBatchId = this.projectBatch.batchId
            reviewInfo.taskBatchName = this.projectBatch.batchName
            reviewInfo.issueId = issueId

            formData.batchId = this.batchId
            formData.reviewInfo = JSON.stringify(reviewInfo)


            console.log('formData', formData)
            that.confirmLoading = true;
            putAction(this.url.savePush, formData).then((res) => {
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
      loadData(ids, params) {
        this.visible = true;
        this.getTaskProjectBatch(this.batchId)
        this.ids = ids
        this.listParams = params
        console.log('listParams', this.listParams)
        this.add()

      },

      //获取项目批次信息
      getTaskProjectBatch(id) {
        queryBatchAndProjectById({ id }).then((res) => {
          if (res.success) {
            let { project = {}, projectBatch = {} } = res.result
            this.project = project
            this.projectBatch = projectBatch
          } else {
            this.$message.warning(res.message)
          }
        })
      },

      //项目周期选择树
      queryNewsTree() {
        getAction(this.url.queryNewsTree, '').then(res => {
          if (res.success) {
            this.newsTreeData = res.result;
          } else {
            this.$message.warning(res.message)
          }
        })
      },

      //选中风控报告周期
      onSelectIssueId(value, node, extra) {
        console.log('node', node)
        if (node.dataRef.issueId) {
          this.model.issueId = node.dataRef.issueId
          this.model.issueName = node.dataRef.issueName
          this.model.xmkhId = node.dataRef.untitled
          this.model.xmkhName = node.dataRef.untitledName
        } else {
          this.$message.warn("请选择具体周期")
          this.model.issueId = ''
          this.model.issueName = ''
          this.model.xmkhId = ''
          this.model.xmkhName = ''
          this.$nextTick(() => {
            this.form.setFieldsValue(
              pick(this.model, 'issueId')
            )
          })
        }
      },
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
