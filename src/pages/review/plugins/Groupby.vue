<template>
  <a-spin :spinning="confirmLoading">

  <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="可选项" size="small">
          <!--<a slot="extra" href="#">more</a>-->
          <a-input-search placeholder="搜索" slot="extra" size="small" style="width: 150px" @input="searchInput" />
          <div  style=";overflow-y: auto" :style="{height: height - 225 + 'px'}">
            <a-empty v-show="dataSourceShow.length === 0"></a-empty>
            <a-checkbox-group v-model="checkKeys">
              <a-checkbox :value="item.code" class="m-r-10 reorder-item"
                          v-for="item in dataSource" :key="item.code" @change="onSelectChange">{{item.value}}</a-checkbox>
            </a-checkbox-group>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="已选项" size="small">
          <div slot="extra" class="t-grey-aaa" style="font-size: 12px;">拖动行可排序</div>
          <div  style=";overflow-y: auto" :style="{height: height - 225 + 'px'}">
          <a-empty v-show="targetSource.length === 0"></a-empty>
          <draggable :options="{animation: 300}" v-model="targetSource">
            <div v-for="(item,index) in targetSource" :key="item.code" style="line-height: 30px">
              <label>
                <!--<a-checkbox :value="item.key" class="m-r-10" @change="onSelectChange($event)"/>-->
                <span :title="item.value">{{item.value}}</span>
              </label>
              <a class="fr" @click="rmTarget(index)">移除</a>
            </div>
          </draggable>
          </div>
        </a-card>
      </a-col>
    </a-row>


  </a-spin>
</template>

<script>
  import draggable from 'vuedraggable'
  import debounce from 'lodash/debounce';

  export default {
    name: 'Reorder',
    props: {
    },
    components: {
      draggable
    },
    data() {
      return {
        confirmLoading: false,
        dataSource: [],
        dataSourceShow: [],
        targetSource: [],
        checkKeys: []
      }
    },
    beforeMount() {
      this.confirmLoading = true
      this.$util.initDict('UNREASONABLE_GROUPBY').then(data => {
        this.targetSource = []
        this.dataSourceShow = this.dataSource = data
      }).finally(()=>{
        this.confirmLoading = false
      })
      this.searchInput = debounce(this.searchInput, 300);//消抖
    },
    watch: {
    },
    methods: {
      searchInput(e){
        let val = e.target.value
        console.log('searchInput', val)
        if(val && (val = val.trim()).length >0){
          this.dataSourceShow = this.dataSource.filter(r => r.value.indexOf(val) > -1)
        } else {
          this.dataSourceShow = this.dataSource
        }
      },
      onSelectChange(e) {
        let { checked, value } = e.target
        if (checked) {
          this.targetSource.push({ ...this.dataSource.find(r => r.code === value), check: false })
        } else {
          let index = this.targetSource.findIndex(item => item.code === value)
          this.targetSource.splice(index, 1)
        }
      },
      rmTarget(index){
        let {code} = this.targetSource.splice(index,1)[0]
        this.checkKeys.splice(this.checkKeys.indexOf(code), 1)

      },
      getData(){
        return [...this.targetSource]
      },
      clear(){
        this.targetSource = []
        this.checkKeys = []
      }
    },
    computed: {
      height(){
        return this.$store.getters.height
      }
    }
  }
</script>
<style scoped>
  .reorder-item{
    display: block;line-height: 30px
  }
</style>
