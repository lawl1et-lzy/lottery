<template>
  <div class="fh box scroll pb">
    <div v-if="dataList.length">
      <div v-for="item in dataList" :key="item.index" class="device mt-20">
        <div class="device-title re bb f-14 z-in-4">设备号：{{item.uid}}</div>
        <div class="body-box">
          <div class="info bb d-flex j-between re z-in-3">
            <div class="time-text ab f-30 bg-last-month">上月</div>
            <div class="">
              <div class="f-14">销售额：{{item.lastMonthData.total_fee}}元</div>
              <div class="mt-10 f-13">销售张数：{{item.lastMonthData.real_ticket_num}}张</div>
            </div>
            <div class="self-center">
              <div class="money-text f-14">佣金：￥{{item.lastMonthData.Commission}}</div>
            </div>
          </div>
          <div class="info bb d-flex j-between re z-in-2">
            <div class="time-text ab f-30 bg-month">本月</div>
            <div class="">
              <div class="f-14">销售额：{{item.thisMonthData.total_fee}}元</div>
              <div class="mt-10 f-13">销售张数：{{item.thisMonthData.real_ticket_num}}张</div>
            </div>
            <!-- <div class="self-center">
              <div class="money-text f-14">佣金：￥{{item.thisMonthData.Commission}}</div>
            </div> -->
          </div>
          <div class="info bb d-flex j-between re">
            <div class="time-text ab f-30 bg-today">今天</div>
            <div class="">
              <div class="f-14">销售额：{{item.todayData.total_fee}}元</div>
              <div class="mt-10 f-13">销售张数：{{item.todayData.real_ticket_num}}张</div>
            </div>
            <!-- <div class="self-center">
              <div class="money-text f-14">佣金：￥{{item.todayData.Commission}}</div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="custom-loading mt-20">
      <div class="loading-item"></div>
      <div class="loading-text">正在加载...</div>
    </div>
    <div v-if="!dataList.length && !isLoading" class="text-center empty-box w-50-center">
      <img class="w-100" src="../../assets/empty-device.png" alt="">
      <div class="i-grey-6">本店铺暂未关联设备</div>
    </div>
  </div>
</template>

<script>
import {api} from '../../public/api'
export default {
  name: 'device',
  data: function() {
    return {
      dataList: [],
      isLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.isLoading = true
      api.request('hunan/passimeter/machine/getmachineinfo')
      .then(res => {
        if (res.code == 0) {
          this.dataList = res.list;
        } else if (res.code == 1){
          this.dataList = [];
        } else {
          this.dataList = [];
          swal({button:'关闭',text:'设备信息获取失败,'+ res.msg})
        }
      })
      .catch(err => {
        this.dataList = [];
        console.log(err)
      })
      .then(()=>{
        this.isLoading = false
      })
    }
  }
}

</script>

<style scoped>
.device {
  background: #fff;
  color: #575757;
}
.pb{
  padding-bottom: 75px;
}
.device-title{
  padding: 20px 0 20px 25px;
  font-size: 14px;
  background: #fff;
}
.device-title::after{
  content: '';
  display: block;
  width: 3px;
  height: 13px;
  background-color: #16a686;
  position: absolute;
  top: 23px;
  left: 14px;
  border-radius: 10px;
}
.body-box{
  border-radius: 5px;
}
.body-box .info{
  padding: 25px 0 25px 55px;  
  background: #fff;
}
.money-text{
  display: inline-block;
  background: #e6f6f3;
  padding: 5px 10px ;
  color: #16a686;
  margin-right: 13px;
  border: 1px solid #16a686;
  border-radius: 15px;
}
.time-text{
  left: -10px;
  top: -6px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  line-height: 59px;
  text-align: center;
  color: #fff;
  transform: rotate(-30deg); 
}
.bg-last-month{
  background-color: #64ccc8;
}
.bg-month{
  background-color: #ee7e74;
}
.bg-today{
  background-color: #f2ae42;
}
.z-in-4 {
  z-index: 4;
}
.z-in-3 {
  z-index: 3;
}
.z-in-2 {
  z-index: 2;
}

.w-50-center{
  width: 50%;
  margin: auto;
}
.w-100{
  width: 100%;
}
</style>