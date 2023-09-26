import { getAction,deleteAction,putAction,postAction} from '@/api-sv3/manage'
import { postAction as postAction_o} from '@/api/manage'


// const uploadFile = (params)=>postAction_o("/system/sysFile/upload",params);
// const showImg = (id) => config.baseUrl + "/system/sysFile/showImg?id=" + id;
// 医疗字典
const querySysDictByType = (params)=>getAction("/config/medicalDict/common/queryByType",params);
const querySysDictByTypes = (params)=>getAction("/config/medicalDict/common/queryByTypes",params);
const queryValByTypeKey = (params)=>getAction("/config/medicalDict/common/queryValByTypeKey",params);

const queryBatchAndProjectById = (params)=>getAction("/task/taskProjectBatch/queryBatchAndProjectById",params);
const queryBatchByProjectId = (params)=>getAction("/task/taskProjectBatch/queryByProjectId",params);
const queryBatchPushedByProjectId = (params)=>getAction("/task/taskProjectBatch/queryPushedByProjectId",params);


// 批次规则关联列表
const queryBatchRuleByType = (params)=>getAction("/task/taskBatchBreakRule/listByType",params);

// 判断规则是否存在于最新的配置 param:{ruleIds, type}
const queryBatchRuleInFormalByType = (params)=>postAction("/task/taskBatchBreakRule/listInFormalByType",params);

// 任务批次关联列表
const taskProjectBatchList = (params)=>getAction("/task/taskProjectBatch/list",params);

// 获取所有项目批次
const getAllProjectAndBatch = (params)=>getAction("/task/taskProjectBatch/getAllProjectAndBatch",params);
// 批次执行
// const taskProjectBatchExec = (params)=>postAction("/task/taskProjectBatch/execBatch",params);
// const taskProjectBatchExecCase = (params)=>postAction("/task/taskProjectBatch/execCase",params);
// const taskProjectBatchExecReRun = (params)=>postAction("/task/taskProjectBatch/execReRun",params);
// 进度+1,传batchId
const taskProjectBatchNextStep = (params)=>postAction("/task/taskProjectBatch/nextStep",params);
// 进度-1,传batchId
const taskProjectBatchLastStep = (params)=>postAction("/task/taskProjectBatch/lastStep",params);
// 跳到第三步骤
const taskProjectBatch3rdStep = (params)=>postAction("/task/taskProjectBatch/to3rdStep",params);
// 获取不合规行为列表用于表头
const listBreakBehaviorForCol = (params)=>getAction("/formal/medicalFormalBehavior/listForCol",params);
const queryClientsByProject = (params)=>getAction("/task/taskProjectClient/queryClientsByProject",params);

const queryProjectSelf = (params)=>getAction("/task/taskProjectClient/queryProjectSelf",params);

const queryStepItemByBatchStep = (params)=>getAction("/task/taskBatchStepItem/queryByBatchStep",params);

// 查询业务组关联的模型信息
const querySimpleCaseByBusiId = (params)=>getAction("/formal/medicalFormalCase/querySimpleByBusiId",params);
const querySimpleHisCaseByBusiId = (params)=>getAction("/his/hisMedicalFormalCase/querySimpleByBusiId",params);
// 库表字段
const queryEntityColByTable = (params)=>getAction("/config/medicalColConfig/queryEntityColByTable",params);
// 查询符合条件的不合规行为字段配置
const listAllActionFieldConfig = (params)=>getAction("/task/taskActionFieldConfig/listAll",params);
const queryDatasourceBySystemCode = (params)=>getAction("/projectSource/queryBySystemCode",params);


export {
  // uploadFile,
  // showImg,
  querySysDictByType,
  querySysDictByTypes,
  queryValByTypeKey,
  queryBatchAndProjectById,
  queryBatchByProjectId,
  queryBatchPushedByProjectId,
  queryBatchRuleByType,
  queryBatchRuleInFormalByType,
  taskProjectBatchList,
  getAllProjectAndBatch,
  // taskProjectBatchExec,
  // taskProjectBatchExecReRun,
  // taskProjectBatchExecCase,
  taskProjectBatchNextStep,
  taskProjectBatch3rdStep,
  taskProjectBatchLastStep,
  listBreakBehaviorForCol,
  queryClientsByProject,
  queryProjectSelf,
  queryStepItemByBatchStep,
  querySimpleCaseByBusiId,
  querySimpleHisCaseByBusiId,
  queryEntityColByTable,
  listAllActionFieldConfig,
  queryDatasourceBySystemCode,
}



