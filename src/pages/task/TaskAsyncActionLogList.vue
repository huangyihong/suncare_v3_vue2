<template>
    <a-card :bordered="false">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">
                    <a-col :md="6" :sm="8">
                        <a-form-item label="操作类型">
                            <m-dict-select-tag dictCode="ASYNC_ACTION_TYPE" v-model="queryParam.actionType"></m-dict-select-tag>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="状态">
                            <m-dict-select-tag dictCode="CUSTOM_RUN_STATUS" v-model="queryParam.status"></m-dict-select-tag>
                        </a-form-item>
                    </a-col>
                    <template v-if="toggleSearchStatus">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="操作语句">
                                <a-input placeholder="请输入操作语句" v-model="queryParam.actionParam"></a-input>
                            </a-form-item>
                        </a-col>
                    </template>
                    <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
                    </a-col>

                </a-row>
            </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <!--<div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('异步操作日志')">导出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>
        </div>-->

        <!-- table区域-begin -->
        <div>
            <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
               <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
               <a style="margin-left: 24px" @click="onClearSelected">清空</a>
             </div>-->

            <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :scroll="{  x:scrollX}"
                    v-bind="tableAttrs"
                    @change="handleTableChange">
                    <span slot="action" slot-scope="text, record">
                        <a @click="handleRoute(record)">跳转进入</a>
                    </span>
            </a-table>
        </div>
        <!-- table区域-end -->

    </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "TaskAsyncActionLogList",
    mixins: [JeecgListMixin],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        description: '异步操作日志管理页面',
        // 表头
        columns: [
          {
            title: '页面',
            align: "left",
            dataIndex: 'actionTitle',
            width: 180,
          },
          {
            title: '类型',
            align: "center",
            dataIndex: 'actionType_dictText',
            width: 100,
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status_dictText',
            width: 100,
          },
          {
            title: '总记录数',
            align: "center",
            dataIndex: 'recordCount',
            width: 100,
          },
          {
            title: '未完成数',
            align: "center",
            dataIndex: 'leftCount',
            width: 100,
          },
          {
            title: '提示信息',
            align: "left",
            dataIndex: 'msg',
            width: 200,
            customRender: text => <j-ellipsis value={text} length={text}/>,
          },
          {
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime',
            width: 120,
          },
          {
            title: '结束时间',
            align: "center",
            dataIndex: 'endTime',
            width: 120,
          },
          {
            title: '创建人姓名',
            align: "center",
            dataIndex: 'createUsername',
            width: 100,
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime',
            width: 120,
          },
          {
            title: '操作参数',
            align: "center",
            dataIndex: 'actionParam',
            width: 200,
            customRender: (text, record, index) => {
              let obj = JSON.parse(text)
              if (Array.isArray(obj)) {
                return <j-ellipsis value={obj.join('&')} length={15}/>
              }
              return text;
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            align: "center",
            width: 100,
            fixed: 'right'
          }
        ],
        url: {
          list: "/apiTask/taskAsyncActionLog/list",
          delete: "/task/taskAsyncActionLog/delete",
          deleteBatch: "/task/taskAsyncActionLog/deleteBatch",
          exportXlsUrl: "task/taskAsyncActionLog/exportXls",
          importExcelUrl: "task/taskAsyncActionLog/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleRoute({actionType, actionPathParam}){
        let param = {}
        for(let item of actionPathParam.split('&')){
          let arr = item.split('=')
          param[arr[0]] = arr[1]
        }
        console.log(param)
        if(actionType.indexOf('_FIRST') > -1){
          if(param["caseId"]){
            this.$router.push({path: '/review/reviewSystemRuleView', query: param})
          } else {
            this.$router.push({path: '/review/reviewSystemList', query: param})
          }
        } else if(actionType.indexOf('_SECOND') > -1){
          this.$router.push({path: '/review/reviewList', query: param})
        }
      }
    }
  }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
