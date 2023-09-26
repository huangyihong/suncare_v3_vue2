export default {
  name: 'multi',
  components: {},
  props: {
    value: Object,
    separator: {
      type: String,
      default: '|'
    },
    buttonText: {
      type: String,
      default: '增加组'
    },
    // 传入值为数组不用分割字符串
    valueObj: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 99
    },
    event: {
      type: String,
      default: 'change'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  render() {
    const components = this.dataSource.map((r,index) => {
      const removeIcon = this.dataSource.length === 1?<a-col span={2}/>
      :<a-col span={2} style="font-size: 30px;line-height:40px;padding-left: 5px">
          <a-icon type="minus-square" theme="twoTone" onClick={ e => this.removeGroup(index)}/>
        </a-col>
      return ([
          <a-col span={22} class="m-b-6" key={r.index}>
              {this.$scopedSlots.default({
                param: { ...this.$attrs},
                value: r.value,
                index,
                on: {
                  [this.event]: val => this.eventFuncMap[this.event](val, r)
                }
              })}
          </a-col>,
          removeIcon
        ]
      )
    })

    let buttonText = this.buttonText
    if(this.separator.indexOf('|') > -1){
      buttonText += ' 或关系'
    } else if(this.separator.indexOf(',') > -1){
      buttonText += ' 且关系'
    }

    const buttonElem = <a-button onClick={e => this.addGroup()}>{buttonText}</a-button>

    return (<a-row>
      {components.flat()}
      <a-col span={3} >
        {this.maxSize > this.dataSource.length?buttonElem: undefined}
      </a-col>
    </a-row>)
  },
  data() {
    this.eventFuncMap = {
      'change': (val, r) => {r.value = val;this.onChange()},
      'input': (e, r) => {r.value = e.target.value;this.onChange()},
    }
    return {
      dataSource: [{value: undefined, index: 0}]
    }
  },
  watch: {
    value: {
      immediate:true,
      handler(val) {
        if(val === this.selectStr){
          return
        }
        this.selectStr = val

        if(val && this.valueObj){
          this.dataSource = val.map((r,index) => ({value: r, index: index}))
        } else if(val && (val = val.trim()).length > 0){
          this.dataSource = val.split(this.separator).map((r,index) => ({value: r, index: index}))
        } else {
          this.dataSource = [{value: undefined, index: 0}]
        }
        console.log('this.dataSource',this.dataSource)

      }

    }
  },
  methods: {
    removeGroup(index){
      this.dataSource.splice(index, 1)
      this.onChange()
    },
    addGroup(){
      this.dataSource.push({
        value: undefined,
        index: Math.max(...this.dataSource.map(r => r.index)) + 1
      })
    },
    onChange(){
      console.log('this.dataSource',this.dataSource)
      console.log('this.valueObj',this.valueObj)
      let val
      if(this.valueObj){
        val = this.dataSource.map(r => r.value).filter(r => r && Object.keys(r).length > 0)
      } else {
        val = this.dataSource.map(r => r.value).filter(r => r && r.length > 0).join(this.separator)
      }
      this.$emit('change', this.selectStr =val)
      console.log('multi.change', val)
    }
  },
  computed: {}
}
