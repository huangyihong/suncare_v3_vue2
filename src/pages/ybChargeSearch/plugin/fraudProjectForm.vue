<template>
  <div>
    <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" >
      <div class="table-page-search-wrapper m-t-10">
        <a-form :form="form"  layout="inline">
          <a-row :gutter="24">
            <a-col :xxl="8" :md="12" :sm="12">
              <a-form-item  label="统计年度">
                <a-date-picker class="search-divider-item2" placeholder="" v-decorator="['chargedateStartdate', {}]"
                               mode="year"
                               :open='yearShowStart'
                               format='YYYY'
                               @openChange="openChangeStart"
                               @panelChange="panelChangeStart"></a-date-picker>
                <div class="search-divider">~</div>
                <a-date-picker class="search-divider-item2" placeholder="" v-decorator="['chargedateEnddate', {}]"
                               mode="year"
                               :open='yearShowEnd'
                               format='YYYY'
                               @openChange="openChangeEnd"
                               @panelChange="panelChangeEnd"></a-date-picker>
                <div class="search-divider2">
                  <a-dropdown>
                    <a-menu slot="overlay">
                      <a-menu-item key="0" @click="beforeYear(0,0)">今年</a-menu-item>
                      <a-menu-item key="1" @click="beforeYear(12,0)">近1年</a-menu-item>
                      <a-menu-item key="2" @click="beforeYear(24,0)">近2年</a-menu-item>
                      <a-menu-item key="3" @click="beforeYear(36,0)">近3年</a-menu-item>
                    </a-menu>
                    <a-button>快速填充<a-icon type="down" /></a-button>
                  </a-dropdown>
                </div>
              </a-form-item>
            </a-col>

          </a-row>
        </a-form>
      </div>
    </a-card>
    </a-spin>


    <div>
      <searchQueryList ref="searchQueryList"
                       :taskType="taskType"
                       @searchQuery="searchQuery">
        <div style="text-align: right;margin:0 50px 20px 0;" slot="queryBtn">
          <div class="table-operator" v-has="'ybChargeTask:createTask'">
            <a-button @click="clearQueryData" style='margin-right: 10px'>清空查询条件</a-button>
            <a-button type="primary"  @click="searchQuery">查询</a-button>
          </div>
        </div>
        <div style="margin:0 30px;" slot="createTaskBtn">
          <div v-has="'ybChargeTask:createTask'">
            <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk()">
              <a-button type="primary">创建文件下载任务</a-button>
            </a-popconfirm>

          </div>
        </div>
      </searchQueryList>
    </div>

  </div>
</template>

<script>
import pick from 'lodash/pick'
import moment from "moment"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchQueryList from '@/pages/ybChargeSearch/searchQueryList'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'
export default {
  name: "fraudProjectForm",
  mixins:[taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      required: true
    },
  },
  components: {
    MDictSelectTag,
    searchQueryList,
  },
  data () {
    return {
      description: '欺诈专题城市年度统计',
      bean:{},
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.searchQuery()
    })
  },
  methods: {
    clearExcelTable(){
      this.bean = Object.assign({}, {})
    },

    //直接查询结果进行展示
    searchQuery(){
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.taskType
          this.$refs.searchQueryList.changeColums(formData.taskType)
          this.$refs.searchQueryList.queryParam = formData;

          this.$refs.searchQueryList.loadData(1);
          this.$refs.searchQueryList.showDetail = false
        }
      })
    },

    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {

          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.taskType

          formData.jsonStr=JSON.stringify(formData)
          this.confirmLoading = true;
          httpAction(this.url.saveTaskByType,formData,'post').then((res)=>{
            if(res.success){
              this.$confirm({
                title: '打开下载任务记录界面?',
                content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
                onOk() {
                  that.$util.openTab('/ybChargeSearch/searchTaskList')
                }
              })
            }else{
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoading = false;
          })
        }
      })
    },

  }
}
</script>
<style lang="less" scoped>
  .rotate90{
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .fieldset-box1 {
    padding: 16px;
    border: 1px solid rgb(153,153,153);
    border-radius: 2px;
    //display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    transition: all 0.2s;
  }

  .table-operator .ant-btn {
    margin-right: 6px;
  }

  .search-divider-item2{
    display: inline-block;
    width: calc(50% - 62px) !important;
    min-width: 80px !important;
  }
  .search-divider2{
    width: 100px;
    padding-left:2px;
    display: inline-block;
  }

  /deep/ .ant-card-body{
    padding-bottom: 0px;
    padding-top: 14px;
    padding-right: 24px;
    padding-left: 24px;
  }
</style>
