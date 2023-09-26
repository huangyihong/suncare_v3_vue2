<template>
  <a-drawer
    :title="title"
    :width="900"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <h3 id="itemInfo">关联{{labelName}}</h3>
        <div class="fieldset-box box-padding">
          <a-form-item extra="拖动项目更改排列顺序">
            <a-row :gutter="24">
              <a-col :span="24">
                <template v-for="(item,index) in selectInfo.tableTypeArr">
                  <a-button  type="primary" @click="openSelect(item.tableType)" style="margin-right:10px">{{item.title}}选择({{item.tableType |getNum(selectData)}}个)</a-button>
                </template>
                <span style="color:#1890ff;margin-left:10px">共关联{{selectData.length}}个</span>
              </a-col>
              <a-col :span="24">

                <a-row class="title">
                  <a-col :span="10">代码</a-col>
                  <a-col :span="10">名称</a-col>
                  <a-col :span="4">操作</a-col>
                </a-row>

                <draggable :options="{animation: 300}" v-model="selectData">
                  <a-row v-for="(item,index) in selectData" :key="item.key" :gutter="8" class="list-item">
                    <a-col :span="10">{{item.code}}</a-col>
                    <a-col :span="10">{{item.name}}</a-col>
                    <a-col :span="4">
                      <a @click="() => rowDel(index)">移除</a>
                    </a-col>
                  </a-row>
                </draggable>
              </a-col>
            </a-row>
          </a-form-item>
        </div>


        <h3 id="baseInfo">说明书内容</h3>

        <div >

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="说明书编码">
              <a-input placeholder="请输入说明书编码" v-decorator="['code', validatorRules.required]" :readOnly="!!model.id"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="说明书修订日期">
              <a-date-picker v-decorator="['revisionDate', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="商品名">
              <a-input placeholder="请输入商品名" v-decorator="['tradeName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="说明书名称">
              <a-input placeholder="请输入说明书名称" v-decorator="['name', validatorRules.required]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="英文名">
              <a-input placeholder="请输入英文名" v-decorator="['ename', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="汉语拼音">
              <a-input placeholder="请输入汉语拼音" v-decorator="['cname', {}]"/>
            </a-form-item>
          </a-col>
          <template v-if="model.kind=='2'">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品性能结构及组成">
                <a-input placeholder="请输入产品性能结构及组成" v-decorator="['ingredient', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规格">
                <a-input placeholder="请输入规格" v-decorator="['specificaion', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="适用范围">
                <a-input placeholder="请输入适用范围" v-decorator="['applicationRange', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="使用说明">
                <a-input placeholder="请输入使用说明" v-decorator="['instructions', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="禁忌">
                <a-input placeholder="请输入禁忌" v-decorator="['taboo', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="注意事项">
                <a-input placeholder="请输入注意事项" v-decorator="['attention', {}]"/>
              </a-form-item>
            </a-col>
          </template>
          <template v-else>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品成分">
                <a-input placeholder="请输入药品成分" v-decorator="['ingredient', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="性状">
                <a-input placeholder="请输入性状" v-decorator="['character', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规格">
                <a-input placeholder="请输入规格" v-decorator="['specificaion', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="适应症">
                <a-input placeholder="请输入适应症" v-decorator="['indication', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="用法用量">
                <a-input placeholder="请输入用法用量" v-decorator="['usage', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="禁忌">
                <a-input placeholder="请输入禁忌" v-decorator="['taboo', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="不良反应">
                <a-input placeholder="请输入不良反应" v-decorator="['adverseReaction', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="注意事项">
                <a-input placeholder="请输入注意事项" v-decorator="['attention', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="儿童用药">
                <a-input placeholder="请输入儿童用药" v-decorator="['childrenDrug', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="孕妇及哺乳期妇女用药">
                <a-input placeholder="请输入孕妇及哺乳期妇女用药" v-decorator="['pregnantDrug', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="老年用药">
                <a-input placeholder="请输入老年用药" v-decorator="['olderDrug', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药物相互作用">
                <a-input placeholder="请输入药物相互作用" v-decorator="['drugInteraction', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药物过量">
                <a-input placeholder="请输入药物过量" v-decorator="['drugOverdose', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药理毒理">
                <a-input placeholder="请输入药理毒理" v-decorator="['toxicology', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药代动力学">
                <a-input placeholder="请输入药代动力学" v-decorator="['dynamics', {}]"/>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="贮藏">
              <a-input placeholder="请输入贮藏" v-decorator="['storage', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="执行标准">
              <a-input placeholder="请输入执行标准" v-decorator="['standard', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="包装">
              <a-input placeholder="请输入包装" v-decorator="['packaging', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="批准文号">
              <a-input placeholder="请输入批准文号" v-decorator="['approveNumber', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="生产企业名称">
              <a-input placeholder="请输入生产企业名称" v-decorator="['enterprise', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="生产地址">
              <a-input placeholder="请输入生产地址" v-decorator="['productionAddress', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item id="filenames"
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2"
                         label="说明书附件">
              <j-upload :disabled="readonly" v-decorator="['filenames', {}]" bizPath="medicalInstruction"></j-upload>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="说明书来源">
              <a-input placeholder="请输入说明书来源" v-decorator="['source', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="备注">
              <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item style="margin-bottom: 0"
                         :labelCol="labelCol2"
                         :wrapperCol="wrapperCol2"
                         label="停用标识">
              <a-switch :checked="model.isStopUsed==='1'" @change="val=>model.isStopUsed=val?'1':'0'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="新增人">
              <a-input placeholder="请输入新增人" v-decorator="['createStaffName', {}]" readOnly/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="新增时间">
              <a-input placeholder="请输入新增时间" v-decorator="['createTime', {}]" readOnly/>
            </a-form-item>
          </a-col>
          <template v-if="model.id">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="修改人">
                <a-input placeholder="请输入修改人" v-decorator="['updateStaffName', {}]" readOnly/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="修改时间">
                <a-input placeholder="请输入修改时间" v-decorator="['updateTime', {}]" readOnly/>
              </a-form-item>
            </a-col>
          </template>
        </div>
      </a-form>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
    <m-modal centered
      :title="'选择'+selectInfo.title"
      :width="'85%'"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="selectVisible=false"
      cancelText="关闭">
      <component :is="selectInfo.component" ref="selectRef" v-bind="selectInfo.params||{}"
                 :selected="openSelectData" :fixedParam="selectInfo.fixedParam"></component>
    </m-modal>
  </a-drawer>
