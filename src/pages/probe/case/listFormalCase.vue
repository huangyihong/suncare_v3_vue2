<template>
  <div>
    <div class="table-operations" style="margin-bottom: 5px">
      <a-button @click="copyCreate" v-has="'probe:add'">复制新增</a-button>
   <!--   <div style="display: flex" class="m-t-6">
        <j-input
          placeholder="名称模糊查询"
          v-model="queryParam.caseName"
          @pressEnter="loadData"
          style="flex: auto" class="m-r-6"></j-input>
        <a-button
          type="primary"
          @click="loadData"
          icon="search"
          style="flex: none">查询</a-button>
      </div>-->
      <j-input-search placeholder="输入名称模糊查询" class="m-t-6"
                      v-model="queryParam.searchCode"
                      @search="loadData(1)" />
    </div>
    <at-table
      size="middle"
      rowKey="caseId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :customRow="rowClick"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      @change="handleTableChange">
      <a-icon slot="filterIcon" slot-scope="filtered" type="search"/>
    </at-table>

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import flowTrialMixin from '@/pages/probe/flowTrialMixin'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getFormalCaseById } from '@/api-sv3/api-flow'
  import JInputSearch from '@/components/jeecg/JInputSearch'

  export default {
    name: "index",
    mixins: [JeecgListMixin, flowTrialMixin],
    components: {JInputSearch},
    data() {
      return {
        data: [],
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: false,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: (total, range) => {
            return total + '条'
          },
        },
        columns: [
          {
            title: '模型名称',
            dataIndex: 'caseName',
            /*scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
            },*/
            align: "center",
            width: '60%',
          },{
            title: '创建时间',
            dataIndex: 'createTime',
            align: "center",
            width: '40%',
          },
        ],
        url: {
          list: "/formal/medicalFormalCase/list",
        },
        fixedParam:{
          caseStatus: 'normal',
          caseClassify: '!*'
        },
        /* 排序参数 */
        isorter:{
          column: 'createTime,caseName',
          order: 'desc,asc',
        },

      }
    },
    methods: {
      initDictConfig() {
        // console.log("--我才是真的方法!--")
        //初始化字典
      },
      rowClick(record,index){
        const that = this
        return ({
          style:{cursor:'pointer'},
          // 事件
          on: {
            click: () => {
              that.onSelectChange([record.caseId],[record])
            }
          }
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows
        this.loadCaseFlow(selectedRowKeys[0])
      },
      loadCaseFlow(id){
        this.$emit('loading', true)
        getFormalCaseById({ id }).then((res) => {
          if (res.success) {
            let data = res.result
            data.isFormalCase = true
            this.$emit('loadData', data)
            this.getStatisticCaseView(id)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.$emit('loading', false)
        })
      },
      copyCreate() {
        if (this.selectedRowKeys.length !== 1) {
          this.$message.warning('请选择一条记录！');
          return
        }
        const that = this
        that.$emit('loading', true)
        getFormalCaseById({ id: this.selectedRowKeys[0],copyCreate: '1' }).then((res) => {
          if (res.success) {
            let data = res.result
            delete data.caseId
            delete data.caseStatus
            // 替换节点key前缀
            let keyObj = {}
            if(data.flowJson){
              let flow = JSON.parse(data.flowJson)
              let keyPreNoObj = {}
              let keyNoIndex = 0
              let keyPres = ['a','b','c','d','e','f','g'
                            ,'h','i','j','k','l','m','n'
                            ,'o','p','q','r','s','t'
                            ,'u','v','w','x','y','z'
                            ,'A','B','C','D','E','F','G'
                            ,'H','I','J','K','L','M','N'
                            ,'O','P','Q','R','S','T'
                            ,'U','V','W','X','Y','Z']
              for (let nodeData of flow.nodeDataArray) {
                let array = nodeData.key.split("-")
                // 确保每组前缀数字都不同
                let keyPre = array[0]
                let keyPreNo
                if(keyPreNoObj[keyPre]){
                  keyPreNo = keyPreNoObj[keyPre]
                } else {
                  keyPreNo = keyPreNoObj[keyPre] = keyPres[keyNoIndex++]
                }
                let newKey = '-' + keyPreNo + array[1]
                keyObj[nodeData.key] =newKey
                nodeData.key = newKey
                delete nodeData.submit
              }
              for (let linkData of flow.linkDataArray) {
                linkData.from = keyObj[linkData.from]
                linkData.to = keyObj[linkData.to]
              }
              for (let rule of data.rules) {
                rule.nodeCode = keyObj[rule.nodeCode]
              }
              console.log('flow',flow)
              data.flowJson = JSON.stringify(flow)
            }

            that.$emit('loadData', data)
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.$emit('loading', false)
        })
      }

    }
  }
</script>
<style scoped>

</style>
