import go from 'gojs'
// import { Inspector } from 'gojs/extensions/DataInspector.js'

const $ = go.GraphObject.make

// helper definitions for node templates
function nodeStyle() {
  return [
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    {
      // the Node.location is at the center of each node
      locationSpot: go.Spot.Center,
      selectionObjectName: 'img'
    }
  ]
}

function setToolManager(diagram) {
  diagram.toolManager.linkingTool.temporaryLink =
    $(go.Link,
      { layerName: 'Tool' },
      $(go.Shape,
        { stroke: 'red', strokeWidth: 2, strokeDashArray: [4, 2] })
    )
  let tempfromnode =
    $(go.Node,
      { layerName: 'Tool' },
      $(go.Shape, 'RoundedRectangle',
        {
          stroke: 'chartreuse', strokeWidth: 3, fill: null,
          portId: '', width: 1, height: 1
        })
    )
  diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode
  diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port
  let temptonode =
    $(go.Node,
      { layerName: 'Tool' },
      $(go.Shape, 'RoundedRectangle',
        {
          stroke: 'cyan', strokeWidth: 3, fill: null,
          portId: '', width: 1, height: 1
        })
    )
  diagram.toolManager.linkingTool.temporaryToNode = temptonode
  diagram.toolManager.linkingTool.temporaryToPort = temptonode.port
}

// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId,
// the "align" is used to determine where to position the port relative to the body of the node,
// the "spot" is used to control how links connect with the port and whether the port
// stretches along the side of the node,
// and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
function makePort(name, align, spot, output, input) {
  let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
  // the port is basically just a transparent rectangle that stretches along the side of the node,
  // and becomes colored when the mouse passes over it
  return $(go.Shape,
    {
      fill: 'transparent',  // changed to a color in the mouseEnter event handler
      strokeWidth: 0,  // no stroke
      width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
      alignment: align,  // align the port on the main Shape
      stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
      portId: name,  // declare this object to be a "port"
      fromSpot: spot,  // declare where links may connect at this port
      fromLinkable: output,  // declare whether the user may draw links from here
      toSpot: spot,  // declare where links may connect at this port
      toLinkable: input,  // declare whether the user may draw links to here
      cursor: 'pointer',  // show a different cursor to indicate potential link point
      mouseEnter: function(e, port) {  // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = '#69e274'
      },
      mouseLeave: function(e, port) {
        port.fill = 'transparent'
      }
    })
}

function textStyle() {
  return {
    font: '9pt Lato, Helvetica, Arial, sans-serif',
    stroke: '#282c34',
    // minSize: new go.Size(30, NaN),
    maxSize: new go.Size(80, NaN),
    maxLines: 3,
    overflow: go.TextBlock.OverflowEllipsis,
    textAlign: 'center',
    verticalAlignment: go.Spot.Center,
    wrap: go.TextBlock.WrapDesiredSize
  }
}

function countStyle() {
  return {
    font: '8pt Lato, Helvetica, Arial, sans-serif',
    stroke: 'red',
    // stroke: '#999',
    // minSize: new go.Size(30, NaN),
    maxSize: new go.Size(80, NaN),
    maxLines: 1,
    overflow: go.TextBlock.OverflowEllipsis,
    textAlign: 'center',
    verticalAlignment: go.Spot.Center,
    wrap: go.TextBlock.WrapDesiredSize
  }
}

function createImgNode(imgs, events, ports, readonly, submit) {
  return $(go.Node, 'Table', nodeStyle(), events
    // 为整个Node背景设置为浅蓝色
    // { background: "#44CCFF" },,
    ,$(go.Panel, 'Auto',
      $(go.Picture,
        { name: 'img', margin: 5, width: 32, height: 32, row: 0, },
        new go.Binding("source", "type", r => imgs[r.replace('_dws', '')])
        // Picture.source参数值与模型数据中的"source"字段绑定
        // new go.Binding('source')
      ),
      ...(readonly ? [] : ports)
    )
    , $(go.TextBlock, textStyle(), { row: 1},
      // TextBlock.text参数值与模型数据中的"name"字段绑定
      new go.Binding('text').makeTwoWay()
    )
    , $(go.TextBlock, countStyle(), { row: 2 },
      // TextBlock.text参数值与模型数据中的"name"字段绑定
      new go.Binding('text', 'count', r => r !== undefined && r !== null?`(${r})`:'')
    )
    , submit ? $('CheckBox', 'submit', { 'Button.width': 16, 'Button.height': 16, row: 1, column: 1 }) : {}
  )
}

