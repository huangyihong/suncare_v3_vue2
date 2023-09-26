import { getAction,deleteAction,putAction,postAction} from '@/api-sv3/manage'

import { postAction as postAction_o,putAction as putAction_o} from '@/api/manage'



const queryDistinctDictByKinds = (params)=>getAction("/config/medicalDict/queryDistinctDictByKinds",params);

// 查询子项无关联
const queryDictItemsByCode = (params)=>getAction("/config/medicalDict/common/queryByType",params);
// 关联组查询子项
const queryItemsByGroup = (params)=>getAction("/config/medicalDict/queryItemsByGroup",params);
// 根据id获取字典项
const queryDictById = (params)=>getAction("/config/medicalDict/queryById",params);


// 临床路径
const queryClinicalById = (params)=>getAction("/medical/medicalClinical/queryById",params);
const queryClinicalInfoById = (params)=>getAction("/medical/medicalClinicalInfo/queryById",params);
const queryRangeGroupByClinicalId = (params)=>getAction("/medical/medicalClinicalRangeGroup/queryByClinicalId",params);
const queryAccessGroupByClinicalId = (params)=>getAction("/medical/medicalClinicalAccessGroup/queryByClinicalId",params);

const queryRangeGroupAndItemByClinicalId = (params)=>getAction("/medical/medicalClinicalRangeGroup/queryGroupAndItemByClinicalId",params);

// 就诊记录包含的DETAIL项目
// const queryChargeItemByVisitId = (params)=>getAction("/review/queryChargeItemByVisitId",params);

// 项目涉及的就诊记录数
// const queryVisitCountByChargeItemCodes = (params)=>getAction("/review/queryVisitCountByChargeItemCodes",params);

// 就诊记录信息
// const queryDwbMasterInfoByVisitid = (params)=>getAction("/review/queryDwbMasterInfoByVisitid",params);

// 保存solr 结果表信息
const saveReviews = (params)=>putAction_o("/review/saveReviews",params);

const updateUnreasonableById = (params)=>putAction_o("/review/updateById",params);

export {
  queryDistinctDictByKinds,
  queryDictItemsByCode,
  queryDictById,
  queryItemsByGroup,
  queryClinicalById,
  queryClinicalInfoById,
  queryRangeGroupByClinicalId,
  queryAccessGroupByClinicalId,
  queryRangeGroupAndItemByClinicalId,
  // queryChargeItemByVisitId,
  // queryVisitCountByChargeItemCodes,
  // queryDwbMasterInfoByVisitid,
  saveReviews,
  updateUnreasonableById
}



