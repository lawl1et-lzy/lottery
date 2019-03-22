<template>
  <div class="model-warp" v-if="isOpen">
    <div class="model-panel">
      <div class="d-flex align-items-centr model-container j-between">
        <div class="f-14">拒绝原因：</div>
        <div class="v-select re f-14">
          <div @click="openOptions" :class="{phd:selectedValue.id==0}">{{selectedValue.value}}</div>
          <div class="select-box ab" v-if="open">
            <div class="select-item" @click="selsected(item)" v-for="item in optionsData" :key="item.id">{{item.value}}</div>
          </div>
        </div>
        <div class="mr-10"><i class="iconfont icon-right f-12"></i></div>
      </div>
      <div v-if="selectedValue.id==5">
        <textarea v-model="otherValue" name="" id="" cols="30" rows="4"></textarea>
      </div>
      <div class="model-btn d-flex align-items-center">
        <div class="text-center wp-50" @click="no">取消</div>
        <div class="text-center wp-50" @click="yes">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'alertModel',
    props: ['isOpen'],
    data: function () {
      return {
        selectedValue: {
          id:0,
          value: '请选择拒绝原因'
        },
        otherValue: '',
        open: true,
        optionsData: [{
            id: 1,
            value: '图片不清晰'
          },
          {
            id: 2,
            value: '身份信息不符'
          },
          {
            id: 5,
            value: '其他原因'
          },
        ]
      }
    },
    methods: {
      no() {
        this.$emit('no')
      },
      yes() {
        let value = ''
        let text = '没有选择拒绝原因'
        if(this.selectedValue.id!=0 && this.selectedValue.id !=5) {
          value = this.selectedValue.value
        }
        if (this.selectedValue.id == 5) {
          value = this.otherValue;
          text = '没有填写拒绝原因'
        }
        if (value) {
          this.$emit('yes', value)
        } else {
          MessageBox.alert(text, '')
        }
      },
      openOptions(){
        this.open = true
      },
      selsected(item){
        this.open = false;
        this.selectedValue = item
      }
    }
  }

</script>

<style scoped>
  .model-warp {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .model-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 85%;
    min-height: 30%;
    border-radius: 3px;
    font-size: 16px;
    overflow: hidden;
    backface-visibility: hidden;
    transition: .2s;
  }

  @media (max-height:400px){
    .model-panel {
      top: 10% !important;
      transform: translate(-50%, 0%);
      height: 50%;
    }
  }

  .model-btn {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 40px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: #006D55;
  }
   .model-container{
     padding: 20px;
   }

  .v-select {
    color: rgba(0, 0, 0, .8);
    flex-grow: 1;
    flex-shrink: 0;
    text-align: left;
    z-index: 2;
  }
  .phd{
    color: rgba(0, 0, 0, .5);
  }

  .select-box {
    background: #fff;
    padding: 10px;
    padding-top: 0px;
    border: 1px solid rgba(0,0,0,0.1);
  }

  .select-item {
    margin-top: 3px;
  }

  .wp-50 {
    width: 50%;
  }

</style>
