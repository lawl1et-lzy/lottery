<template>
  <div>
    <li v-if="imgs.length" class="img-item">
        <div class="item-key">
          <span>{{title}}：</span>
        </div>
        <div class="item-value">
          <div class="img-box">
            <div class="img-box-item" v-for='(img,index) in imgs' :key="index" @click="showImg(img)">
              <div class="zoomImage">
                <img :src="img" alt=""  class="img-position" >
              </div>
            </div>
          </div>
        </div>
    </li>
    <!-- <div  v-if="iSShow" class="img-modle">
      <img :src="showImgSrc" alt="" class="selef-img-height">
      <div class="close-btn" @click="closeImg">
        <img src="images/close.png" width="30" height="30" alt=""  class="img-position">
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'img-list',
  props: ['imgs','title'],
  data() {
    return {
    }
  },
  methods:{
    showImg(src) {
      window.location.href = src;
    }
  }
}
</script>

<style scoped>
  .img-item{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .img-box{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap
  }
  .img-box-item{
    width: 45%;
    margin-left: 10px;
    margin-bottom: 5px;
  }
  .item-key{
    flex-shrink: 0;
  }
  .item-value{
    flex-grow: 1;
    flex-shrink: 1;
  }
  .img-modle{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background: black;
  }
  .alert-model{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.65);
    width: 100%;
  }

  .img-modle img {
    width: 100%;
  }
  .err-text{
    color: red;
    font-size: 12px;
    text-align: left;
    padding-left: 35px;
  }
  .zoomImage{
    position: relative;
    width:100%;
    height:0;
    padding-bottom: 54%;
    overflow:hidden;
  }
</style>
