<template>
  <div>
    <a-radio-group v-if="tagType==='radio'" @change="handleInput" :value="value" :disabled="disabled">
      <a-radio v-for="(item, key) in dictOptionShows" :key="key" :value="item.code" :class="{'block':vertical}">{{
        item.name }}
      </a-radio>
    </a-radio-group>

    <a-select v-else-if="tagType==='select'" :placeholder="placeholder" :disabled="disabled" :value="value"
              @change="handleInput" :loading="loading" :dropdownMatchSelectWidth="false" :allowClear="!required"
              v-bind="search?{showSearch:true,filterOption,...$attrs}:$attrs">
      <a-select-option v-for="(item, key) in dictOptionShows" :key="key" :value="item.code" :title="item.name ">
        {{ item.name }}
      </a-select-option>
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu"/>
        <template v-if="dictCode">
          <a-divider style="margin: 0"/>
          <div style="margin: 4px 0;padding: 4px 8px; cursor: pointer;" class="ant-select-dropdown-menu-item" @click="$refs.itemModal.edit(dictCode)">
            <a-icon type="edit"/>管 理
          </div>
        </template>
      </div>
    </a-select>
    <medical-dict-item-modal ref="itemModal" :autoIncrease="autoIncrease" @ok="editOk"></medical-dict-item-modal>
  </div>

</template>

<script>
  import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'
  import MedicalDictItem from '../../pages/selectMulti/MedicalDictItem'

  import MedicalDictItemModal from '@/pages/config/modules/MedicalDictItemModal'
  export default {
    name: "MDictSelectTagEdit",
    components: {
      MedicalDictItem,
      MedicalDictItemModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
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
      filter: Function,
      loaded: Function,
      // 编辑的时候是否自增长
      autoIncrease: Boolean
    },
    data() {
      return {
        dictOptions: [],
        tagType: "",
        loading: false
      }
    },
    watch: {
      dictCode: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0)
            this.initDictData()
        },
      },
      options: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0)
            this.constructData(val)
        },
      }
    },
    computed: {
      dictOptionShows() {
        let options = this.filter ? this.dictOptions.filter(this.filter) : this.dictOptions
        if (this.required && (this.value === null || this.value === undefined || this.value === '') && options.length > 0) {
          this.handleInput(this.tagType === "radio" ? { target: { value: options[0].code } } : options[0].code)
        }
        return options
      }
    },
    beforeMount() {
      // console.log(this.dictCode);
      if (!this.type || this.type === "list") {
        this.tagType = "select"
      } else {
        this.tagType = this.type
      }
    },
    methods: {
      initDictData() {
        console.log('initDictData',this.dictCode)
        //根据字典Code, 初始化字典数组
        this.loading = true
        this.$util.initDict(this.dictCode).then(data => {
          console.log('initDict',data)
          if (this.loaded) {
            data = this.loaded(Array.from(data)) || data
          }
          this.constructData(data)

        }).finally(() => {
          this.loading = false
        })

      },
      constructData(data) {
        if (this.valueEqName) {
          this.dictOptions = data.map(item => {
            return {
              code: item.value,
              value: item.value,
              name: this.showKey?`${item.value}(${item.code})`:item.value
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
      editOk(){
        this.initDictData()
      },
      handleInput(e) {
        console.log('handleInput',e)
        let val;
        if (this.tagType === "radio") {
          val = e.target.value
        } else {
          val = e
        }
        console.log(this.dictCode, val);
        // if (this.triggerChange) {
        this.$emit('change', val);
        // } else {
        this.$emit('input', val);

        this.$emit('select', val?this.dictOptions.find(r => r.code === val):{})
        // }
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
    }
  }
</script>

<style scoped>
</style>
