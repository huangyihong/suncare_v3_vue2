<template>
  <div class="relative content" ref="content">
    <div :style="{width: contentWidth + 'px'}">

    <div class="left-item" :style="{width: leftWidth + unit,paddingRight:padding + 'px'}">
      <slot name="left"></slot>
    </div>

    <vue-draggable-resizable
      class="line-style"
      classNameDragging="active"
      :style="{left: px?offset - 5 + unit: `calc(${offset + unit} - 5px)`, ...lineStyle}"
      :w="10"
      :x="0"
      :z="1"
      axis="x"
      :draggable="true"
      :resizable="false"
      :onDrag="onDragEvent"
    ></vue-draggable-resizable>
    <div class="right-item" :style="{width: rightWidth + unit,paddingLeft:padding + 'px'}">
      <slot name="right"></slot>
    </div>
    </div>
  </div>
</template>

<script>
  // 节流
  import throttle from 'lodash/throttle'

  export default {
    name: 'ResizeDivision',
    components: {},
    props: {
      // 初始偏移值
      offset: {
        type: Number,
        default: 30
      },
      // -1 不限 px=false百分比 px=true数值
      limit: {
        type: Number,
        default: -1
      },
      // 是否px单位，默认百分比
      px: {
        type: Boolean,
        default: false
      },
      lineStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 内距间隔
      padding: {
        type: Number,
        default: 24
      },

    },
    data() {
      return {
        leftWidth: 30,
        rightWidth: 70,
        resizableX: 0,
        contentWidth: 100,
        onDragEvent: this.px ? this.onDragPX : this.onDrag,
        unit: this.px ? 'px' : '%'
      }
    },
    beforeMount() {
      // this.onDragEvent(0)
    },
    mounted() {
    },
    methods: {
      onDrag(x) {
        let perVal = (this.resizableX = x) * 100.0 / this.contentWidth
        return this.setWidth(perVal)
      },

      setWidth(x) {
        let isDrug = true
        if (this.limit !== -1 && Math.abs(x) > this.limit) {
          x = x < 0 ? 0 - this.limit : this.limit
          isDrug = false
        }
        let leftWidth = this.offset + x
        if (leftWidth >= 100 || leftWidth <= 0) {
          this.leftWidth = this.rightWidth = 100
          isDrug = false
        } else {
          this.rightWidth = 100 - (this.leftWidth = leftWidth)
          isDrug = isDrug && true
        }
        return isDrug
      },

      onDragPX(x) {
        this.resizableX = x
        let isDrug = true
        if (this.limit !== -1 && Math.abs(x) > this.limit) {
          x = x < 0 ? 0 - this.limit : this.limit
          isDrug = false
        }
        let leftWidth = this.offset + x
        if (leftWidth >= this.contentWidth || leftWidth <= 0) {
          this.leftWidth = this.rightWidth = this.contentWidth
          isDrug = false
        } else {
          this.rightWidth = this.contentWidth - (this.leftWidth = leftWidth)
          isDrug = isDrug && true
        }
        // console.log(this.leftWidth, this.rightWidth)
        return isDrug
      }

    },
    watch: {
      winWidth: {
        immediate: true,
        handler(val) {
          this.$nextTick(() => {
            this.contentWidth = this.$refs.content.clientWidth
            this.onDragEvent(this.resizableX)
          })

        }
      }
    },
    computed: {
      winWidth() {
        return this.$store.getters.width
      }
    }
  }
</script>
<style lang="less" scoped>

  .content{
    .left-item, .right-item {
      /*display: inline-block;*/
      float: left;
      /*transition: width .3s;*/
      overflow: hidden;
    }
    .line-style {
      position: absolute;
      top: 0;
      height: 100%!important;
      cursor: col-resize;
      transition: background-color .3s;

      &:after {
        display: inline-block;
        content: '';
        width: 6px;
        height: 100%;
        border-right: 2px dashed #b3b3b3;
      }
      &.active{
        background: rgba(0,0,0,0.08);
      }
    }
    &:after{
      clear:both;
      content:".";
      display:block;
      height:0;
      line-height:0;
      visibility:hidden;
    }
  }



</style>
