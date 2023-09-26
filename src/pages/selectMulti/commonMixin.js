import JEllipsis from '@/components/jeecg/JEllipsis'
import { getAction } from '@/api/manage'
import SelectedTag from '@/pages/selectMulti/plugins/SelectedTag'
/* 分页参数 */
let ipagination = {
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '100', '300', '1000', '2000'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
}


const commonMethod = {
}

const commonComputed = {
  // selectTag组件监听事件
  selectActionOn(){
    let onObj = {
      clear: this.onClearSelected,
      remove: this.removeSelect,
    }
    if(this.url && this.url.selectAll){
      // 所有页全选
      onObj.selectAllPage = this.selectAllPage
      // 所有页反选
      onObj.invertAllPage = this.invertAllPage
      // 反选全部
      onObj.invertAll = this.invertAll
    }
    return onObj
  }
}
// 选择项关联为code
export const multiSelectMixin = {
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    selectType: {
      type: String,
      default: 'checkbox'
    }
  },
  components: { JEllipsis, SelectedTag },
  data() {
    this.selectedData = []
    this.selectedDataLen = 0
    this.selectedCopy = []
    return {
      code: 'code',
      name: 'name',
      id: 'id',
      showSelectTags: false,
      /* 分页参数 */
      ipagination
    }
  },
  computed: {
    ...commonComputed,
    /*rowSelection() {
      return this.url.selectAll ? {
        onSelectInvert: (selectedRowKeys) => {
          const id = this.id
          let selectSet = new Set(selectedRowKeys)
          this.selectedRowRecords = this.selectedRowRecords.filter(r => selectSet.has(r[id]))
          let selectedSet = new Set(this.selectedRowRecords.map(r => r[id]))
          for (let key of selectedRowKeys) {
            if (!selectedSet.has(key)) {
              this.selectedRowRecords.push(this.dataSource.find(r => r[id] === key))
            }
          }
        },
        hideDefaultSelections: false,
        selections: [{
          key: 'all-page',
          text: '所有页全选',
          onSelect: this.selectAllPage
        }
        ]
      } : {}
    },*/
  },
  watch: {
    dataSource(array) {
      this.pageSelected(array)
    },
    selected: {
      immediate: true,
      handler(array) {
        if (!array || (array === this.selectedData && this.selectedDataLen === array.length)) {
          return
        }
        this.selectedRowKeys = []
        this.selectedCopy = array.map(item => {
          return {
            [this.code]: item.code,
            [this.name]: item.name,
            ...item
          }
        })

        this.selectedRowRecords = [...this.selectedCopy]
        if (this.dataSource.length > 0) {
          this.pageSelected(this.dataSource)
        }
      }
    },
    selectType(){
      this.onClearSelected()
    }
  },
  methods: {
    ...commonMethod,
    invertAll() {
      this.loading = true
      getAction(this.url.selectAll, this.fixedParam).then(res => {
        if (res.success) {
          const { id, code, name } = this
          let selectCodeSet = new Set(this.selectedRowRecords.map(r => r[code]))
          let data = res.result.filter(r => !selectCodeSet.has(r.CODE))
          this.selectedRowKeys = data.map(r => r.ID)
          this.selectedRowRecords = data.map(r => {
            return { [id]: r.ID, [code]: r.CODE, [name]: r.NAME }
          })
          this.selectedCopy = []
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 处理每页被选项方法
    pageSelected(array) {
      array.forEach(r => {
        let index = this.selectedCopy.findIndex(item => item[this.code] === r[this.code])
        if (index > -1) {
          let item = this.selectedCopy.splice(index, 1)[0]
          this.selectedRowKeys.push(item[this.id] = r[this.id])
        }
      })
    },
    getSelect() {
      console.warn('getSelect2')
      this.selectedDataLen = this.selectedRowRecords.length
      return this.selectedData = this.selectedRowRecords.map(record => {
        return { ...record, code: record[this.code], name: record[this.name] }
      })
    },
    removeSelect(rowIndex) {
      let record = this.selectedRowRecords.splice(rowIndex, 1)[0]
      if (record[this.id]) {
        let index = this.selectedRowKeys.indexOf(record[this.id])
        if (index > -1) {
          this.selectedRowKeys.splice(index, 1)
        }
      }
      const code = record[this.code]
      let index = this.selectedCopy.findIndex(item => item[this.code] === code)
      if (index > -1) {
        this.selectedCopy.splice(index, 1)
      }
    },
    selectAllPage() {
      this.loading = true
      getAction(this.url.selectAll, this.getQueryParams()).then(res => {
        if (res.success) {
          const { id, code, name } = this
          let selectCodeSet = new Set(this.selectedRowRecords.map(r => r[code]))
          let data = res.result.filter(r => !selectCodeSet.has(r.CODE))
          let codeSet = new Set(data.map(r => r.CODE))
          this.selectedRowKeys = [...this.selectedRowKeys, ...data.map(r => r.ID)]
          this.selectedRowRecords = [...this.selectedRowRecords, ...data.map(r => {
            return { [id]: r.ID, [code]: r.CODE, [name]: r.NAME }
          })]
          this.selectedCopy = this.selectedCopy.filter(r => codeSet.has(r[code]))
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })

    },
    invertAllPage() {
      this.loading = true
      getAction(this.url.selectAll, this.getQueryParams()).then(res => {
        if (res.success) {
          const { id, code, name } = this
          let selectCodeSet = new Set(this.selectedRowRecords.map(r => r[code]))
          let data = res.result.filter(r => !selectCodeSet.delete(r.CODE))
          this.selectedRowRecords = this.selectedRowRecords.filter(r => selectCodeSet.has(r[code]))
          this.selectedRowKeys = this.selectedRowRecords.map(r => r[id]).filter(r => r)

          let codeSet = new Set(data.map(r => r.CODE))
          this.selectedRowKeys = [...this.selectedRowKeys, ...data.map(r => r.ID)]
          this.selectedRowRecords = [...this.selectedRowRecords, ...data.map(r => {
            return { [id]: r.ID, [code]: r.CODE, [name]: r.NAME }
          })]
          this.selectedCopy = this.selectedCopy.filter(r => codeSet.has(r[code]))
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })

    }
  }

}


// 选择项关联为id
export const multiSelectIdMatchMixin = {
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    selectType: {
      type: String,
      default: 'checkbox'
    }
  },
  components: {
    JEllipsis,
    SelectedTag
  },
  data() {
    this.selectedData = []
    this.selectedDataLen = 0
    return {
      id: 'id',
      code: 'code',
      name: 'name',
      showSelectTags: false,
      ipagination
    }
  },
  computed: {
    ...commonComputed,
    /*rowSelection() {
      return this.url.selectAll ? {
        onSelectInvert: (selectedRowKeys) => {
          const id = this.id
          let selectSet = new Set(selectedRowKeys)
          this.selectedRowRecords = this.selectedRowRecords.filter(r => selectSet.has(r[id]))
          let selectedSet = new Set(this.selectedRowRecords.map(r => r[id]))
          for (let key of selectedRowKeys) {
            if (!selectedSet.has(key)) {
              this.selectedRowRecords.push(this.dataSource.find(r => r[id] === key))
            }
          }
        },
        hideDefaultSelections: false,
        selections: [
          {
            key: 'all-page',
            text: '所有页全选',
            onSelect: this.selectAllPage
          }
        ]
      } : {}
    }*/
  },
  watch: {
    selected: {
      immediate: true,
      handler(array) {
        if (!array || (array === this.selectedData && this.selectedDataLen === array.length)) {
          return
        }
        this.selectedRowKeys = array.map(item => item[this.id])
        this.selectedRowRecords = array.map(item => {
          return {
            [this.id]: item.id,
            [this.code]: item.code,
            [this.name]: item.name,
            ...item
          }
        })
      }
    },
    selectType(){
      this.onClearSelected()
    }
  },
  methods: {
    ...commonMethod,
    invertAll() {
      this.loading = true
      getAction(this.url.selectAll, this.fixedParam).then(res => {
        if (res.success) {
          let selectKeySet = new Set(this.selectedRowKeys)
          let data = res.result.filter(r => !selectKeySet.has(r.ID))
          const { id, name } = this
          this.selectedRowKeys = data.map(r => r.ID)
          this.selectedRowRecords = data.map(r => {
            return { [id]: r.ID, [name]: r.NAME }
          })

        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getSelect() {
      console.warn('getSelect')
      this.selectedDataLen = this.selectedRowRecords.length
      this.selectedData = this.selectedRowRecords.map(record => {
        return { ...record, id: record[this.id], code: record[this.code], name: record[this.name] }
      })
      console.log('this.selectedData', this.selectedData)
      console.log('this.selectedRowRecords', this.selectedRowRecords)
      return this.selectedData
    },
    removeSelect(rowIndex) {
      let record = this.selectedRowRecords.splice(rowIndex, 1)[0]
      this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record[this.id]), 1)
    },
    selectAllPage() {
      this.loading = true
      getAction(this.url.selectAll, this.getQueryParams()).then(res => {
        if (res.success) {
          // 过滤已存在的记录
          let selectKeySet = new Set(this.selectedRowKeys)
          let data = res.result.filter(r => !selectKeySet.has(r.ID))
          const { id, name } = this
          this.selectedRowKeys = [...this.selectedRowKeys, ...data.map(r => r.ID)]
          this.selectedRowRecords = [...this.selectedRowRecords, ...data.map(r => {
            return { [id]: r.ID, [name]: r.NAME }
          })]
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    invertAllPage() {
      this.loading = true
      getAction(this.url.selectAll, this.getQueryParams()).then(res => {
        if (res.success) {
          let selectKeySet = new Set(this.selectedRowKeys)
          let data = res.result.filter(r => !selectKeySet.delete(r.ID))
          const { id, name } = this
          this.selectedRowKeys = Array.from(selectKeySet)
          this.selectedRowRecords = this.selectedRowRecords.filter(r => selectKeySet.has(r[id]))

          this.selectedRowKeys = [...this.selectedRowKeys, ...data.map(r => r.ID)]
          this.selectedRowRecords = [...this.selectedRowRecords, ...data.map(r => {
            return { [id]: r.ID, [name]: r.NAME }
          })]
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }

}
