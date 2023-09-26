import { getAction,deleteAction,putAction,postAction} from '@/api/manage'
import {putAction as putAction_sv3,postAction as postAction_sv3} from '@/api-sv3/manage'

const getRandomuser = (params)=>getAction("https://randomuser.me/api",params);

// 探查流程操作
const getProbeCaseCode = ()=>getAction("/probe/medicalProbeCase/getProbeCaseCode");
const addProbeCase = (params)=>postAction("/probe/medicalProbeCase/addProbeCase",params);
const updateProbeCase = (params)=>postAction("/probe/medicalProbeCase/updateProbeCase",params);
const getProbeCaseById = (params)=>getAction("/probe/medicalProbeCase/getProbeCaseById",params);
const getProbeCaseByIds = (params)=>getAction("/probe/medicalProbeCase/getProbeCaseByIds",params);
const setProbeCaseSubmit = (params)=>getAction("/probe/medicalProbeCase/setProbeCaseSubmit",params);
const setProbeCaseReject = (params)=>getAction("/probe/medicalProbeCase/setProbeCaseReject",params);
// 试算
// const engineTrail = (params)=>postAction("/engine/trail",params);
// const engineTrailEchart = (params)=>postAction("/engine/trail/echart",params);
// const engineCompare = (params)=>postAction("/engine/trail/compare",params);
// const engineCompareEchart = (params)=>postAction("/engine/trail/compare/echart",params);


// 获取医疗字段和字段类型字典
const getRuleColConfig = (params)=>getAction("/config/medicalColConfig/getRuleColConfig",params);

const getRuleColConfigByTable = (params)=>getAction("/config/medicalColConfig/getRuleColConfigByTable",params);

const updateDisplayCol = (params)=>postAction_sv3("/config/medicalColConfig/updateDisplayCol",params);
// 打分字段列表
const getGradeColConfig = (params)=>getAction("/config/medicalColConfig/getGradeColConfig",params);
// 统计（分组）字段列表
const getGroupByColConfig = (params)=>getAction("/config/medicalColConfig/getGroupByColConfig",params);

const queryColConfigById = (params)=>getAction("/config/medicalColConfig/queryById",params);

const saveFormalCase = (params)=>postAction("/formal/medicalFormalCase/saveFormalCase",params);
const setFormalCaseSubmit = (params)=>getAction("/formal/medicalFormalCase/setFormalCaseSubmit",params);
const getFormalCaseById = (params)=>getAction("/formal/medicalFormalCase/getFormalCaseById",params);
const getFormalCaseGrade = (params)=>getAction("/formal/medicalFormalFlowRuleGrade/queryByCaseId",params);

const getHisFormalCaseById = (params)=>getAction("/his/hisMedicalFormalCase/getHisFormalCaseById",params);
const getHisFormalCaseGrade = (params)=>getAction("/his/hisFormalFlowRuleGrade/queryByCaseId",params);
const getHisFormalCaseByVersion = (params)=>getAction("/his/hisMedicalFormalCase/getHisFormalCaseByVersion",params);

// 节点模板

const queryFlowTemplRulesById = (params)=>getAction("/probe/medicalFlowTempl/queryRulesById",params);
const queryFlowTemplRulesByIds = (params)=>getAction("/probe/medicalFlowTempl/queryRulesByIds",params);
const queryFlowTemplById = (params)=>getAction("/probe/medicalFlowTempl/queryById",params);


export {
  getProbeCaseCode,
  getRandomuser,
  addProbeCase,
  updateProbeCase,
  getProbeCaseById,
  getProbeCaseByIds,
  setProbeCaseSubmit,
  setProbeCaseReject,
  getRuleColConfig,
  updateDisplayCol,
  getGradeColConfig,
  getGroupByColConfig,
  queryColConfigById,
  saveFormalCase,
  setFormalCaseSubmit,
  getFormalCaseById,
  getFormalCaseGrade,
  // engineTrail,
  // engineTrailEchart,
  // engineCompare,
  // engineCompareEchart,
  getHisFormalCaseById,
  getHisFormalCaseGrade,
  getHisFormalCaseByVersion,
  queryFlowTemplRulesById,
  queryFlowTemplRulesByIds,
}



