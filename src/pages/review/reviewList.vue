<template>
    <div>
        <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" class="m-b-6">
            <breadcrumb :parent="{path:'/task/taskProjectList'}" style="margin-bottom: 4px">
                <a-popconfirm placement="bottomRight" slot="right" v-if="onStep"
                              title="确定完成推送?" @confirm="() => passTo3rdStep(batchId)">
                    <a-button type="primary" :loading="tabStatusLoading">
                        完成推送
                    </a-button>
                </a-popconfirm>
            </breadcrumb>
            <a-row :gutter="8" style="font-size: 15px;">
                <a-col :xs="8">
                    <span style="font-weight: bold">项目名称</span>：{{project.projectName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">任务批次</span>：{{projectBatch.batchName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">风控月份</span>：{{projectBatch.month}}
                    <a style="float: right" @click="$refs.modalForm.edit(projectBatch)">批次详情</a>
                </a-col>
            </a-row>
        </a-card>
        <keep-alive>
            <component ref="tabpage" :is="tabCurrent.component" :key="tabCurrent.type"
                       :batchId="batchId" :onStep="onStep" v-bind="tabCurrent.params||{}">
                <template slot="tabs">
                    <a-tabs v-model="tabIndex" @change="tabChange" :animated="false">
                        <template v-for="(tab,index) in tabs">
                            <a-tab-pane :key="tab.type">
                  <span slot="tab">
                    {{tab.title}}
                  </span>
                            </a-tab-pane>
                        </template>
                    </a-tabs>
                </template>
            </component>
        </keep-alive>
        <task-project-batch-modal ref="modalForm"></task-project-batch-modal>
    </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import reviewPushList from '@/pages/review/reviewPushList'
  import { reviewMixin } from './mixin'

  export default {
    name: 'reviewSystemList',
    mixins: [reviewMixin],
    components: {
      Breadcrumb,
      reviewPushList
    },
    data() {
      let tabs = [
        { title: "未推送", type: '01', component: 'reviewPushList', params: { secPushStatus: '!1' } },
        { title: "已推送", type: '02', component: 'reviewPushList', params: { secPushStatus: '1' } },
      ]
      return {
        tabIndex: '01',
        tabs,
        tabCurrent: tabs[0],
        tabStatusLoading: false,
        step: 1,
        // 已经加载过的tab页
        compLoadedSet: new Set()
      }
    },
    beforeMount() {
      this.compLoadedSet.add(this.tabCurrent.type)
    },
    methods: {
      tabChange(key) {
        this.tabIndex = key
        this.tabCurrent = this.tabs.find(item => item.type === key)
        if (this.compLoadedSet.has(key)) {
          this.$nextTick(() => {
            this.$refs.tabpage.loadData()
          });
        } else {
          this.compLoadedSet.add(key)
        }

      },
    },
  }
</script>
<style scoped>

</style>
