<template>
  <a-row :gutter="24">
    <a-col :span="4" style="overflow: auto" :style="{maxHeight:scrollH}">
      <other-dict-tree @selectNode="searchData" dictEname="pathologyclass" :showCode="true"></other-dict-tree>
    </a-col>
    <a-col :span="20">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="YX形态学编码">
                <j-input placeholder="输入YX形态学编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="YX形态学名称">
                <j-input placeholder="输入YX形态学名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
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
              <a-col :xl="6" :lg="8" :sm="12">
                <a-form-item label="父级分类编码">
                  <j-input placeholder="输入父级分类编码模糊查询" v-model="queryParam.parentCode"/>
                </a-form-item>
              </a-col>

              <a-col :xl="6" :lg="8" :sm="12">
                <a-form-item label="父级分类名称">
                  <j-input placeholder="输入父级分类名称模糊查询" v-model="queryParam.parentName"/>
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
          :rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
          :scroll="{ x: scrollX,y: scrollY}"
          @change="handleTableChange"
          v-bind="tableAttrs">

        <span slot="name" slot-scope="text, record">
          <!--<a @click="handleDetail(record)"><j-ellipsis :value="text" :length="12"/></a>-->
          <j-ellipsis :value="text" :length="12"/>
        </span>

          <!--  <span slot="auditResult" slot-scope="text, record">
          <a @click="showMedicalAuditLog(record)">{{text}}</a>
        </span>-->

          <span slot="parentName" slot-scope="text">
          <j-ellipsis :value="text" :length="12"/>
        </span>

          <span slot="descript" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>

          <span slot="createReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

          <span slot="updateReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

          <span slot="deleteReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        </a-table>
      </div>
      <!-- table区域-end -->
    </a-col>

  </a-row>

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'

  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import OtherDictTree from '@/pages/config/modules/OtherDictTree'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'


  export default {
    name: "MedicalPathology",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
      JDictSelectTag,
      OtherDictTree,
    },
    data() {
      return {
        description: '形态学编码管理页面',
        // 表头
        columns: [
          {
            title: 'YX形态学编码',
            width: 150,
            align: "left",
            dataIndex: 'code',
          },
          {
            title: 'YX形态学名称',
            width: 200,
            align: "left",
            dataIndex: 'name',
          },
          {
            title: '父级分类编码',
            width: 150,
            align: "left",
            dataIndex: 'parentCode',
            //fixed: 'left',
          },
          {
            title: '父级分类名称',
            width: 200,
            align: "left",
            dataIndex: 'parentName',
            //fixed: 'left',
            // scopedSlots: { customRender: 'parentName' },
          },
          {
            title: '描述',
            width: 200,
            align: "center",
            dataIndex: 'descript',
            scopedSlots: { customRender: 'descript' },
          },

        ],
        isorter: {
          column: 'code',
          order: 'asc',
        },
        url: {
          list: "/config/medicalPathology/list",
          selectAll: "/config/medicalPathology/selectAll",
        },
        fixedParam: {
          state: '1'
        },
        sideCollapsed: false,
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    computed: {
      scrollH() {
        let y = this.$store.getters.height * this.heightRatio - 150
        return (y < 300 ? 300 : y) + 'px'
      }
    },
    beforeMount() {

    },
    methods: {
      sideCollapse() {
        this.sideCollapsed = !this.sideCollapsed
      },
      //左侧树点击查询
      searchData(parentCode) {
        this.queryParam.typeCode_1 = parentCode;
        this.searchQuery();
      },
      getSelect() {
        let data = this.selectedRowRecords.map(record => {
          return {...record,remark:record.descript, code: record[this.code], name: record[this.name] }
        })
        console.log('select',data)
        return data
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
