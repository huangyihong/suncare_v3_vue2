export const checklistCols = [
  {
    title: '收费项目名称A',
    align: "left",
    dataIndex: 'itemname',
    width: '350px'
  },
  {
    title: '收费项目名称B',
    align: "left",
    dataIndex: 'itemname1',
    width: '350px'
  },
 /* {
    title: '收费项目名称类型',
    align: "center",
    dataIndex: 'itemType_dictText',
    width: '200px',
  },
*/
  {
    title: '重复收费类型',
    align: "center",
    dataIndex: 'item1Type_dictText',
    width: '140px',
  },
  {
    title: '收费项目B违规判断',
    align: "left",
    dataIndex: 'item1Wgtype_dictText',
    width: '200px',
  },
  {
    dataIndex: 'qtyType_dictText',
    align: "center",
    title: '超量检查的类型',
    width: '120px',
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
    width: '200px',
  },
  {
    title: '查询次数',
    align: "center",
    dataIndex: 'queryCount',
    width: '200px',
  },
  {
    title: '是否纳入规则',
    align: "center",
    dataIndex: 'isRule',
    width: '200px',
  },

]