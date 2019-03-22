<template>
  <div>
    <div class="wrapper">
      <canvas id="signature-pad" class="signature-pad" ref="canvas"></canvas>
    </div>
    <!-- <button id="save-png" @click="saceAsPng">保存</button> -->
    <button id="clear" @click="clear">清除</button>
  </div>
</template>

<script>
  import SignaturePad from 'signature_pad'
  import {Toast} from 'mint-ui'
  export default {
    name: 'signature',
    data() {
      return {
        canvas: '',
        signaturePad: ''
      }
    },
    props: ['signatureSource'],
    methods: {
      // 重置canvas画布
      resizeCanvas() {
        this.canvas = this.$refs.canvas
        let ratio = Math.max(window.devicePixelRatio || 1, 1)
        this.canvas.width = this.canvas.offsetWidth * ratio
        this.canvas.height = this.canvas.offsetHeight * ratio
        this.canvas.getContext('2d').scale(ratio, ratio)
      },
      // 保存
      saceAsPng() {
        if (this.signaturePad.isEmpty()) {
          Toast({
            message: '您还未签名',
            duration: 1500
          })
          return false
        } else {
          let data = this.signaturePad.toDataURL('image/png')
          this.$emit('callback', data)
          return true
        }
      },
      // 清除页面
      clear() {
        if (this.signaturePad.isEmpty()) {
          return false
        }
        this.signaturePad.clear()
      },
      // 图片文件转化为base64
      async changeToBase64(imgSrc) {
        return new Promise((resolve, reject) => {
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          let img = new Image()
          img.crossOrigin = "Anonymous" // 处理跨域
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
      isDataURL() {
        let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
        if (reg.test(this.signatureSource)) {
          return true
        } else {
          return false
        }
      }
    },
    async mounted() {
      window.onresize = this.resizeCanvas
      this.resizeCanvas()
      // 初始化 SignaturePad
      this.signaturePad = new SignaturePad(this.canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
      })
      // 初始化签名
      if (this.signatureSource) {
        if (this.isDataURL(this.signatureSource)) {
          this.signaturePad.fromDataURL(this.signatureSource)
        } else {
          try {
            let dataURL = await this.changeToBase64(this.signatureSource)
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

<style scoped>
  .signature-pad {
    border: 1px solid rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 400px;
    box-sizing: border-box;
  }
</style>
