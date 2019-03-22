<template>
  <div class="load-prompt" v-show="options.isShow">
    <div class="load-prompt-con">
      <img src="@/public/default-img/zc-prompt.png" alt="prompt">
      <button class="btn-known" @click="handleKnownClick">知道了</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'img-upload-prompt',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    // 照片规则提示层 点击事件
    handleKnownClick () {
      this.$emit('closePrompt')
    }
  }
}
</script>

<style lang="scss" scoped>
.load-prompt{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .load-prompt-con{
    box-sizing: border-box;
    background-color: #fff;
    padding: 30px;
    width: 80%;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width: 100%;
    }
    .btn-known{
      display: inline-block;
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      height: 100%;
      margin-top: 36px;
      padding: 0 30px;
      background-color: #fff;
      color: #2a6853;
      border-radius: 4px;
      border: 1px solid#006d55;
      outline: none;
    }
  }
}
</style>
