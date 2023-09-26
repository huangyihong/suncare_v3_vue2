<template>
    <a-list item-layout="vertical" :data-source="dataSource" :loading="loading" :pagination="ipagination">
        <a-list-item slot="renderItem" slot-scope="item, index" style="padding-bottom: 0">
            <!--<div slot="actions" class="block t-r" style="min-width: 100px"></div>
            <span slot="actions"></span>-->
            <a-list-item-meta>
                <a-row slot="description">
                    <a-col :xs="24" :md="12">
                        <a-progress
                                :stroke-color="{from: '#108ee9',to: '#87d068'}"
                                :percent="((item.recordCount - item.leftCount)* 100.0/item.recordCount).toFixed(2)"
                                :status="progressStatusMap[item.status]"
                                />
                    </a-col>
                    <a-col :xs="24" :md="12" class="t-c">
                        {{item.startTime}} ~ {{item.endTime}}
                        <span class="fr">{{item.createUsername}}</span>
                    </a-col>
                    <a-col :span="24" :class="item.status === 'abnormal'?'t-red': 't-grey-aaa'"
                           v-if="item.status === 'normal' || item.status === 'abnormal'">
                        <j-ellipsis :value="item.msg" :length="40"></j-ellipsis>
                    </a-col>
                </a-row>
                <!--<div slot="description">
                    <a v-if="item.status === 'abnormal'" class="t-red">
                        <a-popover title="异常信息">
                            <template slot="content">
                                <div style="max-width: 500px">{{item.msg}}</div>
                            </template>
                            {{item.msg.length > 80? item.msg.substring(0, 80) + '...':item.msg}}
                        </a-popover>
                    </a>

                </div>-->
                <div slot="title">
                    <a-row>
                        <a-col :xs="12" :sm="8">
                            {{item.actionType_dictText}}
                        </a-col>
                        <a-col :xs="12" :sm="8">
                          <template v-if="item.recordCount === -1">
                            {{(999999999 - item.leftCount) + ' / ' + (999999999 - item.leftCount)}}
                          </template>
                          <template v-else>
                            {{item.recordCount - item.leftCount}} / {{item.recordCount}}
                          </template>
                        </a-col>
                        <a-col :xs="12" :sm="8">
                            {{item.actionTitle}}
                        </a-col>
                    </a-row>
                </div>
            </a-list-item-meta>
        </a-list-item>
    </a-list>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "TaskAsyncActionLogMini",
    mixins: [JeecgListMixin],
    props: ['param', 'actionType'],
    components: {
      MDictSelectTag
    },
    data() {
      this.progressStatusMap = {
        'running': 'active',
        'abnormal': 'exception',
        'wait': 'normal',
        'normal': 'success'
      }
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
          // list: this.$suncare_v3 + "/apiTask/taskAsyncActionLog/list",
          list: "/task/taskAsyncActionLog/list",
        },
        fixedParam: {
          actionPathParam: this.param,
          actionType: this.actionType
        },
        ipagination: {
          current: 1,
          pageSize: 5,
          hideOnSinglePage: true,
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          total: 0,
          onChange: this.onChange,
          onShowSizeChange: this.onShowSizeChange
        },
        refreshTime: 5
      }
    },
    watch:{
      dataSource(val){
        if(val.length > 0
          // && val.some(r =>r.status === 'running')
        ){
          this.$emit('countdown')

        }

      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      onChange(page, pageSize){
        this.ipagination.current = page
        this.loadData()
      },
      onShowSizeChange(page,pageSize){
        this.ipagination.current = 1
        this.ipagination.pageSize = pageSize
        this.loadData()
      },
    }
  }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
