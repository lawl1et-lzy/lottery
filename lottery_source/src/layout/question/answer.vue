<template>
  <div class="scroll fh answer-box">
    <div class="answer-item" v-for="item in answer" :key="item.id">
      <div class="item-q">
        <span>
          <img src="../../assets/question.png" width="15" height="15" alt="">
        </span>
        <span v-html="item.q">
        </span>
      </div>
      <div class="item-a">
        <div v-for=" (a, index) in item.a" :key="index" v-html="a" ></div>
      </div>
    </div>
  </div>
</template>

<script>
import fqa from './fqa'
export default {
  name:'question',
  data: function () {
    return {
      answer:[],
    }
  },
  created(){
    let id = this.$route.query.id;
    if(id) {
      this.answer = fqa[id];
    }
  },
  methods:{}
}
</script>
<style lang="scss" scoped>
  .answer-box{
    padding-bottom: 100px;
    box-sizing: border-box;
    background: #F3F7FA;
  }
  .answer-item{
    background: #fff;
    margin-bottom:15px;
    font-size: 14px;
    line-height: 20px;
    .item-q{
      padding: 10px 15px 10px 0;
      margin-left: 15px;
      border-bottom: 1px dashed rgba(0,0,0,0.2)
    }
    .item-a{
      padding: 15px;
      padding-left: 30px;
      color: rgba(0,0,0,0.6);
    }
  }
</style>

