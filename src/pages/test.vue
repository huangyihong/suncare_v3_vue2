<template>
    <div >
      <div style="position: fixed;top:0;right: 0;bottom: 0;left: 0;z-index: 1" v-show="menuVisible" @click="menuVisible=false">
        <ul class="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-root ant-dropdown-menu-light ant-dropdown-content"
            :style="{left: menuX + 'px', top: menuY + 'px'}"
            style="position: absolute">
          <li class="ant-dropdown-menu-item" @click="update">
            <a>修改</a></li>
          <li class="ant-dropdown-menu-item" @click="remove">
            <a>删除</a>
          </li>
        </ul>
      </div>

      <div ref="annotator" class="annotator"></div>

      <m-modal
        :title="'选择' + (selectType === 'label'?'标签': '连接注解')"
        :visible="selectVisible"
        :width="500"
        @ok="handleSelectOk"
        @cancel="handleSelectClose"
        class="modal-mini">

          <template v-if="selectType === 'label' && !focusId">
            <div class="t-c m-b-15 bg-color-gray-eee" style="padding: 5px;white-space: pre-line;">“{{jsonData.content.substring(...focusArgs)}}”</div>
          </template>
          <a-radio-group v-model="selectValue">
            <a-row :gutter="12">
            <template v-for="item in selectType === 'label'?noteLabel:noteConnect">
              <a-col :sm="8" :xs="12">
                <a-radio :value="item.code">
                  {{item.value}}
                </a-radio>
              </a-col>

            </template>
            </a-row>
          </a-radio-group>

      </m-modal>
    </div>
</template>

