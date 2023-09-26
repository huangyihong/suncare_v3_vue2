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

    <a-card  :loading="loading" :bordered="false" :style="{ marginTop: '24px' }" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="使用情况统计" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :xs="12">
                <bar title="周使用排行" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :xs="12">
                <rank-list title="项目地使用排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>

        </a-tabs>
      </div>
    </a-card>


  </div>

</template>

<script>
import {mapState} from "vuex";
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import { getAction } from '@/api/manage'
export default {
  components: {
    RankList,
    Bar
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
            if(!children.hidden&&children.route){
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
          }
        }else {
          if(item.name !='home'&&item.route){
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