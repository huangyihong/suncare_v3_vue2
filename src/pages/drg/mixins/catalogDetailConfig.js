export const catalogDetailConfig = {
  data(){
    return {
      detailTitleMap:{
        'MDC_V':{title:'MDC',codeNameTitle:'MDC',versionTitle:'MDC目录版本',showTree:false},
        'ADRG_V':{title:'ADRG',codeNameTitle:'ADRG',versionTitle:'ADRG目录版本',showTree:true},
        'MDC_INFO_V':{title:'MDC主诊表',codeNameTitle:'疾病',versionTitle:'MDC主诊表版本',showTree:true},
        'ADRG_LIST_V':{title:'ADRG列表',codeNameTitle:'疾病',versionTitle:'ADRG列表版本',showTree:true},
        'MCC_INFO_V':{title:'MCC信息',codeNameTitle:'疾病',versionTitle:'MCC信息版本',showTree:false},
        'CC_INFO_V':{title:'CC信息',codeNameTitle:'疾病',versionTitle:'CC信息版本',showTree:false},
        'EXCLUDE_INFO_V':{title:'排除表信息',codeNameTitle:'疾病',versionTitle:'排除表信息版本',showTree:false},
        'SURGERY_INFO_V':{title:'手术室手术',codeNameTitle:'手术',versionTitle:'手术室手术信息版本',showTree:false},
        'DRG_V':{title:'DRG',codeNameTitle:'DRG',versionTitle:'DRG目录版本',showTree:true},
        'CONDITION_V':{title:'分组条件',codeNameTitle:'分组条件',versionTitle:'',showTree:false},
      },
      detailListMap:{
        'ADRG_V':[
          {
            title: 'ADRG编码',
            align: "left",
            dataIndex: 'code',
            width: '300px'
          }, {
            title: 'ADRG名称',
            align: "left",
            dataIndex: 'name',
            width: '300px'
          }, {
            title: '分组条件限制',
            align: "left",
            dataIndex: 'hasCondition_dictText',
            width: '200px'
          }],
        'ADRG_LIST_V':[{
            title: '关联诊断组1',
            align: "left",
            dataIndex: 'diagGroupCode1',
            width: '200px'
          }, {
            title: '疾病编码1',
            align: "left",
            dataIndex: 'diagCode1',
            width: '200px'
          }, {
            title: '疾病名称1',
            align: "left",
            dataIndex: 'diagName1',
            width: '300px'
          }, {
            title: '关联诊断组2',
            align: "left",
            dataIndex: 'diagGroupCode2',
            width: '200px'
          }, {
            title: '疾病编码2',
            align: "left",
            dataIndex: 'diagCode2',
            width: '200px'
          }, {
            title: '疾病名称2',
            align: "left",
            dataIndex: 'diagName2',
            width: '300px'
          }, {
            title: '手术或操作编码1',
            align: "left",
            dataIndex: 'surgeryCode1',
            width: '200px'
          }, {
            title: '手术或操作名称1',
            align: "left",
            dataIndex: 'surgeryName1',
            width: '300px'
          }, {
            title: '手术或操作编码2',
            align: "left",
            dataIndex: 'surgeryCode2',
            width: '200px'
          }, {
            title: '手术或操作名称2',
            align: "left",
            dataIndex: 'surgeryName2',
            width: '300px'
          }, {
            title: '手术或操作编码3',
            align: "left",
            dataIndex: 'surgeryCode3',
            width: '200px'
          }, {
            title: '手术或操作名称3',
            align: "left",
            dataIndex: 'surgeryName3',
            width: '300px'
          }, {
            title: '分组条件',
            align: "left",
            dataIndex: 'conditionName',
            width: '300px'
          },],
        'DRG_V':[
          {
            title: 'DRG编码',
            align: "left",
            dataIndex: 'code',
            width: '300px'
          }, {
            title: 'DRG名称',
            align: "left",
            dataIndex: 'name',
            width: '300px'
          }, {
            title: '是否判断次要诊断',
            align: "left",
            dataIndex: 'validSecondDiag_dictText',
            width: '300px'
          }, {
            title: '是否有效MCC',
            align: "left",
            dataIndex: 'validMcc_dictText',
            width: '200px'
          }, {
            title: '是否有效CC',
            align: "left",
            dataIndex: 'validCc_dictText',
            width: '200px'
          }, {
            title: '分组条件限制',
            align: "left",
            dataIndex: 'hasCondition_dictText',
            width: '200px'
          },],
        'CONDITION_V':[
          {
            title: '分组条件编码',
            align: "left",
            dataIndex: 'code',
            width: '300px'
          }, {
            title: '分组条件名称',
            align: "left",
            dataIndex: 'name',
            width: '300px'
          }, {
            title: '诊断数量',
            align: "left",
            dataIndex: 'diagNum',
            width: '100px'
          }, {
            title: '手术1',
            align: "left",
            dataIndex: 'validSurgery1_dictText',
            width: '100px'
          }, {
            title: '手术2',
            align: "left",
            dataIndex: 'validSurgery2_dictText',
            width: '100px'
          }, {
            title: '手术3',
            align: "left",
            dataIndex: 'validSurgery3_dictText',
            width: '100px'
          },],
      },
    }
  },
}