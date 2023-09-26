<template>
  <a-radio-group v-if="tagType==='radio'" @change="handleInput" :value="value" :disabled="disabled">
    <a-radio v-for="(item, index) in dictOptionShows" :key="index" :value="item.code" :class="{'block':vertical}">{{ item.name }}</a-radio>
  </a-radio-group>
  <a-select v-else-if="tagType==='select'" :placeholder="placeholder" :disabled="disabled" :value="value"
            @change="handleInput" :loading="confirmLoading || loading" :dropdownMatchSelectWidth="dropdownMatchSelectWidth" :allowClear="!required"
            v-bind="search?{showSearch:true,filterOption,...$attrs}:$attrs">
    <a-select-option value="" v-if="showFirstAll">全部</a-select-option>
    <a-select-option v-for="(item, index) in dictOptionShows" :key="index" :value="item.code" :title="item.name ">
        {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script>
  import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'

  export default {
    name: "MDictSelectTag",
    props: {
      dictCode: String,
      options: Array,
      placeholder: {
        type: String,
        default: '请选择'
      },
      // triggerChange: Boolean,
      disabled: Boolean,
      value: String,
      type: String,
      vertical: Boolean, // 垂直显示，radio
      valueEqName: {
        type: Boolean,
        default: false
      },
      showKey: Boolean,
      // 是否初始值必选，去除空白，默认选第一项
      required: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      dropdownMatchSelectWidth: {
        type: Boolean,
        default: false
      },
      loading: Boolean,
      filter: Function,
      loaded: Function,
      //是否显示全部选项
      showFirstAll: {
        type: Boolean,
        default: false
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        dictOptions: [],
        tagType: "",
        confirmLoading: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val, oldVal) {
          //console.log('MDictSelectTag',val, oldVal)
        },
      },
      dictCode: {
        immediate: true,
        handler(val) {
          if(val && val.length > 0)
            this.initDictData()
        },
      },
      options: {
        immediate: true,
        handler(val) {
          if(val)
            this.constructData(val)
        },
      },
      type: {
        immediate: true,
        handler(val) {
          if (!val || val === "list") {
            this.tagType = "select"
          } else {
            this.tagType = val
          }
        },
      }
    },
    mounted() {

    },
    computed:{
      dictOptionShows(){
        let options = this.filter?this.dictOptions.filter(this.filter):this.dictOptions
        if(this.required && (this.value === null || this.value === undefined || this.value === '')  && options.length > 0){
          this.handleInput(this.tagType === "radio"?{target:{value:options[0].code}}:options[0].code)
        }
        return options
      }
    },
    methods: {
      initDictData() {
        //根据字典Code, 初始化字典数组
        this.confirmLoading = true
        this.$util.initDict(this.dictCode).then(data => {
          if(this.loaded){
            data = this.loaded(Array.from(data)) || data
          }
          this.constructData(data)

        }).finally(()=>{
          this.confirmLoading = false
        })

      },
      constructData(data){
        if (this.valueEqName) {
          this.dictOptions = data.map(item => {
            return {
              code: item.value,
              value: item.value,
              name: item.value
            }
          })
        } else if (this.showKey) {
          this.dictOptions = data.map(item => {
            return { ...item, ...{ name: `${item.value}(${item.code})` } }
          })
        } else {
          this.dictOptions = data.map(item => {
            return { ...item, ...{ name: item.value } }
          })
        }
      },
      handleInput(e) {
        let val;
        if (this.tagType === "radio") {
          val = e.target.value
        } else {
          val = e
        }
        this.$emit('change', val);
        this.$emit('select', val?this.dictOptions.find(r => r.code === val):{})
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
    }
  }
</script>

<style scoped>
</style>
