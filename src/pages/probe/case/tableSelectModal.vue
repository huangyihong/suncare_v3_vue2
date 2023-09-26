<template>

  <m-modal
    centered
    title="选择表"
    width="80%"
    :visible="visible"
    @cancel="hide"
    @max="isMax=> {isMax? heightRatio+=0.2: heightRatio-=0.2}"
    :maskClosable="true"
    :footer="null">
    <a-spin :spinning="confirmLoading">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :md="6" :xs="8">
              <a-form-item label="表名称">
                <a-input placeholder="模糊搜索" v-model="queryParam.code" @change="searchChange"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="表中文名称">
                <a-input placeholder="模糊搜索" v-model="queryParam.value" @change="searchChange"></a-input>
              </a-form-item>
            </a-col>
            <!--<template v-if="toggleSearchStatus">
              <a-col :md="6" :xs="8">
                <a-form-item label="字段类型">
                  <m-dict-select-tag placeholder="选择字段类型" dictCode="COL_TYPE"
                                     v-model="queryParam.colType" @change="searchChange"></m-dict-select-tag>
                </a-form-item>
              </a-col>
            </template>-->

            <a-col :md="6" :xs="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                  <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
                </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div>
        <a-tabs v-bind="grid < 2?{tabPosition:'top'}:{tabPosition:'left',tabBarStyle:{height: tabHeight - 40 +'px'}}">
          <template v-for="(type,index) in typeShow">
            <a-tab-pane :key="type" :forceRender="false">
             <span slot="tab">
                {{type}}
                <a-badge :count="typeDataShow[index].length" :overflow-count="999"
                         :numberStyle="{backgroundColor: color} " showZero/>
              </span>
              <a-row :gutter="12" style="overflow: auto;transition: height 0.3s" :style="{height: tabHeight+'px'}">
                <template v-for="item in typeDataShow[index]">
                  <a-col :xs="12" :xxl="8" class="col-item">
                    <span @click="selectOK(item)" :title="`${item.value}(${item.code})`">
                      <p>{{item.value}}</p>
                      <p>({{item.code}})</p>
                    </span>
                  </a-col>
                </template>

              </a-row>
            </a-tab-pane>
          </template>

        </a-tabs>
      </div>
    </a-spin>
  </m-modal>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { queryColConfigById } from '@/api-sv3/api-flow'
  import debounce from 'lodash/debounce';

  export default {
    name: "tableSelect",
    components: {},
    props: ['tableData'],
    data() {
      return {
        visible: false,
        confirmLoading: true,
        toggleSearchStatus: false,
        heightRatio: 0.8,
        queryParam: {},
        types: ['病人','门诊','住院','收费项目','疾病','药品','医疗机构','科室','医生','地区'],
        typeData: {},
        typeShow: [],
        typeDataShow: [],
        typeInitShow: [],
        typeInitDataShow: []
      }
    },
    computed: {
      ...mapGetters(["grid", "color", "height", "colDict"]),
      tabHeight() {
        let height = this.height * this.heightRatio - 160
        if (this.isShowSelect) {
          height -= 54
        }
        return height < 200 ? 200 : height
      },
    },
    beforeMount() {
      // this.getTableData()
      this.searchChange = debounce(this.searchChange, 500);//消抖
    },
    watch: {
      tableData: {
        immediate: true,
        handler(data) {
          if (data && data.length > 0) {
            this.initShowVal(data)
            this.typeInitShow = this.typeShow
            this.typeInitDataShow = this.typeDataShow
            this.confirmLoading = false
          }
        }
      }
    },
    methods: {
      // 初始化列表
      /*getTableData() {
        this.confirmLoading = true
        this.$util.initDict('DATA').then(data => {
          this.initShowVal(this.tableData = data)
          this.typeInitShow = this.typeShow
          this.typeInitDataShow = this.typeDataShow
        }).finally(() => {
          this.confirmLoading = false
        })
      },*/
      initShowVal(data) {
        let filterData = []
        let typeShow = []
        let typeDataShow = []
        for (let type of this.types) {
          filterData.push(data.filter(r => r.value.indexOf(type) > -1))
        }

        for (let i = 0, len = filterData.length; i < len; i++) {
          if (filterData[i].length > 0) {
            typeShow.push(this.types[i])
            typeDataShow.push(filterData[i])
          }
        }

        typeShow.unshift('全部')
        typeDataShow.unshift(data)

        this.typeShow = typeShow
        this.typeDataShow = typeDataShow
      },
      show() {
        this.visible = true
        this.isShowSelect = false
      },
      hide() {
        this.visible = false
        // this.searchReset()
      },

      selectOK(item) {
        this.$emit('selected', item.code)
        this.hide()
      },
      searchChange() {
        this.searchQuery()
      },
      searchQuery() {
        let filter = {}
        for (let field in this.queryParam) {
          let val = this.queryParam[field]
          if (val && val.trim().length > 0) {
            filter[field] = val.trim().toUpperCase()
          }
        }
        if (Object.keys(filter) === 0) {
          this.typeShow = this.typeInitShow
          this.typeDataShow = this.typeInitDataShow
        }
        let filterData = this.tableData.filter(r => {
          let isFit = true
          for (let field in filter) {
            if (r[field].toUpperCase().indexOf(filter[field]) === -1) {
              isFit = false
              break
            }
          }
          return isFit
        })
        this.initShowVal(filterData)
      },
      searchReset() {
        this.queryParam = {}
        this.typeShow = this.typeInitShow
        this.typeDataShow = this.typeInitDataShow
      }
    }
  }
</script>
<style lang="less" scoped>
  .col-item {
    font-size: 16px;
    line-height: 24px;
    margin: 8px 0;
    &,p{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    p:last-child{
      font-size: 14px;
      font-family: monospace;
    }
    &:hover {
      color: #007fe6;
      cursor: pointer;
    }

    .icon {
      display: none;
      margin-left: 10px;
      cursor: pointer;
    }

    &:hover .icon {
      display: inline-block;
      font-size: 18px;

    }


  }
</style>