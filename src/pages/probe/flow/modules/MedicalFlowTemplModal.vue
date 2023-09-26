<template>
    <a-drawer
            :title="title"
            :width="1000"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-form-item label="节点编码">
                    <a-input placeholder="请输入节点编码" v-decorator="['nodeCode', validatorRules.required]"
                             :readOnly="readonly"/>
                </a-form-item>
                <a-form-item label="节点名称">
                    <a-input placeholder="请输入节点名称" v-decorator="['name', validatorRules.required]"
                             :readOnly="readonly"/>
                </a-form-item>
                <a-form-item label="分类">
                    <m-dict-select-tag placeholder="选择节点分类" dictCode="FLOW_TEMPL_KIND" required
                                       v-decorator="['nodeKind']" :disabled="readonly"></m-dict-select-tag>
                </a-form-item>
                <a-form-item label="所属表">
                    <table-select-tag v-decorator="['tableName', validatorRules.required]"
                                      @change="tableSelectChange" :readonly="readonly"
                                      placeholder="选择所属表" required :loaded="tableDwsLoaded"
                                      :filter="tableFilter"></table-select-tag>
                </a-form-item>
            </a-form>
            <a-spin :spinning="rulesLoading">
                <div style="padding: 10px 0;display: flex;justify-content: space-between">
                    <span style="font-size: 18px">规则详情</span>
                    <span>
          <a-button @click="addGroup" type="primary" v-if="!readonly">增加组</a-button>
          <a-button type="primary" icon="bar-chart" v-if="groups.length > 0" @click="test"
                    style="margin-left: 8px">试算</a-button>
          <a-button @click="clearRule" style="margin-left: 8px" v-if="!readonly">清除</a-button>
        </span>

                </div>
                <div class="fieldset-box">
                    <rule-content ref="ruleRef" :tableName="tableName" :readonly="readonly" @groupChange="ruleChange">
                        <!--@groupChange="val => groups = val" -->
                    </rule-content>
                </div>
            </a-spin>


            <div style="font-size: 18px;padding: 10px 0;" v-show="showResult">节点结果</div>
            <div class="fieldset-box" v-show="showResult">
                <node-result ref="resultRef" :nodeName="model.name" :nodeKey="nodeKey"
                             tableName="DWB"
                             :caseData="nodeTestParams" @getParams="(key)=> nodeTestParams=getTestParam(key)"
                ></node-result>
            </div>
        </a-spin>
        <div class="drawer-bottom">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk" v-if="!readonly">确定</a-button>
        </div>
    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { queryFlowTemplRulesById } from '@/api-sv3/api-flow'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import RuleContent from '@/pages/probe/case/caseRuleDetail';
  import NodeResult from '@/pages/probe/case/nodeResult';
  import tableSelectTag from "@/pages/probe/case/tableSelectTag"

  export default {
    name: "MedicalFlowTemplModal",
    components: {
      MDictSelectTag,
      RuleContent,
      NodeResult,
      tableSelectTag,
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
        rulesLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/probe/medicalFlowTempl/add",
          edit: "/probe/medicalFlowTempl/edit",
          queryById: "/probe/medicalFlowTempl/queryById",
        },
        nodeKey: '1',
        nodeTestParams: [],
        groups: [],
        showResult: false,
        readonly: false,
        tableName: undefined,
        tableFilter: r => true
      }
    },
    beforeMount() {
      let ruleFunNames = [
        'addGroup',
        'clearRule',
        'deleteGroups',]
      const that = this
      ruleFunNames.forEach(item => {
        that[item] = function(...arg) {
          console.log(item, arg)
          return that.$refs.ruleRef[item](...arg)
        }
      })
      this.$util.initDict('DATA2').then(data => {
        let filterTables = data.map(r => r.code)
        this.tableFilter = r => filterTables.indexOf(r.code) === -1
      })
    },

    methods: {
      test() {
        if (this.$refs.ruleRef.validateData(this.nodeKey)) {
          this.showResult = true
          this.$refs.resultRef.trail()
        }
      },
      getTestParam(key) {
        let rules = this.getRules([key])
        // 只有节点结果有动态字段列表
        let cols = this.$refs.ruleRef.getCols(rules)
        let flowJson = {
          "class": "GraphLinksModel",
          "nodeDataArray":
            [{ "category": "rectangle", "text": "", "type": "rect", "key": this.nodeKey }], "linkDataArray": []
        }
        return { flowJson, rules, cols }
      },
      getRules(keys) {
        return this.$refs.ruleRef.getRules(keys)
      },
      ruleChange(val) {
        this.groups = val
      },

      add() {
        this.edit({});
      },
      edit(record, nodeKey, rules = []) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.showResult = false;
        this.$nextTick(() => {
          this.form.setFieldsValue({
              ...pick(this.model, 'nodeId', 'nodeCode', 'nodeName', 'nodeKind', 'tableName'),
              // nodeName 和选择框冲突
              name: this.model.nodeName
            }
          )
          if (this.model.nodeId) {
            this.loadRules(this.model.nodeId)
          } else {
            this.nodeKey = nodeKey || '1'
            this.setData(this.nodeKey, rules)
          }
        });
      },
      detail(id, readonly = true) {
        if (typeof id === 'string') {
          this.confirmLoading = true
          getAction(this.url.queryById, { id }).then(res => {
            if (res.success) {
              this.edit(res.result)
            } else {
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.edit(id)
        }

        this.readonly = readonly
        this.visible = true
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        if (!this.$refs.ruleRef.validateData(this.nodeKey)) {
          return
        }
        const rules = this.getRules([this.nodeKey])
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.nodeId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            // 名字字段转换
            formData.nodeName = formData.name
            delete formData.name
            formData.rules = rules
            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
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
      loadRules(id) {
        this.rulesLoading = true
        queryFlowTemplRulesById({ id }).then(res => {
          if (res.success) {
            let data = res.result
            data.forEach(item => item.nodeCode = this.nodeKey)
            this.setData(this.nodeKey, data)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.rulesLoading = false
        })
      },
      setData(nodeKey, data){
        this.$refs.ruleRef.setRules(data)
        this.$refs.ruleRef.nodeChange(this.nodeKey)

        if (data.length > 0) {
          if (data[0].tableName.startsWith("DWS")) {
            this.tableName = data[0].tableName
          } else {
            this.tableName = 'DWB'
          }
        } else {
          this.tableName = 'DWB'
        }
        this.form.setFieldsValue({tableName: this.tableName})
      },
      tableDwsLoaded(dicts) {
        let data = dicts.filter(item => item.code.startsWith("DWS"))
        data.unshift({ value: 'DWB表', code: 'DWB' })
        return data
      },
      tableSelectChange(val) {
        this.$refs.ruleRef.clearRule()
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
