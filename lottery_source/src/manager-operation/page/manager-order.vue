<template>
     <div>
      <div class="nav nav-box manager-nav">
        <div  class="nav-item" :class="{'nav-active': item.active}" 
        v-for="item in nav" 
        :key="item.index"
        @click="navChange(item)"
        >{{item.name}}</div>
      </div>
      <div class="list-container scroll" @scroll="isScrollBottom">
        <div class="item re" v-for="item in list" :key="item.index" >
          <!-- <div v-if="item.order_status == '1'" class="delivering f-14">配送中</div> -->
          <div v-if="item.order_status == '2'" class="delivered">
            <img src="../../assets/complete.png" width="60" height="60" alt="complete"/>
          </div>
          <div class="d-flex bb p-15 align-items-center">
            <div class="mr-15">
              <img v-if="selectName =='待配送'" src="../../assets/lottery-order/unpayed.png" width="60" height="60" alt="">
              <img v-if="selectName =='配送中'" src="../../assets/lottery-order/payed.png" width="60" height="60" alt="">
              <img v-if="selectName =='已完成'" src="../../assets/lottery-order/finish.png" width="60" height="60" alt="">
            </div>
            <div>
              <div class="mb-3">{{item.club_name}}</div>
              <div class="text-gray-45 f-13 mb-3">
                <span>
                  <svg class="icon" width="12px" height="12px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#59a090" d="M510.21244873 582.60827606c-156.23198297 0-283.32687985-127.09489689-283.32687986-283.32687985S353.98046576 15.95451635 510.21244873 15.95451635 793.53932855 143.04941326 793.53932855 299.28139621 666.44443167 582.60827606 510.21244873 582.60827606z m0-521.96497739c-131.56377515 0-238.63809753 107.07432242-238.63809756 238.63809754S378.64867359 537.91949376 510.21244873 537.91949376 748.85054624 430.84517133 748.85054624 299.28139621 641.77622382 60.64329867 510.21244873 60.64329867z"  /><path fill="#59a090" d="M823.21268002 665.01439063c-23.59567705-23.95318731-49.33641568-44.86753743-77.04346071-62.3855401l-32.89094377 32.89094377c107.07432242 64.53060166 181.07894592 179.29139462 188.58666132 310.31890437H126.96145162C138.04426962 751.53187317 292.48870129 596.01491074 484.65046523 581.35699015v-44.86753747c-101.71166853 6.79269492-196.63064217 48.80015029-270.81402079 120.48095713-83.12113509 80.26105302-130.13373407 188.22915109-132.10004051 303.88371973v29.85210658h865.71109092v-22.34439116c-0.17875514-114.22452758-44.15251693-221.83511538-124.23481483-303.34745433z"  /></svg>
                </span>
                {{item.name}} 
                <span class="ml-5">{{item.phone}}</span>
            </div>
              <div class="text-gray-45 f-13">
                <span>
                  <svg class="icon" width="12px" height="12px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#59a090" d="M820.88886333 715.06582681c-32.22359132-8.96159047-68.64196964-16.39780386-107.72975789-22.11796799v48.24005089c34.51165696 5.33881986 66.54457614 12.01234468 94.95472465 19.82990233 87.13716701 24.21536151 110.20849568 51.67214937 110.2084957 62.73113336s-23.07132867 38.51577186-110.2084957 62.73113334c-80.27297005 22.30864012-187.62138365 34.70232908-301.83399423 34.70232912s-221.56102421-12.20301682-301.83399422-34.70232912c-87.13716701-24.21536151-110.20849568-51.67214937-110.20849569-62.73113334s23.07132867-38.51577186 110.20849569-62.73113336c29.55418135-8.19890193 62.9218055-15.0630989 98.76816739-20.40191875v-48.24005087c-40.61316537 5.91083627-78.17557653 13.5377218-111.54320062 22.68998439-96.28942962 26.69409931-145.10149691 63.30314976-145.10149693 108.68311859s48.81206729 81.79834714 145.10149693 108.68311859c84.27708494 23.45267297 196.20162986 36.41837831 314.60902745 36.41837831s230.33194252-12.96570538 314.60902747-36.41837831c96.28942962-26.69409931 145.10149691-63.30314976 145.10149692-108.68311859s-48.62139514-81.98901929-145.10149692-108.68311859z"  /><path fill="#59a090" d="M506.27983586 470.43347395c-75.50616659 0-136.90259498-61.39642841-136.90259497-136.90259498s61.39642841-136.90259498 136.90259497-136.90259501c75.50616659 0 136.90259498 61.39642841 136.902595 136.90259501s-61.39642841 136.90259498-136.902595 136.90259498z m0-226.32782766c-49.19341158 0-89.23456052 40.04114894-89.2345605 89.23456054 0 49.19341158 40.04114894 89.23456052 89.2345605 89.23456052 49.19341158 0 89.23456052-40.04114894 89.23456051-89.23456052 0-49.19341158-40.04114894-89.23456052-89.23456051-89.23456054z"  /><path fill="#59a090" d="M506.27983586 795.14812471h-0.38134428c-10.86831185-0.19067215-14.68175461-4.5761313-29.36350922-20.59259088-6.48285271-7.0548691-17.16049241-19.06721379-31.0795585-35.46501763-22.88065653-26.69409931-57.58298563-68.83264177-93.23867539-117.2633648-91.52262617-124.69957817-138.0466278-221.75169632-138.04662782-288.6776167 0-161.11795649 130.99175869-292.10971519 292.10971521-292.10971521 161.11795649 0 292.10971519 130.99175869 292.1097152 292.10971521 0 65.20987116-44.23593597 159.40190724-131.75444726 279.90669838-62.9218055 86.75582274-130.99175869 162.45266147-142.62275912 174.08366185-2.09739353 2.28806565-7.81755764 8.00822981-17.73250882 8.00822978z m0-706.05892648c-134.80520147 0-244.44168073 109.63647926-244.44168075 244.44168074 0 54.53223143 42.90123101 142.24141484 123.74621749 253.59394334 48.04937876 66.16323184 96.48010174 122.41151249 120.69546326 149.48695608 58.72701845-65.40054327 244.25100861-288.86828885 244.25100861-403.08089942 0.19067215-134.80520147-109.44580715-244.44168073-244.25100861-244.44168074z"  /></svg>
                </span>
                {{item.area}}{{item.city}}{{item.address}}
              </div>
            </div>
          </div>
          <div class="f-13 text-gray-65 px-15 my-10-7">订单号：<span class="ml-5">{{item.trade_no}}</span></div>
          <div class="f-13 text-gray-65 px-15 my-10-7">下单时间：<span class="ml-5">{{item.create_date}}</span></div>
          <div v-if="item.order_status == '1' && item.update_date" class="f-13 text-gray-65 my-10-7 px-15">配送时间：<span class="ml-5">{{item.update_date}}</span></div>
          <!-- <div v-if="item.order_status == '2' && item.update_date" class="f-13 text-gray-65 my-10-7">完成时间：<span class="ml-5">{{item.update_date}}</span></div> -->
          <div class="f-13 text-gray-65 px-15 my-10-7" v-if="item.pay_type">支付方式：{{item.pay_type}}</div>
          <div class="d-flex flex-warp order-list f-12 text-gray-45">
            <div class="mt-3" v-for="ticket in item.tickets" :key="ticket.index">{{ticket.title}}*{{ticket.ticket_num}}；</div>
          </div>
          <div class="f-12 text-gray-45 confirm-text p-15" v-if="item.order_status == '2' && item.confirmer">
            <span><i class="iconfont icon-goods i-color"></i></span>
            <span>确认收货:</span>
            <span>{{item.confirmer}}</span>
            <span v-if="item.update_date" class="ml-5">{{item.update_date}}</span>
          </div>
          <div v-if="selectName=='待配送'" class="d-flex justify-content-end px-15 my-15">
            <button @click="deliveryorder(item)" class="btn btn-self btn-confirm btn-pad"><i class="iconfont icon-delivery" aria-hidden="true"></i>  配送</button>
          </div>
          <div v-if="selectName=='配送中'" class="d-flex justify-content-end px-15 my-15">
            <button @click="confirmOrder(item)" class="btn btn-self btn-confirm btn-pad"> 确认收货</button>
          </div>
        </div>
        <div v-if="isLoading" class="custom-loading mt-15">
          <div class="loading-item"></div>
          <div class="loading-text">正在加载...</div>
        </div>
        <div v-if="list.length && noMore &&!isLoading" class="text-center f-12 text-gray-45 mt-15" >—— 没有更多了 ——</div>
      </div>
      <div v-if="!list.length && !isLoading" class="empty-order">
        <div>
          <img src="../../assets/review-empty.png" alt="">
        </div>
        <div>列表为空</div>
      </div>
    </div>