function createBlankNode(events, ports, readonly) {
  return $(go.Node, 'Auto', nodeStyle(), events,
    $(go.Shape, 'Rectangle',
      { fill: '#eee', stroke: null }),
    $(go.TextBlock,
      {
        font: '11pt Lato, Helvetica, Arial, sans-serif',
        margin: 5,
        // maxSize: new go.Size(250, NaN),
        wrap: go.TextBlock.WrapFit,
        editable: !readonly
      },
      new go.Binding('text').makeTwoWay())
  )
}

function showLinkLabel(e) {
  let label = e.subject.findObject('LABEL')
  console.log('showLinkLabel', e)
  if (label !== null) {
    // /*label.visible = (e.subject.fromNode.data.category === 'Conditional')
    label.visible = (e.subject.fromNode.data.category === 'conditional')
  }

}

// This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
function animateFadeDown(e) {
  var diagram = e.diagram
  var animation = new go.Animation()
  animation.isViewportUnconstrained = true // So Diagram positioning rules let the animation start off-screen
  animation.easing = go.Animation.EaseOutExpo
  animation.duration = 900
  // Fade "down", in other words, fade in from above
  animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position)
  animation.add(diagram, 'opacity', 0, 1)
  animation.start()
}

function addNodeTemplate(myDiagram, contextMenu, imgs, readonly, isSubmit, nodeClick, selectionChanged) {

  myDiagram.nodeTemplateMap.add('start', createImgNode(imgs, {
    contextMenu,
    selectionChanged: selectionChanged
  }, [
    // three named ports, one on each side except the top, all output only:
    makePort('L', go.Spot.Left, go.Spot.Left, true, false),
    makePort('R', go.Spot.Right, go.Spot.Right, true, false),
    makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
  ], readonly))
  // define the Node templates for regular nodes
  myDiagram.nodeTemplateMap.add('rectangle', createImgNode(imgs, {
      contextMenu,
      // selectionChanged: selectionChanged
      selectionChanged: selectionChanged,
      // click: nodeClick
    }, [
      // four named ports, one on each side:
      makePort('T', go.Spot.Top, go.Spot.TopSide, true, true),
      makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
      makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
      makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, true)
    ]
    , readonly))
  myDiagram.nodeTemplateMap.add('conditional', createImgNode(imgs, {
    contextMenu,
    selectionChanged: selectionChanged
    // click: nodeClick
  }, [
    // four named ports, one on each side:
    makePort('T', go.Spot.Top, go.Spot.Top, true, true),
    makePort('L', go.Spot.Left, go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, true)
  ], readonly))
  myDiagram.nodeTemplateMap.add('end', createImgNode(imgs, {
    contextMenu,
    selectionChanged: selectionChanged
  }, [
    // three named ports, one on each side except the bottom, all input only:
    makePort('T', go.Spot.Top, go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, go.Spot.Left, false, true),
    makePort('R', go.Spot.Right, go.Spot.Right, false, true)
  ], readonly, isSubmit))


  myDiagram.nodeTemplateMap.add('comment', createBlankNode({
    contextMenu
    // selectionChanged: selectionChanged,
  }, [], readonly))

  /* myDiagram.groupTemplate =
     $(go.Group, "Vertical",
       $(go.Panel, "Auto",
         $(go.TextBlock,         // group title
           { alignment: go.Spot.Center, font: "Bold 12pt Sans-Serif" },
           new go.Binding("text", "key")),
         $(go.Placeholder,    //占位符,表示所有构件的面积，
           { padding: 5})  // 添加内边距
       )
     );*/
  // myDiagram.groupTemplate.findObject('Rectangle').background= 'rgba(0,0,0,0.2)'"
  myDiagram.groupTemplate =
    $(go.Group, 'Auto',
      $(go.Shape, 'Rectangle', { fill: 'rgba(24,144,255,0.05)', stroke: 'darkorange' }),
      $(go.Panel, 'Table',
        { margin: 0.5 },  // avoid overlapping border with table contents
        $(go.RowColumnDefinition, { row: 0, background: 'white' }),  // header is white
        $('SubGraphExpanderButton', { row: 0, column: 0, margin: 3 }),
        $(go.TextBlock,  // title is centered in header
          {
            row: 0, column: 1, font: 'bold 14px Sans-Serif', stroke: 'darkorange',
            textAlign: 'center', stretch: go.GraphObject.Horizontal
          },
          new go.Binding('text', 'key')),
        $(go.Placeholder,  // becomes zero-sized when Group.isSubGraphExpanded is false
          { row: 1, columnSpan: 2, padding: 10 },
          new go.Binding('padding', 'isSubGraphExpanded',
            function(exp) {
              return exp ? 10 : 0
            }).ofObject())
      )
    )
}

