<template>
  <div class="user-wrapper" :class="theme">
  <!--  <span class="action">
      <a class="logout_title" target="_blank" href="http://jeecg-boot.mydoc.io">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span>-->
    <span class="action" title="刷新当前页" @click="reloadPage">
      <a-icon style="font-size: 16px; padding: 4px" type="reload" :spin="reloadSpin"/>
    </span>
    <!--<header-notice class="action">
      <a-icon style="font-size: 16px; padding: 4px" type="bell"/>
    </header-notice>-->

    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="avatar" icon="user"/>
        <template v-if="systemCode=='insight'">
          <span v-if="isDesktop()"  >{{ nickname }} </span>
        </template>
        <template v-else>
          <span v-if="isDesktop()" @click='changeProjectSource'>{{ nickname }}，{{dataSourceName}}【切换】</span>
        </template>
      </span>

      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!--<a-menu-item key="0">-->
          <!--<router-link :to="{ name: 'account-center' }">-->
            <!--<a-icon type="user"/>-->
            <!--<span>个人中心</span>-->
          <!--</router-link>-->
        <!--</a-menu-item>-->
        <a-menu-item key="0" @click="changeProjectSource" v-if="systemCode!='insight'">
          <a-icon type="swap"/>
          <span>切换项目地</span>
        </a-menu-item>
        <a-menu-item key="9" @click="clearCacheDataSource" v-has="'ybChargeTask:clearCacheDataSource'">
          <a-icon type="sync"/>
          <span>清项目地缓存</span>
        </a-menu-item>
        <!--
        <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        -->
        <!--<a-menu-item key="3"  @click="systemSetting">
           <a-icon type="tool"/>
           <span>系统设置</span>
        </a-menu-item>-->
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting"/>
          <span>密码修改</span>
        </a-menu-item>
        <!--<a-menu-item key="5" @click="updateCurrentDepart">
          <a-icon type="cluster"/>
          <span>切换部门</span>
        </a-menu-item>-->
        <a-menu-item key="6" @click="handleLogout">
          <a-icon type="logout"/>
          <span>退出登录</span>
        </a-menu-item>
       <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>

   <!-- <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout"/>
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>-->
    <ChangeProjectSource  ref="changeProjectSource" @freshtab="freshtab"></ChangeProjectSource>
    <user-password ref="userPassword"></user-password>
    <depart-select ref="departSelect" :closable="true" title="部门切换"></depart-select>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer>
  </div>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import ChangeProjectSource from './ChangeProjectSource'
  import UserPassword from './UserPassword'
  import SettingDrawer from "@/components/setting/SettingDrawer";
  import DepartSelect from './DepartSelect'
  import { mapActions, mapGetters } from 'vuex'
  import { mixinDevice } from '@/utils/mixin.js'
  import { getAction } from '@/api/manage'

  export default {
    name: "UserMenu",
    mixins: [mixinDevice],
    components: {
      ChangeProjectSource,
      HeaderNotice,
      UserPassword,
      DepartSelect,
      SettingDrawer
    },
    props: {
      theme: {
        type: String,
        required: false,
        default: 'dark'
      }
    },
    data() {
      return {
        dataSourceName: '',
        reloadSpin: false,
        systemCode:this.$config.systemCode
      }
    },
    beforeMount() {
      this.$util.initDict('SOLR_DATA_SOURCE').then(data => {
        this.dataSourceName = data.find(r => r.code ===this.userInfo.dataSource).value
      })
    },
    computed: {
      ...mapGetters(["nickname", "avatar","userInfo"]),
    },
    methods: {
      ...mapActions(["Logout"]),
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
                window.location.href= that.$config.routerBase;
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      updatePassword(){
        let username = this.userInfo.username
        this.$refs.userPassword.show(username)
      },
      updateCurrentDepart(){
        this.$refs.departSelect.show()
      },
      systemSetting(){
        this.$refs.settingDrawer.showDrawer()
      },
      reloadPage(){
        this.$bus.$emit('reloadPage')
        this.reloadSpin = true
        setTimeout(()=> {
          this.reloadSpin = false
        }, 1000)
      },
      changeProjectSource(){
        this.$refs.changeProjectSource.show()
      },
      freshtab(){
        this.$emit("freshtab")
      },
      //清项目地缓存
      clearCacheDataSource(){
        getAction(this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/clearCacheDatasourceAndDatabase", {}).then((res) => {
          if (res.success) {
            this.$message.success("当前项目地数据源配置缓存清理成功!");
          }else{
            this.$message.warning(res.message);
          }
        })
      }

    }
  }
</script>

<style scoped>
  .logout_title {
    color: inherit;
    text-decoration: none;
  }
</style>
