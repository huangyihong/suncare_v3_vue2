<template>
    <m-modal
            centered
            :title="model.actionName + '-已选字段'"
            :width="800"
            :visible="visible"
            @cancel="handleCancel"
            :footer="null">
        <a-spin :spinning="confirmLoading">
        <template v-for="(item,index) in selectedData">
            <a-tag :key="item.colId" :color="item.status === 'stop'?'#bbb':item.tableName.startsWith('DWS') || item.tableName.startsWith('APP')
                    ?'orange':primaryColor" :title="item.tableName + '.' + item.colName"
                   class="tag-style">{{item.colCnname}}
            </a-tag>
        </template>
        </a-spin>

    </m-modal>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  export default {
    name: "TaskActionFieldConfigDetailModal",
    data() {
      return {
        visible: false,
        confirmLoading: false,
        model: {},
        url: {
          listAllCol: '/task/taskActionFieldCol/listAll',
          queryColByConfigId: '/task/taskActionFieldCol/queryByConfigId'
        },
        selectedData: []
      }
    },
    computed: {
      primaryColor() {
        return this.$store.getters.color
      }
    },
    methods: {
      detail(record) {
        this.model = Object.assign({}, record);
        this.visible = true;

        if(!this.allFieldDataMap){
          this.confirmLoading = true
          this.initData().finally(() => {
            this.confirmLoading = false
            this.editData(this.model)
          })
        } else {
          this.$nextTick(() => {
            this.editData(this.model)
          })
        }
      },
      editData(record){
        this.typeChange(this.type = record.classifyId ? 'DWS' : 'DWB')
        this.confirmLoading = true
        getAction(this.url.queryColByConfigId, {configId: record.id}).then(res => {
          if (res.success) {
            let data = res.result
            let colIdMap = this.allFieldData.reduce((prev, cur) => {
              prev[cur.colId] = cur
              return prev
            }, {})
            this.selectedData = data.map(r => {
              let obj = colIdMap[r.colId]
              if(obj){
                obj = {...obj}
                r.colCnname && (obj.colCnname = r.colCnname)
              }
              return obj
            }).filter(r => !!r)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      async initData() {
        let res = await getAction(this.url.listAllCol, {})
        if (res.success) {
          let data = res.result
          let defSelectedCols = []
          let dwsCols = []
          let commonCols = []
          data.forEach(r => {
            if(r.defSelect === '1'){
              defSelectedCols.push(r)
            } else if(r.dwsCol === '1'){
              dwsCols.push(r)
            } else {
              commonCols.push(r)
            }
          })
          this.allFieldDataMap = {
            'DWB': [...commonCols, ...defSelectedCols],
            'DWS': [...commonCols, ...defSelectedCols, ...dwsCols]
          }
        } else {
          this.$message.warning(res.message);
        }
      },
      typeChange(type) {
        this.allFieldData = this.allFieldDataMap[type]
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },

    }
  }
</script>

<style lang="less" scoped>
    .tag-style {
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 26px;
    }
</style>
