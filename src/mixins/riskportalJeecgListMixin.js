/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile } from '@/api/riskportalManage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export const JeecgListMixin = {
  data () {
    /*const components = {
      header: {
        cell: this.resizeableTitle // 拖拉列
      }
    }*/
    return {
      //token header
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      /*tableAttrs: {
        components
      },*/
      columns: [],
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 固定查询条件，不会被重置- */
      fixedParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc',
        isSorter: false
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table当前选中records*/
      selectedRowRecords: [],
      /* table当前页选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      // 用于设置 selectedRowRecords的值
      selectRowsEvent: {
        onChange: this.onSelectChange,
        onSelect: this.onItemSelect,
        onSelectAll: this.onSelectAll
      },
      // 是否一开始就获取数据
      initLoad: true,
      // 拖拉状态保存
      draggingState: {},
      tableMarginTop: 350, // 一行搜索框  + 选项区域
      heightRatio: .8,
      statisticsMap: {},
      arg: 1

    }
  },
  beforeMount () {
    if (this.initLoad) {
      this.loadData()
    }
    //初始化字典配置 在自己页面定义
    this.initDictConfig()
  },
  watch: {
    columns: {
      immediate: true,
      handler (columns) {
        const draggingMap = {}
        columns.forEach(col => {
          if (col.dataIndex)
            draggingMap[col.dataIndex] = col.width
        })
        this.draggingState = Vue.observable(draggingMap)
      }
    }
  },
  computed: {
    tableAttrs () {
      return {
        isorter: false,//this.isorter
        sortChange: prop => {
          this.isorter = prop
          this.loadData(this.arg)
        }
      }
    },
    rowKey () {
      return this.$refs.table && this.$refs.table.rowKey
    },
    scrollX () {
      return this.columns.reduce((prev, cur) => prev + (cur.width || 120), 20)
    },
    // 滚动列表，常用于弹窗选项列表
    scrollY () {
      let y
      if (this.$store.getters.modalMax) {
        y = this.$store.getters.height - this.tableMarginTop - 20
      } else {
        y = this.$store.getters.height * this.heightRatio - this.tableMarginTop
      }
      return (y < 200 ? 200 : y) + 'px'
    },
    scrollPageY () {
      return this.$store.getters.height - 250
    }
  },
  methods: {
    loadData (arg) {

      this.arg = arg
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          if (arg === 2) {
            this.dataSource = res.result.page.records
            this.ipagination.total = res.result.page.total
            //统计
            this.statisticsMap = res.result.statisticsMap
          }
        } else {
          this.$message.warning(res.message)
          this.$refs.table && this.$refs.table.setEmptyDesc(res.message)
        }
      }).catch(e => {
        this.$refs.table && this.$refs.table.setEmptyDesc(e.response.data.message)
        this.$message.error("网络中断或超时")
      }).finally(() => {
        this.loading = false
      })
    },
    initDictConfig () {
      // console.log("--这是一个假的方法!")
    },
    handleSuperQuery (arg) {
      //高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams () {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      let param = Object.assign(sqp, this.queryParam, this.isorter, this.filters, this.fixedParam)
      // param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField () {
      //TODO 字段权限控制
      var str = 'id'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    onSelectChange (selectedRowKeys, selectionRows) {
      console.log('onSelectChange', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onItemSelect (record, selected) {
      if (this.selectType === 'radio') {
        this.selectedRowRecords.length = 0
      }
      console.log(record, selected)
      if (selected) {
        this.selectedRowRecords.push(record)
      } else {
        const id = this.rowKey
        this.selectedRowRecords.splice(this.selectedRowRecords
          .findIndex(r => r[id] === record[id])
          , 1)
      }
    },
    onSelectAll (selected, selectedRows, changeRows) {
      console.log(selected, changeRows)
      if (selected) {
        this.selectedRowRecords.push(...changeRows)
      } else {
        const id = this.rowKey
        this.selectedRowRecords = this.selectedRowRecords.filter(record =>
          changeRows.findIndex(r => r[id] === record[id]) === -1)
      }
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.selectedRowRecords = []
    },
    searchQuery () {
      this.loadData(1)
    },
    superQuery () {
      this.$refs.superQueryModal.show()
    },
    searchReset () {
      this.queryParam = {}
      this.loadData(1)
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        const that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            that.loading = true
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.loading = false
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      this.loading = true
      const that = this
      return new Promise((resolve, reject) => {
        deleteAction(that.url.delete, { id: id }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.onClearSelected()
            that.loadData()
            resolve()
          } else {
            that.loading = false
            that.$message.warning(res.message)
            reject()
          }
        })
      })
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.readonly = false
    },
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleCopyAdd: function () {
      if (this.selectedRowKeys.length !== 1) {
        this.$message.warning('请选择一条记录！')
        return
      }
      let record = { ...this.selectionRows[0] }
      delete record.createTime
      delete record.createUser
      delete record.createUsername
      delete record.updateTime
      delete record.updateUser
      delete record.updateUsername
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '复制新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleTableChange (pagination, filters = {}, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      console.log('filters', filters)
      let params = {}
      for (let i in filters) {
        params[i] = ',' + filters[i].join(',') + ','
      }
      this.filters = params
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    modalFormOk () {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
      this.$refs.modalForm.readonly = true
    },
    handleExportXls (fileName, param, url, method = 'get') {
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      fileName += '.xls'
      this.handleExportFile(fileName, param, url, method)
    },
    handleExportFile (fileName, param, url, method = 'get') {
      if (this.loading) {
        this.$message.warn('请等待加载完成')
        return
      }
      if (!param) {
        param = this.getQueryParams()
        if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
          param['selections'] = this.selectedRowKeys.join(',')
        }
      }
      console.log('导出参数', param)
      const hideMsg = this.$message.loading('正在导出请等待...', 0);
      downFile(url || this.url.exportXlsUrl, param, method).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if (data.size < 2001) {
          let reader = new FileReader()
          reader.onload = function (event) {
            let result = JSON.parse(reader.result)
            if (!result.success) {
              that.$message.error(result.message)
            } else {
              // if(result.message === '等待导出'){

              // } else {
              that.$message.success(result.result || result.message)
              that.openExportTaskPage()
              // }
            }
          }
          reader.readAsText(data)
          return
        } else {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }
      }).catch(e => {
        this.$message.error(e.message)
      }).finally(() => {
        hideMsg()
      })
    },
    handleExportXlsAsync (url) {
      if (!url && !this.url.exportExcelByThread) {
        this.$message.error('请设置url.exportExcelByThread属性!')
        return
      }
      let param = filterObj({ ...this.queryParam, ...this.fixedParam })
      const that = this
      getAction(url || that.url.exportExcelByThread, param, 'get').then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.openExportTaskPage()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    openExportTaskPage () {
      const that = this
      this.$confirm({
        title: '打开导出记录界面?',
        content: '',
        onOk () {
          that.$util.openTab('/config/MedicalExportTaskList')
        }
      })
    },
    /* 导入 */
    handleImportExcel (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = this.$config['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br />
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `)
      }
    },
    /* 图片预览 */
    getImgView (text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return this.$config['imgDomainURL'] + '/' + text
    },
    /* 文件下载 */
    uploadFile (text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      window.open(this.$config['domianURL'] + '/sys/common/download/' + text)
    },
    resizeableTitle (h, props, children) {

      const { key, ...restProps } = props
      const col = this.columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })

      if (!col || !col.width) {
        return (<th {...restProps} >{children}</th>)
      }
      // console.log('resizeableTitle',key)

      // const onDrag = x => {
      // }

      let thDom = null
      const onActivated = () => {
        this.draggingState[key] = thDom.getBoundingClientRect().width
      }

      const onDragstop = (x) => {
        col.width = Math.max(col.width + x - this.draggingState[key], 60)
        this.draggingState[key] += 1
      }
      // this.$nextTick(onActivated)

      return (
        <th {...restProps} v-ant-ref={r => thDom = r} key={key} width={col.width} class="resize-table-th">
          {children}
          <div class="table-draggable-Position" onmouseenter={onActivated} />
          <vue-draggable-resizable
            key={key}
            class="table-draggable-handle"
            classNameDragging="active"
            w={10}
            x={this.draggingState[key]}
            z={1}
            axis="x"
            draggable={true}
            resizable={false}
            // onDragging={onDrag}
            onDragstop={onDragstop}
          ></vue-draggable-resizable>
        </th>
      )
    }
  }

}


export const ListMoreMixin = {
  data () {
    return {}
  },
  methods: {
    setColFilter (dataIndex, dict) {

      let col = this.columns.find(item => item.dataIndex === dataIndex)
      this.$set(col, 'filters', dict.map(item => {
        return {
          value: item.code,
          text: item.value
        }
      }))
    }
  }
}
