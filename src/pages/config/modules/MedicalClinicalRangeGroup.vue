<template>
  <a-spin :spinning="confirmLoading">
    <a-button type="primary" @click="groups.push([])" v-if="!readonly">添加{{selectInfo.title}}范围组</a-button>
    <a-empty v-if="groups.length === 0 && !confirmLoading"></a-empty>
    <template v-for="(group,index) in groups">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="groupId"
        :columns="columns"
        :dataSource="group"
        :pagination="false"
        :loading="confirmLoading"
        :rowSelection="false"
        :scroll="{ x: 720}"
        class="m-t-10"
      >
        <template slot="title" slot-scope="currentPageData" v-if="!readonly">
          <span style="font-size: 18px">范围组{{index + 1}}</span>
          <a-button type="primary" class="fr" @click="toSelectModal(index)">选择{{selectInfo.title}}组</a-button>
        </template>
        <template slot="groupName" slot-scope="text, record">
          {{text}}
          <p v-if="record.remark">{{record.remark}}</p>
        </template>
        <template slot="attr" slot-scope="text, record">
          <a-radio-group v-model="record.adviceAttr">
            <template v-for="(value,code) in attrAdviceDict">
              <a-radio :value="code">{{value}}</a-radio>
            </template>
          </a-radio-group>
          <a-radio-group v-model="record.requireAttr">
            <template v-for="(value,code) in attrRequireDict">
              <a-radio :value="code">{{value}}</a-radio>
            </template>
          </a-radio-group>
        </template>
        <template slot="attrAdvice" slot-scope="text, record">
          <a-radio-group v-model="record.adviceAttr">
            <template v-for="(value,code) in attrAdviceDict">
              <a-radio :value="code" style="margin-right: 0">{{value}}</a-radio>
            </template>
          </a-radio-group>
        </template>
        <template slot="attrRequire" slot-scope="text, record">
          <a-radio-group v-model="record.requireAttr">
            <template v-for="(value,code) in attrRequireDict">
              <a-radio :value="code" style="margin-right: 0">{{value}}</a-radio>
            </template>
          </a-radio-group>
        </template>
        <span slot="action" slot-scope="text, record,index">
          <!--<a @click="handleEdit(record)">编辑</a>-->
          <!--     <a-tag :color="primaryColor" @click="handleEdit(record,'2')">准入</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'3')">药品</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'4')">项目</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'1','moreInfo')">资料</a-tag>
               <a-divider type="vertical"/>-->
              <a @click="group.splice(index,1)">移除</a>
            </span>
      </a-table>
    </template>
    <!--
        <a-row :gutter="10" style="margin-top: 10px">
          <a-col :sm="12" v-for="(item,index) in dataSource" :key="index">
            <a-card hoverable style="margin-bottom: 10px">
              <a-card-meta>
                <template slot="title">
                  {{item.groupName}}({{item.groupCode}})
                  <a  style="float: right" :style="{color:primaryColor}">
                    <a-icon type="delete" @click="dataSource.splice(index,1)"/>
                  </a>

                </template>
                <template slot="description">

                    <div>描述：{{item.remark || '无'}}</div>
                  <a-row>
                    <a-col :md="12"><div>医嘱属性： <a-dropdown>
                      <span class="ant-dropdown-link"> {{attrAdviceDict[item.adviceAttr] || '请选择'}}
                        <a-icon type="down"/>
                      </span>
                      <a-menu slot="overlay">
                        <a-menu-item v-for="(value,code) in attrAdviceDict" :key="code"
                                     @click="chooseAttr(index,'adviceAttr',code)">
                          <a>{{value}}</a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                    </div>
                    </a-col>
                    <a-col :md="12">
                      <div>必要属性：<a-dropdown>
                      <span class="ant-dropdown-link"> {{attrRequireDict[item.requireAttr] || '请选择'}}
                        <a-icon type="down"/>
                      </span>
                        <a-menu slot="overlay">
                          <a-menu-item v-for="(value,code) in attrRequireDict" :key="code"
                                       @click="chooseAttr(index,'requireAttr',code)">
                            <a>{{value}}</a>
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>
                      </div>
                    </a-col>
                  </a-row>

                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
    -->
    <m-modal
      :title="`选择${selectInfo.title}`"
      v-model="modalVisible"
      destroyOnClose
      @ok="handleSelected" v-if="!readonly">
      <medical-group ref="groupModalRef" :kind="selectInfo.kind" :selected="selected"></medical-group>
    </m-modal>
  </a-spin>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from 'moment'
  import MedicalGroup from '@/pages/selectMulti/MedicalGroupClinicalRange'
  import { queryRangeGroupByClinicalId } from '@/api-sv3/api-medical'
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'

  export default {
    name: 'MedicalClinicalModalGroup',
    components: { MedicalGroup },
    props: {
      type: String,
      clinicalId: String,
      readonly: {
        type: Boolean,
        required: false
      }
    },
    data() {
      const columns = [{
        title: '分组编码',
        align: 'left',
        dataIndex: 'groupCode',
        scopedSlots: { customRender: 'code' },
        width: 100
      },
        {
          title: '分组名称',
          align: 'center',
          dataIndex: 'groupName',
          scopedSlots: { customRender: 'groupName' },
          width: 150
        },
        /*{
          title: '医嘱属性 / 必要属性',
          align: "center",
          scopedSlots: { customRender: 'attr' },
          width: 250,
        },*/
        {
          title: '医嘱属性',
          align: 'center',
          scopedSlots: { customRender: 'attrAdvice' },
          width: 200
        },
        {
          title: '必要属性',
          align: 'center',
          scopedSlots: { customRender: 'attrRequire' },
          width: 220
        }]
      if (!this.readonly) {
        columns.push({
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 80
        })
      }
      return {
        confirmLoading: false,
        columns,
        modalVisible: false,
        selectInfoObj: {
          'drug': {
            title: '药品',
            kind: '7'
          },
          'project': {
            title: '项目',
            kind: '1'
          }
        },
        selectInfo: {},
        groups: [],
        groupFocusIndex: [],
        // dataSource: [],
        attrAdviceDict: {},
        attrRequireDict: {}
      }
    },
    beforeMount() {
      this.$util.initDict(['DOC_ADVICE_ATTR', 'REQUIRE_ATTR']).then(obj => {
        this.attrAdviceDict = {}
        this.attrRequireDict = {}
        for (let item of obj['DOC_ADVICE_ATTR']) {
          this.attrAdviceDict[item.code] = item.value
        }
        for (let item of obj['REQUIRE_ATTR']) {
          this.attrRequireDict[item.code] = item.value
        }
      })
    },
    watch: {
      type: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.selectInfo = this.selectInfoObj[val]
          }
        }
      },
      clinicalId: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.queryData(val)
          }
        }
      }
    },
    methods: {
      queryData(clinicalId) {
        this.confirmLoading = true
        queryRangeGroupByClinicalId({ clinicalId, type: this.type }).then(res => {
          if (res.success) {
            let data = res.result
            data.sort((a, b) => a.groupNo - b.groupNo)
            let group = []
            let groupNo = -1
            for (let item of data) {
              if (groupNo !== item.groupNo) {
                groupNo = item.groupNo
                this.groups.push(group = [])
              }
              group.push(item)
            }
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      /*chooseAttr(index, field, code) {
        let item = this.dataSource[index]
        item[field] = code
        this.dataSource.splice(index, 1, item)
      },*/
      toSelectModal(groupIndex) {
        this.groupFocusIndex = groupIndex
        this.selected = this.groups[groupIndex].map(item => ({
          code: item.groupCode,
          name: item.groupName,
          remark: item.remark,
          adviceAttr: item.adviceAttr,
          requireAttr: item.requireAttr
        }))

        this.modalVisible = true
      },
      handleSelected() {
        let array = this.$refs.groupModalRef.getSelect()
        let groupNo = this.groupFocusIndex
        // 添加新的项
        let group = array.map(item => {
          return {
            groupCode: item.code,
            groupName: item.name,
            groupType: this.type,
            remark: item.remark,
            adviceAttr: item.adviceAttr,
            requireAttr: item.requireAttr,
            groupNo
          }
        }).sort((item1, item2) => item1.groupCode > item2.groupCode ? 1 : -1)
        this.groups.splice(groupNo, 1, group)
        this.modalVisible = false
      },
      getData() {
        return this.groups.flat(2)
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
