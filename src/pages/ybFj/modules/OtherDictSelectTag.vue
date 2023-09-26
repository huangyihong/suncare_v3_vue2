<template>
    <a-radio-group v-if="tagType=='radio'" @change="handleInput" :value="value" :disabled="disabled">
        <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.code">{{item.value}}</a-radio>
    </a-radio-group>

    <a-select v-else-if="tagType=='select'"
              show-search
              :mode="mode"
              :filter-option="filterOption"
              :placeholder="placeholder"
              :disabled="disabled"
              :value="value"
              @change="handleInput"
              :loading="loading"
              :labelInValue="labelInValue">
        <a-select-option value="">请选择</a-select-option>
        <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.code">{{item.value}}</a-select-option>
    </a-select>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: "OtherDictSelectTag",
    props: {
      dictCname: String,
      dictEname: String,
      placeholder: {
        type: String,
        default: '请选择',
      },
      triggerChange: Boolean,
      disabled: Boolean,
      value: Object,
      type: String,
      labelInValue: Boolean,
      mode:String,
      valueEqName: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        dictOptions: [],
        tagType: "",
        loading: false,
        url: '/config/medicalOtherDict/getDictList',
      }
    },
    watch: {
      dictCname: {
        immediate: true,
        handler(val) {
          if (val) {
            this.initDictData()
          }
        },
      },
      dictEname: {
        immediate: true,
        handler(val) {
          if (val) {
            this.initDictData()
          }
        },
      },
    },
    beforeMount() {
      if (!this.type || this.type === "list") {
        this.tagType = "select"
      } else {
        this.tagType = this.type
      }
      //获取字典数据
      // this.initDictData();
    },
    methods: {
      initDictData() {
        //根据字典Code, 初始化字典数组
        let dictName = '';
        if (this.dictCname) {
          dictName = this.dictCname;
        }
        if (this.dictEname) {
          dictName = this.dictEname;
        }
        this.$store.dispatch('GetCacheAsync', {
          key: 'OtherDict_' + dictName, func: resolve => {
            this.loading = true
            let param = { dictCname: this.dictCname, dictEname: this.dictEname };
            getAction(this.url, param, 'get').then((data) => {
              if (data.success) {
                resolve(data.result)
              } else {
                that.$message.warning(data.message);
              }
            }).finally(() => {
              this.loading = false
            })
          }
        }).then((data) => {
          if (this.valueEqName) {
            this.dictOptions = data.map(item => {
              return {
                code: item.value,
                value: item.value,
                name: item.value
              }
            })
          }else{
            this.dictOptions = data;
          }
        })

      },
      handleInput(e) {
        let val;
        if (this.tagType == "radio") {
          val = e.target.value
        } else {
          val = e
        }
        this.$emit('change', val);
        this.$emit('input', val);
        this.$emit('select', val ? this.dictOptions.find(r => r.code === val) : {})

      },
      setCurrentDictOptions(dictOptions) {
        this.dictOptions = dictOptions
      },
      getCurrentDictOptions() {
        return this.dictOptions
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
    }
  }
</script>

<style scoped>
</style>
