<template>
  <m-modal centered
           :title="title"
           width="80%"
           :visible="visible"
           @cancel="handleCancel"
           >
           <!--@ok="handleSelectOk"-->
           <!--@cancel="handleCancel"-->
           <!--cancelText="关闭"-->
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button key="submit1" type="primary" @click="setExcelTable">
        导入条件进行编辑
      </a-button>
      <a-popconfirm title="确定要根据当前导入条件创建报表查询任务吗?" @confirm="handleOk">
        <a-button type="primary">直接创建下载任务</a-button>
      </a-popconfirm>
    </template>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX, y: 'calc(100vh - 400px)' }"
      v-bind="tableAttrs"
      @change="handleTableChange" hideTools>
      <span slot="itemType" slot-scope="text, record, index">
              {{filterDictText(dictOptins.ITEM_TYPE, text)||'医保项目名称'}}
      </span>
      <span slot="item1Type" slot-scope="text, record, index">
              {{filterDictText(dictOptins.ITEM1_TYPE, text)||'同一天'}}
      </span>
      <span slot="item1Wgtype" slot-scope="text, record, index">
              {{filterDictText(dictOptins.ITEM1_WGTYPE, text)||'B项目存在违规(重复收费)'}}
      </span>
      <span slot="qtyType" slot-scope="text, record, index">
              {{filterDictText(dictOptins.QTY_TYPE, text)||'一天超量'}}
      </span>
      <span slot="isSameDay" slot-scope="text, record, index">
              {{filterDictText(dictOptins.YESNO, text)||'否'}}
      </span>
    </a-table>
  </m-modal>
</template>

<script>
import {getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "excelTableList",
    props: {

    },
    mixins:[JeecgListMixin],
    components: {},
    data() {
      return {
        title: '从excel导入查询项目',
        visible: false,

        columns:[
          {dataIndex: 'itemname', title: '收费项目名称A',width: '220px',ellipsis:true}
          ,{dataIndex: 'itemname1', title: '收费项目名称B',width: '220px',ellipsis:true}
          ,{dataIndex: 'itemType', title: '收费项目名称类型',  width: '140px',scopedSlots: { customRender: 'itemType' } }
          ,{dataIndex: 'item1Type', title: '重复收费类型', width: '170px', scopedSlots: { customRender: 'item1Type' } }
          ,{dataIndex: 'item1Wgtype', title: '收费项目B违规判断', width: '200px', scopedSlots: { customRender: 'item1Wgtype' } }
          ,{dataIndex: 'qtyType', title: '超量检查的类型', width: '120px', scopedSlots: { customRender: 'qtyType' } }
          ,{dataIndex: 'qtyNum', title: '超量的数值(不含)', width: '140px',}
          ,{dataIndex: 'isSameDay', title: '是否输出同一天的手术项目', width: '200px',scopedSlots: { customRender: 'isSameDay' } }
          ],
        initLoad:false,
        dictOptins:{},
      }
    },
    computed: {

    },
    beforeMount() {
      let keys = ['ITEM_TYPE', 'ITEM1_TYPE', 'ITEM1_WGTYPE', 'YESNO','QTY_TYPE']
      this.$util.initDict(keys).then(obj => {
        this.dictOptins = obj
        for (let key in this.dictOptins){
          this.dictOptins[key] = this.dictOptins[key].map(item =>{
            return {
              text: item.value,
              value: item.code
            }
          })
        }
      })
    },
    methods: {
      filterDictText,
      close() {
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      initData(datas){
        this.dataSource = datas
        this.ipagination.total = this.dataSource.length
        this.visible = true
      },
      handleOk(){
        this.$emit('saveTask','excel')
      },
      setExcelTable(){
        this.$emit('setExcelTable')
      }

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
