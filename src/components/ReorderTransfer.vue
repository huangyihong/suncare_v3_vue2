<template>
    <div>
      <p>targetKeys:{{targetKeys}}</p>
      <p>selectedKeys:{{selectedKeys}}</p>
      <a-transfer
        :data-source="dataSource"
        :titles="['Source', 'Target']"
        :target-keys="targetKeys"
        :selected-keys="selectedKeys"
        @change="handleChange"
        @selectChange="handleSelectChange"
      >
        <template
          slot="children"
          slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },}">
          <template v-if="direction === 'left'" >
            <div v-for="item in filteredItems" :key="item.key" style="line-height: 30px">
              <label >
                <a-checkbox :value="item.key" class="m-r-10" @change="onSelectChange($event,itemSelect)"/>
                <span :title="item.title">{{item.title}}</span>
              </label>
            </div>
          </template>
          <template v-else>
            <div v-for="item in filteredItems" :key="item.key" style="line-height: 30px">
              <label>
                <a-checkbox :value="item.key" class="m-r-10" @change="onSelectChange($event,itemSelect)"/>
                <span :title="item.title">{{item.title}}</span>
              </label>
              <a-switch class="fr"
                un-checked-children="顺序"
                checked-children="倒序"
                :checked="checkKeys.indexOf(item.key) > -1"
                @change="val => handleOrder(val,item.key)"
              />
            </div>
          </template>
        </template>
      </a-transfer>
    </div>
</template>

<script>

  export default {
    name: 'Reorder',
    props:{
      columns: Array,
      isorter: Object
    },
    components: {},
    data() {
      return {
        targetKeys: [],
        selectedKeys: [],
        dataSource: [],
        checkKeys: []
      }
    },
    beforeMount(){
    },
    watch:{
      columns:{
        immediate: true,
        handler(array) {
          if (array) {
            this.dataSource = array.filter(item => item.dataIndex || item.key).map(item => {
              return {
                key: item.dataIndex || item.key,
                title: item.title,
                description: item.title,
                // disabled: bool
              }
            })

          }
        },
      },
      isorter:{
        immediate: true,
        handler(obj) {
          console.log('isorter',obj)
          if (obj) {
            let {column, order} = obj
            let cols = column.split(',')
            let orders = order.split(',')
            if(cols.length > orders.length){
              for(let i = 0, len = cols.length - orders.length; i < len; i++){
                orders.push('asc')
              }
            }
            let checkKeys = []
            let targetKeys = []
            for(let [index,col] of cols.entries()){
              if(orders[index] === 'desc'){
                checkKeys.push(col)
              }
              targetKeys.push(col)
            }
            this.checkKeys = checkKeys
            this.targetKeys = targetKeys
          }
        },
      }
    },
    methods: {
      onSelectChange(e,callback) {
        console.log(e,callback)
        let {checked, value} = e.target
        callback(value, checked)
      },
      handleOrder(isDesc, col){
        console.log('isDesc, col',isDesc, col)
        if(isDesc){
          this.checkKeys.push(col)
        } else {
          this.checkKeys.splice(this.checkKeys.indexOf(col),1)
        }
      },
      handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
        this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
      },
      handleChange(nextTargetKeys, direction, moveKeys) {
        this.targetKeys = nextTargetKeys;

        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
      },
      getSort(){
        let orders = []
        for(let col of this.targetKeys){
          orders.push(this.checkKeys.indexOf(col)>-1?'desc':'asc')
        }
        return {
          column: this.targetKeys.join(','),
          orders: orders.join(',')
        }

      }

    },
    computed: {}
  }
</script>
<style scoped>

</style>
