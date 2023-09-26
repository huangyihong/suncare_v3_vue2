<template>
  <div>
    <div class="table-operations" style="margin-bottom: 5px">
      <a-button type="primary" @click="copyCreate" v-has="'probe:add'">复制新增</a-button>
      <a-button type="default" class="m-l-6" @click="delCase" v-has="'probe:del'">删除</a-button>
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
      <j-input-search placeholder="输入名称或编码模糊查询" class="m-t-6"
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
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getFormalCaseById } from '@/api-sv3/api-flow'
  import JInputSearch from '@/components/jeecg/JInputSearch'

  export default {
    name: "index",
    mixins: [JeecgListMixin],
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
            title: '创建人',
            dataIndex: 'createUsername',
            align: "center",
            width: '40%',
          },
        ],
        url: {
          list: "/formal/medicalFormalCase/list",
          delete: "/formal/medicalFormalCase/delete",
        },
        fixedParam:{
          caseStatus: 'normal',
          caseClassify: '*'
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
            that.$emit('loadData', data)
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.$emit('loading', false)
        })
      },
      delCase(){
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        const that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.handleDelete(that.selectedRowKeys[0]).then(()=>{
              that.$emit('loadData', undefined)
            })
          }
        });
      },

    }
  }
</script>
<style scoped>

</style>
