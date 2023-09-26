export default {
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    multi: Boolean,
    showKey: Boolean,
    separator: {
      type: String,
      default: ','
    },
    // 返回值包含编码:名称
    wholeValue: Boolean,
    disable: Boolean,
    hideButton: Boolean,
    valueEqName: Boolean,
    maxTag: {
      type: Number,
      default: 20
    },
  },
  data() {
    return {
      loading: false,
      selectVisible: false,
      selectData: [],
      selectStr: '',
      codes: [],
      code: 'code',
      name: 'name',
      maxTagCount: this.maxTag
    }
  },
  computed: {
    placeholderVal(){
      if(this.multi){

        if(this.separator.indexOf('|') > -1){
          return this.placeholder + "（多选 或关系）"
        } else if(this.separator.indexOf(',') > -1){
          return this.placeholder + "（多选 且关系）"
        } else {
          return this.placeholder + "（多选）"
        }
      } else {
        return this.placeholder + '（单选）'
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val !== this.selectStr) {
          // this.forbiddenChangeCode = true
          if (val && val.length > 0) {
            this.codes = val.split(this.separator)
            if(this.wholeValue){
              this.selectData = this.codes.map(code => {
                // let array = code.split(':')
                // return {[this.code]: array[0], [this.name]: array[1]}
                let index = code.indexOf(':')
                return {[this.code]: code.substring(0, index), [this.name]: code.substring(index + 1)}
              })
              this.codes = this.selectData.map(r => r[this.code])
            } else {
              this.selectData = this.codes.map(code => {return {[this.code]: code, [this.name]: code}})
              let codes = this.codes
              if(codes.length > this.maxTagCount){
                codes = this.codes.slice(0, this.maxTagCount)
              }
              this.loadData(codes.join(","));
              /*for(let i = 0, j, len = this.codes.length; i < len; i+=50){
                if((j = i + 50) > len){
                  j = len
                }
                this.loadData(this.codes.slice(i, j).join(","));
              }*/
            }
          } else {
            this.selectData = []
            this.codes = []
            this.selectStr = ''
          }
        }
      },
    },
    /*codes(val) {
      if(this.forbiddenChangeCode){
        this.forbiddenChangeCode = false
        return
      }
      this.changeVal(val)
    },*/
    separator(val){
      if(this.codes && this.codes.length > 0){
        this.changeVal(this.codes)
      }

    }
  },
  methods: {
    handleSelectOk() {
      this.selectData = this.$refs.selectRef.getSelect()
      this.codes = this.selectData.map(item => item[this.code])
      this.changeVal(this.codes)
      this.handleSelectClose()
    },
    handleSelectClose() {
      this.selectVisible = false
    },
    openSelect(){
      if(!this.codes){
        this.selectData.length = 0
      } else if(this.codes.length !== this.selectData.length){
        this.selectData = this.selectData.filter(item => this.codes.some(val => val === item[this.code]))
      }
      this.selectVisible = true
    },
    // 组件移除选项时调用
    onChange(val){
      this.changeVal(val)
    },
    // 手动赋值时调用
    changeVal(val) {
      // 返回值不能是undefined 不然清空后值不会被后台改变
      let selectVal = ''
      if(this.wholeValue){
        if(val && val.length > 0){
          if(val.length !== this.selectData){
            this.selectData = this.selectData.filter(r => val.indexOf(r[this.code]) > -1)
          }
          selectVal = this.selectData.map(r => `${r[this.code]}:${r[this.name]}`).join(this.separator)
        }
      } else if(this.valueEqName){
        if(val && val.length > 0){
          if(val.length !== this.selectData){
            this.selectData = this.selectData.filter(r => val.indexOf(r[this.code]) > -1)
          }
          selectVal = this.selectData.map(r => r[this.name]).join(this.separator)
        }
      } else {
        selectVal = val && val.length > 0 ? val.join(this.separator) : ""
      }
      this.selectStr = selectVal
      console.log('this.selectStr',this.selectStr)
      this.$emit('input', selectVal)
      this.$emit('change', selectVal)
      // if(this.multi){
        this.$emit('select',this.selectData.map(r => ({code: r[this.code], name: r[this.name]})))
      /*} else {
        if (this.selectData.length === 0) {
          this.$emit('select')
        } else {
          let item = this.selectData[0]
          this.$emit('select', { code: item[this.code], name: item[this.name] })
        }
      }*/
    },
    loadData(codes) {
    }
  },

/*  render() {
    return (
      <div>
        <a-input-group compact >
          <a-select
            mode={this.multi ? 'tags' : 'default'}
            placeholder={this.placeholder}
            vModel={this.codes}
            open={false}
            showArrow={false}
            :allowClear="!disable"
            style="flex: auto">
            <a-select-option vFor={item in this.selectData} key={item.code}
                             value={item.code}>{item.value}</a-select-option>
          </a-select>

          <a-button type="primary" style="width: 64px" loading={loading} vOn:click={this.openSelect}>选择</a-button>
        </a-input-group>
        <m-modal centered
                 title={this.placeholder}
                 width="80%"
                 visible={this.selectVisible}
                 vOn:ok={this.handleSelectOk}
                 vOn:cancel={this.handleSelectClose}
                 destroyOnClose={true}
                 cancelText={'关闭'}>
          {this.$slot.default}
        </m-modal>
      </div>

    )
  }*/
}