<script>
  import {Annotator,Action} from 'poplar-annotation'
  export default {
    name: 'test',
    components: {},
    data() {
      let colors = ['#eac0a2', '#619dff', '#9d61ff', '#ff9d61,',
      '#EEDDB1', '#92E4A6', '#A0DFFE', '#FEBD59', '#70D3B4', '#FF4B68', '#FAFFA3', '#61BCB7', '#D769C0']
      this.labelColors = colors.map(r => {
        console.log(r, r.toString(16))
        return {
          color: r,
          borderColor: '#' + (parseInt(r.substring(1),16) - 0x233333).toString(16)
        }

      })
      console.log('this.labelColors',this.labelColors)
    /*  this.labelColors = [
        {
          "color": "#eac0a2",
          "borderColor": "#a38671"
        },
        {
          "color": "#619dff",
          "borderColor": "#436db2"
        },
        {
          "color": "#9d61ff",
          "borderColor": "#6d43b2"
        },
        {
          "color": "#ff9d61",
          "borderColor": "#b26d43"
        }
      ]*/
      this.jsonData = {
        "labelCategories": [],
        "labels": [
          {
            "id": 1,
            "categoryId": '部位',
            "startIndex": 10,
            "endIndex": 20
          },
          {
            "id": 2,
            "categoryId": '症状',
            "startIndex": 100,
            "endIndex": 120
          },
        ],
        "connectionCategories": [],
        "connections": [
          {
            "id": 0,
            "categoryId": '症状/特性修饰',
            "fromId": 1,
            "toId": 2
          }
        ]
      }
      this.annotator = undefined
      this.focusId = undefined
      this.focusArgs = []
      return {
        noteLabel: [],
        noteConnect: [],
        menuVisible: false,
        menuX: 0,
        menuY: 0,
        selectTitle: '标签',
        selectVisible: false,
        selectValue: undefined,
        selectType: undefined,
      }
    },
    beforeMount(){
      Promise.all([this.initDict(), this.loadData()]).then(arr => {
        console.log('arr', arr)
        this.$nextTick(this.initAnnotator())
      })
    },
    methods: {
      async initDict(){
        let obj = await this.$util.initDict(['NOTE_LABEL','NOTE_CONNECT'])
        console.log('obj',obj)
        this.noteLabel = obj['NOTE_LABEL']
        this.noteConnect = obj['NOTE_CONNECT']
        let colorLen = this.labelColors.length
        this.jsonData.labelCategories = this.noteLabel.map((v,i) => ({
          id: v.code,
          text: v.value,
          ...this.labelColors[i % colorLen]
        }))
        this.jsonData.connectionCategories = this.noteConnect.map((v,i) => ({
          id: v.code,
          text: v.value,
        }))
      },
      async loadData(){
        this.jsonData.content = '病   史\n' +
          '主诉： 主诉 反复心慌胸闷不适1月余\n' +
          '\n' +
          '现病史： 现病史 患者近1月来反复出现心慌胸闷不适，活动后明显，间断发作，每次持续时间不等，无大汗淋漓，无黑曚晕厥，无恶心呕吐，速效救心丸含服后好转，未规律服用阿司匹林、他汀等相关药物，当地诊断输液治疗后未见明显改善，遂来我院就诊，拟以“不稳定性心绞痛”收住我科。患者自病来，神志清，精神一般，食纳尚可，体重未见明显变化。\n' +
          '\n' +
          '既往史： 一般健康状况: 一般\n' +
          '\n' +
          '疾病史： 疾病史: 1.冠状动脉粥样硬化性心脏病 不稳定性心绞痛 心功能IV级 2.陈旧性脑梗死 3.高血压3级（很高危）4.慢性支气管炎\n' +
          '\n' +
          '传染病史： 传染病史 无\n' +
          '\n' +
          '预防接种史： 预防接种史: 不详 \n' +
          '\n' +
          '手术外伤史： 手术: 无 \n' +
          '\n' +
          '外伤: 无 \n' +
          '\n' +
          '输血史： 输血史 无\n' +
          '输血反应: 无\n' +
          '\n' +
          '药物过敏史： 药物过敏史 无 \n' +
          '过敏药品名称： 无\n' +
          '\n' +
          '个人史： 经常居留地： 界首\n' +
          '寄生虫疫水接触史： 无\n' +
          '\n' +
          '吸烟史: 无\n' +
          '\n' +
          '饮酒史: 无 \n' +
          '\n' +
          '毒品接触史： 毒品接触史： 无 \n' +
          '\n' +
          '婚育史： 婚育史: 已婚已育，子女体键\n' +
          '\n' +
          '家族史： 家族史 否认家族性及遗传性疾病史\n' +
          '以上病史记录已经陈述者认同。陈述者签名：\n' +
          '\n' +
          '体 格 检 查 生命体征 生命体征：T:36.8 ℃  P:75次/分    R: 21次/分   BP:140/85 mmHg\n' +
          '\n' +
          '一般情况： 发育： 正常\n' +
          '营养： 良好 \n' +
          '\n' +
          '身高: 162cm \n' +
          '体重： 65kg\n' +
          '\n' +
          '表情: 自如\n' +
          '检查合作： 是\n' +
          '\n' +
          '体型： 正力型\n' +
          '步态： 正常\n' +
          '体位： 自动体位 \n' +
          '神志： 清楚\n' +
          '\n' +
          '皮肤粘膜： 色泽: 正常\n' +
          '皮疹: 无\n' +
          '皮下出血: 无\n' +
          '\n' +
          '肝掌: 无\n' +
          '蜘蛛痣: 无\n' +
          '其他: 无\n' +
          '\n' +
          '淋巴结： 浅表淋巴结肿大： 无\n' +
          '\n' +
          '头部： 头发分布： 正常\n' +
          ' 其他： /\n' +
          '\n' +
          '眼： 正常\n' +
          '巩膜黄染: 无\n' +
          '\n' +
          '瞳孔： 等大等圆\n' +
          '对光反射： 正常\n' +
          '\n' +
          '耳：外耳道分泌物： 无\n' +
          '乳突压痛： 无\n' +
          '听力障碍： 无\n' +
          '\n' +
          '鼻：鼻翼煽动： 无\n' +
          '异常分泌物： 无\n' +
          '鼻窦压痛： 无\n' +
          '\n' +
          '口腔：唇： 正常\n' +
          '粘膜： 正常\n' +
          '      舌： 正常\n' +
          '牙齿： 正常\n' +
          '齿龈： 正常\n' +
          '\n' +
          '      扁桃体： 正常\n' +
          '咽： 正常\n' +
          '\n' +
          '颈部：颈项强直： 无  下颌距胸骨 / cm\n' +
          '\n' +
          '      颈静脉： 不显露\n' +
          '颈动脉： 搏动正常\n' +
          '\n' +
          '      肝颈静脉回流征： 阴性\n' +
          '颈部血管杂音： 无\n' +
          '\n' +
          '      气管： 正中\n' +
          '甲状腺： 正常\n' +
          '\n' +
          '胸部： 胸廓： 正常\n' +
          '乳房： 正常\n' +
          '胸骨叩痛： 无\n' +
          '其他： /\n' +
          '\n' +
          '肺：视诊： 正常\n' +
          '呼吸运动： 正常\n' +
          '\n' +
          '     触诊：语颤： 正常\n' +
          '胸膜摩擦音： 无\n' +
          '      叩诊： 正常清音\n' +
          ' \n' +
          '     听诊：呼吸音： 粗\n' +
          '啰音： 双肺可闻及少量湿罗音\n' +
          '语音传导： 正常\n' +
          '\n' +
          '     胸膜摩擦音： 无\n' +
          '其他： /\n' +
          '\n' +
          '心：视诊：心前区隆起： 无\n' +
          '心尖搏动： 正常\n' +
          '\n' +
          '     心尖搏动位置： 正常\n' +
          '\n' +
          '     触诊：心尖搏动： 正常\n' +
          '震颤： 无\n' +
          '心包摩擦音： 无\n' +
          '\n' +
          '     叩诊：心脏相对浊音界： 正常\n' +
          '\n' +
          '右（cm）\n' +
          '肋间\n' +
          '左（cm）\n' +
          '2.0\n' +
          'II\n' +
          '2.5\n' +
          '2.5\n' +
          'III\n' +
          '4.0\n' +
          '3.0\n' +
          'IV\n' +
          '6.5\n' +
          '/\n' +
          'V\n' +
          '8.0\n' +
          '\n' +
          ' （前正中线距锁骨中线 8.5 cm）\n' +
          '     听诊： 心率75次/分\n' +
          '心律： 整齐\n' +
          '过早搏动 无\n' +
          '\n' +
          '     心音： 低钝\n' +
          '杂音： 无\n' +
          '      附加心音： 无\n' +
          '\n' +
          '     心包摩擦音： 无 \n' +
          '\n' +
          '     周围血管征及其他： 无 \n' +
          '\n' +
          '     其他：  无 \n' +
          '\n' +
          '腹部: 视诊：外形： 正常 \n' +
          '手术疤痕： 无\n' +
          '\n' +
          '触诊： 全腹柔软\n' +
          '压痛： 无\n' +
          '反跳痛： 无\n' +
          '\n' +
          '     腹部包块： 无\n' +
          '肝脏： 未触及\n' +
          '\n' +
          '     胆囊： 未触及\n' +
          'Murphy征： 阴性 \n' +
          '\n' +
          '     脾脏： 未触及\n' +
          '肾脏： 未触及\n' +
          '\n' +
          '叩诊：肝浊音界： 正常    肝上界位于右锁骨中线第5肋间\n' +
          '\n' +
          '叩痛： 阴性 \n' +
          '移动性浊音： 无\n' +
          '\n' +
          '听诊：肠鸣音： 正常\n' +
          '气过水声： 无\n' +
          '其他： /\n' +
          '\n' +
          '直肠肛门： 直肠肛门： 未查\n' +
          '\n' +
          '外生殖器： 外生殖器： 未查\n' +
          '\n' +
          '脊柱： 脊柱 正常\n' +
          '\n' +
          '四肢： 四肢： 正常\n' +
          '其他： 其他：无\n' +
          '\n' +
          '神经系统： 神经系统： 正常\n' +
          '\n' +
          '专 科 情 况 专科情况 1.患者邢增宇，男，72岁，系“反复心慌胸闷不适1月余”入院。\n' +
          '2.体格检查：血压：140/85mmHg，营养良好，正常面容，表情自如，神志清楚，自动体位。口唇正常，颈软，颈静脉不显露，肝颈静脉回流征阴性。两肺呼吸音粗，两肺可闻及湿性啰音。心界正常，心率75次/分，心律整齐，未闻及早搏，心音低钝，各瓣膜听诊区未闻及病理性杂音。腹软，肝脾肋下未触及，无压痛及反跳痛，双下肢无水肿。四肢肌力肌张力正常，病理征阴性。\n' +
          '\n' +
          '辅 助 检 查 辅助检查 门诊及院外重要辅助检查结果（包括检查项目、医疗机构名称、日期、结果）无\n' +
          '\n' +
          '                                初步诊断： 初步诊断: 1.冠状动脉粥样硬化性心脏病\n' +
          '    不稳定性心绞痛\n' +
          '    心功能IV级 \n' +
          '2.陈旧性脑梗死 \n' +
          '3.高血压3级（很高危）\n' +
          '4.慢性支气管炎'
      },
      initAnnotator(){

        let {labels,connections,labelCategories,connectionCategories} = this.jsonData
        let labelCategoriesSet = new Set(labelCategories.map(r => r.id))
        let connectionCategoriesSet = new Set(connectionCategories.map(r => r.id))
        let newLabels = []
        let delLabelSet = new Set()
        for(let label of labels){
          if(labelCategoriesSet.has(label.categoryId)){
            newLabels.push(label)
          } else {
            delLabelSet.add(label.id)
          }
        }

        this.jsonData.labels = newLabels
        this.jsonData.connections = connections.filter(r =>
          connectionCategoriesSet.has(r.categoryId)
          && !delLabelSet.has(r.fromId)
          && !delLabelSet.has(r.toId))


        let elem = this.$refs.annotator
        let annotator = new Annotator(this.jsonData, elem, {})
        annotator.on('textSelected', (startIndex, endIndex) => {
          // 输出用户选取的那些字
          let text = this.jsonData.content.slice(startIndex, endIndex);
          if(text.indexOf('\n') > -1){
            this.$message.warn('不能在段落之间标记')
            return
          }
          this.focusArgs = [startIndex, endIndex]
          this.selectType = 'label'
          this.focusId = undefined
          this.showSelect()
        })
        annotator.on('twoLabelsClicked', (fromId, toId) => {
          // 输出用户点击的label的ID
          this.focusArgs = [fromId, toId]
          this.selectType = 'connect'
          this.focusId = undefined
          this.showSelect()
        });
        annotator.on('labelRightClicked', (id,{x, y}) => {
          // 输出用户点击的label的ID, 被点击时鼠标的 X,Y 值
          this.menuX = x + 10
          this.menuY = y + 10
          this.menuVisible = true
          this.focusId = id
          this.selectType = 'label'
        });
        annotator.on('connectionRightClicked', (id,{x, y}) => {
          // 输出用户点击的label的ID, 被点击时鼠标的 X,Y 值
          this.menuX = x + 10
          this.menuY = y + 10
          this.menuVisible = true
          this.focusId = id
          this.selectType = 'connect'
        });
        this.annotator = annotator
      },
      showSelect(val){
        this.selectVisible = true
        this.selectValue = val
      },
      handleSelectOk(){
        this.handleSelectClose()
        if(this.selectValue === undefined || this.selectValue === null){
          return
        }
        let action = this.selectType === 'label'?Action.Label:Action.Connection
        if(this.focusId !== undefined && this.focusId !== null){
          this.annotator.applyAction(action.Update(this.focusId, this.selectValue))
        } else {
          this.annotator.applyAction(action.Create(this.selectValue, ...this.focusArgs))
        }

      },
      handleSelectClose(){
        this.selectVisible = false
      },
      update(){
        let attr = this.selectType === 'label'?'labelRepo' : 'connectionRepo'
        let selectValue = this.annotator.store[attr].json.find(r => r.id === this.focusId).categoryId
        console.log('this.selectValue', this.selectValue)
        this.showSelect(selectValue)
      },
      remove(){
        let action = this.selectType === 'label'?Action.Label:Action.Connection
        this.annotator.applyAction(action.Delete(this.focusId))
      }
    },
    computed: {}
  }
</script>
<style lang="less">
  .annotator {
    position: relative;
    &> svg{
      width: 100%;
    }
    textarea:first-child{
      width: 100%;
    }
  }

</style>
