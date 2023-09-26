<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="ATC药品编码">
              <j-input placeholder="输入ATC药品编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="ATC药品名称">
              <j-input placeholder="输入ATC药品名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
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
              <a-form-item label="ATC药品级别">
                <std-atc-cascader  @change="onChangeActCode" placeholder="请选择ATC药品级别" :defaultValue="actCode"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="收费类别">
                <other-dict-select-tag  placeholder="请选择收费类别" v-model="queryParam.chargeClassCode"  dictEname="chargeClass"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="8" :sm="12">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search" title="查询"></a-button>
                <a-button type="primary" @click="searchResetArr();searchReset()" icon="reload" class="m-l-6" title="重置"></a-button>

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
        :scroll="{x:scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"
  import StdAtcCascader from "@/pages/config/modules/StdAtcCascader"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'


  export default {
    name: "MedicalEquipmentList",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
      OtherDictSelectTag,
      StdAtcCascader,
    },
    props:{
      fixedParam: Object,
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    data() {
      return {
        description: 'ATC药品级别信息页面',
        // 表头
        columns: [
          {
            title: 'ATC药品编码',
            width:200,
            align:"left",
            dataIndex: 'code',
          },
          {
            title: 'ATC药品名称',
            width:200,
            align:"left",
            dataIndex: 'name',
          },
          {
            title: 'ATC药品1级分类',
            width:150,
            align:"center",
            dataIndex: 'act1Name',
          },
          {
            title: 'ATC药品2级分类',
            width:150,
            align:"center",
            dataIndex: 'act2Name',
          },
          {
            title: 'ATC药品3级分类',
            width:150,
            align:"center",
            dataIndex: 'act3Name',
          },
          {
            title: 'ATC药品4级分类',
            width:150,
            align:"center",
            dataIndex: 'act4Name',
          },
          {
            title: '收费类别',
            width:100,
            align:"center",
            dataIndex: 'chargeClassName',
          },

        ],
        isorter: {
          column: 'code',
          order: 'asc',
        },
        url: {
          list: "/config/medicalStdAtc/list",
          selectAll: "/config/medicalStdAtc/selectAll",
        },
        code: 'code',
        name: 'name',
        id: 'id',
        actCode:[],
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
      },
      onChangeActCode(value,selectedOptions) {
        let that = this;
        for(let i=1;i<6;i++){
          that.queryParam['act'+i+'Code']="";
        }
        selectedOptions.forEach(function(item,index,arr){
          that.queryParam['act'+(index+1)+'Code']=item.value;
        });
      },
      searchResetArr(){
        this.actCode=[]
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
