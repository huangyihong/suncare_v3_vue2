<template>
  <a-checkbox-group v-if="tagType=='checkbox'" @change="onChange" :value="arrayValue" :disabled="disabled">
    <a-checkbox v-for="(item, key) in dictOptions" :key="key" :value="item.code">{{ item.value || item.label }}</a-checkbox>
  </a-checkbox-group>

  <a-select
    v-else-if="tagType=='select'"
    :value="arrayValue"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    :disabled="disabled"
    mode="multiple"
    :placeholder="placeholder"
    :maxTagCount="maxTag"
    allowClear
    :loading="dictLoading"
    :filterOption="filterOption"
    v-bind="$attrs">
    <a-select-option
      v-for="(item,key) in dictOptionShows"
      :key="key" :value="item.code" :title="item.name ">
      {{ item.name }}
    </a-select-option>
  </a-select>

</template>

<script>
  import {querySysDictByType, querySysDictByTypes} from '@/api-sv3/api'
  export default {
    name: 'JMultiSelectTag',
    props: {
      dictCode: String,
      placeholder: {
        type: String,
        default: '请选择(多选)'
      },
      disabled: Boolean,
      value: String,
      type: String,
      options:Array,
      separator: {
        type: String,
        default: ','
      },
      valueEqName: {
        type: Boolean,
        default: false
      },
      showKey: Boolean,
      filter: Function,
      loaded: Function,
      maxTag: Number
    },
    data() {
      return {
        dictOptions: [],
        tagType:"",
        arrayValue:!this.value?[]:this.value.split(this.separator),
        dictLoading: false
      }
    },
    computed:{
      dictOptionShows(){
        return this.filter ? this.dictOptions.filter(this.filter) : this.dictOptions
      }
    },
    beforeMount() {
      if(!this.type || this.type==="list_multi"){
        this.tagType = "select"
      }else{
        this.tagType = this.type
      }
    },
    watch:{
      value (val) {
        if(!val){
          this.arrayValue = []
        }else{
          this.arrayValue = val.split(this.separator)
        }
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
          if(val && val.length > 0)
            this.constructData(val)
        },
      }
    },
    methods: {
      initDictData() {
        if(!this.dictCode){
          return
        }
        //根据字典Code, 初始化字典数组
        this.loading = true
        this.$util.initDict(this.dictCode).then(data => {
          if(this.loaded){
            data = this.loaded(Array.from(data)) || data
          }
          this.constructData(data)

        }).finally(()=>{
          this.loading = false
        })

      },
      constructData(data){
        console.log('constructData',data)
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
      onChange (selectedValue) {
        // 返回数组
        this.$emit('change', selectedValue.join(this.separator));
      },
      onBlur(){
        this.$emit('blur', this.arrayValue);
      },
      onFocus(){
        this.$emit('focus');
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
