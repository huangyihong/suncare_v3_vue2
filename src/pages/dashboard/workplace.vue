<template>
  <a-row :gutter="10">
    <a-col :span="12">
      <a-card :bordered="false" title="菜单列表" class="card-padding0">
        <a-dropdown placement="bottomCenter" slot="extra">
          <a-menu slot="overlay">
            <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-tree
          checkable
          @check="checkNodeAction"
          :treeData="treeData"
          :checkedKeys="checkedKeys"
          :expandedKeys="iExpandedKeys"
          :showIcon="true"
          @expand="onExpand">
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}
          </span>
        </a-tree>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card :bordered="false" title="快捷区域列表" :loading="confirmLoading">
        <a href="#" slot="extra">
          <a-popover title="提示" trigger="hover" placement="bottomRight" >
          <a slot="content">
            1. 拖动菜单排序<br>
            2. 拖动到区域外可移除
          </a>
          <a><a-icon type="exclamation-circle" /></a>
          </a-popover>
        </a>
        <a-row :gutter="8" ref="dragRef">
        <draggable :options="{animation: 300}" v-model="dataSource" @end="dragEnd">
            <template v-for="(data,index) in dataSource">
              <a-col :xxl="4" :lg="6" :xs="8" :key="index">
                <div class="modular-list" >
                  <jsx-temp :key="data.key" :jsx="data.icon" class="modular-icon" :style="{backgroundColor: primaryColor}"></jsx-temp>
                  <!--<a-icon :type="data.icon?data.icon:'file-text'" class="modular-icon" :style="{backgroundColor: primaryColor}"></a-icon>-->
                  <div class="modular-title">{{data.title}}</div>
                </div>
              </a-col>

            </template>
        </draggable>
        </a-row>
      </a-card>
      <div class="drawer-bootom-button">

        <a-button @click="save" type="primary" :loading="saveLoading">保存</a-button>
        <a-button @click="reset" style="margin-left: 8px">还原</a-button>
        <a-button @click="clear" style="margin-left: 8px">清空</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script>
  import draggable from 'vuedraggable'
  import { mapState } from 'vuex'
  import { mixin } from '@/utils/mixin.js'

  import { getUserQuickMenu, saveUserMenu } from '@/api-sv3/api-dashboard'
  const jsxTemp = {
    props: ["jsx"],
    render() {
      return (
        this.jsx
      );
    }
  };
  export default {
    name: 'workplace',
    components: { draggable,jsxTemp },
    mixins: [mixin],
    data() {
      return {
        description: '图片拖拽排序',
        confirmLoading: false,
        saveLoading: false,
        //数据集
        dataSource: [],
        oldDateSource: [],
        newDateSource: [],
        treeData: [],
        allTreeKeys:[],
        checkedKeys: [],
        iExpandedKeys:[],
        keyNodeObj: {}

      }
    },
    beforeMount: function() {
      // let routes = this.$router.option.routes
      let {nodes, keys} = this.getTreeList(this.permissionMenuList)
      this.treeData = nodes
      this.allTreeKeys = keys
      this.expandAll()
      this.loadData()
    },
    mounted: function() {
    },
    methods: {
      loadData(){
        this.confirmLoading = true
        getUserQuickMenu().then(res => {
          if (res.success) {
            let keys = res.result.map( item => item.menuId)
            let keyNodeObj = this.keyNodeObj
            this.checkedKeys = keys
            this.dataSource = keys.map(key => keyNodeObj[key]).filter(item => item)
            this.oldDateSource = [...this.dataSource];
          } else {
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      getTreeList(list) {
        let nodes = []
        let keys = []
        for (let item of list) {
          if (item.hidden) {
            continue
          }
          let obj = { key: item.id, title: item.meta.title, icon: <a-icon type={item.meta.icon || 'file-text'}/> }
          keys.push(obj.key)
          nodes.push(obj)
          this.keyNodeObj[obj.key] = obj
          if (item.children && item.children.length > 0) {
            let {nodes, keys} = this.getTreeList(item.children)
            obj.children = nodes
            keys.push(...keys)
          }
        }
        return {nodes,keys}
      },
      checkNodeAction(keys, e) {
        let data = e.node.dataRef
        if (e.checked) {
          this.pushToData(data)
        } else {
          this.removeFromData(data)
        }
      },
      checkNode(nodes, checked) {
        if (checked) {
          this.pushToData({children: nodes})
        } else {
          this.removeFromData({children: nodes})
        }
      },
      pushToData(data) {
        if (data.children) {
          for (let item of data.children) {
            this.pushToData(item)
          }
        } else {
          if (!this.dataSource.some(item => item.key === data.key)) {
            this.dataSource.push(data)
            this.checkedKeys.push(data.key)
          }

        }
      },
      removeFromData(data) {
        if (data.children) {
          for (let item of data.children) {
            this.removeFromData(item)
          }
        } else {
          let index = this.dataSource.findIndex(item => item.key === data.key)
          if (index >= 0) {
            this.dataSource.splice(index, 1)
            this.checkedKeys.splice(this.checkedKeys.indexOf(data.key), 1)
          }
        }
      },
      dragEnd(e){
        let {clientX: x,clientY: y} = e.originalEvent
        let {top,left, right, bottom} = this.$refs.dragRef.$el.getBoundingClientRect()
        if(x < left || x > right || y < top || y > bottom){
          let item = this.dataSource.splice(e.newIndex, 1)[0]
          this.checkedKeys.splice(this.checkedKeys.indexOf(item.key),1)
        }
      },
      save() {
        let ids = Array.from(this.dataSource, item => item.key).join(",")
        this.saveLoading = true
        saveUserMenu({ids: ids}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.oldDateSource = [...this.dataSource]
          } else {
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.saveLoading = false
        })
      },
      reset(){
        this.dataSource = [...this.oldDateSource]
        this.syncTree()
      },
      clear(){
        this.dataSource = []
        this.syncTree()
      },
      syncTree(){
        this.checkedKeys = Array.from(this.dataSource, item => item.key)
      },
      expandAll () {
        this.iExpandedKeys = this.allTreeKeys
      },
      closeAll () {
        this.iExpandedKeys = []
      },
      checkALL () {
        this.checkNode(this.treeData, true)
      },
      cancelCheckALL () {
        //this.checkedKeys = this.defaultCheckedKeys
        this.checkedKeys = []
        this.dataSource = []
      },
      onExpand(expandedKeys) {
        this.iExpandedKeys = expandedKeys
      },
    },
    computed: {
      ...mapState({
        // 后台菜单
        permissionMenuList: state => state.user.permissionList
      })
    }
  }
</script>
<style scoped>
  .drawer-bootom-button {
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    background: #fff;
    border-radius: 0 0 2px 2px;
    text-align: right;
  }
</style>
