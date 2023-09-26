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
      <a-transfer
        :data-source="mockData"
        show-search
        :filter-option="filterOption"
        :target-keys="targetKeys"
        :show-select-all="false"
        :render="item => item.title"
        @change="handleChange"
        @search="handleSearch"
        :titles="['11', '22']"
      >
        <template
        slot="children"
        slot-scope="{
          props: { filteredItems,selectedKeys},
           on: {  itemSelectAll,itemSelect },
        }"
      >
          <at-table
            ref="table"
            size="small"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="filteredItems"
            :loading="loading"
            :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
            :row-selection="
	      getRowSelection({
	          selectedKeys,
	          itemSelectAll,
	          itemSelect,
	      })
	    "
            v-bind="tableAttrs"
            @change="handleTableChange">
          </at-table>

        </template>
      </a-transfer>



    </a-modal>
  </div>
</template>

<script>
import {getAction, postAction} from '@/api/manage'
export default {
  mixins:[],
  data() {
    return {
      title: '授权角色',
      visible: false,
      url: {
        list: "/system/sysDatasource/roleList",
        add:"/system/sysDatasource/addRoleBatch",
        del:"/system/sysDatasource/delRoleBatch"
      },
      mockData: [],
      targetKeys: [],
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
          title: '角色名称',
          align: 'center',
          dataIndex: 'roleName',
          width: 100
        },
      ],


    }
  },
  computed: {


  },

  created() {

  },
  methods: {

    show(record) {
      this.visible = true
      this.getMock(record.code);
    },
    getMock(code) {
      const targetKeys = [];
      //const mockData = [];
      getAction(this.url.list, {pageSize:9999999}).then(res => {
        if (res.success) {
         this.mockData = res.result.records

          this.mockData.map(t=>{t.key = t.id;return t})
          console.log(this.mockData)
          this.targetKeys = this.mockData.filter(t=>{
            console.log(t.systemCode)
            return t.systemCode=='search'}).map(t=>t.id);
          console.log('this.targetKeys:::',this.targetKeys)

        } else {
          this.$message.error(res.message);
        }
      })
      //this.mockData = mockData;

    },
    filterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1;
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value);
    },
    handleCancel() {
      this.visible = false
    },
    getRowSelection({selectedKeys, itemSelectAll,itemSelect}) {
      return {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.map(({ key }) => key);
          itemSelectAll(treeSelectedKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
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