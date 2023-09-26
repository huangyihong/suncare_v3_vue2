<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item label="疾病项目">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.chargeItems"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

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
        rowKey="ruleId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <!-- 字符串超长截取省略号显示 -->
        <span slot="message" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>
        <span slot="codes" slot-scope="text">
          <j-ellipsis :value="text" :length="22"/>
        </span>
        <span slot="names" slot-scope="text">
          <j-ellipsis :value="text" :length="13"/>
        </span>
        <span slot="limitScope" slot-scope="text">
          <j-ellipsis :value="toLimitScopeShow(text)" :length="12"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const limitDict = {
    '01': '年龄',
    '02': '性别',
    '03': '就医方式',
    '04': '参保类型',
    '05': '医院级别',
    '06': '科室',
    '07': '疗程用药剂量',
    '08': '年度用药剂量',
    '09': '治疗项目',
    '10': '治疗方式',
    '11': '重复用药',
    '12': '二线用药',
    '13': '适用症',
    '14': '治疗用药',
    '15': '住院天数',
    '16': '入院前天数',
    '17': '诊疗项目',
  }
  export default {
    name: "MedicalTreatProjectList",
    mixins: [JeecgListMixin,multiSelectIdMatchMixin],
    components: {
      JEllipsis,
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '疾病名称',
            align: "center",
            dataIndex: 'diseaseNames',
            width: 200,
            // fixed: true,
            // scopedSlots: { customRender: 'names' }
          }, {
            title: '就诊类型',
            align: "center",
            dataIndex: 'jzlx_dictText',
            width: 200,
            // scopedSlots: { customRender: 'names' }
          },
          {
            title: '限定范围',
            align: "center",
            dataIndex: 'limitScope',
            width: 200,
            // scopedSlots: { customRender: 'limitScope' }
            customRender: this.toLimitScopeShow
          },
          {
            title: '住院天数',
            align: "center",
            dataIndex: 'inhospitalMax',
            width: 200,
            customRender: (t, r, i) => {
              let html = t?'上限：'+ t: '';
              if(r.inhospitalMin){
                html += '  下限：'+r.inhospitalMin;
              }
              return html
            },
          },
          {
            title: '入院前天数',
            align: "center",
            dataIndex: 'beforeInhospital',
            width: 130
          },
        ],
        url: {
          list: "/medical/medicalDrugRule/list",
        },
        /* 排序参数 */
        isorter: {
          column: 'chargeItems',
          order: 'asc',
        },
        fixedParam: {ruleType: '3'},
        id: 'ruleId',
        code: 'diseaseCodes',
        name: 'diseaseNames',
      }
    },
    methods: {
      toLimitScopeShow(limitScope) {
        return limitScope.trim().split(",").map(item => limitDict[item.toString()]).join(",")
      },
      /*getSelect() {
        return this.selectedRowRecords.map(record => {
          return {
            id: record[this.id],
            name: record[this.name],
            code: record[this.code]
          }
        })
      },*/
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
