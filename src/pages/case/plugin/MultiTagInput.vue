<template>
    <div>
        <template v-for="(tag, index) in tags">
            <a-tag :key="tag" :closable="!readonly" @close="() => handleClose(tag)">
                {{ tag }}
            </a-tag>
        </template>
        <template v-if="!readonly">
            <a-input
                    v-if="inputVisible"
                    ref="input"
                    type="text"
                    size="small"
                    :style="{ width: '78px' }"
                    :value="inputValue"
                    @change="handleInputChange"
                    @blur="handleInputConfirm"
                    @keyup.enter="handleInputConfirm"></a-input>
            <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                <a-icon type="plus" /> {{addText}}
            </a-tag>
        </template>
    </div>
</template>
<script>
  export default {
    name: 'MultiTagInput',
    props: {
      readonly: Boolean,
      value: String,
      addText: {
        type: String,
        default: '新增'
      },
      separator: {
        type: String,
        default: ','
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        tags: [],
        inputVisible: false,
        inputValue: '',
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('val === this.changeData', val, this.changeData)
          if (this.changeData === val) {
            return
          }
          if(val === undefined || val === null || (val = val.trim()).length === 0){
            this.tags = []
            return
          }
          this.tags = val.split(this.separator)
        }
      }
    },
    methods: {
      handleClose(removedTag) {
        const tags = this.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.tags = tags;
        this.$emit('change', this.changeData = tags.join(this.separator))
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(function() {
          this.$refs.input.focus();
        });
      },

      handleInputChange(e) {
        this.inputValue = e.target.value;
      },

      handleInputConfirm() {
        const inputValue = this.inputValue;
        let tags = this.tags;

        Object.assign(this, {
          inputVisible: false,
          inputValue: '',
        });

        if(tags.indexOf(inputValue) > -1){
          return
        }

        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = this.tags = [...tags, inputValue];
        }
        console.log(tags);

        this.$emit('change', this.changeData = tags.join(this.separator))
      },
    },
  };
</script>
