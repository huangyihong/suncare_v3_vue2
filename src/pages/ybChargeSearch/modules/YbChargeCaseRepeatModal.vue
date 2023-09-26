<template>
  <a-modal
    :title="title"
    width="80%"
    heigh="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="继续导入"
    cancelText="放弃">

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataList"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">

    </a-table>

  </a-modal>
</template>

<script>
import {httpAction, deleteAction, getAction} from '@/api/manage'
export default {
  name: "YbChargeCaseRepeatModal",
  data(){
    return {
      title:"重复数据",
      visible: false,
      confirmLoading:false,
      list:[],
      dataList:[],
      /* table选中keys*/
      selectedRowKeys: [],
      /* table当前选中records*/
      selectedRowRecords: [],
      /* table当前页选中records*/
      selectionRows: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      url: {
        importData: "/ybChargeSearch/ybChargeCase/saveBatch",
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
          title: '违规类型',
          align: "center",
          dataIndex: 'wgType'
        },
        {
          title: '项目编码（国家码）',
          align: "center",
          dataIndex: 'itemCode'
        },
        {
          title: '违规项目',
          align: "center",
          dataIndex: 'wgItemName'
        },
        {
          title: '项目关键词',
          align: "center",
          dataIndex: 'itemname'
        },
        {
          title: '违规描述',
          align: "center",
          dataIndex: 'wgDescription'
        },
        {
          title: '政策依据',
          align: "center",
          dataIndex: 'policyBasis'
        },
        {
          title: '所属地区',
          align: "center",
          dataIndex: 'region'
        },
        {
          title: '所属时间',
          align: "center",
          dataIndex: 'startdate',
          customRender: (text, record, index) => {
            let html = '';
            if(record.startdate){
              html =  record.startdate;
            }
            if(record.startdate || record.enddate) {
              html += '到';
            }
            if(record.enddate){
              html += record.enddate;
            }
            return html
          }
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },
      ],
    }
  },
  methods: {
    show(dataList){
      this.visible=true
      this.list=dataList
      const size=dataList.length
      this.ipagination.total = size
      if(size>this.ipagination.pageSize){
        this.dataList=dataList.slice(0,this.ipagination.pageSize)
      }
      console.log("size==",size)
      console.log("this.dataList2==",this.list)
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      console.log('onSelectChange', selectedRowKeys.length, selectionRows.length)
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows

    },
    handleCancel(){
      this.visible=false
    },
    handleOk(){
      if(this.selectionRows.length<1){
        this.$message.error("请选择1条记录!")
      }else{
        this.confirmLoading=true
        httpAction(this.url.importData, this.selectionRows,'post').then(res => {
          if (res.success) {
            this.list = this.list.filter(
              (a) => !this.selectionRows.some((b) => a.id === b.id)
            )
            this.$message.success("导入成功:"+this.selectionRows.length+"条")
            this.selectionRows=[]
            this.ipagination.total = this.list.length
            this.handleTableChange(this.ipagination)
            this.$forceUpdate();
          } else {
            this.$message.error(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      }

      console.log("选中==",this.selectionRows)
    },
    handleTableChange(pagination, filters = {}, sorter) {
      console.log('selectionRows', this.selectionRows)
      const current=pagination.current
      const pageSize=pagination.pageSize
      const size=this.list.length
      this.dataList=this.list.slice((current-1)*pageSize,current*pageSize>size?size:current*pageSize)
      //分页、排序、筛选变化时触发
      // //TODO 筛选
      // if (Object.keys(sorter).length > 0) {
      //   this.isorter.column = sorter.field
      //   this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      // }
      // let params = {}
      // for (let i in filters) {
      //   params[i] = ',' + filters[i].join(',') + ','
      // }
      // this.filters = params
      this.ipagination = pagination
    },
  }
}
</script>

<style scoped>

</style>