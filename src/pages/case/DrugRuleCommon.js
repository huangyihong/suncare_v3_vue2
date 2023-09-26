export const drugLimitScope = [
  /*{
    switch: false,
    code: '01',
    field: 'age',
    name: '年龄',
    input: true,
    type: 'number',
    param: { min: 1, step: 1 }
  },
  { switch: false, code: '15', field: 'ageUnit', name: '年龄单位', dict: 'AGE_UNIT' },*/
  { switch: false, code: '01', field: 'age', name: '年龄', component:'AgeComp'},
  { switch: false, code: '02', field: 'sex', name: '性别', dict: 'GB/T2261.1' },
  { switch: false, code: '03', field: 'jzlx', name: '就医方式', dict: 'BM_JZBZ00',multi: true,separator:'|' },
  { switch: false, code: '04', field: 'yblx', name: '参保类型', oDict: 'medinsuranceType' },
  // { switch: false, code: '16', field: 'outHospPlan', name: '门诊统筹', dict: 'YESNO' },
  { switch: false, code: '13', field: 'indication', name: '适应症', kind: '5', multi: true, group: [''], },
  { switch: false, code: '31', field: 'unIndication', name: '禁忌症', kind: '5', multi: true, group: [''], },
  {
    switch: false,
    code: '12',
    field: 'twoLimitDrug',
    name: '二线用药',
    stdAtc: 'STD_ATC',
    multi: true,
    separator: '|'
    // group: [''],
  },
  { switch: false, code: '09', field: 'treatProject', name: '治疗项目', kind: '1', multi: true, group: [''], },
  { switch: false, code: '05', field: 'yyjb', name: '医院级别', dict: 'YYJB', multi: true, separator: '|' },
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', dict: 'SOLR_DATA_SOURCE', multi: true, separator: '|' },
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', input: true },
  // { switch: false, code: '30', field: 'ruleBasis', name: '政策依据', input: true },
  { switch: false, code: '14', field: 'treatDrug', name: '治疗用药', stdAtc: 'STD_ATC', multi: true, separator: '|', },
  { switch: false, code: '25', field: 'healthOrgKind', name: '卫生机构类别', oDict: 'Medical_Org_type' },
  // { switch: false, code: '08', field: 'yearDose', name: '年度用药剂量', input: true },
  // { switch: false, code: '14', field: 'treatDrug', name: '治疗用药', kind: '7', multi: true, group: [''], },
  {
    switch: false,
    code: '24',
    field: 'twoLimitDrug2',
    name: '合用不予支付药品',
    stdAtc: 'STD_ATC',
    multi: true,
    separator: '|'
    // group: [''],
  },
  { switch: false, code: '32', field: 'unExpense', name: '不能报销', component: 'YesOrNoTextComp', params:{text: '1'} },
  { switch: false, code: '33', field: 'drugUsage', name: '给药途径', oDict: 'usage', multi: true, separator: '|', },
  { switch: false, code: '34', field: 'unfitGroupCodes', name: '相互作用', stdAtc: 'STD_ATC', multi: true, separator: '|' },
  { switch: false, code: '06', field: 'office', name: '科室', oDict: 'Department', multi: true, separator: '|' },
  { switch: false, code: '17', field: 'dosageLimit', name: '用药量限制', input: true },
  { switch: false, code: '18', field: 'dosageUnit', name: '用药量单位', input: true },
  { switch: false, code: '19', field: 'takeTimeLimit', name: '用药时限', input: true },
  { switch: false, code: '20', field: 'timeUnit', name: '时间单位', dict: 'DRUG_TIME_UNIT' },
  { switch: false, code: '21', field: 'maxKeepUseTime', name: ' 最大持续使用时间', input: true },
  { switch: false, code: '22', field: 'maxKeepTimeUnit', name: '最大持续时间单位', dict: 'DRUG_TIME_UNIT' },
  { switch: false, code: '40', field: 'testResult', name: '检验结果', component: 'TestResult'},

  // { switch: false, code: '26', field: 'docAdvice', name: '医嘱信息', input: true },
]

