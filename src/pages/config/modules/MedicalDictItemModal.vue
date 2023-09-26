<template>
    <a-drawer
            :title="title"
            :width="700"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible">
        <a-spin :spinning="confirmLoading" ref="rootDom">
            <a-affix :offset-top="10" :target="modalBody">
                <a-button type="primary" @click="addSelectItem">增加字典
                </a-button>
            </a-affix>
            <a-form>

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="{span:24}"
                        extra="拖动图标更改排列顺序">
                    <a-row :gutter="24">
                        <a-col :span="24">

                            <a-row class="title">
                                <a-col :span="10">编码</a-col>
                                <a-col :span="10">名称</a-col>
                                <a-col :span="4" class="t-c">操作</a-col>
                            </a-row>

                            <draggable :options="{animation: 300}" v-model="selectData" handle=".move-item">
                                <a-row v-for="(item,index) in selectData" :key="item.itemId" :gutter="8"
                                       class="list-item">
                                    <a-col :span="10">
                                        <a-input v-model.trim="item.code" :readOnly="autoIncrease"></a-input>
                                    </a-col>
                                    <a-col :span="10">
                                        <a-input v-model.trim="item.value"></a-input>
                                    </a-col>
                                    <a-col :span="4" class="t-c">
                                        <a-icon type="drag" class="move-item" style="font-size: 20px;cursor: pointer"
                                                title="拖动"/>
                                        <a-divider type="vertical"/>
                                        <!--<a-popconfirm title="确定删除吗?" @confirm="() => rowDel(index)">-->
                                        <a @click="rowDel(index)">移除</a>
                                        <!--</a-popconfirm>-->
                                    </a-col>
                                </a-row>
                            </draggable>
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-spin>
        <div class="drawer-bottom">
            <a-button @click="close">关闭</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
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
    name: "MedicalDictItemModal",
    components: {
      MDictSelectTag,
      draggable
    },
    props: ['autoIncrease'],
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
        url: {
          edit: "/config/medicalDict/updateItems",
        },
        columns: [
          { title: '字典编码', dataIndex: 'code', width: '30%', scopedSlots: { customRender: 'code' }, },
          { title: '字典名称', dataIndex: 'name', width: '40%', scopedSlots: { customRender: 'name' }, },
          { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, align: "center", },
          { title: '顺序', dataIndex: 'order', scopedSlots: { customRender: 'order' }, align: "center", },],
        selectData: [],
        oldData: [],
      }
    },
    methods: {
      edit(groupCode) {
        this.visible = true;
        this.model = { groupCode }
        this.loadDelData(groupCode)
      },
      loadDelData(groupCode) {
        if (!groupCode || groupCode.length === 0)
          return
        this.confirmLoading = true
        queryDictItemsByCode({ type: groupCode }).then(res => {
          if (res.success) {
            let data = this.selectData = res.result
            let oldData = this.oldData = data.map(r => ({ ...r }))
            this.$util.initDict(groupCode).then(data => {
              if (oldData.length !== data.length) {
                this.refreshDict()
                return
              }
              for (let i = 0, len = data.length; i < len; i++) {
                // console.log(oldData[i],data[i])
                if (oldData[i].code !== data[i].code || oldData[i].value !== data[i].value) {
                  this.refreshDict()
                  return
                }
              }
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
        this.selectData = this.selectData.filter(r => r.code && r.code.length > 0 && r.value && r.value.length)

        const that = this;
        that.confirmLoading = true;
        let httpurl = '';
        let httpAction;
        /*if (!this.model.groupId) {
          httpurl += this.url.add;
          httpAction = postAction
        } else {*/
        httpurl += this.url.edit;
        httpAction = putAction
        // }
        let formData = Object.assign({}, this.model);
        // 选择项
        // this.selectData = this.selectData.filter(item => !item.editable)
        // this.selectData = this.selectData.filter(item => !!item.code && !!item.name)
        let nowSet = new Set(this.selectData.map(r => `${r.code}::${r.value}`))
        let dels = []
        for (let r of this.oldData) {
          if (!nowSet.has(`${r.code}::${r.value}`)) {
            dels.push(`${r.code}::${r.value}`)
          }
        }

        if (this.selectData.length > 0) {
          this.selectData = this.selectData.reverse()
          formData.codes = this.selectData.map(item => item.code).join(",")
          formData.names = this.selectData.map(item => item.value).join(",")
        }
        formData.dels = dels.join(",")
        console.log(formData)
        httpAction(httpurl, formData).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.refreshDict()
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
          that.close();
        })
      },
      refreshDict() {
        this.$util.clearCache('MDict_' + this.model.groupCode)
        this.$emit('ok');
      },
      addSelectItem() {
        let code = ''
        if(this.autoIncrease){
          let max = Math.max(...this.selectData.map(r => Number(r.code)).filter(r => !isNaN(r)))
          code += parseInt(max) + 1
        }
        this.selectData.unshift({ code, value: '', itemId: Math.random() + '' })
      },
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
        console.log('dom',dom)
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
