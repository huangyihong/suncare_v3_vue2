import { postAction, getAction } from '@/api/manage'
import { postAction as putAction_sv3 } from '@/api-sv3/manage'

export default {
  components: {
    processBar: {
      props: {
        data: Object,
        probe: {
          type: Boolean,
          default: false
        }
      },
      render() {
        console.log('this.probe', this.probe)
        let data = this.data
        if (!data) {
          return
        }
        let msg = ''
        if(data.TOTAL === 0){
          msg = '流程统计未开始'
        } else if (data.RUNNING === 0 && data.ABNORMAL === 0) {
          msg = '流程统计完成'
        } else {
          if (data.RUNNING) {
            msg += `统计中：${data.RUNNING}`
          }
          if (data.ABNORMAL) {
            if (data.RUNNING) {
              msg += '，'
            }
            msg += `统计异常：${data.ABNORMAL}`
          }
        }
        if (data.END_TIME) {
          msg += ` (${data.END_TIME})`
        }
        return <a-alert type={data.RUNNING > 0 ? 'info' : data.ABNORMAL > 0 ? 'warning' : 'success'}
                        class="min-alert" show-icon>
          <div slot="message">{msg}
            {!data.RUNNING ?
              <a-popconfirm class="fr" title="确定执行吗?" onConfirm={() => this.$emit('exec', this.probe)}>
                <a>执行</a>
              </a-popconfirm>
              : undefined}
          </div>
          {/*
            <a-icon type={data.RUNNING > 0?'loading': data.ABNORMAL> 0?'warning': 'check-circle'} slot="icon"></a-icon>
*/}
        </a-alert>

      }
    }
  },
  data() {
    this.statisticUrl = {
      statisticTotalView: '/engine/statisticTotalView',
      statisticCaseView: '/engine/statisticCaseView',
      statisticExec: this.$suncare_v3 + '/engine/statisticExec',
      statisticCaseExec: this.$suncare_v3 + '/engine/statisticCaseExec',
    }
    return {
      statisticTotalInfo: undefined,
      /*statisticTotalInfo: {
        TOTAL: 760,
        RUNNING: 0,
        ABNORMAL: 2,
        END_TIME: '2021-09-16 10:09:12'
      },*/
      statisticNodeList: undefined
    }
  },
  beforeMount() {
    /*if(this.loadStatisticTotal){
      this.getStatisticTotalView()
    }*/
  },
  beforeDestroy() {
    if (this.timer) {
      console.log('退出页面,取消定时获取')
      clearTimeout(this.timer)
    }
  },
  methods: {
    getStatisticTotalView() {
      let probe = this.url && this.url.list && this.url.list.startsWith('/probe')
      getAction(this.statisticUrl.statisticTotalView, {probe}).then(res => {
        if (res.success) {
          let data = res.result
          if (data.RUNNING) {
            this.statisticTotalInfo = data
            this.timer = setTimeout(this.getStatisticTotalView, 5000)
          } else if (data.ABNORMAL !== 0) {
            this.statisticTotalInfo = data
            this.timer = undefined
          } else {
            this.statisticTotalInfo = undefined
            this.timer = undefined
          }
        } else {
          this.statisticTotalInfo = undefined
          this.timer = undefined
          this.$message.warning(res.message)
        }
      }).finally(() => {
      })
    },
    getStatisticCaseView(caseId) {
      getAction(this.statisticUrl.statisticCaseView, { caseId }).then(res => {
        if (res.success) {
          let data = res.result
          this.statisticNodeList = data
          this.$emit('statisticCase', this.statisticNodeList, caseId)
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
      })
    },
    execStatistic(probe){
      putAction_sv3(this.statisticUrl.statisticExec, { probe: !!probe }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getStatisticTotalView()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
      })

    },
    execCaseStatistic(params) {
      return new Promise((resolve, reject) => {
        postAction(this.statisticUrl.statisticCaseExec, params).then(res => {
          if (res.success) {
            let result = res.result
            let func = (obj) => {
              let result = {}
              for(let key in obj){
                result[key] = obj[key].count
                Object.assign(result, func(obj[key]))
              }
              return result
            }
            resolve(func(result))
          } else {
            this.$error({
              title: '统计结果',
              content: res.message,
            });
            // this.$message.warning(res.message)
            reject(res.message)
          }
        }).catch(e => {
          reject(e.message)
        })
      })
    },
  }
}