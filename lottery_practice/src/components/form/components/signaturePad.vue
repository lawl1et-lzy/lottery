<template>
  <div class="v-mask-shadow">
    <div class="v-mask">
      <div class="mask-head">
        请在下方空白处签名
      </div>
      <div class="mask-main">
        <!-- 画稿 -->
        <canvas id="signature-pad" class="signature-pad" ref="canvas"></canvas>
      </div>
      <div class="button-group" @click.stop>
        <div class="button-group-link mt-20">
          <!-- 清除 -->
          <span @click="clear()" class="button-rotate">
            清除
          </span>
          <!-- 撤销 -->
          <span @click="undo()" class="button-rotate">
            撤销
          </span>
        </div>
        <!-- 确定 -->
        <span class="sub-btn mt-20" @click="saceAsPng()">确定</span>
        <!-- 返回按钮 -->
        <span class="sub-btn mt-20" @click="cancel()">返回</span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import SignaturePad from 'signature_pad'
import {Toast} from 'mint-ui'
export default {
  name: 'SignaturePad',
  data () {
    return {
      canvas: '',
      signaturePad: ''
    }
  },
  props: ['signatureUrl'],
  methods: {
    // 重置canvas画布
    resizeCanvas () {
      this.canvas = this.$refs.canvas
      let ratio = Math.max(window.devicePixelRatio || 1, 1)
      this.canvas.width = this.canvas.offsetWidth * ratio
      this.canvas.height = this.canvas.offsetHeight * ratio
      this.canvas.getContext('2d').scale(ratio, ratio)
    },
    // 保存
    saceAsPng () {
      if (this.signaturePad.isEmpty()) {
        Toast({
          message: '请先签名',
          duration: 1000
        })
        return false
      } else {
        let data = this.signaturePad.toDataURL('image/png')
        this.$emit('callback', data)
      }
    },
    // 清除页面
    clear () {
      if (this.signaturePad.isEmpty()) {
        return false
      }
      this.signaturePad.clear()
    },
    // 撤销上一步
    undo () {
      let data = this.signaturePad.toData()
      if (data) {
        data.pop() // 撤销上一步操作
        this.signaturePad.fromData(data)
      }
    },
    // 返回
    cancel () {
      this.$emit('closeSignMask')
    },
    // 图片文件转化为base64
    async changeToBase64 (imgSrc) {
      return new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.crossOrigin = 'Anonymous' // 处理跨域
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          let dataURL = canvas.toDataURL('image/png')
          resolve(dataURL)
        }
        img.onerror = (err) => {
          reject(err)
        }
        img.src = imgSrc
      })
    },
    // 判断是base64格式还是其他
    isDataURL () {
      let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i
      if (reg.test(this.signatureUrl)) {
        return true
      } else {
        return false
      }
    }
  },
  async mounted () {
    // 初始化
    window.onresize = this.resizeCanvas
    this.resizeCanvas()
    // 初始化 SignaturePad
    this.signaturePad = new SignaturePad(this.canvas, {
      backgroundColor: 'rgb(255, 255, 255)'
    })
    // 初始化签名
    if (this.signatureUrl) {
      if (this.isDataURL(this.signatureUrl)) {
        this.signaturePad.fromDataURL(this.signatureUrl)
      } else {
        try {
          let dataURL = await this.changeToBase64(this.signatureUrl)
          this.signaturePad.fromDataURL(dataURL)
        } catch (error) {
          Toast({
            message: '签名档不存在，请重新签名',
            duration: 1000
          })
          this.signaturePad.clear()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-mask-shadow{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  box-sizing: border-box;
  z-index: 999;
  .v-mask{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #c5c5c5;
    font-size: 12px;
    padding: 10px;
    box-sizing: border-box;
    .mask-head{
      box-sizing: border-box;
      padding: 10px 4px;
      width: 100%;
    }
    .mask-main{
      height: 50%;
      width: 100%;
      overflow: hidden;
      .signature-pad {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
    .button-group{
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 16px;
      .button-group-link{
        display: flex;
        justify-content: space-around;
      }
      .button-rotate{
        color: #3047af;
        font-size: 16px;
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
}

</style>
