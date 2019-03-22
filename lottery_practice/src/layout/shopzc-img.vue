<template>
  <div class="load-box fh scroll">
    <div class="notes ab" v-if="imgArr[0].src">
      请点击图片重新上传图片
    </div>
    <div class="load-img-box" @click.prevent.once="handleShowloadPrompt()">
      <div class="loadimg-position" v-for="item in imgArr" :key="item.index">
        <div class="img-container">
          <img width="100%" height="100%" :src="item.bg_src" alt="">
          <input type="file" accept="image/*" @change="loadFile($event,item)"/>
        </div>
        <span class="img-desc">
          {{item.desc}}
        </span>
      </div>
    </div>
    <div class="mt-20 h-40">
      <button :disabled="loading" @click="nextStep" class="sub-btn">下一步</button>
    </div>
    <!-- 照片规则提示层 -->
    <img-upload-prompt :options="showPrompt" v-show="showPrompt.hasClick" @closePrompt="handleClosePrompt"></img-upload-prompt>
    <!-- img cropper -->
    <zw-cropper :cropperOptions="cropperOptions" @cropperClick="handleCropperClick"></zw-cropper>
  </div>
</template>

<script>
import { api } from '@/public/api'
import swal from 'sweetalert'
import { Indicator } from 'mint-ui'
import imgUploadPrompt from '@/components/alert/img-upload-prompt'
import zwCropper from '@/components/cropper/img-cropper'
let backImg = require('@/public/default-img/zc-back.png')
let frontImg = require('@/public/default-img/zc-front.png')
let yanImg = require('@/public/default-img/zc-yan.png')
let licenseImg = require('@/public/default-img/license.png')
export default {
  name: 'shop-img',
  data () {
    return {
      imgArr: [
        {
          name: 'front',
          bg_src: frontImg,
          src: '',
          type: 'id_number',
          desc: '上传身份证正面照'
        },
        {
          name: 'back',
          bg_src: backImg,
          src: '',
          type: 'id_number',
          desc: '上传身份证反面照'
        },
        {
          name: 'yan_code',
          bg_src: yanImg,
          src: '',
          type: 'yan_code',
          desc: '上传烟草证'
        },
        {
          name: 'business_license',
          bg_src: licenseImg,
          src: '',
          type: 'business_license',
          desc: '上传营业执照'
        }
      ],
      loading: false,
      // 照片规则提示层 参数
      showPrompt: {
        isShow: false // 是否点击过
      },
      currItem: '', // 当前图片点击对象数据 item
      // 图片旋转参数
      cropperOptions: {
        preImgUrl: '', // 原始图片数据: base64
        isCropperShow: ''
      }
    }
  },
  components: {
    zwCropper,
    imgUploadPrompt
  },
  methods: {
    // 初始化图片数据
    initImgArrData () {
      api
        .request('/mobile/Register/getClubImage')
        .then(res => {
          if (res.code === 0 && res.data) {
            if (res.data.front) {
              this.imgArr[0].src = this.imgArr[0].bg_src = res.data.front
            }
            if (res.data.back) {
              this.imgArr[1].src = this.imgArr[1].bg_src = res.data.back
            }
            if (res.data.yan_image) {
              this.imgArr[2].src = this.imgArr[2].bg_src = res.data.yan_image
            }
            if (res.data.business_license) {
              this.imgArr[3].src = this.imgArr[3].bg_src =
                res.data.business_license
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理 '下一步' 按钮
    nextStep () {
      var reqData = {}
      for (let item of this.imgArr) {
        if (item.src) {
          reqData[item.name] = item.src
        } else {
          swal({
            button: '关闭',
            text: '请完成照片上传！'
          })
          return
        }
      }
      api
        .request('mobile/Register/uploadClubImage', reqData)
        .then(res => {
          if (res.code === 0) {
            this.$router.push({path: '/shopzc'})
          } else {
            swal({
              button: '关闭',
              text: res.mag
            })
          }
        })
        .catch(err => {
          console.log(err)
          swal({
            button: '关闭',
            text: '信息提交失败,请联系客服'
          })
        })
    },
    // 上传图片
    loadFile (e, item) {
      let file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        return false
      }
      this.loading = true

      let render = new FileReader()
      // 转化为base64
      render.readAsDataURL(file)

      render.onload = (e) => {
        this.cropperOptions.preImgUrl = e.target.result
        this.cropperOptions.isCropperShow = true
        this.currItem = item
      }
    },
    // 处理裁剪后的图片
    handleCropperClick (data) {
      this.postImg(data, this.currItem)
    },
    // upload img
    postImg (url, item) {
      var reqData = {
        type: item.type,
        base64: url
      }
      api
        .request('/mobile/Register/uploadBase64', reqData)
        .then(res => {
          if (res.data) {
            item.bg_src = url
            item.src = res.data
          } else {
            item.src = ''
            swal({
              button: '关闭',
              text: '图片上传失败,' + res.msg
            })
          }
          this.loading = false
          Indicator.close()
        })
        .catch(err => {
          console.log(err)
          item.src = ''
          swal({
            button: '关闭',
            text: '图片上传失败,请联系客服'
          })
          this.loading = false
          Indicator.close()
        })
    },
    // 显示 照片规则提示层
    handleShowloadPrompt () {
      this.showPrompt.isShow = true
    },
    // 关闭 照片规则提示层
    handleClosePrompt () {
      this.showPrompt.isShow = false
    }
  },
  created () {
    this.initImgArrData()
  }
}
</script>

<style lang="scss" scoped>
.load-box {
  padding: 20% 14% 12%;
  position: relative;
  box-sizing: border-box;
  .load-img-box {
    width: 100%;
    .loadimg-position {
      padding: 0 12%;
      margin-bottom: 8%;
      position: relative;
      .btn-position {
        top: 50%;
        transform: translateY(-50%);
        right: 8%;
      }
      .img-container {
        width: 100%;
        padding-bottom: 56%;
        height: 0;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0.1);
        & > input {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;
          opacity: 0;
        }
        & > img {
          position: absolute;
          width: 100%;
        }
      }
      .img-desc {
        margin-top: 2%;
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
  }
  .sub-btn {
    display: inline-block;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    width: 90%;
    height: 100%;
    margin: 0 5%;
    background-color:#2a6853;
    color: #ffffff;
    border-radius: 4px;
    border: none !important;
    outline: none;
  }
}
.mt-20 {
  margin-top: 20px;
}
.h-40 {
  height: 40px;
}
.notes {
  width: 100%;
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 15px;
  background: #f7f6eb;
  color: #ebbe87;
  box-sizing: border-box;
}

// swal style
.swal-button--confirm {
  padding: 7px 19px;
  border-radius: 2px;
  background-color: #2a6853;
  font-size: 12px;
  border: 1px solid #2a6853;
}
.swal-button--confirm:active {
  background-color: #274e41 !important;
}
.swal-button--cancel {
  color: rgba(0, 0, 0, 0.5);
}
</style>
