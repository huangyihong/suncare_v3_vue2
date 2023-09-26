<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="中草药编码">
              <j-input placeholder="请输入中草药编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="中草药名称">
              <j-input placeholder="请输入中草药名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search" title="查询"></a-button>
                <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6" title="重置"></a-button>

              </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <template v-if="selectType === 'checkbox'">
        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                      v-on="selectActionOn"></selected-tag>
      </template>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{x:scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="source" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="medicalPart" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="pieceName" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="pieceSize" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="dosageType" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="method" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="prescription" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="place" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalChineseDrugList",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
    },
    data() {
      return {
        description: '中草药信息管理页面',
        // 表头
        columns: [
          {
            title: '中草药编码',
            align: "left",
            dataIndex: 'code',
            width: 180,
          },
          {
            title: '中草药名称',
            align: "left",
            dataIndex: 'name',
            width: 180,
          },
          {
            title: '来源名称',
            width:100,
            align:"left",
            dataIndex: 'source',
            // scopedSlots: { customRender: 'source' },
          },
          {
            title: '药用部位',
            width:100,
            align:"left",
            dataIndex: 'medicalPart',
            // scopedSlots: { customRender: 'medicalPart' },
          },
          {
            title: '饮片名',
            width:100,
            align:"left",
            dataIndex: 'pieceName',
            // scopedSlots: { customRender: 'pieceName' },
          },
          {
            title: '饮片规格',
            width:100,
            align:"left",
            dataIndex: 'pieceSize',
            // scopedSlots: { customRender: 'pieceSize' },
          },

          {
            title: '剂型',
            width:100,
            align:"left",
            dataIndex: 'dosageType',
            // scopedSlots: { customRender: 'dosageType' },
          },
          {
            title: '描述',
            width:100,
            align:"left",
            dataIndex: 'remark',
            // scopedSlots: { customRender: 'remark' },
          },

        ],
        url: {
          list: "/config/medicalChineseDrug/list",
          selectAll: "/config/medicalChineseDrug/selectAll",
        },
        fixedParam: {
          state: '1'
        },
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
        /*delete this.queryParam.code_in
        delete this.queryParam.code_not_in
        let codeStr = 'null';
        if(this.selectedRowRecords.length>0){
          codeStr = this.selectedRowRecords.map(item => item.code).join(",")
        }
        if(this.queryParam.queryType=='in'){
          this.queryParam.code_in = codeStr
        }
        if(this.queryParam.queryType=='not_in'){
          this.queryParam.code_not_in = codeStr
        }
        this.loadData(1);*/
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
