<template>
    <div>
      <a-input :value="`${filterDictText(tableData,value)}(${value})`" placeholder="请选择所属表" readOnly
      @click="readonly?()=>{}:$refs.modalRef.show()"></a-input>
      <table-select-modal ref="modalRef" :tableData="tableData" @selected="selected"></table-select-modal>
    </div>
</template>

<script>

  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'

  import tableSelectModal from '@/pages/probe/case/tableSelectModal'
  export default {
    name: 'tableSelectTag',
    components: {
      tableSelectModal
    },
    props: {
      value: String,
      loaded: Function,
      filter: Function,
      required: Boolean,
      readonly: Boolean,
    },
    data() {
      return {
        allData:[],
        tableData:[],
      }
    },
    beforeMount(){
      this.$util.initDict('DATA').then(data => {
        if(this.loaded){
          data = this.loaded(Array.from(data)) || data
        }
        let options = this.allData = data
        if(this.filter){
          options = options.filter(this.filter)
        }
        this.tableData = options
        console.log('this.required',this.required)
        console.log('options', options)
        if(this.required && options.length > 0 && !this.value){
          this.selected(options[0].code)
        }
        console.log('tableData', this.tableData)
      })
    },
    watch: {
      filter: {
        handler(val, oldVal) {
          if(val){
            this.tableData = this.allData.filter(val)
          } else if(oldVal){
            this.tableData = this.allData
          }
          if(this.required && this.tableData.length > 0 && !this.value){
            this.selected(this.tableData[0].code)
          }
          console.log('tableData', this.tableData)
        },
      },
    },
    methods: {
      filterDictText,
      selected(val){
        console.log('tableSelectTag', val)
        this.$emit('input',val)
        this.$emit('change',val)
      }
    },
  }
</script>
<style scoped>

</style>