</template>


<script>
  import { postAction, putAction, getAction } from '@/api-sv3/manage'

  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import MedicalEquipment from "@/pages/selectMulti/MedicalEquipment"
  import MedicalStdAtc from "@/pages/selectMulti/MedicalStdAtc"
  import draggable from 'vuedraggable'
  import { mapGetters } from 'vuex'
  import ACol from "ant-design-vue/es/grid/Col";
  import JUpload from '@/components/jeecg/JUpload'

  export default {
    name: "MedicalInstructionModal",
    components: {
      ACol,
      MedicalDrug,
      MedicalEquipment,
      MedicalStdAtc,
      draggable,
      JUpload
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        wrapperCollHalf2: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {},
        selectData: [],
        openSelectData:[],
        selectInfos: {
          '1': { title: '药品说明书', component: 'MedicalDrugInstruction', tableNameUrl:'medicalDrugInstruction',labelName:'药品',
            tableTypeArr:[
              {tableType:'STD_ATC',title:'STD_ATC',component: 'MedicalStdAtc',num:0,fixedParam:{ state: '1' }},
              {tableType:'STD_DRUG_INFO',title:'STD_DRUG_INFO',component: 'MedicalDrug',num:0,fixedParam:{ state: '1' }},
            ]
          },
          '2': { title: '器械说明书', component: 'MedicalEquipInstruction', tableNameUrl:'medicalEquipInstruction',labelName:'医疗器械',
            tableTypeArr:[
              {tableType:'STD_MEDICAL_EQUIPMENT',title:'STD_MEDICAL_EQUIPMENT',component: 'MedicalEquipment',num:0,fixedParam:{ state: '1' }},
            ]
          },
        },
        selectInfo: {},
        selectVisible: false,
        tableNameUrl:'medicalDrugInstruction',
        labelName:'药品说明书',
        userInfoBean: null,//登录用户信息
        tableType:'',
      }
    },
    beforeMount() {
      this.userInfoBean = this.userInfo()
    },
    methods: {
      ...mapGetters(["userInfo"]),
      openSelect(tableType) {
        this.tableType = tableType
        let tableTypeInfo = this.selectInfo.tableTypeArr.filter(item => item.tableType==tableType)
        if(tableTypeInfo.length>0){
          this.selectInfo.component = tableTypeInfo[0].component
          this.selectInfo.title = tableTypeInfo[0].title
          this.selectInfo.fixedParam = tableTypeInfo[0].fixedParam
        }
        this.openSelectData = this.selectData.filter(item => item.tableType==tableType).map(item => {
          if(this.tableType=='STD_MEDICAL_EQUIPMENT'){
            item.productcode = item.code
            item.productname = item.name
          }
          return item
        })
        this.selectVisible = true
      },
      kindChange(kind) {
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.selectInfo = info

          }
        }
        this.selectData = []
      },
      kindChangeUrl(kind){
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.tableNameUrl = info.tableNameUrl
            this.labelName = info.labelName
            this.url = {
              add: `/config/${this.tableNameUrl}/add`,
              edit: `/config/${this.tableNameUrl}/edit`,
              listAll: `/config/${this.tableNameUrl}Item/listAll`,
              isExistName: `/config/${this.tableNameUrl}/isExistName`,
            }
          }
        }
      },
      handleSelectOk() {
        this.selectData = this.selectData.filter(item => item.tableType!=this.tableType)
        this.openSelectData = this.$refs.selectRef.getSelect().map(item => {
          item.tableType = this.tableType
          if(this.tableType=='STD_MEDICAL_EQUIPMENT'){
            item.code = item.productcode
            item.name = item.productname
          }
          console.dir(item)
          return item
        })
        this.selectData = [...this.selectData,...this.openSelectData]
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.beforSetEdit();
        this.visible = true;
        this.kindChangeUrl(this.model.kind);
        this.loadItemData(this.model.id)
        this.$nextTick(() => {
          if(this.model.kind =='2'){
            this.form.setFieldsValue(pick(this.model, 'code','revisionDate','name','tradeName','ename','cname','ingredient','specificaion',
              'applicationRange','instructions','taboo','attention','storage','packaging','standard','approveNumber','enterprise',
              'productionAddress','filenames','source','remark','isStopUsed','createStaff','createStaffName','updateStaff','updateStaffName'))
          } else{
            this.form.setFieldsValue(pick(this.model, 'code','name','revisionDate','tradeName','ename','cname','ingredient','character',
              'specificaion','indication','usage','taboo','adverseReaction','attention','pregnantDrug','childrenDrug','olderDrug',
              'drugInteraction','drugOverdose','toxicology','dynamics','storage','packaging','standard','approveNumber','enterprise',
              'productionAddress','filenames','source','remark','isStopUsed','createStaff','createStaffName','updateStaff','updateStaffName'))
          }

          //时间格式化
          this.form.setFieldsValue({revisionDate: this.model.revisionDate ? moment(this.model.revisionDate) : null })
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.kindChange(this.model.kind)
        });

      },
      loadItemData(parentId) {
        if (!parentId || parentId.length === 0)
          return
        this.confirmLoading = true
        getAction(this.url.listAll,{ parentId: parentId }).then(res => {
          if (res.success) {
            this.selectData = res.result.map((item, index) => {
              return { code: item.itemCode, name: item.itemValue, key: index + '',tableType:item.tableType }
            })
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let httpAction;
            if (!this.model.id) {
              httpurl += this.url.add;
              httpAction = postAction
            } else {
              httpurl += this.url.edit;
              httpAction = putAction
            }
            let formData = Object.assign(this.model, values);
            formData.revisionDate = formData.revisionDate ? formData.revisionDate.format("YYYY-MM-DD") : null;
            // 选择项
            // this.selectData = this.selectData.filter(item => !item.editable)
            // this.selectData = this.selectData.filter(item => !!item.code && !!item.name)
            if (this.selectData.length > 0) {
              formData.itemCodes = this.selectData.map(item => item.code).join(",")
              formData.itemNames = this.selectData.map(item => item.name).join(",")
              formData.tableTypes = this.selectData.map(item => item.tableType).join(",")
            }
            formData.code = formData.code.trim()
            formData.name = formData.name.trim()
            delete formData.createStaff
            delete formData.createStaffName
            delete formData.createTime
            delete formData.updateStaff
            delete formData.updateStaffName
            delete formData.updateTime

            let param = {};
            param.code = that.form.getFieldValue('code').trim();
            param.id = that.model.id;
            getAction(this.url.isExistName,param,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.confirmLoading = false;
                  that.$message.warning('说明书编码已存在，请重新输入');
                }else{
                  httpAction(httpurl, formData).then((res) => {
                    if (res.success) {
                      that.$message.success(res.message);
                      that.$emit('ok');
                    } else {
                      that.$message.warning(res.message);
                    }
                  }).finally(() => {
                    that.confirmLoading = false;
                    that.close();
                  })
                }
              }else{
                that.$message.warning(data.message);
              }
            })

          }
        })
      },
      handleCancel() {
        this.close()
      },
      rowDel(index) {
        this.selectData.splice(index, 1)
      },
      //设置新增字段信息
      setCreatField(){
        this.model.createStaffName = this.userInfoBean.realname;
        this.model.createStaff = this.userInfoBean.id;
        this.model.createTime = new Date();
      },
      //修改赋值之前设值
      beforSetEdit(){
        if (!this.model.id) {
          this.setCreatField();
        }
      },
    },
    filters: {
      getNum: function (tableType,selectData) {
        return selectData.filter(item => item.tableType==tableType).length
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

  .list-item {
    /*border-bottom: 1px solid #e8e8e8;*/
  }
</style>