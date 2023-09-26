<template>
  <a-card :bordered="false">

    <div style="text-align: center;font-size: 22px;padding-top: 10px;padding-bottom: 20px;">
      <span>{{resultConfigBean.title}}</span>
    </div>

    <div class="table-page-search-wrapper">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8" v-if="bean.taskType=='lowStatistics'">
              <a-form-item label="数据来源">
                <!--<a-radio-group  v-decorator="['etlSource', {}]">
                  <a-radio value="yb">医保数据</a-radio>
                  <a-radio value="his">HIS</a-radio>
                </a-radio-group>-->
                <m-dict-select-tag v-decorator="['etlSource', {}]" dictCode="SEARCH_ETL_SOURCE" type="radio"></m-dict-select-tag>

              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="12" v-else>
              <a-form-item  label="标签名称">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['tagId', validatorRules.required]"
                  placeholder="请选择标签名称"
                  :dropdownMatchSelectWidth="false"
                  @change="getOrgList"
                >
                  <a-select-option  v-for="(item,index) in tagList" :value="item.TAG_INDEX" :key="item.TAG_INDEX">{{item.TAGNAME}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="12">
              <a-form-item  label="医院名称">
                <a-select
                  show-search
                  allowClear
                  mode="multiple"
                  :max-tag-count="2"
                  v-decorator="['orgs', {}]"
                  placeholder="模糊检索,多个医院检索用#分隔"
                  :dropdownMatchSelectWidth="false"
                  :filter-option="filterOption"
                >
                  <a-select-option  v-for="(item,index) in orgList" :value="item.VALUE" :key="item.VALUE">{{item.NAME}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

        </a-form>
      </a-spin>
    </div>

    <search-task-list ref="searchTaskList" :taskType="bean.taskType">
      <div style="text-align: right;margin:20px;" slot="createTaskBtn">
        <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk">
          <a-button type="primary" v-has="'ybChargeTask:createTask'">创建文件下载任务</a-button>
        </a-popconfirm>
      </div>
    </search-task-list>

  </a-card>
</template>

<script>
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import { mapGetters } from 'vuex'
import pick from 'lodash/pick'
import moment from "moment"
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import searchTaskList from './searchTaskList'
import { taskMixin } from './mixins/taskMixin'

export default {
  name: "search",
  mixins:[taskMixin],
  components: {
    MDictSelectTag,
    searchTaskList
  },
  data () {
    const taskType = this.$route.path.substring(this.$route.path.lastIndexOf("/")+1)
    return {
      description: '收费明细查询任务页面',
      //表单
      bean:{taskType:taskType},
      model: {},
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },

      confirmLoading: false,

      url: {
        getOrgList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgList",
        getTagList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getTagList",
        saveTaskByType: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskByType",
      },
      orgList:[],
      tagList:[],
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),

  },
  beforeMount() {
    this.loadResultConfigMap()
    this.bean.dataSource = this.userInfo.dataSource
    this.getDatasourceAndDatabase()
    this.resetForm()
    if(this.bean.taskType=='lowStatistics'){
      this.getOrgList('')
    }else{
      this.getOrgList(this.form.getFieldValue('tagId'))
      this.getTagList()
    }

  },

  methods: {

    //获取机构列表
    getOrgList(tagId){
      this.orgList = []
      getAction(this.url.getOrgList, {dataSource:this.userInfo.dataSource,taskType:this.bean.taskType,tagId}).then((res) => {
        if (res.success) {
          this.orgList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取标签列表
    getTagList(){
      this.tagList = []
      getAction(this.url.getTagList, {dataSource:this.userInfo.dataSource,taskType:this.bean.taskType}).then((res) => {
        if (res.success) {
          this.tagList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    resetForm(){
      if(this.bean.taskType=='lowStatistics'){
        this.bean.etlSource = 'yb'
      }
      this.model = Object.assign({}, this.bean);
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'tagId','orgs','etlSource'))
      });
    },

    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          let formData = Object.assign(this.model, values);
          formData.orgs = formData.orgs.length>0?formData.orgs.join(','):null
          console.log(formData)
          httpAction(that.url.saveTaskByType,formData,'post').then((res)=>{
            if(res.success){
              this.$success({
                title: '操作成功',
                content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
              });
              this.$refs.searchTaskList.reloadTable()
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
    },


  }
}
</script>
<style lang="less" scoped>
  .layui-elem-quote {
    margin-bottom: 10px;
    padding: 15px;
    line-height: 22px;
    border-left: 5px solid #009688;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    div {
      padding: 0 5px;
    }
  }
  .list-item {
    border-bottom: 1px solid #e8e8e8;
    padding: 5px 0;
  }
  .fieldset {
    margin: 0 15px;
    padding: .35em .625em .75em;
    border-width: 2px;
    border-style: solid;
    border-color: silver silver silver rgb(95, 94, 94);
  }
  .success_btn{
    color: #fff;
    background-color: #009688;
    border-color: #009688;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }
</style>
