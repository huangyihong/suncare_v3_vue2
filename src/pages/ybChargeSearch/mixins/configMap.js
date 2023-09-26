export const configMap = {
  '':{
    taskColumns:[
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
        align: 'center',
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '查询任务类型',
        dataIndex: 'taskType',
        scopedSlots: { customRender: 'taskType' },
        width: 200,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },

      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
      },
      {
        title: '任务耗时(秒)' ,
        dataIndex: 'taskCostTime',
        width: 120,
        customRender: (text, record, index) => {
          if(record.overTime){
            let date2 = new Date(record.overTime.replace(/-/g, '/'));
            let date1 = new Date(record.updateTime.replace(/-/g, '/'));
            let html = (date2.getTime() - date1.getTime())/1000;
            return html
          }
        }
      },

      {
        title: '任务开始时间',
        dataIndex: 'updateTime',
        width: 180,
      },

      {
        title: '任务结束时间',
        dataIndex: 'overTime',
        width: 180,
      },

      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],

  },
  'search':{
    taskColumns:[
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
        align: 'center',
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '医保项目名称',
        dataIndex: 'itemname',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 10);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 10);
          }
          return html
        }
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: 100,
        customRender: (text, record, index) => {
          let html = text;
          if(html){
            html = html.replace("ZY","住院")
            html = html.replace("MM","门诊")
            html = html.replace("GY","购药")
          }else{
            html=''
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 100,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:`报表取值说明：<br>
          1、按照医院名称和指定的项目名称，以及在界面上设定的其它条件，按天导出每个就诊记录所使用的指定项目的数量和金额；<br>
          2、如果只指定医院名称，不指定收费项目名称，则不再按天导出，直接导出每个就诊记录、每个收费项目的数量和金额。<br>`,
  },
  'drugRuleStatistics':{
    taskColumns:[
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
        align: 'center',
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '药品名称',
        dataIndex: 'itemname',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 10);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 10);
          }
          return html
        }
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: 100,
        customRender: (text, record, index) => {
          let html = text;
          if(html){
            html = html.replace("ZY","住院")
            html = html.replace("MM","门诊")
            html = html.replace("GY","购药")
          }else{
            html=''
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 100,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },

      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
  'yearStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 4);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 4);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:`报表取值说明：<br>
          按照机构名称、费用结算年份汇总，统计每个机构对应年份的就诊人次、门诊人次、住院人次、医疗费用总额、基金使用总额。<br>`,
  },
  'itemStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 4);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 4);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:`报表取值说明：<br>
          按照机构名称、收费的年份、收费项目名称来汇总，输出每个机构在对应的年份所使用的收费项目的单价、数量和金额。<br>`,
  },
  'itemByDeptStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 4);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 4);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
  'deptStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 4);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 4);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:`报表取值说明：<br>
          1、首先按机构、科室、年度汇总，按就诊总费用排名，取出每个科室就诊总费用最多的10条记录；<br>
          2、导出满足上述就诊记录的所有收费明细数据。<br>`,
  },
  'itemByVisitStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 10);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 10);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
  'visitStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '项目地',
        dataIndex: 'dataSource_dictText',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '数据层级',
        dataIndex: 'dataStaticsLevel',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='src'){
            html =  '原始层';
          }else if(text=='ods'){
            html =  '清洗后数据(ODS)';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 200,
      },
      {
        title: '时间范围',
        dataIndex: 'chargedateStartdate',
        width: 200,
        customRender: (text, record, index) => {
          let html = '';
          if(record.chargedateStartdate){
            html =  record.chargedateStartdate.substr(0, 10);
          }
          if(record.chargedateStartdate || record.chargedateEnddate){
            html += ' - ';
          }
          if(record.chargedateEnddate){
            html += record.chargedateEnddate.substr(0, 10);
          }
          return html
        }
      },
      {
        title: '是否包含自费',
        dataIndex: 'isFundpay',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='0'){
            html =  '否';
          }else if(text=='1'){
            html =  '是';
          }
          return html
        }
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:`报表取值说明：<br>
          根据指定的条件，输出符合条件的就诊清单，一次就诊一条记录，主要包括就诊的机构、医生、科室、日期，以及就诊总费用和基金支付金额等。<br>`,
  },
  'riskStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 100,
      },

      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 300,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
  'diagRiskStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 100,
      },

      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 300,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
  'lowStatistics':{
    taskColumns:[
      {
        title: '查询时间',
        dataIndex: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '查询人',
        dataIndex: 'createUser',
        width: 100,
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        width: 100,
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '结果记录数',
        dataIndex: 'recordCount',
        width: 100,
      },
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'etlSource',
        width: 120,
        customRender: (text, record, index) => {
          let html = text;
          if(text=='yb'){
            html =  '医保数据';
          }else if(text=='his'){
            html =  'HIS';
          }
          return html
        }
      },
      {
        title: '医院名称',
        dataIndex: 'orgs',
        width: 300,
      },
      {
        title: '文件大小(kb)',
        dataIndex: 'fileSize',
        width: 120,
      },
      {
        title: '查询完成时间',
        dataIndex: 'overTime',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }],
    desc:``,
  },
}