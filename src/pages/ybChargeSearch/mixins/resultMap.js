export const resultMap = {
  'search': {
    resultColumns: [
      {
        title: '就诊年份',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '就诊ID',
        dataIndex: 'visitid',
        width: '120px'
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorname',
        width: '120px'
      },
      {
        title: '科室名称',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '患者名称',
        dataIndex: 'name',
        width: '140px'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: '80px'
      },
      {
        title: '就诊',
        dataIndex: 'visitdate',
        width: '100px'
      },
      {
        title: '出院',
        dataIndex: 'leavedate',
        width: '100px'
      },
      {
        title: '年龄',
        dataIndex: 'yearage',
        width: '80px'
      },
      {
        title: '诊断',
        dataIndex: 'dis',
        width: '180px'
      },
      {
        title: '收费',
        dataIndex: 'charge',
        width: '100px'
      },
      {
        title: '机构项目名称',
        dataIndex: 'hisItemname',
        width: '200px'
      },
      {
        title: '医保项目名称',
        dataIndex: 'itemname',
        width: '200px'
      },
      {
        title: '医保项目编码',
        dataIndex: 'itemcode',
        width: '150px'
      },
      {
        title: '收费等级',
        dataIndex: 'chargeattri',
        width: '80px'
      },
      {
        title: '数量',
        dataIndex: 'amount',
        width: '80px'
      },
      {
        title: '金额',
        dataIndex: 'fee',
        width: '80px'
      },
    ]
  },
  'deptStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '科室名称',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊号',
        dataIndex: 'visitid',
        width: '120px'
      },
      {
        title: '总费用',
        dataIndex: 'totalfee',
        width: '120px'
      },
      {
        title: '报销金额',
        dataIndex: 'fundpay',
        width: '120px'
      },
      {
        title: '金额排名',
        dataIndex: 'rank1',
        width: '120px'
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '患者名称',
        dataIndex: 'name',
        width: '140px'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: '80px'
      },
      {
        title: '就诊日期',
        dataIndex: 'visitdate',
        width: '100px'
      },
      {
        title: '出院日期',
        dataIndex: 'leavedate',
        width: '100px'
      },
      {
        title: '年龄',
        dataIndex: 'yearage',
        width: '80px'
      },
      {
        title: '诊断',
        dataIndex: 'dis',
        width: '180px'
      },
      {
        title: '医院收费名称',
        dataIndex: 'hisItemname',
        width: '200px'
      },
      {
        title: '医保收费编码',
        dataIndex: 'itemcode',
        width: '150px'
      },
      {
        title: '医保收费名称',
        dataIndex: 'itemname',
        width: '200px'
      },
      {
        title: '收费等级',
        dataIndex: 'chargeattri',
        width: '80px'
      },
      {
        title: '单价',
        dataIndex: 'itemprice',
        width: '80px'
      },
      {
        title: '数量',
        dataIndex: 'amount',
        width: '80px'
      },
      {
        title: '金额',
        dataIndex: 'fee',
        width: '100px'
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        width: '120px'
      },
    ]
  },
  'riskStatistics': {
    resultColumns: [
      {
        title: '算法名称',
        dataIndex: 'tagName',
        width: '200px'
      },
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '科室',
        dataIndex: 'deptnameSrc',
        width: '120px'
      },
      {
        title: '映射后科室',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '就诊号',
        dataIndex: 'visitidSrc',
        width: '120px'
      },
      {
        title: '费用发生时间',
        dataIndex: 'feeOccurTime',
        width: '100px'
      },
      {
        title: '医院收费名称',
        dataIndex: 'hisItemnameSrc',
        width: '200px'
      },
      {
        title: '医保收费名称',
        dataIndex: 'itemnameSrc',
        width: '200px'
      },
      {
        title: '收费类型',
        dataIndex: 'chargeClass',
        width: '80px'
      },
      {
        title: '单价/平均单价',
        dataIndex: 'itemprice',
        width: '100px'
      },
      {
        title: '总数量',
        dataIndex: 'totalAmount',
        width: '100px'
      },
      {
        title: '总费用',
        dataIndex: 'totalFee',
        width: '100px'
      },
      {
        title: '分析对象',
        dataIndex: 'compareObject',
        width: '180px'
      },
      {
        title: '分析对象的值',
        dataIndex: 'analyseValue',
        width: '100px'
      },
      {
        title: '异常阈值',
        dataIndex: 'abnormalStandard',
        width: '100px'
      },
      {
        title: '对比机构参考值',
        dataIndex: 'compareValue',
        width: '100px'
      },
      {
        title: '对比机构数量',
        dataIndex: 'compareOrgAmount',
        width: '100px'
      },
      {
        title: '异常程度',
        dataIndex: 'abnormalMoney',
        width: '80px'
      },
      {
        title: '数据来源名称',
        dataIndex: 'etlSource',
        width: '80px'
      },
    ]
  },
  'itemByDeptStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '科室名称',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '医院收费名称',
        dataIndex: 'hisItemname',
        width: '200px'
      },
      {
        title: '医保收费名称',
        dataIndex: 'itemname',
        width: '200px'
      },
      {
        title: '医保收费编码',
        dataIndex: 'itemcode',
        width: '150px'
      },
      {
        title: '收费类别',
        dataIndex: 'itemclass',
        width: '80px'
      },
      {
        title: '收费等级',
        dataIndex: 'chargeattri',
        width: '80px'
      },
      {
        title: '单价',
        dataIndex: 'itemprice',
        width: '80px'
      },
      {
        title: '数量',
        dataIndex: 'sumAmount',
        width: '80px'
      },
      {
        title: '汇总金额',
        dataIndex: 'sumFee',
        width: '80px'
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        width: '120px'
      },
    ]
  },
  'yearStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '原始机构名称',
        dataIndex: 'orgnameSrc',
        width: '100px'
      },
      {
        title: '结算年份',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '就诊人次',
        dataIndex: 'totalCount',
        width: '100px'
      },
      {
        title: '门诊人次',
        dataIndex: 'mzCount',
        width: '100px'
      },
      {
        title: '住院人次',
        dataIndex: 'zyCount',
        width: '100px'
      },
      {
        title: '医疗费用总额',
        dataIndex: 'sumTotalfee',
        width: '130px'
      },
      {
        title: '基金使用总额',
        dataIndex: 'sumFundpay',
        width: '130px'
      },
    ]
  },
  'visitStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '就诊号',
        dataIndex: 'visitid',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '医生',
        dataIndex: 'doctorname',
        width: '120px'
      },
      {
        title: '科室',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '患者名称',
        dataIndex: 'name',
        width: '140px'
      },
      {
        title: '年龄',
        dataIndex: 'yearage',
        width: '80px'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: '80px'
      },
      {
        title: '就诊日期',
        dataIndex: 'visitdate',
        width: '100px'
      },
      {
        title: '出院日期',
        dataIndex: 'leavedate',
        width: '100px'
      },
      {
        title: '住院天数',
        dataIndex: 'visitdays',
        width: '80px'
      },
      {
        title: '诊断',
        dataIndex: 'dis',
        width: '180px'
      },
      {
        title: '住院总费用',
        dataIndex: 'sumTotalfee',
        width: '100px'
      },
      {
        title: '基金支付总额',
        dataIndex: 'sumFundpay',
        width: '100px'
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        width: '120px'
      },
    ]
  },
  'lowStatistics': {
    resultColumns: [
      {
        title: '算法名称',
        dataIndex: 'tagName',
        width: '200px'
      },
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '就诊号',
        dataIndex: 'visitid',
        width: '120px'
      },
      {
        title: '患者姓名',
        dataIndex: 'clientname',
        width: '120px'
      },
      {
        title: '年龄',
        dataIndex: 'yearage',
        width: '80px'
      },
      {
        title: '科室名称',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorname',
        width: '120px'
      },
      {
        title: '全部诊断',
        dataIndex: 'dis',
        width: '180px'
      },
      {
        title: '入院时间',
        dataIndex: 'visitdate',
        width: '100px'
      },
      {
        title: '出院时间',
        dataIndex: 'leavedate',
        width: '100px'
      },
      {
        title: '住院天数',
        dataIndex: 'visitdays',
        width: '80px'
      },
      {
        title: '参保类型',
        dataIndex: 'insurancetype',
        width: '80px'
      },
      {
        title: '总费用',
        dataIndex: 'totalfee',
        width: '100px'
      },
      {
        title: '基金支付金额',
        dataIndex: 'fundpay',
        width: '100px'
      },
      {
        title: '治疗费',
        dataIndex: 'treatAmt',
        width: '100px'
      },
      {
        title: '手术费',
        dataIndex: 'operationAmt',
        width: '100px'
      },
      {
        title: '检查费',
        dataIndex: 'checkTotalAmt',
        width: '100px'
      },
      {
        title: '化验费',
        dataIndex: 'labtestAmt',
        width: '100px'
      },
      {
        title: '耗材费',
        dataIndex: 'conamteAmt',
        width: '100px'
      },
      {
        title: '西药费',
        dataIndex: 'wmAmt',
        width: '100px'
      },
      {
        title: '中成药费',
        dataIndex: 'chimedAmt',
        width: '100px'
      },
      {
        title: '中草药费',
        dataIndex: 'herbalAmt',
        width: '100px'
      },
      {
        title: '护理费',
        dataIndex: 'nursingAmt',
        width: '100px'
      },
      {
        title: '床位费',
        dataIndex: 'bedAmt',
        width: '100px'
      },
      {
        title: '诊查费',
        dataIndex: 'diagAmt',
        width: '100px'
      },
      {
        title: '其他费',
        dataIndex: 'elsefeeAmt',
        width: '100px'
      },
    ]
  },
  'itemStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '医院收费名称',
        dataIndex: 'hisItemname',
        width: '200px'
      },
      {
        title: '医保收费名称',
        dataIndex: 'itemname',
        width: '200px'
      },
      {
        title: '医保收费编码',
        dataIndex: 'itemcode',
        width: '150px'
      },
      {
        title: '收费类别',
        dataIndex: 'itemclass',
        width: '80px'
      },
      {
        title: '收费等级',
        dataIndex: 'chargeattri',
        width: '80px'
      },
      {
        title: '单价',
        dataIndex: 'itemprice',
        width: '80px'
      },
      {
        title: '数量',
        dataIndex: 'sumAmount',
        width: '80px'
      },
      {
        title: '汇总金额',
        dataIndex: 'sumFee',
        width: '80px'
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        width: '120px'
      },
    ]
  },
  'diagRiskStatistics': {
    resultColumns: [
      {
        title: '算法名称',
        dataIndex: 'tagName',
        width: '200px'
      },
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '科室',
        dataIndex: 'deptnameSrc',
        width: '120px'
      },
      {
        title: '映射后科室',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '主诊断',
        dataIndex: 'primarydiagNameSrc',
        width: '180px'
      },
      {
        title: '映射后主诊断',
        dataIndex: 'primarydiagName',
        width: '180px'
      },
      {
        title: '总数量',
        dataIndex: 'totalAmount',
        width: '100px'
      },
      {
        title: '总费用',
        dataIndex: 'totalFee',
        width: '100px'
      },
      {
        title: '分析对象',
        dataIndex: 'compareObject',
        width: '180px'
      },
      {
        title: '分析对象的值',
        dataIndex: 'analyseValue',
        width: '100px'
      },
      {
        title: '异常阈值',
        dataIndex: 'abnormalStandard',
        width: '100px'
      },
      {
        title: '对比机构参考值',
        dataIndex: 'compareValue',
        width: '100px'
      },
      {
        title: '对比机构数量',
        dataIndex: 'compareOrgAmount',
        width: '100px'
      },
      {
        title: '异常程度',
        dataIndex: 'abnormalMoney',
        width: '100px'
      },
      {
        title: '数据来源名称',
        dataIndex: 'etlSource',
        width: '80px'
      },
    ]
  },
  'itemByVisitStatistics': {
    resultColumns: [
      {
        title: '机构名称',
        dataIndex: 'orgname',
        width: '150px'
      },
      {
        title: '年',
        dataIndex: 'year',
        width: '80px'
      },
      {
        title: '科室名称',
        dataIndex: 'deptname',
        width: '120px'
      },
      {
        title: '就诊号',
        dataIndex: 'visitid',
        width: '120px'
      },
      {
        title: '总费用',
        dataIndex: 'totalfee',
        width: '120px'
      },
      {
        title: '报销金额',
        dataIndex: 'fundpay',
        width: '120px'
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorname',
        width: '120px'
      },
      {
        title: '就诊类型',
        dataIndex: 'visittype',
        width: '100px'
      },
      {
        title: '患者名称',
        dataIndex: 'name',
        width: '140px'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: '80px'
      },
      {
        title: '就诊日期',
        dataIndex: 'visitdate',
        width: '100px'
      },
      {
        title: '出院日期',
        dataIndex: 'leavedate',
        width: '100px'
      },
      {
        title: '年龄',
        dataIndex: 'yearage',
        width: '80px'
      },
      {
        title: '诊断',
        dataIndex: 'dis',
        width: '180px'
      },
      {
        title: '医院收费名称',
        dataIndex: 'hisItemname',
        width: '200px'
      },
      {
        title: '医保收费编码',
        dataIndex: 'itemcode',
        width: '150px'
      },
      {
        title: '医保收费名称',
        dataIndex: 'itemname',
        width: '200px'
      },
      {
        title: '收费等级',
        dataIndex: 'chargeattri',
        width: '80px'
      },
      {
        title: '单价',
        dataIndex: 'itemprice',
        width: '80px'
      },
      {
        title: '数量',
        dataIndex: 'amount',
        width: '80px'
      },
      {
        title: '金额',
        dataIndex: 'fee',
        width: '80px'
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        width: '120px'
      },
    ]
  },
}