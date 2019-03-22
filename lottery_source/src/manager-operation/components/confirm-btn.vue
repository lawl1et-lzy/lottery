<template>
  <div class="confirm-btns">
    <button class="no-btn" @click="showrepulse">拒绝</button>
    <button class="yes-btn" @click="showconfirm">通过</button>
    <alert-model :isOpen="isShow" @no="repulseNo" @yes="repulseYes($event)"></alert-model>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { api } from '../../public/api'
import swal from 'sweetalert';
import alertModel from './alertModel'
export default {
  name: 'confirm-btn',
  props: ['id','type'],
  components:{
    alertModel
  },
  data(){
    return {
      inputValue: '',
      isShow: false
    }
  },
  created(){
  },
  methods: {
    repulseNo(){
      this.isShow = false;
    },
    repulseYes(e){
      this.repulse(e)
      this.isShow = false;
    },
    showrepulse(){
      this.isShow = true;
      // return;
      // MessageBox.prompt('请填写拒绝理由','',{
      //   inputPlaceholder: '拒绝理由',
      //   confirmButtonText: '确定拒绝',
      //   cancelButtonText: '取消操作',
      // })
      // .then(({ value, action }) => {
      //   this.repulse(value)
      // })
      // .catch(err => {
      //   console.log(err);
      // })
    },
    showconfirm() {
      MessageBox.confirm('', {
        title: '提示',
        message: '确定执行此操作?',
        confirmButtonText: '确定通过',
        cancelButtonText: '取消操作'
      })
      .then(action => {
        if(action === 'confirm'){
          this.confirm()
        }
      })
      .catch(err=>{
      })
    },
    repulse(value) {
      if(!value){
        MessageBox.alert('拒绝原因不能为空。','')
        return;
      }
      api.request('wechat/Audit/nopass', {
        type: this.type,
        id: this.id,
        reason: value
      })
      .then( res => {
        if (res.code === 0){
          this.$store.commit('initCheckState')
          this.$router.push({path:'/manager-review'})
        }else {
          swal({
            button: '关闭',
            text: '操作失败,'+res.msg,
          });
        }
      })
    },
    confirm(){
      api.request('wechat/Audit/pass', {
        type: this.type,
        id: this.id,
      })
      .then(res => {
        if (res.code === 0){
          this.$store.commit('initCheckState')
          this.$router.push({path:'/manager-review'})
        }else {
          swal({
            button: '关闭',
            text: '操作失败,'+res.msg,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
}
</script>

<style scoped>
  .confirm-btns{
    width: 100%;
    height: 50px;
    padding-top: 15px;
    position: fixed;
    left: 0;
    bottom: 0;
    text-align: center;
    background: #fff;
  }
  .confirm-btns .no-btn{
    margin-right: 10px;
    border: 1px solid #2A6853;
    background: #fff;
    color: #2A6853;
  }
  .confirm-btns .yes-btn{
    background: #2A6853;
  }
  .confirm-btns button{
    display: inline-block;
    width: 40%;
    height: 35px;
    color: #fff;
    border: none;
    border-radius: 3px;
  }
</style>
