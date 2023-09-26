import ReorderBtn from '@/components/ReorderBtn'

export default {
  name: 'MTable',
  components: { ReorderBtn },
  props: {
    rowKey: {
      type: String,
      default: 'id'
    },
    loading: Boolean,
    bordered: Boolean,
    hideTools: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showOverflow: {
      type: Boolean,
      default: true
    },
    columns: Array,
    isorter: Object,
    sortChange: Function,
    dataSource: Array,
    expandedRowKeys: Array,
    pagination: Object,
    rowSelection: Object,
    scroll: Object,
    customRow: Object,
    size: String,
    custom: {
      type: Boolean,
      default: true
    },
    zooms: {
      type: Boolean,
      default: true
    },
    toolLg: {
      type: Number,
      default: 8
    },
    lg: {
      type: Number,
      default: 16
    },
  },
  data () {
    // 表格中选中操作不引起监听
    this.selectTrigger = false
    this.oldKeyLen = -1
    return {
      tableHeight: undefined,
      isMax: false,
      // 空白页提示
      emptyDescription: undefined
    }
  },
  mounted () {
    // 手动将表格和工具栏进行关联
    this.$nextTick(() => {
      this.$refs.mTable.connect(this.$refs.xToolbar)
    })
  },
  watch: {
    dataSource (dataSource) {
      this.oldKeyLen = -1
    },
    'rowSelection.selectedRowKeys' (keys) {
      if (keys.length === this.oldKeyLen) {
        return
      }
      this.oldKeyLen = keys.length
      if (this.selectTrigger) {
        this.selectTrigger = false
        return
      }
      const table_o = this.$refs.mTable
      const rowKey = this.rowKey
      table_o.clearCheckboxRow()
      if (keys.length > 0) {
        let keySet = new Set(keys)
        let rows = this.dataSource.filter(r => keySet.has(r[rowKey]))
        table_o.setCheckboxRow(rows, true)
      }
    },
    'scroll.y': {
      immediate: true,
      handler (val, oldVal) {
        let height = val
        if (!height) {
          height = 'auto'
        } else if (typeof height === 'number') {
          height = height + 'px'
        }
        this.tableHeight = height
      }
    }
  },
  methods: {
    setEmptyDesc (desc) {
      this.emptyDescription = desc
    },
    selectAllEvent ({ records, checked }) {
      if (!this.rowSelection.onSelectAll) {
        this.selectAllEventSimple({ records, checked })
        return
      }
      const rowSelection = this.rowSelection
      const rowKey = this.rowKey
      let selectedRowKeys = rowSelection.selectedRowKeys
      let changeRows
      if (checked) {
        let idSet = new Set(selectedRowKeys)
        changeRows = records.filter(r => !idSet.has(r[rowKey]))
        selectedRowKeys.push(...changeRows.map(r => r[rowKey]))
      } else {
        changeRows = this.dataSource // 默认 this.selectionRows
        selectedRowKeys = selectedRowKeys.filter(r => !changeRows.some(r2 => r2[rowKey] === r))
      }
      // 更新 selectedRowRecords
      rowSelection.onSelectAll(checked, undefined, changeRows)
      // 更新selectedRowKeys, selectionRows
      rowSelection.onChange(selectedRowKeys, records)
      this.selectTrigger = true
    },
    // 只选择当前页
    selectAllEventSimple ({ records, checked }) {
      let selectedRowKeys = checked ? records.map(r => r[this.rowKey]) : []
      // 更新selectedRowKeys, selectionRows
      this.rowSelection.onChange(selectedRowKeys, records)
      this.selectTrigger = true
    },
    selectChangeEvent ({ records, checked, row, rowIndex }) {
      const rowSelection = this.rowSelection
      const rowKey = this.rowKey
      let selectedRowKeys = rowSelection.selectedRowKeys
      // if(records.length - selectedRowKeys.length === 1){
      if (checked) {
        selectedRowKeys.push(row[rowKey])
        //  更新selectedRowRecords
        rowSelection.onSelect && rowSelection.onSelect(row, checked)
      } else {
        selectedRowKeys.splice(selectedRowKeys.indexOf(row[rowKey]), 1)
        //  更新selectedRowRecords
        rowSelection.onSelect && rowSelection.onSelect(row, checked)
      }
      /*} else {
        // 树形显示的时候不是严格模式，选择父节点会联动子节点
        if (checked) {
          // 计算出新勾选的记录
          records = records.filter(r => !selectedRowKeys.some(r2 => r[rowKey] === r2))
          selectedRowKeys.push(...records.map(r => r[rowKey]))
        } else {
          // 计算出取消勾选的记录
          console.log('records',records.length)
          console.log('selectedRowKeys',selectedRowKeys.length)
          records = this.dataSource.filter(r => selectedRowKeys.some(r2 => r[rowKey] === r2)
            && !records.some(r2 => r[rowKey] === r2[rowKey]))
          console.log('records',records.length)
          // 过滤取消的记录得出还在勾选的
          selectedRowKeys = selectedRowKeys.filter(r => !records.some(r2 => r ===r2[rowKey]))
        }
        //  更新selectedRowRecords
        rowSelection.onSelect && records.forEach(r => rowSelection.onSelect(r, checked))
      }*/
      // 更新selectedRowKeys, selectionRows
      rowSelection.onChange && rowSelection.onChange(selectedRowKeys, records)
      this.selectTrigger = true
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.pagination.current = currentPage
      this.pagination.pageSize = pageSize
      this.$emit('change', this.pagination, {}, {})
    },
    pageChange (currentPage, pageSize) {
      this.pagination.current = currentPage
      this.pagination.pageSize = pageSize
      this.$emit('change', this.pagination, {}, {})
    },
    pageChangeVex ({ currentPage, pageSize }) {
      this.pagination.current = currentPage
      this.pagination.pageSize = pageSize
      this.$emit('change', this.pagination, {}, {})
    },
    toPage (currentPage) {
      this.pagination.current = currentPage
      this.$emit('change', this.pagination, {}, {})
    },
    zoom () {
      this.isMax = !this.isMax

      this.$refs.mTable.zoom()
    },
    initColFunc (col) {
      return {
        key: col.dataIndex || col.key,
        type: col.type,
        field: col.dataIndex || col.key,
        title: col.title,
        fixed: col.fixed === true ? 'left' : col.fixed,
        minWidth: col.width || 120,
        align: col.align,
        filters: col.filters,
        children: col.children && col.children.map(this.initColFunc),
        slots:
        {
          ...col.scopedSlots && this.$scopedSlots[col.scopedSlots.customRender] ?
            { default: ({ row, rowIndex }) => this.$scopedSlots[col.scopedSlots.customRender](row[col.dataIndex || col.key], row, rowIndex) }
            : col.customRender ?
              { default: ({ row, rowIndex }) => [col.customRender(row[col.dataIndex || col.key], row, rowIndex)] }
              : {},
          ...col.desc ? {
            header: () => [<a-tooltip title={col.desc} placement="bottom">{col.title}</a-tooltip>]
          } : {},
          ...col.slots&&this.$scopedSlots[col.slots.title] ?
           { header: ({ column }) =>this.$scopedSlots[col.slots.title](col.dataIndex || col.key) }
            : {},
        }
      }
    }
  },
  computed: {
    tableCols () {
      // 列属性转化
      let cols = this.columns.map(this.initColFunc)
      if (cols.length > 0) {
        cols[0].treeNode = true
      }
      this.isFixedLeftCol = cols.some(r => r.fixed === 'left')
      return cols
    },
    tableOn () {
      /*const rowSelection = this.rowSelection
      let selectTypeMulti = rowSelection && (rowSelection.type === 'checkbox' || rowSelection.type === undefined)
      return {
        'checkbox-all': selectTypeMulti && this.selectAllEvent,
        'checkbox-change': selectTypeMulti && this.selectChangeEvent,
        'radio-change': !selectTypeMulti
          && (({ newValue, oldValue, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) => {
            this.selectChangeEvent({ records: [row], checked: true, row, rowIndex })
          }),
        'toggle-row-expand': ({ expanded, row}) => this.$emit('expand', expanded, row),
        'toggle-tree-expand': ({ expanded, row}) => this.$emit('expand', expanded, row)
      }*/
      return {
        'checkbox-all': this.selectAllEvent,
        'checkbox-change': this.selectChangeEvent,
        'radio-change': (({ newValue, oldValue, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) => {
          this.selectChangeEvent({ records: [row], checked: true, row, rowIndex })
        }),
        'toggle-row-expand': ({ expanded, row }) => this.$emit('expand', expanded, row),
        'toggle-tree-expand': ({ expanded, row }) => this.$emit('expand', expanded, row)
      }
    }
  },
  render () {
    const {
      rowKey, loading, bordered, dataSource, pagination, size
      , showHeader, showOverflow, hideTools
      , customRow, expandedRowKeys
    } = this.$props

    const height = this.tableHeight
    const { title: slotsTitle, footer: slotsFooter, expandedRowRender } = this.$scopedSlots
    // 使用原对象，防止刷新宽度等
    let cols = this.tableCols
    const isTreeData = dataSource.some(r => r.children)
    const rowSelection = this.rowSelection
    // 单多选
    if (rowSelection) {
      let type = rowSelection.type || 'checkbox'
      let fixed = (this.isFixedLeftCol || rowSelection.fixed) && 'left'
      let col = cols.find(r => r.key === 'checkbox')
      if (col) {
        if (col.type !== type || col.fixed !== fixed) {
          Object.assign(col, { type, fixed })
          cols = [...cols]
        }
      } else {
        cols.unshift({
          key: 'checkbox',
          type,
          width: '60',
          fixed,
          align: 'center'
        })
      }

    }
    // 展开子页面
    if (expandedRowRender) {
      let fixed = this.isFixedLeftCol && 'left'
      let col = cols.find(r => r.type === 'expand')
      if (col) {
        if (col.fixed !== fixed) {
          Object.assign(col, { fixed })
          cols = [...cols]
        }
      } else {
        cols.unshift({
          key: 'expanded',
          type: 'expand',
          width: '60',
          fixed,
          align: 'center',
          slots: { content: ({ row, rowIndex }) => expandedRowRender(row, rowIndex) }
        })
      }
    }

    return (
      <div style={'height:' + height}>
        <vxe-grid
          border={bordered === false ? 'inner' : true}
          size={size === 'default' || size === 'middle' ? undefined : size === 'small' ? 'mini' : size}
          // size={size}
          resizable
          ref="mTable"
          showOverflow={showOverflow}
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          // highlight-current-column
          props={
            {
              ...height === 'auto' ? { scrollY: { enabled: false } } : { autoResize: true, height: 'auto' }
              , rowStyle: customRow && (({ row, rowIndex }) => customRow(row, rowIndex).style)
              , expandConfig: expandedRowKeys && { expandRowKeys: expandedRowKeys }
              , treeConfig: isTreeData && {}
              , ...this.$attrs
            }
          }
          resizable-config={{ minWidth: 80 }}
          checkbox-config={{ checkField: 'rowChecked', checkStrictly: isTreeData }}
          showHeader={showHeader}
          rowId={rowKey}
          loading={loading}
          columns={cols}
          data={dataSource}
          showHeaderOverflow={showOverflow}
          on={this.tableOn}
          scopedSlots={{
            // 空白页
            empty: props => <a-empty>
              <div slot="description">
                {
                  this.emptyDescription ? <span class="t-red">{this.emptyDescription}</span>
                    : '暂无数据'
                }
              </div>
            </a-empty>,
            // 头部插槽
            top: props => slotsTitle &&
              <div style="padding: 16px;border: 1px solid #e8e8e8">{slotsTitle()}</div>,
            // 分页组件和功能按钮
            pager: props => !hideTools || pagination ?
              <a-row class="m-t-10 p-b-10">
                <a-col lg={this.toolLg} sm={24}>
                  {!hideTools &&
                    <div class="height:32px">
                      <vxe-toolbar
                        class="right-top inline-block"
                        custom={this.custom}
                        zoom={this.zooms}
                        ref="xToolbar"
                        refresh={{
                          query: () => new Promise(resolve => {
                            this.$emit('change', this.pagination, {}, {})
                            resolve()
                          }
                          )
                        }}>


                      </vxe-toolbar>
                      {this.isorter &&
                        <reorder-btn columns={this.columns} isorter={this.isorter}
                          onOk={this.sortChange} style="vertical-align: top;margin-left:12px">
                          <vxe-button circle={true}
                            scopedSlots={{
                              default: prop => <a-icon type="sort-ascending" style="font-size:18px" />
                            }} />
                        </reorder-btn>}
                    </div>
                    /*<a-button shape="circle" onClick={this.zoom}><i class="vxe-icon--zoomin"/></a-button>*/
                    /*<a-button onClick={this.zoom}>{this.isMax?'取消全屏':'全屏'}</a-button>*/

                  }
                </a-col>
                <a-col lg={this.lg} sm={24} class="t-r">
                  {
                    pagination && pagination.total ?
                      <a-pagination
                        value={pagination.current}
                        props={pagination}
                        onChange={this.pageChange}
                        onShowSizeChange={this.pageChange} /> : undefined
                  }
                </a-col>
                {/*
                vex自带的page
                {pagination
                && <vxe-pager
                  border
                  class="fr"
                  style="height:auto"
                  current-page={pagination.current}
                  page-size={pagination.pageSize}
                  total={pagination.total}
                  size={pagination.simple?'mini':pagination.size}
                  autoHidden={pagination.hideOnSinglePage}
                  pageSizeOptions={pagination.pageSizeOptions && pagination.pageSizeOptions.map(r => parseInt(r))}
                  layouts={(() => {
                      let array = ['PrevPage', 'JumpNumber', 'NextPage']
                      if (pagination.showQuickJumper) {
                        array.push('FullJump')
                      }
                      if (pagination.showSizeChanger) {
                        array.push('Sizes')
                      }
                      array.push('Total')
                      return array
                    // ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
                    })()
                  }
                  on={{
                    'page-change': this.pageChangeVex
                  }}/>
                }*/}
              </a-row> : undefined
          }}
        >
        </vxe-grid>
        <div>
          {slotsFooter && slotsFooter()}
        </div>

      </div>

    )
  }
}