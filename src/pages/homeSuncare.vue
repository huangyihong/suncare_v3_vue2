<template>
  <div class="page-header-index-wide">
    <a-card :loading="quickMenuLoading" :bordered="false" :body-style="{padding: '8px 16px 16px 16px'}" title="快捷菜单">
      <a href="#" slot="extra">
        <router-link :to="{ path: '/dashboard/workplace'}" style="float: right">
          去设置
        </router-link>
      </a>
      <div>
        <template v-for="(item,index) in quickMenuData">
          <router-link :to="{ name:item.name, href:item.href, target:item.target}">
            <div class="modular-list" style="margin: 4px;padding:8px 20px;display: inline-block;">
              <a-icon :type="item.icon?item.icon:'file-text'" class="modular-icon"
                      :style="{backgroundColor: primaryColor}"></a-icon>
              <div class="modular-title">{{item.title}}</div>
            </div>
          </router-link>
        </template>
      </div>
    </a-card>
    <a-card :bordered="false" :loading="batchTaskLoading" :body-style="{padding: '0', }" :style="{ marginTop: '24px' }"
            title="最近批次任务">
      <a @click="loadTopBatchTask" slot="extra">
        <a-icon :type="batchTaskLoading?'loading':'redo'"/>
        刷新</a>
      <a-row>
        <template v-for="item in batchTaskData">
          <a-col :xs="12" :lg="8" :xxl="6">
            <a-card-grid class="w-b-100">
              <!--<div  style="border: 1px solid #d9d9d9;border-radius: 4px;">-->
              <div style="font-size: 16px;color: black">
                <div style="display: inline-block;width: 45%" class="ellipsis-1">{{item.projectName}}</div>
                <div style="display: inline-block;width: 10%" class="ellipsis-1 t-c">/</div>
                <router-link :to="{ path: '/review/reviewSystemList',query:{batchId:item.batchId}}"
                             style="display: inline-block;width: 45%" class="ellipsis-1">
                  {{item.batchName}}
                </router-link>
              </div>
              <a-row style="min-height: 66px">
                <template v-for="r in item.list">
                  <a-col :xs="8" style="margin: 6px 0">
                    <span class="m-r-10">{{r.title}}</span>
                    <a-icon type="check" v-if="r.status === 'normal'" style="color: green"/>
                    <a-tooltip :title="r.msg" v-else-if="r.status === 'abnormal'">
                      <a-icon type="exclamation" style="color: orange" class="pointer"/>
                    </a-tooltip>
                    <a-icon type="clock-circle" v-else-if="r.status === 'wait'" style="color: grey"/>
                    <a-icon type="loading" v-else-if="r.status === 'running'" style="color: deepskyblue"/>
                  </a-col>
                </template>
              </a-row>
              <a-divider style="margin: 5px 0"/>
              <div class="t-r"><span>{{item.timeTitle}}：{{item.time}}</span></div>
            </a-card-grid>
            <!--</div>-->
          </a-col>
        </template>
      </a-row>

    </a-card>
    <a-row :gutter="24" :style="{ marginTop: '18px' }">
      <a-col :xs="12" :xl="6">
        <chart-card :loading="loading" title="医疗总费用" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">次均费用<span>￥ 234.56</span></template>
        </chart-card>
      </a-col>

      <a-col :xs="12" :xl="6">
        <chart-card :loading="loading" title="诊疗次数" :total="6560 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-bar :height="40"/>
          </div>
          <template slot="footer">住院次数占比 <span>30%</span></template>
        </chart-card>
      </a-col>

      <a-col :xs="12" :xl="6">
        <chart-card :loading="loading" title="疑似违规病例" total="13%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="13" :height="8"/>
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              30%
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :xs="12" :xl="6">
        <chart-card :loading="loading" title="系统访问量" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-area/>
          </div>
          <template slot="footer">日访问量<span> {{ '43' | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :style="{ marginTop: '24px' }" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{width: '256px'}"/>
          </div>
          <a-tab-pane loading="true" tab="就诊总金额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :xs="12">
                <bar title="就诊总金额排行" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :xs="12">
                <rank-list title="医疗费用排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="疑似病例" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :xs="12">
                <bar title="疑似病例数量趋势" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :xs="12">
                <rank-list title="疑似病例数量排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row :style="{ marginTop: '24px' }">
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周疑似病例次数统计">
          <a-row>
            <a-col :span="6">
              <head-info title="今日疑似病例涉及机构" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"/>
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日疑似病例人数" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"/>
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="疑似病例总次数" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"/>
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import ACol from "ant-design-vue/es/grid/Col"
import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HeadInfo from '@/components/tools/HeadInfo.vue'

import Trend from '@/components/Trend'
import { getLoginfo, getVisitInfo } from '@/api/api'
import { getAction } from '@/api/manage'
import { getUserQuickMenu } from '@/api-sv3/api-dashboard'
import { mapState } from 'vuex'
import { mixin } from '@/utils/mixin'
import pick from 'lodash/pick'

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: 'XX县第' + (i + 1) + ' 医院',
    total: 1234.56 - i * 100
  })
}
const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  name: "home",
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo,
  },
  mixins: [mixin],
  data() {
    return {
      url: {
        topBatchTask: '/task/taskProjectBatch/topBatchTask'
      },
      loading: false,
      center: null,
      rankList,
      barData,
      loginfo: {},
      visitFields: ['ip', 'visit'],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin/>,
      quickMenuLoading: true,
      quickMenuData: [],
      batchTaskLoading: true,
      batchTaskData: []
  }
  },
  beforeMount() {
    /*setTimeout(() => {
      this.loading = !this.loading
    }, 1000)*/
    this.initLogInfo();
    this.loadQuickMenuData()
    this.loadTopBatchTask()
  },
  computed: {
    ...mapState({
      // 后台菜单
      permissionMenuList: state => state.user.permissionList
    })
  },
  methods: {
    loadQuickMenuData() {
      let keyNodeObj = this.getKeyMenuItemObj(this.permissionMenuList)
      getUserQuickMenu().then(res => {
        if (res.success) {
          this.quickMenuData = res.result.map(item => keyNodeObj[item.menuId]).filter(item => item)
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.quickMenuLoading = false
      })
    },
    getKeyMenuItemObj(list) {
      let keyNodeObj = {}
      for (let item of list) {
        if (item.hidden) {
          continue
        }
        let obj = {
          key: item.id,
          title: item.meta.title,
          icon: item.meta.icon,
          name: item.name,
          href: item.path,
          target: item.meta.target
        }
        keyNodeObj[obj.key] = obj
        if (item.children && item.children.length > 0) {
          keyNodeObj = { ...keyNodeObj, ...this.getKeyMenuItemObj(item.children) }
        }
      }
      return keyNodeObj
    },
    loadTopBatchTask() {
      /*let typeObj = {
        '-1': '特殊批次',
        '01': '模型(业务组)',
        '11': '模型探查',
        '02': '药品合规',
        '03': '收费合规',
        '07': '合理诊疗',
        '08': '合理用药',
        '06': '临床路径',
        '09': '收费测试',
        '10': '诊疗测试',
        '12': '药品测试',
      }*/
      let typeObj = {
        '-1': '特殊批次',
        '01': '模型(业务组)',
        '11': '模型探查',
        // '02': '药品合规',
        // '03': '收费合规',
        // '07': '合理诊疗',
        '08': '合理用药',
        '06': '临床路径',
        '09': '收费合规',
        '10': '合理诊疗',
        '12': '药品合规',
      }
      this.batchTaskLoading = true
      getAction(this.url.topBatchTask, { topNum: 8 }).then(res => {
        if (res.success) {
          let data = res.result;
          // 归纳相同批次的任务进度
          let obj = {}
          for (let item of data) {
            if (!obj[item.batchId]) {
              obj[item.batchId] = []
            }
            obj[item.batchId].push(item)
          }
          // 归纳批次子项，设置批次主要信息
          let array = []
          for (let batchId in obj) {
            let arr = obj[batchId]
            let item0 = arr[0]
            let objItem = {
              ...pick(item0, 'projectId', 'projectName', 'batchId', 'batchName'),
              list: []
            }
            let updateTimes = arr.map(r => r.updateTime);
            if (arr.find(r => r.status === 'running' || r.status === 'wait')) {
              updateTimes.sort((a, b) => a > b ? 1 : -1)
              objItem.timeTitle = '开始时间'
            } else {
              updateTimes.sort((a, b) => a < b ? '1' : '-1')
              objItem.timeTitle = '结束时间'
            }
            // console.log(objItem.timeTitle,updateTimes)
            objItem.time = updateTimes[0]
            for (let item of arr) {
              if (!typeObj[item.itemId]) {
                continue
              }
              objItem.list.push({
                title: typeObj[item.itemId],
                type: item.itemId,
                status: item.status,
                msg: item.msg
              })
            }
            objItem.list.sort((a, b) => a.type > b.type ? 1 : -1)
            array.push(objItem)
          }
          array.sort((a, b) => {
            if(a.timeTitle === b.timeTitle){
              return a.time > b.time ? -1 : 1
            } else {
              return a.timeTitle === '开始时间' ? -1 : 1
            }
          })
          this.batchTaskData = array
        }
      }).finally(() => {
        this.batchTaskLoading = false
      })
    },
    initLogInfo() {
      getLoginfo(null).then((res) => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + ""
          })
          this.loginfo = res.result;
        }
      })
      getVisitInfo().then(res => {
        if (res.success) {
          console.log("aaaaaa", res.result)
          this.visitInfo = res.result;
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }

    p {
      line-height: 42px;
      margin: 0;

      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>
