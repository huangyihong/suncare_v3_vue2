<template>
  <div>
    <a-card hoverable style="border: none">
      <module0 :param="param"></module0>
    </a-card>
    <a-layout class="m-t-10">
      <a-layout-sider style="background-color: white">
        <div class="t-r m-t-20 m-b-20 m-r-6">
          <a-radio-group v-model="grid" button-style="solid">
            <a-radio-button :value="24">
              <a-icon type="database"/>
            </a-radio-button>
            <a-radio-button :value="12">
              <a-icon type="appstore"/>
            </a-radio-button>
          </a-radio-group>
        </div>
        <a-affix :offset-top="20" :target="getContainer">
          <a-anchor :affix="true" showInkInFixed style="margin: 10px"
                    :getContainer="getContainer"
                    @click.prevent="()=>{}">
            <template v-for="(item, index) of modules">
              <a-anchor-link :href="'#module' + index + anchorSuffix" :title="item.title"/>
              <!--<div @click.self="() => module = modules[index]">{{item.title}}</div>-->
            </template>
          </a-anchor>
        </a-affix>
      </a-layout-sider>
      <a-layout-content :id="'content' + anchorSuffix" style="background: #f0f2f5" class="module-content">
        <a-row>
          <draggable :options="{animation: 300}" v-model="modules" handle=".move-item">
            <template v-for="(item, index) of modules">
              <a-col :span="grid" :id="'module' + index + anchorSuffix" :key="item.key">

                <a-card class="module-card" :bodyStyle="{paddingBottom: '10px'}">
                  <div slot="title">
                    {{item.title}}
                    <span v-if="item.tip" class="m-l-10 t-grey-999" style="font-size: 14px">
                    提示：{{item.tip}}
                    <!--<a-tooltip :title="item.tip" class="t-grey-999">
                      <a-icon type="info-circle-o"/>
                    </a-tooltip>-->
                    </span>
                    <span class="fr">
                      <a-icon type="reload"  class="t-grey-999 m-r-20" title="刷新"
                              @click="()=> {item.key += 1; modules = [...modules]}"/>
                      <a-icon type="drag" class="move-item t-grey-999" style="cursor: grab"
                            title="拖动"/>
                    </span>

                  </div>

                  <component :is="item.component" :param="param" style="overflow: hidden"></component>
                </a-card>
              </a-col>
            </template>
          </draggable>
        </a-row>
        <!--  <template v-for="(component, index2) of module.components">
            <a-card hoverable class="module-card" :style="index2 === 0? 'margin-top: 0': ''">
              <template slot="title">
                {{component.title}}
                <a-tooltip :title="component.tip" class="m-l-10 t-grey-999" v-if="component.tip">
                  <a-icon type="info-circle-o"/>
                </a-tooltip>
              </template>

              <component :is="component.component" :param="param"></component>
            </a-card>
          </template>-->

      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
  import Module0 from '@/pages/review/statistic/Module0'
  import Module1 from '@/pages/review/statistic/Module1'
  import Module2 from '@/pages/review/statistic/Module2'
  import Module2a from '@/pages/review/statistic/Module2a'
  import Module3 from '@/pages/review/statistic/Module3'
  import Module3a from '@/pages/review/statistic/Module3a'
  import Module4 from '@/pages/review/statistic/Module4'
  import Module5 from '@/pages/review/statistic/Module5'
  import Module6 from '@/pages/review/statistic/Module6'
  import Module7 from '@/pages/review/statistic/Module7'
  import draggable from 'vuedraggable'

  export default {
    name: 'reviewStatisticView',
    components: {
      Module0,
      Module1,
      Module2,
      Module2a,
      Module3,
      Module3a,
      Module4,
      Module5,
      Module6,
      Module7,
      draggable
    },
    inject: ['getContainer'],
    data() {
      this.anchorSuffix = new Date().getTime()

      return {
        param: {},
        modules: [
          {
            title: '初审 - 规则级别统计',
            component: 'Module7',
            key: 'Module7',
          },
          {
            title: '初审实时 - 未判定统计',
            component: 'Module1',
            key: 'Module1',
          },
          {
            title: '初审实时 - 全量统计',
            component: 'Module2',
            key: 'Module2',
            tip: '审核过程就诊ID未去重，因此数据会有部分误差'
          },
          {
            title: '初审实时 - 不合规行为',
            component: 'Module2a',
            key: 'Module2a',
          },
          {
            title: '初审实时 - 医疗机构',
            component: 'Module6',
            key: 'Module6',
          },
          {
            title: '复审实时 - 全量统计',
            component: 'Module3',
            key: 'Module3',
            tip: '审核过程就诊ID未去重，因此数据会有部分误差'
          },
          {
            title: '复审实时 - 不合规行为',
            component: 'Module3a',
            key: 'Module3a',
          },
          {
            title: '白名单归因统计',
            component: 'Module4',
            key: 'Module4',
          },
          {
            title: '初审/复审比较统计',
            component: 'Module5',
            key: 'Module5',
            tip: '已初审和已复审的对比'
          }
        ],
        // module: this.modules[0],
        grid: 24
      }
    },
    beforeMount() {
      let { projectIds, batchIds } = this.$route.query
      this.param = { projectIds, batchIds, step: 1 }
    },
    methods: {
      modalBody() {
        return document.getElementById('content' + this.anchorSuffix)
      }
    },
    computed: {}
  }
</script>
<style lang="less" scoped>
  .module-content {
    .module-card {
      margin: 0 0 10px 10px;
    }

  }

</style>
