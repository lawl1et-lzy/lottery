<template>
  <div class="load-box fh scroll">
    <div class="notes" v-if="imgArr[0].src">
      请点击图片重新上传照片
    </div>
    <div class="load-img-box">
      <div class="loadimg-position" v-for="item in imgArr" :key="item.index">
        <div class="img-container">
          <img width="100%" height="100%" :src="item.bg_src" alt="">
          <input type="file"  accept="image/*" @change="loadFile($event,item)" />
        </div>
        <span class="img-desc">
          {{item.desc}}
        </span>
      </div>
    </div>
    <div class="mt-20 h-40">
      <button :disabled="loading" @click="nextStep" class="sub-btn">下一步</button>
    </div>
  </div>
</template>

<script>
import { api } from "../public/api";
import swal from "sweetalert";
import { Indicator } from "mint-ui";
let backImg = require("../public/default-img/zc-back.png");
let frontImg = require("../public/default-img/zc-front.png");
let yanImg = require("../public/default-img/zc-yan.png");
let licenseImg = require("../public/default-img/license.png");
export default {
  name: "shop-img",
  data: function() {
    return {
      imgArr: [
        {
          name: "front",
          bg_src: frontImg,
          src: "",
          type: "id_number",
          desc: "上传身份证正面照"
        },
        {
          name: "back",
          bg_src: backImg,
          src: "",
          type: "id_number",
          desc: "上传身份证反面照"
        },
        {
          name: "yan_code",
          bg_src: yanImg,
          src: "",
          type: "yan_code",
          desc: "上传烟草证"
        },
        {
          name: "business_license",
          bg_src: licenseImg,
          src: "",
          type: "business_license",
          desc: "上传营业执照"
        }
      ],
      loading: false,
      refuse: ""
    };
  },
  created: function() {
    this.initImgArrData();
    this.refuse = this.$route.query.refuse;
  },
  methods: {
    // imgRotate(item){
    //   item.deg += 90
    //   item.roate = `rotate(${item.deg}deg)`
    // },
    initImgArrData: function() {
      var _vue = this;
      api
        .request("mobile/Register/getClubImage")
        .then(res => {
          if (res.code === 0) {
            if (res.data.front) {
              _vue.imgArr[0].src = _vue.imgArr[0].bg_src = res.data.front;
            }
            if (res.data.back) {
              _vue.imgArr[1].src = _vue.imgArr[1].bg_src = res.data.back;
            }
            if (res.data.yan_image) {
              _vue.imgArr[2].src = _vue.imgArr[2].bg_src = res.data.yan_image;
            }
            if (res.data.business_license) {
              _vue.imgArr[3].src = _vue.imgArr[3].bg_src =
                res.data.business_license;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextStep: function() {
      var reqData = {};
      for (let item of this.imgArr) {
        if (item.src) {
          reqData[item.name] = item.src;
        } else {
          swal({ button: "关闭", text: "请完成照片上传！" });
          return;
        }
      }
      var _vue = this;
      api
        .request("mobile/Register/uploadClubImage", reqData)
        .then(res => {
          if (res.code === 0) {
            this.$router.push({ path: "/shopzc" });
          } else {
            swal({ button: "关闭", text: res.mag });
          }
        })
        .catch(err => {
          console.log(err);
          swal({ button: "关闭", text: "信息提交失败,请联系客服" });
        });
    },
    loadFile: function(e, item) {
      var imageBase64 = "";
      var file = e.target.files[0];
      if (file) {
        this.loading = true;
        Indicator.open("图片上传中...");
      } else {
        // swal({button:'关闭', text:'文件不存在'});
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      var _vue = this;
      reader.onloadend = function() {
        imageBase64 = reader.result;
        if (file.size / 1024 / 1024 > 1) {
          Indicator.close();
          Indicator.open("图片正在压缩...");
          // swal({button:'关闭', text:'图片太大，正在压缩'});
          _vue.compressImage(imageBase64, { width: 1240 }, item);
        } else {
          _vue.uploadImage(imageBase64, item);
        }
      };
    },

    uploadImage: function(url, item) {
      var reqData = {
        type: item.type,
        base64: url
      };
      var _vue = this;
      api
        .request("mobile/Register/uploadBase64", reqData)
        .then(res => {
          if (res.data) {
            item.bg_src = url;
            item.src = res.data;
          } else {
            item.src = "";
            swal({ button: "关闭", text: "图片上传失败," + res.msg });
          }
          _vue.loading = false;
          Indicator.close();
        })
        .catch(err => {
          item.src = "";
          swal({ button: "关闭", text: "图片上传失败,请联系客服" });
          _vue.loading = false;
          Indicator.close();
          console.log(err);
        });
    },
    compressImage: function(path, obj, item) {
      var _vue = this;
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.8; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        // console.log(base64);
        _vue.uploadImage(base64, item);
      };
    }
  }
};
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
    background-color: #16a685;
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