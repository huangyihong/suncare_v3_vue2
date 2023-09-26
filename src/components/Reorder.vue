<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="可选项" size="small">
          <!--<a slot="extra" href="#">more</a>-->
          <a-empty v-show="dataSource.length === 0"></a-empty>
         <!-- <div v-for="item in dataSource" :key="item.dataIndex" style="line-height: 30px">
            <label class="pointer">
              <a-checkbox :value="item.dataIndex" class="m-r-10" v-model="item.check"
                          @change="onSelectChange($event,item)"/>
              <span :title="item.title">{{item.title}}</span>
            </label>
          </div>-->
          <a-radio-group v-model="checkKeys" @change="onSelectSingleChange" v-if="single" class="block">
            <a-radio :value="item.dataIndex"  class="reorder-item"
                     v-for="item in dataSource" :key="item.dataIndex">{{item.title}}</a-radio>
          </a-radio-group>
          <a-checkbox-group v-model="checkKeys" v-else>
              <a-checkbox :value="item.dataIndex" class="m-r-10 reorder-item"
                          v-for="item in dataSource" :key="item.dataIndex" @change="onSelectChange">{{item.title}}</a-checkbox>
          </a-checkbox-group>


        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="已选项" size="small">
          <div slot="extra" class="t-grey-aaa" style="font-size: 12px;">拖动行可排序</div>
          <a-empty v-show="targetSource.length === 0"></a-empty>
          <draggable :options="{animation: 300}" v-model="targetSource">
            <div v-for="item in targetSource" :key="item.dataIndex" style="line-height: 30px">
              <label>
                <!--<a-checkbox :value="item.key" class="m-r-10" @change="onSelectChange($event)"/>-->
                <span :title="item.title">{{item.title}}</span>
              </label>
              <a-switch class="fr"
                        un-checked-children="顺序"
                        checked-children="倒序"
                        v-model="item.check"
              />
            </div>
          </draggable>
        </a-card>
      </a-col>
    </a-row>


  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'Reorder',
    props: {
      columns: Array,
      isorter: Object,
      tolowercase: Boolean,
      single: Boolean
    },
    components: {
      draggable
    },
    data() {
      return {
        dataSource: [],
        targetSource: [],
        checkKeys: []
      }
    },
    beforeMount() {
    },
    watch: {
      isorter: {
        immediate: true,
        handler(obj) {
          if (obj) {
            let { column, order } = obj
            // dataIndex不存在 或为action 或isSorter:false 不排序
            let dataSource = this.columns.filter(item => item.dataIndex && item.dataIndex !== 'action' && item.isSorter !== false)
              .map(item => {
                  let dataItem = { ...item }
                  if (dataItem.dataIndex.endsWith('_dictText')) {
                    dataItem.dataIndex = dataItem.dataIndex.substring(0, dataItem.dataIndex.length - 9)
                  }
                  return dataItem
                }
              )

            let cols = column.split(',')
            let orders = order.split(',')
            if (cols.length > orders.length) {
              for (let i = 0, len = cols.length - orders.length; i < len; i++) {
                orders.push('asc')
              }
            }
            let targetSource = []
            let checkKeys = []
            if(this.tolowercase){
              cols = cols.map(r => this.toLine(r))
            }
            for (let [index, col] of cols.entries()) {
              let record = dataSource.find(item => item.dataIndex === col)
              console.log(cols,record)
              if (record) {
                checkKeys.push(record.dataIndex)
                targetSource.push({
                  ...record,
                  check: orders[index] === 'desc'
                })
              }
            }
            this.targetSource = targetSource
            this.dataSource = dataSource
            this.checkKeys = checkKeys
            if(this.single && this.checkKeys.length > 0){
              this.checkKeys = this.checkKeys[0]
              this.targetSource = [this.targetSource[0]]
            }
            console.log('targetSource', targetSource)
            console.log('checkKeys', checkKeys)
          }
        },
      }
    },
    methods: {
      onSelectChange(e) {
        let { checked, value } = e.target
        if (checked) {
          this.targetSource.push({ ...this.dataSource.find(r => r.dataIndex === value), check: false })
        } else {
          let index = this.targetSource.findIndex(item => item.dataIndex === value)
          this.targetSource.splice(index, 1)
        }
      },
      onSelectSingleChange(e) {
        let { value } = e.target
        this.targetSource.splice(0,1, { ...this.dataSource.find(r => r.dataIndex === value), check: false })
      },
      getSort() {
        let orders = []
        let cols = []
        if(this.tolowercase){
          for (let col of this.targetSource) {
            cols.push(this.toHump(col.dataIndex))
            orders.push(col.check ? 'desc' : 'asc')
          }
        } else {
          for (let col of this.targetSource) {
            cols.push(col.dataIndex)
            orders.push(col.check ? 'desc' : 'asc')
          }
        }

        return {
          column: cols.join(','),
          order: orders.join(',')
        }

      },
      toHump(col) {
        let array = col.split('_')
        for (let i = 1; i < array.length; i++) {
          let item = array[i].trim()
          if (item.length === 0)
            continue
          array[i] = item.charAt(0) + item.substring(1, item.length).toLowerCase()
        }
        array[0] = array[0].toLowerCase()
        return array.join('')
      },
      // 驼峰转换下划线
      toLine(name) {
        return name.replace(/([A-Z])/g,"_$1").toUpperCase();
      }
    },
    computed: {}
  }
</script>
<style scoped>
  .reorder-item{
    display: block;line-height: 30px;margin-left: 0;
  }
</style>
