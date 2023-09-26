<template>
  <div>
    <a-modal
      centered
      :title="title"
      width="80%"
      :visible="visible"
      :loading="loading"
      :destroyOnClose="true"
      @cancel="handleCancel"
      :footer="null">

      <div>
        <a-transfer
          :titles="['可选用户', '已选用户']"
          :dataSource="mockData"
          :target-keys="targetKeys"
          :rowKey="record => record.id"
          :show-search="false"
          :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          :show-select-all="false"
          @change="moveChange"
        >
          <template
            slot="children"
            slot-scope="{
      props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
      on: { itemSelectAll, itemSelect },
    }"
          >
            <a-input v-if="direction === 'left'"  style="width: 75%" placeholder="模糊搜索" v-model="keyWordLeft" @change="test"></a-input>
            <a-input v-else style="width: 75%" placeholder="模糊搜索" v-model="keyWordRight" @change="test"></a-input>
            <a-button  @click="searchQuery(direction)" style="width: 20%;margin-left: 5%" icon="search">查询</a-button>
            <a-table
              ref="table"
              tableLayout="fixed"
              :row-selection="
	      getRowSelection({
	         disabled: listDisabled,
	          selectedKeys,
	          itemSelectAll,
	          itemSelect,
	      })
	    "
              :columns="columns"
              :loading="loading"
              :pagination="direction === 'left' ? ipagination : ipagination2"
              rowKey="id"
              :data-source="filteredItems"
              size="small"
              :scroll="{ x: scrollX,y: scrollY}"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="
       ({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })

      "
              @change="(obj)=>handleTableChange(obj,direction)"
            />
          </template>
        </a-transfer>


      </div>


    </a-modal>
  </div>
</template>

<script>
import {getAction, postAction} from '@/api/manage'

export default {
  data() {
    return {
      title: '授权用户',
      visible: false,
      url: {
        list: "/fj/org/userList",
        list2: "/fj/org/userOrgList",
        add:"/ybFJ/ybFjUserOrg/addBatch",
        del:"/ybFJ/ybFjUserOrg/delBatch"
      },
      mockData: [],
      query:{},
      keyWordLeft:"",
      keyWordRight:"",
      unMockData:[],
      targetKeys: [],
      orgId:'',
      disabled: false,
      loading:false,
      rootSubmenuKeys: [],
      openKeys: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      ipagination2: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username',
          width: 100
        },
        {
          title: '用户名称',
          align: 'center',
          width: 100,
          dataIndex: 'realname'
        }
      ],

    }
  },
  computed: {
    scrollY() {
      let y = this.$store.getters.height - 340
      return (y < 200 ? 200 : y) + 'px'
    },

  },

  created() {

  },
  methods: {
    handleTableChange(obj,direction) {
      this.loading=true
      this.getList(this.orgId)
      console.log("ipagination2",this.ipagination2)
      console.log("ipagination",this.ipagination)
    },
    getList(orgId) {
      let param=Object.assign(this.query)
      param.orgId=orgId
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      getAction(this.url.list, param).then(res => {
        if (res.success) {
          this.unMockData=res.result.records
          this.$set(this.ipagination,"total",res.result.total)
          this.$set(this.ipagination,"size",res.result.size)

          param.pageNo = this.ipagination2.current
          param.pageSize = this.ipagination2.pageSize
          getAction(this.url.list2, param).then(res => {
            if (res.success) {
              var data=res.result.records
              this.targetKeys=data.map(item =>item.id)
              this.mockData=this.unMockData.concat(data)
              this.$set(this.ipagination2,"total",res.result.total)
              this.$set(this.ipagination2,"size",res.result.size)

            } else {
              this.$message.error(res.message);
            }
          })

          if (this.mockData.length === 0) {
            this.$refs.table && this.$refs.table.setEmptyDesc()
          }
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.$forceUpdate()
        this.loading=false

      })
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];

    },
    // handleOk() {
    //   console.log("targetKeys====", this.targetKeys)
    //   console.log("selectedKeys====", this.selectedKeys)
    // },
    handleCancel() {
      this.targetKeys=[]
      this.mockData=[]
      this.visible = false
    },
    show(org) {
      this.loading=true
      this.orgId=org[0].orgId
      this.getList(org[0].orgId)
      this.visible = true
    },
    onOpenChange(openKeys) {
      console.log(openKeys, this.$route.path)
      const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
      console.log(latestOpenKey, this.rootSubmenuKeys.indexOf(latestOpenKey) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    moveChange(nextTargetKeys, direction, moveKeys) {
      console.log("nextTargetKeys====",nextTargetKeys)
      console.log("direction====",direction)
      console.log("moveKeys====",moveKeys)
      let ids = moveKeys.join(',')
      console.log("ids====",ids)
      this.loading=true
      if(direction=='left'){
        this.delBatch(ids)
      }else{
        this.saveBatch(ids)
      }

    },

    saveBatch(ids){
      getAction(this.url.add, {orgId: this.orgId,ids:ids}).then(res => {
        if (res.success) {
          this.$message.success("操作成功")
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.$set(this.ipagination,"current",1)
        this.$set(this.ipagination2,"current",1)
        this.getList(this.orgId).then(res=>{
          this.$forceUpdate()
          this.loading=false
        })

      })

    },
    delBatch(ids){
      getAction(this.url.del, {ids:ids}).then(res => {
        if (res.success) {
          this.$message.success("操作成功")
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.$set(this.ipagination,"current",1)
        this.$set(this.ipagination2,"current",1)
        this.getList(this.orgId).then(res=>{
          this.$forceUpdate()
          this.loading=false
        })
      })
    },
    // 搜索框
    searchQuery(direction) {
      this.loading=true
      if(direction=='left'){
        this.query.leftWord=this.keyWordLeft
      }else{
        this.query.rightWord=this.keyWordRight
      }
      this.getList(this.orgId)
      console.log('search:', direction, value)
    },
    test(){
      this.query.leftWord=this.keyWordLeft
      this.query.rightWord=this.keyWordRight
    },


    getRowSelection({disabled, selectedKeys, itemSelectAll, itemSelect}) {
      return {
        getCheckboxProps: (item) => ({props: {disabled: disabled || item.disabled}}),
        onSelectAll(selected, selectedRows) {
          let treeSelectedKeys = this.selectedRowKeys
          itemSelectAll(treeSelectedKeys, selected)
        },
        onSelect({key}, selected) {
          itemSelect(key, selected)
        },

        selectedRowKeys: selectedKeys,
      }

    },


  }
}
</script>
<style lang="less" scoped>
/deep/.ant-transfer-customize-list .ant-transfer-list{
  width: 50%;
  height: 100%;
  min-height: 200px;
}
</style>