export const chargeLimitScope = [
  { switch: false, code: '38', field: 'frequency', name: '数量/频次', component: 'FrequencyComp' },
  { switch: false, code: '27', field: 'fitGroupCodes', name: '合规项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '01', field: 'age', name: '年龄', component:'AgeComp'},
  { switch: false, code: '02', field: 'sex', name: '性别', dict: 'GB/T2261.1', },
  { switch: false, code: '03', field: 'jzlx', name: '就医方式', dict: 'BM_JZBZ00',multi: true,separator:'|' },
  { switch: false, code: '04', field: 'yblx', name: '参保类型', oDict: 'medinsuranceType', },
  { switch: false, code: '35', field: 'org', name: '医疗机构', component:'InputMedicalOrg', params:{multi:true,separator:'|'} },
  { switch: false, code: '06', field: 'office', name: '科室', oDict: 'Department', multi: true, separator: '|' },
  { switch: false, code: '37', field: 'payDuration', name: '支付时长', component: 'PayDuration'},
  // { switch: false, code: '38', field: 'count', name: '数量', component: 'CountComp'},
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', dict: 'SOLR_DATA_SOURCE', multi: true, separator: '|' },
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', input: true },
  // { switch: false, code: '30', field: 'ruleBasis', name: '政策依据', input: true },
  { switch: false, code: '28', field: 'unfitGroupCodes', name: '互斥项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '29', field: 'unfitGroupCodesDay', name: '一日互斥项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '13', field: 'indication', name: '适应症', kind: '5', multi: true, group: [''], },
  { switch: false, code: '31', field: 'unIndication', name: '禁忌症', kind: '5', multi: true, group: [''], },
  { switch: false, code: '32', field: 'unExpense', name: '不能报销', component: 'YesOrNoTextComp', params:{text: '1'} },
  { switch: false, code: '36', field: 'unCharge', name: '不能收费', component: 'YesOrNoTextComp', params:{text: '1'}},
  { switch: false, code: '39', field: 'diseasegroupFreq', name: '频率疾病组', component: 'DiseasegroupFreq'},

]
export const treatLimitScope = [
  { switch: false, code: '38', field: 'frequency', name: '数量/频次', component: 'FrequencyComp' },
  { switch: false, code: '27', field: 'fitGroupCodes', name: '合规项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '01', field: 'age', name: '年龄', component:'AgeComp'},
  { switch: false, code: '02', field: 'sex', name: '性别', dict: 'GB/T2261.1', },
  { switch: false, code: '03', field: 'jzlx', name: '就医方式', dict: 'BM_JZBZ00',multi: true,separator:'|' },
  { switch: false, code: '04', field: 'yblx', name: '参保类型', oDict: 'medinsuranceType', },
  { switch: false, code: '35', field: 'org', name: '医疗机构', component:'InputMedicalOrg', params:{multi:true,separator:'|'} },
  { switch: false, code: '06', field: 'office', name: '科室', oDict: 'Department', multi: true, separator: '|' },
  { switch: false, code: '37', field: 'payDuration', name: '支付时长', component: 'PayDuration'},
  // { switch: false, code: '38', field: 'count', name: '数量', component: 'CountComp'},
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', dict: 'SOLR_DATA_SOURCE', multi: true, separator: '|' },
  // { switch: false, code: '23', field: 'ruleSource', name: '规则来源', input: true },
  // { switch: false, code: '30', field: 'ruleBasis', name: '政策依据', input: true },
  { switch: false, code: '28', field: 'unfitGroupCodes', name: '互斥项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '29', field: 'unfitGroupCodesDay', name: '一日互斥项目组', kind: '1', multi: true, separator: '|' },
  { switch: false, code: '13', field: 'indication', name: '适应症', kind: '5', multi: true, group: [''], },
  { switch: false, code: '31', field: 'unIndication', name: '禁忌症', kind: '5', multi: true, group: [''], },
  { switch: false, code: '32', field: 'unExpense', name: '不能报销', component: 'YesOrNoTextComp', params:{text: '1'} },
  { switch: false, code: '36', field: 'unCharge', name: '不能收费', component: 'YesOrNoTextComp', params:{text: '1'}},
  { switch: false, code: '39', field: 'diseasegroupFreq', name: '频率疾病组', component: 'DiseasegroupFreq'},

]

export const druguseLimitScope = [
  { switch: false, field: 'diseaseGroups', name: '疾病组', group: [''], multi: true
    , component: 'InputMedicalDrugGroup', params: {kind: '5', multi: true, wholeValue: true}},
  { switch: false, field: 'treatGroups', name: '项目组', group: [''], multi: true
    , component: 'InputMedicalDrugGroup', params: {kind: '1', multi: true, wholeValue: true}},
  { switch: false, field: 'treatmentGroups', name: '化验结果', group: [''], multi: true
    , component: 'InputMedicalTreatProject', params: { multi: true, wholeValue: true}},
  ]
