export const checklistCols = [
  {
    title: '收费项目A编码',
    align: "center",
    dataIndex: 'itemCode1',
    width: '200px'
  },
  {
    title: '收费项目A名称',
    align: "center",
    dataIndex: 'packageItem1',
    width: 140,
    // scopedSlots: {customRender: 'packageItem1'},
  },
  {
    title: '收费项目A关键字',
    align: "center",
    dataIndex: 'itemname',
    width: '350px'
  },
  {
    title: '收费项目B编码',
    align: "center",
    dataIndex: 'itemCode2',
    width: '200px'
  },
  {
    title: '收费项目B名称',
    align: "center",
    dataIndex: 'packageItem2',
    width: 140,
    // scopedSlots: {customRender: 'packageItem2'},
  },

  {
    title: '收费项目B关键字',
    align: "center",
    dataIndex: 'itemname1',
    width: '350px'
  },
  {
    title: '收费项目名称类型',
    align: "center",
    dataIndex: 'itemType_dictText',
    width: '140px'
  },

  {
    title: '重复收费类型',
    align: "center",
    dataIndex: 'item1Type_dictText',
    width: '140px'
  },
  {
    title: '收费项目B违规判断',
    align: "center",
    dataIndex: 'item1Wgtype_dictText',
    width: '140px'
  },
  {
    dataIndex: 'qtyType_dictText',
    align: "center",
    title: '超量检查的类型',
    width: '140px'
  },
  {
    dataIndex: 'qtyNum',
    title: '超量的数值(不含)',
    width: '140px',
    customRender: (text, record, index) => {
      if (text) {
        return text;
      }
      return ''
    }
  },

  {
    title: '是否输出同一天的手术项目',
    align: "center",
    dataIndex: 'isSameDay_dictText',
    width: '140px'
  },
  {
    title: '违规案例提示',
    align: "center",
    dataIndex: 'wgCaseExample',
    width: '120',
    scopedSlots: {customRender: 'wgCaseExample'},
  },
  {
    title: '历史查询金额',
    align: "center",
    dataIndex: 'totalFee',
    width: '140px'
  },
  {
    title: '历史查出记录数',
    align: "center",
    dataIndex: 'recordCount',
    width: '140px'
  },
  {
    title: '历史查询次数',
    align: "center",
    dataIndex: 'queryCount',
    width: '140px'
  },
  {
    title: '整理人',
    align: "center",
    dataIndex: 'sorter',
    width: '140px'
  },

]