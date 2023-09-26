<template>
  <a-drawer
    :title="title"
    :width="700"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-spin :spinning="confirmLoading">
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="{span:24}"
        extra="拖动项目更改排列顺序">
        <a-row :gutter="24">
          <a-col :span="5">
            <a-button type="primary" @click="openSelect" v-if="itemTagType === '1'">选择字典
            </a-button>
            <a-button type="primary" @click="addSelectItem" v-else-if="itemTagType === '2'">增加字典
            </a-button>
          </a-col>
          <a-col :span="24">

            <a-row class="title">
              <a-col :span="10">编码</a-col>
              <a-col :span="10">名称</a-col>
              <a-col :span="4">操作</a-col>
            </a-row>

            <draggable :options="{animation: 300}" v-model="selectData" @end="saveOrder()">
              <a-row v-for="(item,index) in selectData" :key="item.key" :gutter="8" class="list-item">
                <template v-if="cacheData[item.key]">
                  <a-col :span="10">
                    <a-input v-model="cacheData[item.key].code"></a-input>
                  </a-col>
                  <a-col :span="10">
                    <a-input v-model="cacheData[item.key].name"></a-input>
                  </a-col>
                </template>
                <template v-else>
                  <a-col :span="10">{{item.code}}</a-col>
                  <a-col :span="10">{{item.name}}</a-col>
                </template>
                <a-col :span="4">
                    <span v-if="cacheData[item.key]">
                      <a @click="() => rowSave(index)">确定</a>
                      <a-divider type="vertical"/>
                      <a @click="() => rowCancel(index)">取消</a>
                    </span>
                  <span v-else>
                      <template v-if="itemTagType === '2'">
                        <a @click="() => rowEdit(index)">编辑</a>
                        <a-divider type="vertical"/>
                      </template>
                      <a-popconfirm title="确定删除吗?" @confirm="() => deleteItem(index,item.itemId)">
                        <a>删除</a>
                      </a-popconfirm>
                    </span>
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
      <!--<a-button type="primary" @click="handleOk">确定</a-button>-->
    </div>
  </a-drawer>
</template>

<script>
  import { postAction, putAction, deleteAction } from '@/api-sv3/manage'
  import { queryDictItemsByCode } from '@/api-sv3/api-medical'

  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import draggable from 'vuedraggable'

  export default {
    name: "MedicalFieldTypeModal",
    components: {
      MDictSelectTag,
      draggable
    },
    data() {
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
          sm: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/config/medicalDict/add",
          edit: "/config/medicalDict/edit",
          addItem: "/config/medicalDictItem/add",
          editItem: "/config/medicalDictItem/edit",
          deleteItem: "/config/medicalDictItem/delete",
          editItemOrders: "/config/medicalDictItem/editOrders",
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
    /*  handleSelectOk() {
        this.selectData = this.$refs.selectRef.getSelect()
        this.handleSelectClose()
      },*/
      handleSelectClose() {
        this.selectVisible = false
      },
      add() {
        this.edit({});
      },
      edit(groupCode,kind = '99') {
        this.form.resetFields();
        this.model = {groupCode,kind}
        this.visible = true;
        this.loadDelData(groupCode)
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
            this.selectData = res.result.map((item, index) => {
              return { code: item.code, name: item.value, key: index + '', itemId: item.itemId }
            })
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
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
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
              formData.codes = this.selectData.map(item => item.code).join(",")
              formData.names = this.selectData.map(item => item.name).join(",")
            }

            console.log(formData)
            httpAction(httpurl, formData).then((res) => {
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
      addSelectItem() {
        this.selectData.push({ code: '', name: '', key: Math.random() + '' })
        this.rowEdit(this.selectData.length - 1)
      },
      rowEdit(index) {
        const target = this.selectData[index]
        this.$set(this.cacheData, target.key, { ...target })
      },
      rowSave(index) {
        const target = this.selectData[index]
        const cache = this.cacheData[target.key]
        if (cache.code.trim().length === 0 || cache.name.trim().length === 0) {
          this.$message.error('保存失败，不能为空')
        }
        if (!this.model.groupId || this.model.groupId.length === 0) {
          //新增
          this.selectData[index] = cache
          this.$set(this.cacheData, target.key, undefined)
        } else {
          //修改
          let record = {
            itemId: target.itemId, groupId: this.model.groupId,
            code: cache.code.trim(), value: cache.name.trim(), isOrder: index
          };
          this.saveItem(record, index);
        }
      },
      rowCancel(index) {
        const target = this.selectData[index]
        if (target.code.trim().length === 0 && target.name.trim().length === 0) {
          this.rowDel(index)
        }
        this.$set(this.cacheData, target.key, undefined)
      },
      rowDel(index) {
        this.selectData.splice(index, 1);
      },
      deleteItem(index, itemId) {
        if (!this.model.groupId || this.model.groupId.length === 0) {
          //新增
          this.rowDel(index)
          return
        }
        let that = this;
        deleteAction(that.url.deleteItem, { id: itemId }).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.rowDel(index);
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      saveItem(record, index) {
        const target = this.selectData[index]
        const cache = this.cacheData[target.key]
        const that = this;
        that.confirmLoading = true;
        let httpurl = '';
        let httpAction;
        if (!record.itemId) {
          httpurl += this.url.addItem;
          httpAction = postAction
        } else {
          httpurl += this.url.editItem;
          httpAction = putAction
        }
        httpAction(httpurl, record).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.selectData[index] = cache
            that.$set(this.cacheData, target.key, undefined)
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
      },
      saveOrder() {
        const that = this;
        that.confirmLoading = true;
        let itemIds = this.selectData.map((item, index) => {
          if (item.itemId) {
            return item.itemId
          }
        }).join(",");
        putAction(this.url.editItemOrders, { 'itemIds': itemIds }).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
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
