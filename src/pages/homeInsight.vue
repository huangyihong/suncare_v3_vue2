<template>
  <div class="page-header-index-wide">
    <a-card title="快捷菜单" :bordered="false"
             >
      <div>
        <template v-for="(item,index) in quickMenuData">
          <router-link :to="{ name:item.name, href:item.href, target:item.target}">
            <div class="modular-list" style="margin: 4px;padding:8px 20px;display: inline-block;">
              <a-icon :type="item.icon?item.icon:'file-text'" class="icon0"
                      :style="{backgroundColor: primaryColor}"></a-icon>
              <div class="modular-title">{{item.title}}</div>
            </div>
          </router-link>
        </template>
      </div>
    </a-card>

    <a-row :gutter="24" :style="{ marginTop: '18px' }">
      <a-col :xs="12" :xl="8">
        <a-card :bordered="false">
          <a-tabs >
            <a-tab-pane key="1" tab="检查任务管理">
              <project-info-list></project-info-list>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>


  </div>

</template>

<script>
import {mapState} from "vuex";
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import { getAction } from '@/api/manage'
import projectInfoList from '@/pages/ybFj/plugin/projectInfoList'
export default {
  components: {
    RankList,
    Bar,
    projectInfoList
  },
  data() {
    return {
      quickMenuData: [],
      rankList:[],
      barData:[],
      loading: false,
      url: {
        getIndexUseCountList: '/ybChargeSearch/ybChargeSearchTask/getIndexUseCountList'
      },
    }
  },
  beforeMount() {
    this.loadQuickMenuData()
  },
  computed: {
    ...mapState({
      // 后台菜单
      permissionMenuList: state => state.user.permissionList
    })
  },
  created() {
    getAction(this.url.getIndexUseCountList).then(res => {
      this.barData=res.result.barData
      this.rankList=res.result.rankList
      console.log("getIndexUseCountList",res.result)
    })
  },
  methods: {
    loadQuickMenuData() {
      let list = this.permissionMenuList
      for (let item of list) {
        if (item.children && item.children.length > 0) {
          if (item.hidden) {
            continue
          }
          for (let children of item.children) {
            let obj = {
              key: children.id,
              title: children.meta.title,
              icon: children.meta.icon,
              name: children.name,
              href: children.path,
              target: children.meta.target
            }
            this.quickMenuData.push(obj)
          }

        }else {
          if(item.name !='home'){
            let obj = {
              key: item.id,
              title: item.meta.title,
              icon: item.meta.icon,
              name: item.name,
              href: item.path,
              target: item.meta.target
            }
            this.quickMenuData.push(obj)
          }

        }
      }
      console.log("quickMenuData==", this.quickMenuData)
    },
  }
}
</script>
<style lang="less" scoped>
.icon0{
  width: 78px;
  height: 78px;
  border-radius: 50%;
  text-align: center;
  line-height: 84px;
  font-size: 50px;
}
</style>