</template>

<script>
import {api} from '../../public/api'
import { MessageBox } from 'mint-ui'
export default {
  name: 'manager-order',
  data: function() {
    return {
       nav: [
        {
          name:'待配送',
          url: 'mobile/order/getUndeliveredOrder',
          active: true,
        },
        {
          name:'配送中',
          url: 'mobile/order/getDeliveringOrder',
          active: false,
        },
        {
          name:'已完成',
          url: 'mobile/order/getDeliveredOrder',
          active: false,
        }
      ],
      list:[],
      params:{
        pageIndex: 1,
        entryNum: 10
      },
      url:'mobile/order/getUndeliveredOrder',
      selectName: '待配送',
      isLoading: false,
      oldScroll: 0,
      noMore: false,
    }
  },
  methods: {
    navChange: function (item) {
      if (this.selectName === item.name ||this.isLoading) {
        return
      }
      this.selectName = item.name
      this.nav.map((nav) => nav.active = false)
      item.active = true
      this.url = item.url
      this.list = []
      this.params.pageIndex = 1
      this.noMore = false
      this.oldScroll = 0
      this.getList(item.url)
    },
    loadMore() {
      this.noMore = true
      this.params.pageIndex ++
      this.getList(this.url)
    },
    isScrollBottom(e) {
      if(this.noMore) {
        return
      }
      let st = e.target.scrollTop;
      if(st-this.oldScroll <= 0) {
        return
      }
      let ch = e.target.clientHeight;
      let sh = e.target.scrollHeight;
      this.oldScroll = st;
      if (sh-st-ch < 10) {
        this.loadMore()
      }
    },
    deliveryorder: function(item) {
      let order =[{
        user_id: item.user_id,
        id: item.id
      }]
      let data = {
        data: JSON.stringify(order)
      }
      api.request('mobile/order/deliveredOrder',data)
        .then(res => {
          let resData = res
          if (resData.code == 0) {
            this.navChange(this.nav[1])
          } else {
            swal({
              text:`提交失败，${resData.msg}`,
              button: '关闭'
            })
          }
        })
        .catch(err => {
          swal({
            text:`服务器错误，请联系工作人员`,
            button: '关闭'
          })
        })
    },

    confirmOrder(item) {
      MessageBox.confirm('', {
          title: '提示',
          message: '是否确认收货?',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(action => {
          if(action === 'confirm'){
             let data = JSON.stringify([{
              user_id: item.user_id,
              id: item.id
            }])
            api.request('mobile/order/confirmOrder',{data})
              .then(res => {
                if (res.code == 0) {
                  this.navChange(this.nav[2])
                } else {
                  swal({
                    text:`提交失败，${res.msg}`,
                    button: '关闭'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
                }
              })
        .catch(err=>{
        })
    },
    getList: function(url) {
      if(this.isLoading) {
        return
      }
      this.isLoading = true
     api.request(url, this.params)
        .then(res => {
          let resData = res
          if (resData.code == 0) {
            this.list = [...this.list, ...resData.data.lists];
            if (this.list.length >= resData.data.length) {
              this.noMore = true
            } else {
              this.noMore = false
            }
          } else {
            this.noMore = false
            swal({
              text:`${resData.msg}`,
              button: '关闭'
            })
          }
        })
        .catch(err => {
          console.log(err)
          swal({
            text:`服务器错误，请联系工作人员`,
            button: '关闭'
          })
        })
        .then(() => {
          this.isLoading = false
        })
    }
  },
  created: function () {
    let state = this.$route.query.state
    // console.log(this.$route);
    if(state) {
      this.selectName = ''
      this.navChange(this.nav[state])
    } else {
      this.getList(this.url)
    }
  }
}
</script>

<style scoped>
.manager-nav {
  padding-top: 0 !important;
  line-height: 45px; 
}
.manager-nav > .nav-item{
  font-size: 15px;
  color: #575757;
  padding: 2px 25px 0 !important;
}
.list-container{
  position: fixed;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  padding-bottom: 20px;
}
.scroll{
  overflow: auto;
}
.item{
  margin-top: 20px;
  background: #fff;
  overflow: hidden;
}
.delivering{
  position: absolute;
  top: 10px;
  right: 15px
}
.delivered{
  position: absolute;
  top: -5px;
  right: -5px;
  transform: rotate(30deg);
}
.bb{
  border-bottom: 1px solid rgba(0,0,0,0.1)
}
.order-list > div {
  width: 33%;
  text-align: left;

}
.order-list {
  padding: 0 15px 8px;
}
.my-10-7{
  margin: 10px 0 7px;
}

.btn-self{
  border-radius: 13px;
  padding: 3px 10px;
}
.btn-color{
  color: #2A6853;
  border-color: #2A6853;
}
.manager-btn{
  background: #fff;
  border: 1px solid #2A6853;
  padding: 7px 30px;
  border-radius: 10px;
  color: #2A6853;
  outline: none;
}

.manager-btn:active{
  background: #2A6853;
  color: #fff;
}
.manager-btn:disabled{
  background: #e9eaea;
}


.flex-warp {
    flex-wrap: wrap;
}

.justify-content-end {
  justify-content: flex-end;
}

.mt-3 {
    margin-top: 3px !important;
}
.mb-3 {
    margin-bottom: 3px !important;
}

.pr-20{
    padding-right: 20px !important;
}

.mb {
    margin-bottom: 5px !important;
}

.my-15 {
    margin-top: 10px !important;
    margin-bottom: 15px !important;
}

.ml-5 {
    margin-left: 5px !important;
}

.mr-15 {
    margin-right: 15px !important;
}
.mt-15 {
    margin-top: 15px !important;
}

.text-gray-45 {
    color: rgba(0, 0, 0, 0.45)
}

.text-gray-65 {
    color: rgba(0, 0, 0, 0.65)
}

.text-center {
    text-align: center;
}

.f-12 {
    font-size: 12px;
}
.f-13 {
    font-size: 13px;
}
.f-14 {
    font-size: 14px;
}
.f-18 {
    font-size: 18px;
}
.nav {
    height: 52px;
    width: 100%;
    font-size: 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    z-index: 200;
}
.nav-box {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding-top: 15px;
}
.nav-item {
  width: 33.33%;
  text-align: center;
}
.nav-active {
    color: #16a686;
    border-bottom: 2px solid #16a686;
}
.empty-order{
  margin-top: 120px;
  text-align: center;
   color: rgba(0,0,0,0.65);
}
.confirm-text{
  border-top: 1px solid rgba(0,0,0,0.1);
}
.i-color{
 color: #24D0A4
}

.pt-0{
  padding-top: 0 !important;
}
.btn-pad{
  padding: 3px 25px;
  box-sizing: content-box;
  min-width: 60px;
}
</style>