function addNodeSelectTemplate(myDiagram, imgs) {
  let templateMap = myDiagram.nodeTemplateMap
  // define the Node templates for regular nodes
  templateMap.add('start', createImgNode(imgs, {}, []))
  templateMap.add('rectangle', createImgNode(imgs, {}, []))
  templateMap.add('conditional', createImgNode(imgs, {}, []))
  templateMap.add('end', createImgNode(imgs, {}, []))
  templateMap.add('comment', createBlankNode({}, []))

}

function replaceLinkTemplate(myDiagram, lineToNode, primaryColor, readonly) {
  let settingObj = lineToNode ? {} : {
    routing: go.Link.Orthogonal,
    curve: go.Link.JumpOver,
    corner: 5, toShortLength: 4,
    relinkableFrom: true, // 重连节点头
    relinkableTo: true, // 重连节点尾
    reshapable: true,   // 可拉伸线
    resegmentable: true // 可摆动线，更多折角
  }

  let colorStr = primaryColor.substring(1).padEnd(6, 0)
  let rgbArray = []
  for (let i = 0; i < 6; i += 2) {
    rgbArray.push(parseInt(colorStr.substring(i, i + 2), 16))
  }
  // replace the default Link template in the linkTemplateMap
  myDiagram.linkTemplate =
    $(go.Link,// the whole link panel
      {
        ...settingObj,
        // mouse-overs subtly highlight links:
        mouseEnter: function(e, link) {
          link.findObject('HIGHLIGHT').stroke = `rgba(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]},0.2)`//'rgba(30,144,255,0.2)'
        },
        mouseLeave: function(e, link) {
          link.findObject('HIGHLIGHT').stroke = 'transparent'
        },
        doubleClick: readonly ? () => {
        } : function(e, link) {
          let TextBlock = link.findObject('TextBlock')
          if (TextBlock.text === '是') {
            TextBlock.text = '否'
          } else {
            TextBlock.text = '是'
          }
        },
        contextMenu: myDiagram.contextMenu,
        selectionAdornmentTemplate: $(go.Adornment, 'Auto'),
        text: '是'
      },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape,  // the highlight shape, normally transparent
        { isPanelMain: true, strokeWidth: 6, stroke: 'transparent', name: 'HIGHLIGHT' }),
      $(go.Shape,  // the link path shape
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
        new go.Binding('stroke', 'isSelected', sel => sel ? primaryColor : 'gray').ofObject()),
      $(go.Shape,  // the arrowhead
        { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
      $(go.Panel, 'Auto',  // the link label, normally not visible
        { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
        new go.Binding('visible', 'visible').makeTwoWay(),
        $(go.Shape, 'RoundedRectangle',  // the label shape
          { fill: 'rgba(255,255,255,0.8)', strokeWidth: 0 }),
        $(go.TextBlock, '是',  // the label text
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: 'black',
            margin: 3,
            editable: false  // editing the text automatically updates the model data
            , name: 'TextBlock'
          },
          new go.Binding('text').makeTwoWay())
      )
    )
  // Make link labels visible if coming out of a "conditional" node.
  // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
// temporary links used by LinkingTool and RelinkingTool are also orthogonal:
  /*  myDiagram.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        { corner: 5, selectable: true },
        $(go.Shape, { strokeWidth: 3, stroke: "#424242" })); */ // dark gray, rounded corner links
  let linkType = lineToNode ? go.Link.Normal : go.Link.Orthogonal
  myDiagram.toolManager.linkingTool.temporaryLink.routing = linkType
  myDiagram.toolManager.relinkingTool.temporaryLink.routing = linkType
}

function setDiagramEvents(myDiagram,imgs, nodeAdd, nodeDelete, nodeCopy) {
  //添加监听节点生成事件
  /*myDiagram.addDiagramListener('externalobjectsdropped', function(e) {
    console.log('节点生成', e)
    e.subject.each(function(node) {
      nodeAdd(node.data)
    })
  })
  //监听节点删除事件
  myDiagram.addDiagramListener('SelectionDeleted', function(e) {
    e.subject.each(function(node) {
      let data = node.data
      console.log('删除', data.type, data.key)
      if (data.type === 'rect' || data.type === 'diam') { // 节点
        nodeDelete(data.key)
      } else {

      }
      // nodeDelete(data)
    })
  })*/

  // 复制事件使用自己的方法
  /* myDiagram.addDiagramListener('ClipboardChanged', function(e) {
     let nodes = []
     e.subject.each(function(node) {
       let key = node.data.key
       if(key !== undefined && key !== null){
         nodes.push(node)
       }
     })
     nodeCopy(nodes)
   })*/
  myDiagram.addModelChangedListener(function(evt) {
    if (!evt.isTransactionFinished) {
      return
    }
    var txn = evt.object //获取事务
    if (txn === null) return
    txn.changes.each(function(e) {//遍历事务
      if (e.change === go.ChangedEvent.Insert) {//新增
        if (e.propertyName === 'nodeDataArray') { //节点
          let data = e.newValue
          nodeAdd(data)
          console.log('Insert', data)
        } else if (e.propertyName === 'linkDataArray') { // 连线
          console.log('Insert.link', e)
        }
      } else if (e.change === go.ChangedEvent.Remove) {
        /*if (e.propertyName === 'nodeDataArray') { //节点
          let data = e.oldValue
          if (data.category === 'rectangle' || data.category === 'conditional') {
            nodeDelete(data.key)
          }
          console.log('Remove', data)
        } else if (e.propertyName === 'linkDataArray') { // 连线

        }*/

      }/*else if (e.change === go.ChangedEvent.Property) { name || data ||
        console.log('Property',e);
      }*/
    })

  })

  //监听节点粘贴事件
  /*  myDiagram.addDiagramListener('ClipboardPasted', function(e) {
      e.subject.each(function(node) {
        console.log('节点粘贴',e, node.data)
        nodeCopy(node.data)
        // nodeDelete(data)
      })
    })*/

  /*myDiagram.addModelChangedListener('ChangedEvent', function(e) {
    console.log('ChangedEvent', e)
  })*/

  //监听选择事件
  /*  myDiagram.addDiagramListener('ChangedSelection', function(e) {
      e.subject.each(function(node) {
        console.log('节点选择', node.data)
        // nodeCopy(node.data)
        // nodeDelete(data)
      })
    })*/
  //添加监听线生成事件
  /* myDiagram.addDiagramListener('LinkDrawn', function(e) {
     console.log('生成线', e.subject.data)
     let toNodeKey = e.subject.data.to
     let it = myDiagram.links

     while (it.next()) {
       var link = it.value;
       console.log('from',link.fromNode.data)
       console.log('to',link.toNode.data)
       console.log('port',link.toPort.data)
     }

     console.log('links', myDiagram.links)
     console.log('links', myDiagram.findTreeRoots())
   })*/

}

class FlowChart {
  constructor({
                diagramId, paletteId, menuId, data,
                setting = {
                  mouseWheelBehavior: false,
                  lineToNode: false,
                  grid: true,
                  primaryColor: 'blue'
                }, imgs = {}, readonly = false, isSubmit = false, canMove = true, scale = 1,
                nodeClick = () => {
                }, nodeAdd,
                nodeDelete = () => {
                },
                nodeCopy = () => {
                },
                nodePaste = () => {
                },
                selectLeave = () => {
                },
                selectActive = () => {
                },
                menuFocus = () =>{}
              }) {
    this.readonly = readonly
    this.imgs = imgs
    // 右键菜单配置
    const cxElement = document.getElementById(menuId)
    let myContextMenu
    if(cxElement && !readonly){
      // 不显示浏览器菜单
      cxElement.addEventListener('contextmenu', function(e) {
        e.preventDefault()
        return false
      }, false)
      myContextMenu = $(go.HTMLInfo, {
        show: (obj, diagram, tool) => {
          if(this.readonly){
            return
          }
          // Show only the relevant buttons given the current state.
          let cmd = diagram.commandHandler
          let hasMenuItem = false
          console.log(obj, diagram, tool)
          menuFocus(obj)
          function maybeShowItem(elt, pred) {
            if(!elt){
              return
            }
            if (pred) {
              elt.style.display = 'block'
              hasMenuItem = true
            } else {
              elt.style.display = 'none'
            }
          }

          function maybeShowItem2(elt, pred) {
            if(!elt){
              return
            }
            console.log('pred',pred)
            if (pred && pred.data && (pred.data.type.startsWith('rect') || pred.data.type.startsWith('diam'))) {
              elt.style.display = 'block'
              hasMenuItem = true
            } else {
              elt.style.display = 'none'
            }
          }

          maybeShowItem(document.getElementById('cut'), !!obj)
          maybeShowItem(document.getElementById('copy'), !!obj)
          maybeShowItem(document.getElementById('paste'), !obj)
          maybeShowItem(document.getElementById('delete'), !!obj)
          maybeShowItem2(document.getElementById('saveTmpl'), obj)

          console.log('maybeShowItem', obj)

          // Now show the whole context menu element
          if (hasMenuItem) {
            cxElement.classList.add('show-menu')
            // we don't bother overriding positionContextMenu, we just do it here:
            let mousePt = diagram.lastInput.viewPoint
            console.log('y',diagram.lastInput.documentPoint.y)
            cxElement.style.left = mousePt.x + 5 + 'px'
            cxElement.style.top = mousePt.y + 'px'
          }
        },
        hide: () => cxElement.classList.remove('show-menu')

      })
    }

    // 初始化画布配置
    this.myDiagram = $(go.Diagram, diagramId,  // must name or refer to the DIV HTML element
      {
        'LinkDrawn': showLinkLabel,  // this DiagramEvent listener is defined below
        'LinkRelinked': showLinkLabel,
        allowClipboard: false,
        allowCopy: false,
        allowDelete: false,
        allowDragOut: !readonly,
        allowDrop: !readonly,
        allowGroup: !readonly,
        allowInsert: !readonly,
        allowLink: !readonly,
        allowMove: canMove,
        allowRelink: !readonly,
        allowReshape: !readonly,
        allowResize: !readonly,
        allowRotate: !readonly,
        //     allowSelect: !readonly,
        allowTextEdit: !readonly,
        allowUndo: !readonly,
        allowUngroup: !readonly,
        'undoManager.isEnabled': !readonly,  // enable undo & redo
        //一个节点只允许有一个父节点，并且没有定向循环
        validCycle: go.Diagram.CycleDestinationTree,
        contextMenu: myContextMenu,
        /* mouseOver : e => {
           let {x, y} = e.viewPoint
           this.mousePoint = {x,y}
           console.log(x, y)

         },*/
        /*  mouseLeave : e => {
            console.log('mouseLeave',e)
            // let {x, y} = e.viewPoint
            this.mousePoint = {x: 0,y: 0}
          },*/
        scale
      })
    let diagram = this.myDiagram
    //  禁止部分键盘命令
    this.myDiagram.commandHandler.doKeyDown = this.doKeyDown = (obj)=> {
      // let e = diagram.lastInput;
      if(this.readonly){
        return
      }
      let cmd = diagram.commandHandler
      let e = obj || event
      console.log('event', e)
      console.log(diagram.viewportBounds)
      if (e.code === 'Delete') {  // could also check for e.control or e.shift
        let selectParts = []
        this.getSelect().each(part => {
          selectParts.push(part)
        })
        nodeDelete(selectParts)
        this.removeParts(selectParts)
      } else {
        if(e.ctrlKey && (e.code === 'KeyC' || e.code === 'KeyX')){
          let selectParts = []
          this.getSelect().each(part => {
            selectParts.push(part)
          })
          nodeCopy(selectParts)
          if(e.code === 'KeyX'){
            this.removeParts(selectParts)
            nodeDelete(selectParts)
          }
        } else if(e.ctrlKey && e.code === 'KeyV'){
          nodePaste()
        } else if(cmd){
          // call base method with no arguments
          go.CommandHandler.prototype.doKeyDown.call(cmd)
        }

      }
    }

    // 添加配置每个节点项，监听部分事件
    addNodeTemplate(this.myDiagram, myContextMenu, imgs, readonly, isSubmit, (e, node) => {
      if (this.myDiagram === e.B) {
        console.log('节点点击')
        nodeClick(node.data)
      }
    }, (node) => {
      if (node.isSelected) {
        console.log('激活', node.data)
        selectActive(node.data)
      } else {
        console.log('离开', node.data)
        selectLeave(node.data)
      }
    })
    if (!nodeAdd)
      nodeAdd = nodeClick
    // 设置事件监听
    setDiagramEvents(this.myDiagram,imgs, nodeAdd, nodeDelete, nodeCopy)
    if (data) {
      this.myDiagram.model = go.Model.fromJson(data)
    }
    this.setModelProp(this.myDiagram.model)
    // type 是自己定义的,存库里  category是流程图内部识别
    this.nodeTempls = [  // specify the contents of the Palette
      { category: 'start', text: '开始', type: 'start' },
      { category: 'rectangle', text: '计算', type: 'rect' },
      { category: 'conditional', text: '条件', type: 'diam' },
      { category: 'end', text: '提交', type: 'end' },
      { category: 'comment', text: '注解', type: 'blank' }
    ]
    this.nodeDatas = [
      ...this.nodeTempls,
      { category: 'rectangle', text: '计算', type: 'rect_v' },
      { category: 'conditional', text: '条件', type: 'diam_v' },
    ]
    if (!readonly) {
      // 组件选择区域
      this.myPalette = $(go.Palette, paletteId)
      // 设置初始数据
      addNodeSelectTemplate(this.myPalette, this.imgs)
    }

    // 设置连线样式
    setToolManager(this.myDiagram)
    this.setSetting(setting)

  }

  setModelProp(model) {
    model.linkFromPortIdProperty = 'fromPort'  // necessary to remember portIds
    model.linkToPortIdProperty = 'toPort'
  }

  setAllowMove(allowMove) {
    this.myDiagram.allowMove = allowMove
  }

  updateText(key, text) {
    this.updateProp(key, 'text', text )
  }

  updateType(key, type) {
    this.updateProp(key, 'type', type )
  }
  updateNodeData(key, obj) {
    let nodeData = this.myDiagram.model.findNodeDataForKey(key)
    for(let name in obj){
      this.myDiagram.model.setDataProperty(nodeData, name, obj[name])
    }
  }
  updateProp(key, name, value) {
    let nodeData = this.myDiagram.model.findNodeDataForKey(key)
    console.log('updateProp', key, name, value)
    this.myDiagram.model.setDataProperty(nodeData, name, value)
  }
  updateAllProp(name, value){
    let nodes = this.myDiagram.model.nodeDataArray
    for(let i = 0; i < nodes.length; i++){
      this.myDiagram.model.setDataProperty(nodes[i], name, value)
    }

    console.log('nodes', nodes)
  }
  updateData(data) {
    if (data) {
      this.myDiagram.model = go.Model.fromJson(data)
      console.log('this.myDiagram.model',this.myDiagram.model)
      this.setModelProp(this.myDiagram.model)
    } else {
      this.myDiagram.clear()
    }
  }

  // 选中节点
  selectNode(key) {
    console.log('selectNode', key)
    // let nodeData = this.myDiagram.model.findNodeDataForKey(key);
    let node = this.myDiagram.findNodeForKey(key)
    this.myDiagram.select(node)
  }

  // 清除所有选中状态
  clearSelection() {
    this.myDiagram.clearSelection()
  }

  removePartsByKeys(keys) {
    this.myDiagram.removeParts(Array.from(keys, key => this.myDiagram.findPartForKey(key)))
  }

  removeParts(parts) {
    this.myDiagram.removeParts(parts)
  }

  addJson(flowJson) {
    if (flowJson.nodeDataArray) {
      this.myDiagram.model.addNodeDataCollection(flowJson.nodeDataArray)
    }
    if (flowJson.linkDataArray) {
      this.myDiagram.model.addLinkDataCollection(flowJson.linkDataArray)
    }
  }

  getPoint(){
    return this.myDiagram.lastInput.documentPoint
  }

  getSelect(){
    return this.myDiagram.selection
  }

  getJson() {
    return this.myDiagram.model.toJson()
  }

  clear() {
    this.myDiagram.clear()
  }

  refresh() {
    // this.myDiagram.model = go.Model.fromJson(this.getJson())
    this.myDiagram.layoutDiagram()
  }

  addNode(type = 'rect', text, loc, prop = {}) {
    let showType = type.replace('_dws', '')
    let nodeTempl = this.nodeDatas.find(item => item.type === showType)
    if (!text || text.length === 0) {
      text = nodeTempl.text
    }
    let node = {
      // key: '',
      type,
      category: nodeTempl.category,
      loc,
      text: text,
      ...prop
    }
    this.myDiagram.model.addNodeData(node)
    return this.myDiagram.model.getKeyForNodeData(node)

  }

  addLink(fromNode, toNode) {
    //,"category":''
    this.myDiagram.model.addLinkData({
      from: fromNode.key,
      to: toNode.key,
      visible: fromNode.category === 'conditional'
    })
  }

  setReadOnly(readonly){
    this.readonly = readonly
    Object.assign(this.myDiagram, {
      allowDragOut: !readonly,
      allowDrop: !readonly,
      allowGroup: !readonly,
      allowInsert: !readonly,
      allowLink: !readonly,
      allowMove: !readonly,
      allowRelink: !readonly,
      allowReshape: !readonly,
      allowResize: !readonly,
      allowRotate: !readonly,
      //     allowSelect: !readonly,
      allowTextEdit: !readonly,
      allowUndo: !readonly,
      allowUngroup: !readonly,
      'undoManager.isEnabled': !readonly
    })

  }

  setScale(num) {
    this.myDiagram.scale = num
  }

  setSetting(setting) {
    if (setting.lineToNode !== undefined || (!this.setting || setting.primaryColor !== this.setting.primaryColor)) {
      replaceLinkTemplate(this.myDiagram, setting.lineToNode, setting.primaryColor, this.readonly)
      if (setting.lineToNode) {
        // setToolManager(this.myDiagram)
      } else {
        // this.myDiagram.toolManager.linkingTool.temporaryLink = undefined
        /*   this.myDiagram.toolManager.linkingTool.temporaryFromNode = undefined
           this.myDiagram.toolManager.linkingTool.temporaryToNode = undefined*/
        /*this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.OrientAlong
        this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.OrientAlong*/
      }

    }
    if (!this.setting || setting.primaryColor !== this.setting.primaryColor) {
      let selectionAdornmentTemplate = $(go.Adornment, 'Auto',
        $(go.Shape, {
          fill: null,
          stroke: setting.primaryColor,
          strokeWidth: 3
        }),
        $(go.Placeholder, { padding: 1 })    //占位符,表示所有构件的面积，
      )
      this.myDiagram.nodeTemplateMap.each(item => {
        item.value.selectionAdornmentTemplate = selectionAdornmentTemplate
      })
      this.updateData(this.getJson())
      if (this.myPalette) {
        this.myPalette.nodeTemplateMap.each(item => {
          item.value.selectionAdornmentTemplate = selectionAdornmentTemplate
        })
        this.myPalette.model = new go.GraphLinksModel(this.nodeTempls)
      }
    }
    if (setting.mouseWheelBehavior !== undefined) {
      this.myDiagram.toolManager.mouseWheelBehavior = setting.mouseWheelBehavior ? go.ToolManager.WheelZoom : undefined
    }
    if (setting.grid !== undefined) {
      this.myDiagram.grid = setting.grid ? $(go.Panel, 'Grid',
        $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
        $(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
        $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
        $(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
      ) : $(go.Panel, 'Grid')
    }
    this.setting = setting
    this.myDiagram.layoutDiagram()
  }

  cmd(val) {
    let diagram = this.myDiagram
    this.doKeyDown({ctrlKey: true, code:val})
   /* switch (val) {

      case 'cut':
        this.copySelection()
        this.deleteSelection()
        // diagram.commandHandler.cutSelection()
        break
      case 'copy':
        this.copySelection()
        // diagram.commandHandler.copySelection()
        break
      case 'paste':
        this.pasteAction()
        // diagram.commandHandler.pasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint)
        break
      case 'delete':
        this.deleteSelection()
        // diagram.commandHandler.deleteSelection()
        break
    }*/
    diagram.currentTool.stopTool()
  }
}

export default FlowChart
