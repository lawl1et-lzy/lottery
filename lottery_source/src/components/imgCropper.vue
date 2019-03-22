<template>
  <div class="cropper-wrapper" v-show="isCropperShow">
    <div class="cropper-main">
      <vue-cropper
      ref="cropper"
      :img="img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :full="option.full"
      :canMove="option.canMove"
      :original="option.original"
      ></vue-cropper>
    </div>
    <div class="button-group">
      <span @click="cancel()">取消</span>
      <span @click="rotateLeft" class="button-rotate">
        <img src="../public/default-img/icon-left.png" alt="left">
        左旋转
      </span>
      <span @click="rotateRight" class="button-rotate">
        <img src="../public/default-img/icon-right.png" alt="right">
        右旋转
      </span>
      <span @click="finish('base64')">确定</span>
    </div>
  </div>
</template>
<script>
import vueCropper from './vue-cropper.vue'
export default {
  name: 'Cropper',
  props: ['cropperOptions'], // preImgUrl && isCropperShow
  data() {
    return {
      option: {
        size: 0.75,   // 生成图片的质量
        outputType: "jpeg", // 输出的图片格式 png || jpeg || webp
        full: false,  // 是否输出原图比例的截图
        canMove: false, // 图片能否在操作框中移动
        original: false, // 上传的图片是否按照原图比例渲染
      },
    }
  },
  computed: {
    // 生成截图框中的图片
    img () {
      return this.cropperOptions.preImgUrl
    },
    isCropperShow () {
      return this.cropperOptions.isCropperShow
    }
  },
  methods: {
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 生成图片
    // type : base64 || blob
    finish(type) {
      this.$refs.cropper.getCropData(data => {
        this.cropperOptions.isCropperShow = false
        this.$emit('cropperClick', data)
      })
    },
    cancel () {
      this.cropperOptions.isCropperShow = false
    }
  },
  components: {
		vueCropper
  }
};
</script>
<style lang="scss" scoped>
.cropper-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
    background-color: #f3f7fa;
  .cropper-main{
    height: 80%;
    width: 90% !important;
    .vue-cropper{
      background-image: none;
    }
  }
  .button-group{
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
    padding: 22px;
    align-items: center;
    color: #006aee;
    font-size: 16px;
    .button-rotate{
      color: #666666;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 30px;
      }
    }
  }
}
</style>
