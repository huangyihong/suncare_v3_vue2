<template>
  <div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xxl="6" :xs="8">
            <a-form-item label="临床路径编码">
              <j-input placeholder="请输入临床路径编码模糊查询" v-model="queryParam.clinicalCode"></j-input>
            </a-form-item>
          </a-col>

          <a-col :xxl="6" :xs="8">
            <a-form-item label="临床路径名称">
              <j-input placeholder="请输入临床路径名称模糊查询" v-model="queryParam.clinicalName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="8">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!--<a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>

      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="clinicalId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
        :scroll="{ x: scrollX,y: scrollY}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <a slot="clinicalName" slot-scope="text, record" @click="handleDetail(record,'1')">
          {{text}}
        </a>
        <template slot="dataStatus" slot-scope="status">
          <!-- <a-tag v-if="status ==='1'" color="green">有效</a-tag>
           <a-tag v-else-if="status ==='0'" color="volcano">无效</a-tag>-->
          <span v-if="status ==='1'">有效</span>
          <span v-else-if="status ==='0'" style="color: grey">无效</span>
        </template>
        <template slot="publicStatus" slot-scope="status">
          <!--  <a-tag v-if="status ==='1'" color="blue">发布</a-tag>
            <a-tag v-else-if="status ==='0'" color="volcano">未发布</a-tag>-->
          <span v-if="status ==='1'">发布</span>
          <span v-else-if="status ==='0'" style="color: grey">未发布</span>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medicalClinical-modal ref="modalForm" @ok="modalFormOk"></medicalClinical-modal>
  </div>
</template>

<script>
  import MedicalClinicalModal from '@/pages/config/modules/MedicalClinicalModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { mixin } from '@/utils/mixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import moment from 'moment'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  moment.locale('zh-cn')
  export default {
    name: "MedicalClinicalList",
    mixins: [JeecgListMixin, mixin,multiSelectIdMatchMixin,postListMixin],
    components: {
      MedicalClinicalModal,
    },
    data() {
      return {
        description: '临床路径主体管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            align: "center",
            dataIndex: 'orderNo',
            width: 60
          },

          {
            title: '临床路径编码',
            align: "center",
            dataIndex: 'clinicalCode',
            width: 120
          },
          {
            title: '临床路径名称',
            align: "center",
            dataIndex: 'clinicalName',
            scopedSlots: { customRender: 'clinicalName' },
            width: 180

          },
          {
            title: '公示年份',
            align: "center",
            dataIndex: 'publicYear',
            width: 60
          },
          {
            title: '录入时间',
            align: "center",
            dataIndex: 'createTime',
            width: 120
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername',
            width: 120
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime',
            width: 120
          },
          {
            title: '修改人',
            align: "center",
            dataIndex: 'updateUsername',
            width: 120
          },
          {
            title: '有效性',
            align: "center",
            dataIndex: 'dataStatus',
            scopedSlots: { customRender: 'dataStatus' },
            width: 80
          },
          /*{
            title: '发布状态',
            align: "center",
            dataIndex: 'publicStatus',
            scopedSlots: { customRender: 'publicStatus' },
            width: 80
          },*/
        ],
        url: {
          list: "/medical/medicalClinical/list",
        },
        /* 排序参数 */
        isorter: {
          column: 'createTime,orderNo',
          order: 'desc,asc',
        },
        fixedParam:{
          publicStatus: '1'
        },
        id: 'clinicalId',
        code: 'clinicalCode',
        name: 'clinicalName',
        paramInId:'clinicalId',//已选中 未选中查询的参数
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleEdit: function(record, tabKey, scrollTo) {
        this.$refs.modalForm.edit(record, tabKey, scrollTo);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleDetail: function(record, tabKey, scrollTo) {
        this.$refs.modalForm.edit(record, tabKey, scrollTo);
        this.$refs.modalForm.title = "详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      searchQuery(){
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
