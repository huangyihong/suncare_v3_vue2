<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="药品编码">
              <j-input placeholder="请输入药品编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="药品名称">
              <j-input placeholder="请输入药品名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"></j-input>
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
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="药品通用名编码">
                <j-input placeholder="输入药品通用名编码模糊查询" v-model="queryParam.generalCode"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="批准文号">
                <j-input placeholder="输入批准文号模糊查询" v-model="queryParam.approveNumber"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="规格">
                <j-input placeholder="输入规格模糊查询" v-model="queryParam.specification"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="生产企业名称">
                <j-input placeholder="输入生产企业名称模糊查询" v-model="queryParam.enterprise"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="8" :sm="12">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search" title="查询"></a-button>
                  <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6" title="重置"></a-button>

                  <a @click="handleToggleSearch" class="m-l-6" :title="toggleSearchStatus ? '收起' : '展开'">
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                  </a>
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
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="productEname" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>

        <span slot="approveNumber" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>

        <span slot="specification" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        <span slot="enterprise" slot-scope="text">
          <j-ellipsis :value="text" :length="8"/>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin, multiSelectMixin, postListMixin],
    components: {
      OtherDictSelectTag,
    },
    data() {
      return {
        description: '药品信息管理页面',
        // 表头
        columns: [
          {
            title: '药品代码',
            align: "left",
            dataIndex: 'code',
            width: 180,
          },
          {
            title: '药品名称',
            align: "left",
            dataIndex: 'name',
            width: 180,
          },
          {
            title: '药品通用名编码',
            width:150,
            align:"left",
            dataIndex: 'generalCode',
          },
          {
            title: '药品商品名称',
            width:150,
            align:"left",
            dataIndex: 'productName',
          },
          {
            title: '药品英文名称',
            width:250,
            align:"left",
            dataIndex: 'productEname',
            // scopedSlots: { customRender: 'productEname' },
          },
          {
            title: '批准文号',
            width:150,
            align:"left",
            dataIndex: 'approveNumber',
            // scopedSlots: { customRender: 'approveNumber' },
          },
          {
            title: '剂型名称',
            width:150,
            align:"left",
            dataIndex: 'dosage',
          },
          {
            title: '规格',
            width:150,
            align:"left",
            dataIndex: 'specification',
            // scopedSlots: { customRender: 'specification' },
          },
          {
            title: '包装',
            width:150,
            align:"left",
            dataIndex: 'packageNum',
            customRender: (text, record, index) => {
              var html = '';
              if(record.packageNum){
                html += record.packageNum;
              }
              if(record.packageUnit){
                html += record.packageUnit;
              }
              return html;
            },
          },
          {
            title: '生产企业名称',
            width:150,
            align:"left",
            dataIndex: 'enterprise',
            // scopedSlots: { customRender: 'enterprise' },
          }

        ],
        isorter:{
          column: 'code',
          order: 'asc',
        },
        url: {
          list: "/config/medicalDrug/list",
          selectAll: "/config/medicalDrug/selectAll",
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
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
