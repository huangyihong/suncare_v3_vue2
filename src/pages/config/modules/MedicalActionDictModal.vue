<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="不合规行为编码">
            <a-input placeholder="请输入不合规行为编码" v-decorator="['actionId', validatorRules.required]" :readOnly="true"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="不合规行为名称">
            <a-input placeholder="请输入不合规行为名称" v-decorator="['actionName', validatorRules.required]" maxLength="100"
                     :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="不合规行为释义">
            <a-textarea placeholder="请输入不合规行为释义" v-decorator="['actionDesc', {}]"
                        :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="人工审核标准">
            <a-input placeholder="请输入人工审核标准" v-decorator="['auditStandard', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="规则级别">
            <a-select placeholder="请选择规则级别" v-decorator="['ruleLevel', validatorRules.required]" :readOnly="readonly">
              <a-select-option value="项目层级">项目层级</a-select-option>
              <a-select-option value="就诊层级">就诊层级</a-select-option>
              <a-select-option value="明细层级">明细层级</a-select-option>
              <a-select-option value="统计层级">统计层级</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="计算逻辑">
            <a-textarea placeholder="请输入计算逻辑" v-decorator="['calculate', {}]" :auto-size="{ minRows: 2, maxRows: 20 }"
                        :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="政策依据">
            <a-tag :closable="policyTitle != policySelectText" @close="clearPolicyDoc" color="#108ee9" style="height:32px;font-size: 14px;padding-top: 4px;"  @click="handClickPolicyTag">{{policyTitle}} </a-tag>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="现场查处需要资料">
            <a-input placeholder="请输入现场查处需要资料" v-decorator="['information', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="现场稽查查处方法">
            <a-input placeholder="请输入现场稽查查处方法" v-decorator="['method', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="违规说明模板">
            <a-button type="primary" @click="insertBreakStateTempl()">插入关联表字段</a-button>
            <a-dropdown class="m-l-6">
              <a-button>插入不合规行为字段</a-button>
              <a-menu slot="overlay">
                <template v-for="item in fields">
                  <a-menu-item @click="handleSelectOk({tableName: 'this', colName: item.code, colCnname: item.name})">
                    {{item.name}}
                  </a-menu-item>
                </template>

              </a-menu>
            </a-dropdown>
            <a-button type="primary" class="fr" @click="updateBreakStateData()">更新批次数据</a-button>
            <div contentEditable="true" ref="breakStateTempl" class="ant-input" style="height: auto"
                 @blur="getSelectRange">
            </div>
            <!--<a-textarea placeholder="请输入违规说明模板" v-decorator="['breakStateTempl', {}]" :readOnly="readonly"/>-->
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="落地难易度">
            <a-select placeholder="请选择落地难易度" v-decorator="['difficultyLevel', {}]" :readOnly="readonly">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="容易">容易</a-select-option>
              <a-select-option value="中等">中等</a-select-option>
              <a-select-option value="困难">困难</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="备注" style="height:30px">
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :auto-size="{ minRows: 2, maxRows: 20 }"
                        :readOnly="readonly"/>
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
        <a-col :md="24" :sm="24" style="margin-bottom: 30px"></a-col>

      </a-form>
    </a-spin>
    <span style="display: none" ref="hideTag" class="ant-tag"></span>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem">提交</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </div>
    <!--<field-select ref="fieldSelectRef" :uniqueVal="uniqueVal"></field-select>-->
    <m-modal
      centered
      title="选择字段"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="()=> selectVisible = false"
      cancelText="关闭">
      <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
      <task-action-field-col ref="selectRef" selectType="radio"></task-action-field-col>
    </m-modal>
    <medical-action-dict-break-state-save ref="breakStateSave"></medical-action-dict-break-state-save>


    <m-modal centered
             title="选择政策依据"
             width="80%"
             :visible="selectPolicyVisible"
             @ok="handlePolicySelecOk"
             @cancel="handlePolicySelectCancel"
             cancelText="关闭">
      <SelectPolicyModal ref="selectPolicyRef" :selected="selectData" selectType="radio"
                         :fixedParam="{ state: '1' }"></SelectPolicyModal>
    </m-modal>
    <MedicalPolicyShowPdfModal  ref="modalPdfForm" @ok="modalFormOk"></MedicalPolicyShowPdfModal>
  </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import ACol from 'ant-design-vue/es/grid/Col'
  import FieldSelect from '@/pages/probe/case/fieldSelect'
  import TaskActionFieldCol from '@/pages/selectMulti/TaskActionFieldCol'
  import MedicalActionDictBreakStateSave from '@/pages/config/modules/MedicalActionDictBreakStateSave'
  import MedicalPolicyShowPdfModal from '@/pages/config/modules/MedicalPolicyShowPdfModal'

  const SelectPolicyModal = () => import("@/pages/selectMulti/MedicalPolicySelect")

  export default {
    name: 'medicalActionDict',
    components: {
      ACol,
      FieldSelect,
      SelectPolicyModal,
      TaskActionFieldCol,
      MedicalActionDictBreakStateSave,
      MedicalPolicyShowPdfModal,
    },
    data() {
      this.fields = [
        { code: 'actionName', name: '不合规行为编码' },
        { code: 'actionDesc', name: '不合规行为释义' },
        { code: 'auditStandard', name: '人工审核标准' },
        { code: 'ruleLevel', name: '规则级别' },
        { code: 'calculate', name: '计算逻辑' },
        { code: 'policyBasis', name: '政策依据' },
        { code: 'information', name: '现场查处需要资料' },
        { code: 'method', name: '现场稽查查处方法' },
        { code: 'difficultyLevel', name: '落地难易度' },
        { code: 'remark', name: '备注' }
      ]
      this.uniqueVal = new Date().getTime()
      return {
        title: '操作',
        visible: false,
        model: {},
        policySelectText:'点击选择关联的政策...',
        policyTitle:'',
        selectPolicyVisible:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 19 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] }
        },
        url: {
          add: '/config/medicalActionDict/add',
          edit: '/config/medicalActionDict/edit',
          getMaxCode: '/config/medicalActionDict/getMaxCode'
        },
        userInfoBean: null,//登录用户信息
        selectVisible: false,
      }
    },
    beforeMount() {
      this.userInfoBean = this.userInfo()
    },
    methods: {
      ...mapGetters(['userInfo']),
      //清除当前选择的政策编号
      clearPolicyDoc(e){
        e.preventDefault();
        this.policyTitle=this.policySelectText;
        this.model.policyBasisCode='';
        this.model.policyBasis='';
      },
      //点击选择政策
      handClickPolicyTag(){
       //如果是请选择，则弹出政策框选择，否则显示政策详情
        if(this.policyTitle==this.policySelectText) {
          this.selectPolicyVisible = true;
        }else{
          //显示政策详情
          this.loadPocilyDetailInfo(this.model.policyBasisCode)
        }
      },
      loadPocilyDetailInfo(policyCode) {
        let params = {policyCode:policyCode}
        this.loading = true

        let getDeailURL = "/config/medicalPolicy/list"
        getAction(getDeailURL, params).then((res) => {
          if (res.success) {
            let dataSource = res.result.records

            //返回列表，取第一条
            if(dataSource && dataSource.length>0 ){
              this.$refs.modalPdfForm.showPdfDetail(dataSource[0])
              this.$refs.modalPdfForm.title = '详情'
              this.$refs.modalPdfForm.disableSubmit = true
              this.$refs.modalPdfForm.readonly = true
            }
            else{
              this.$message.error("查询不到该政策信息！")
            }

          } else {
            this.$message.warning(res.message)
          }
        }).catch(e => {
          console.error(e)
          this.$message.error("网络中断或超时")
        }).finally(() => {
          this.loading = false
        })
      },
      handlePolicySelecOk() {
        let selectData = this.$refs.selectPolicyRef.getSelect()
        if (selectData.length > 0) {
          let policyInfo = selectData[0]
          if(policyInfo.policyCode && policyInfo.policyCode.length >0){


            this.model.policyBasisCode=policyInfo.policyCode;
            this.model.policyName=policyInfo.policyName;

            //显示标题
            this.showPolicyTitle(policyInfo.policyCode ,policyInfo.policyName)
          }
        }

        this.selectPolicyVisible = false;
      },
      handlePolicySelectCancel(){
        this.selectPolicyVisible = false;
      },
      //设置新增字段信息
      setCreatField(record) {
        record.createStaffName = this.userInfoBean.realname
        record.createStaff = this.userInfoBean.id
        record.createTime = new Date()
        return record
      },
      //系统自动生成不合规行为编码
      getMaxCode() {
        getAction(this.url.getMaxCode, {}, 'get').then((data) => {
          if (data.success) {
            this.model.actionId = data.result
            this.form.setFieldsValue(pick(this.model, 'actionId'))
          } else {
            this.$message.warning(data.message)
          }
        })
      },
      add(record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.id
          delete newRecord.updateStaffName
          delete newRecord.updateStaff
          delete newRecord.updateTime
        } else {
          newRecord = {}
        }
        newRecord = this.setCreatField(newRecord)
        this.edit(newRecord)
      },
      edit(record) {
        this.form.resetFields()
        let model = this.model = Object.assign({}, record)
        if (!this.model.id) {
          this.getMaxCode()
        }

        this.showPolicyTitle(this.model.policyBasisCode,this.model.policyBasis );

        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'actionId', 'actionName', 'actionDesc', 'auditStandard', 'ruleLevel', 'calculate',
             'information', 'method', 'difficultyLevel', 'remark', 'createStaffName', 'updateStaffName'))
          //时间格式化
          this.form.setFieldsValue({ createTime: this.model.createTime ? moment(this.model.createTime).format('YYYY-MM-DD HH:mm:ss') : null })
          this.form.setFieldsValue({ updateTime: this.model.updateTime ? moment(this.model.updateTime).format('YYYY-MM-DD HH:mm:ss') : null })
          this.setBreakStateTempl(model.breakStateTempl)
        })
      },
      //根据政策编号和标题显示内容
      showPolicyTitle(policyCode ,policyName){
        //计算政策依据标题
        if(policyName && policyName !=''){
          this.policyTitle =policyCode + "|" +policyName;

          if(this.policyTitle.length>35){
            this.policyTitle = this.policyTitle.substring(0,35) + "..."
          }
        }else{
          this.policyTitle = this.policySelectText;
        }
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        this.validateField().then(formData => {
          if (formData.breakStateTempl !== this.model.breakStateTempl) {
            this.showBreakStateTemplConfirm(formData, () => {
              this.saveData(formData)
            })
            return
          }
          this.saveData(formData)
        })
      },
      // 触发表单验证
      validateField(){
        return new Promise((resolve, reject) => {
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let formData = Object.assign({}, this.model, values)
              let breakStateTempl = this.getBreakStateTempl()
              if (breakStateTempl && breakStateTempl.length > 0) {
                formData.breakStateTempl = breakStateTempl
              }
              resolve(formData)
            } else {
              reject(err)
            }
          })
        })

      },
      saveData(formData) {
        formData.policyBasisCode = this.model.policyBasisCode;
        formData.policyBasis = this.model.policyBasis;

        let httpurl = ''
        let method = ''
        if (!this.model.id) {
          httpurl += this.url.add
          method = 'post'
        } else {
          httpurl += this.url.edit
          method = 'put'
        }
        delete formData.createStaff
        delete formData.createStaffName
        delete formData.createTime
        delete formData.updateStaff
        delete formData.updateStaffName
        delete formData.updateTime
        this.confirmLoading = true
        httpAction(httpurl, formData, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      handleCancel() {
        this.close()
      },
      // 手动触发更新违规说明数据
      updateBreakStateData(){
        this.validateField().then(formData => {
          if(formData.breakStateTempl.length === 0){
            this.$message.warn('违规说明模板为空')
            return
          }
          this.$refs.breakStateSave.handler(formData)
        })
      },
      // 获取光标位置
      getSelectRange() {
        this.range = window.getSelection().getRangeAt(0)
      },
      // 选完字段回调
      handleSelectOk(col) {
        if (!col) {
          this.selectVisible = false
          let selectData = this.$refs.selectRef.getSelect()
          if (selectData.length === 0) {
            return
          }
          col = selectData[0]
        }
        let value = col.colCnname
        let elm = document.createElement('input')

        elm.setAttribute('class', `ant-tag m-l-6 m-r-6${col.tableName !== 'this' ? ' blue-tag' : ''}`)
        elm.setAttribute('value', value)
        elm.setAttribute('code', JSON.stringify({ tableName: col.tableName, colName: col.colName, colCnname: value }))
        elm.setAttribute('title', `${col.tableName}.${col.colName}`)
        elm.setAttribute('readOnly', 'readOnly')
        elm.style.width = this.inputResize(value) + 'px'

        this.insertIntoFocus(elm)
      },
      // 打开字段选择
      insertBreakStateTempl(item) {
        this.selectVisible = true

        /*this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          callback: col => {
            console.log('col', col)
            let value = col.colChnName
            let elm = document.createElement('input')

            elm.setAttribute("class", "ant-tag m-l-6 m-r-6")
            elm.setAttribute('value', value)
            elm.setAttribute('code', JSON.stringify({tableName: col.tabName,colName:col.colName, colChnName: value}))
            elm.setAttribute('title', `${col.tabName}.${col.colName}`)
            elm.setAttribute('readOnly', 'readOnly')
            elm.style.width = this.inputResize(value)+ 'px';
            // col.colChnName
            console.dir(elm)

            this.insertIntoFocus(elm)
            console.log('children',this.$refs.breakStateTempl.childNodes)
          },
        })*/
      },
      // 插入选择的字段到编辑框光标位置
      insertIntoFocus(elm) {
        let selection = window.getSelection()
        // console.log('selection',selection)
        if (!this.range) {
          const breakStateTemplElem = this.$refs.breakStateTempl
          breakStateTemplElem.focus()
          if (document.selection) {
            let sel = document.selection.createRange()
            sel.moveStart('character', breakStateTemplElem.innerText.length)
            sel.collapse()
            sel.select()
          } else {                                                 /* IE11 特殊处理 */
            let sel = window.getSelection()
            let range = document.createRange()
            range.selectNodeContents(breakStateTemplElem)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
          }
          this.range = selection.getRangeAt(0)// 找到焦点位置
        }
        // 插入Img节点
        this.range.insertNode(elm)
        this.range.setStartAfter(elm)
        selection.removeAllRanges()
        selection.addRange(this.range)
      },
      inputResize(html) {
        this.$refs.hideTag.style = ''
        this.$refs.hideTag.innerHTML = html
        let width = this.$refs.hideTag.getBoundingClientRect().width.toFixed(4)
        this.$refs.hideTag.style = 'display:none'
        return width
      },
      // 违规说明模板保存的内容
      getBreakStateTempl() {
        let children = this.$refs.breakStateTempl.childNodes
        console.log('children', children)
        if (!children) {
          return
        }
        let items = Array.from(children).map(r => {
          if (r.nodeName === 'INPUT') {
            return r.getAttribute('code')
          } else {
            return r.data
          }
        }).filter(r => r && r.length > 0)
        console.log('breakStateTemplSaveConstruct', items)
        return items.join('##').trim()
      },
      setBreakStateTempl(str) {
        if (!str || str.length === 0) {
          this.$refs.breakStateTempl.innerHTML = ''
          return ''
        }
        let html = str.split('##').map(r => {
          if (r.startsWith('{') && r.endsWith('}')) {
            try {
              let col = JSON.parse(r)
              let value = col.colCnname
              return `<input class="ant-tag m-l-6 m-r-6${col.tableName !== 'this' ? ' blue-tag' : ''}" readOnly="readOnly" value='${value}' code = '${r}' title="${col.tableName}.${col.colName}"
                style="width:${this.inputResize(value)}px;"/>`
            } catch (e) {
            }
          }
          return r
        }).join('')
        this.$refs.breakStateTempl.innerHTML = html
        return html
      },
      // 编辑了模板询问是否更新违规说明数据
      showBreakStateTemplConfirm(data, callback) {
        callback()
        /*this.$confirm({
          title: '违规说明模板更改',
          content: h => <div style="color:red;">是否更新项目批次违规说明数据</div>,
          onOk: () => {
            this.$refs.breakStateSave.handler(data).then(res => {
              callback()
            })
          },
          onCancel: () => {
            callback()
          },
          class: 'test'
        })*/
      }
    }
  }
</script>
<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>