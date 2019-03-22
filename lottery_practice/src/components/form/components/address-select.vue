<template>
  <div>
    <div class="mod-address-slide">
      <div class="mod-address-slide-main">
        <!-- address head -->
        <div class="mod-address-head">
          <span class="title">所在地区</span>
          <span class="close icon-wrong1 iconfont" @click="closeSelect()"></span>
        </div>
        <!-- address body -->
        <div class="mod-address-body">
          <!-- 顶部tab导航 -->
          <div class="mod-address-tab">
            <div :class="{active: tab === '1' }" @click="provinceTabClick()">{{currentProvince || placeholders.province}}</div>
            <div :class="{active: tab === '2' }" @click="cityTabClick()" v-if="showCityTab ">{{currentCity || placeholders.city}}</div>
            <div :class="{active: tab === '3' }" @click="areaTabClick()" v-if="showAreaTab">{{currentArea || placeholders.area}}</div>
            <div :class="{active: tab === '4' }" @click="streetTabClick()" v-if="showStreetTab">{{currentStreet || placeholders.street}}</div>
          </div>
          <!-- 内容选项 -->
          <div class="mod-address-list">
            <mt-tab-container v-model="tab" swipeable>
              <!-- province -->
              <mt-tab-container-item id="1">
                <div v-for="(item, index) in currentProvinceList" :key="item.code" @click="chooseProvince(item, index)" :ref="item.name === currentProvince ? 'provinceElem': ''">
                  <mt-cell :title="item.name" :class="item.name === (currentProvince || province) ? 'active': ''">
                    <span :class="item.name === (currentProvince || province) ? 'active iconfont': ''"></span>
                  </mt-cell>
                </div>
              </mt-tab-container-item>
              <!-- city -->
              <mt-tab-container-item id="2">
                <div v-for="(item, index) in currentCityList" :key="item.code" @click="chooseCity(item, index)" :ref="item.name === currentCity ? 'cityElem': ''">
                  <mt-cell :title="item.name" :class="item.name === (currentCity || city) ? 'active': ''">
                    <span :class="item.name === (currentCity || city) ? 'active iconfont': ''"></span>
                  </mt-cell>
                </div>
              </mt-tab-container-item>
              <!-- area -->
              <mt-tab-container-item id="3">
                <div v-for="(item, index) in currentAreaList" :key="item.code" @click="chooseArea(item, index)" :ref="item.name === currentArea ? 'cityElem': ''">
                  <mt-cell :title="item.name" :class="item.name === (currentArea || area) ? 'active': ''">
                    <span :class="item.name === (currentArea || area) ? 'active iconfont': ''"></span>
                  </mt-cell>
                </div>
              </mt-tab-container-item>
              <!-- street -->
              <mt-tab-container-item id="4">
                <div v-for="(item, index) in currentStreetList" :key="item.code" @click="chooseStreet(item, index)" :ref="item.name === currentStreet ? 'streetElem': ''">
                  <mt-cell :title="item.name" :class="item.name === (currentStreet || street) ? 'active': ''">
                    <span :class="item.name === (currentStreet || street) ? 'active iconfont': ''"></span>
                  </mt-cell>
                </div>
              </mt-tab-container-item>
            </mt-tab-container>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TabContainer, TabContainerItem } from 'mint-ui'
export default {
  name: 'AddressSelect',
  props: {
    province: {type: [Number, String], default: ''},
    city: {type: [Number, String], default: ''},
    area: {type: [Number, String], default: ''},
    street: {type: [Number, String], default: ''},
    wholeCode: {type: [Number, String], default: ''},
    provinceCode: {type: [Number, String], default: ''},
    wheels: {type: [Number, String], default: 1},
    provinceList: {
      type: [Array, String],
      default () {
        return []
      }
    },
    areaList: {
      type: [Array, String],
      default () {
        return []
      }
    },
    cityList: {
      type: [Array, String],
      default () {
        return []
      }
    },
    streetList: {
      type: [Array, String],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tab: '1', // 哪一列数据显示，对应 mt-tab-container-item 的 id 名称
      // head 的名称
      currentProvince: '',
      currentCity: '',
      currentArea: '',
      currentStreet: '',
      // code
      currentProvinceCode: '',
      currentCityCode: '',
      currentAreaCode: '',
      currentStreetCode: '',
      // head 选项
      showCityTab: false,
      showAreaTab: false,
      showStreetTab: false,
      placeholders: {
        province: '省',
        city: '市',
        area: '区',
        street: '街道'
      }
    }
  },
  computed: {
    currentProvinceList () {
      return this.provinceList
    },
    currentCityList () {
      return this.cityList
    },
    currentAreaList () {
      return this.areaList
    },
    currentStreetList () {
      return this.streetList
    }
  },
  watch: {
    wholeCode: {
      handler (value) {
        let wholeCodeLength = value.length ? value.length : 0 // 长度判断该地址为哪个等级
        switch (wholeCodeLength) {
          case 2:
            this.tab = '1'
            break
          case 4:
            this.tab = '2'
            break
          case 6:
            this.tab = '3'
            break
          case 9:
            this.tab = '4'
            break
          default:
            this.tab = '1'
            break
        }
      },
      immediate: true
    },
    provinceCode: {
      handler (value) {
        if (value) {
          this.currentProvinceCode = value
        }
      },
      immediate: true
    },
    province: {
      handler (value) {
        if (value) {
          this.currentProvince = value
        }
      },
      immediate: true
    },
    city: {
      handler (value) {
        if (value) {
          this.currentCity = value
          this.showCityTab = true
        }
      },
      immediate: true
    },
    area: {
      handler (value) {
        if (value) {
          this.currentArea = value
          this.showAreaTab = true
        }
      },
      immediate: true
    },
    street: {
      handler (value) {
        if (value) {
          this.currentStreet = value
          this.showStreetTab = true
        }
      },
      immediate: true
    }
  },
  components: {
    TabContainer,
    TabContainerItem
  },
  methods: {
    // 关闭弹窗
    closeSelect () {
      this.emitClose()
    },
    // tab点击事件
    provinceTabClick () {
      this.tab = '1'
    },
    cityTabClick () {
      this.tab = '2'
    },
    areaTabClick () {
      this.tab = '3'
    },
    streetTabClick () {
      this.tab = '4'
    },
    // 列表点击事件
    chooseProvince (item, index) {
      this.currentProvince = item.name
      this.currentProvinceCode = item.code
      this.tab = '2'
      if (this.wheels === '1') {
        this.emitClose()
      } else {
        this.currentCity = ''
        this.currentArea = ''
        this.currentStreet = ''
        this.showCityTab = true
        this.showAreaTab = false
        this.showStreetTab = false
      }
      this.$emit('selection', {type: 'province', value: this.setValue(item.code)})
    },
    chooseCity (item, index) {
      this.currentCity = item.name
      this.currentCityCode = item.code
      if (this.wheels === '2') {
        this.emitClose()
      } else {
        this.tab = '3'
        this.currentArea = ''
        this.currentStreet = ''
        this.showAreaTab = true
        this.showStreetTab = false
      }
      this.$emit('selection', {type: 'city', value: this.setValue(item.code)})
    },
    chooseArea (item, index) {
      this.currentArea = item.name
      this.currentAreaCode = item.code
      if (this.wheels === '3') {
        this.emitClose()
      } else {
        this.tab = '4'
        this.currentStreet = ''
        this.showStreetTab = true
      }
      this.$emit('selection', {type: 'area', value: this.setValue(item.code)})
    },
    chooseStreet (item, index) {
      this.currentStreet = item.name
      this.currentStreetCode = item.code
      this.$emit('selection', {type: 'street', value: this.setValue(item.code)})
      this.emitClose()
    },
    // 触发关闭事件
    emitClose () {
      this.$emit('closeAddressPanel')
    },
    setValue (code) {
      let outval = {}
      if (this.currentProvinceCode) outval.provinceCode = this.currentProvinceCode
      if (this.currentProvince) outval.province = this.currentProvince
      if (this.currentCity) outval.city = this.currentCity
      if (this.currentArea) outval.area = this.currentArea
      if (this.currentStreet) outval.street = this.currentStreet
      outval.code = code
      return outval
    },
    // 滚动到视图中间位置
    scrollIntoView (elem) {
      if (elem) {
        elem.scrollIntoViewIfNeeded()
      }
    }
  }
}
</script>

<style lang="scss" >
.mod-address-slide {
  .mod-address-slide-main {
    background-color: white;
    font-size: 14px;
    .mod-address-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 14px 10px;
      background-color: #f3f2f8;
      border-bottom: 1px solid #dddddd;
    }
    .mod-address-body {
      .mod-address-tab {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        border-bottom: 1px solid #dddddd;
        & > div {
          text-align: center;
          padding: 10px;
          margin-right: 10px;
        }
        .active {
          color: red;
          border-bottom: 1px solid red;
        }
      }
      .mod-address-list {
        padding: 5px 10px;
        height: 300px;
        overflow-y: scroll;
        & > div {
          padding: 10px 0;
          position: relative;
          &.active {
            color: red;
            font-size: 14px;
            &::before {
              content: "\e608";
              position: absolute;
              top: 10px;
              right: 10px;
              color: red;
            }
          }
        }
        // mint-ui
        .mint-tab-container {
          padding: 0 !important;
          .mint-cell {
            min-height: 0;
            padding: 8px 0;
            background-image: none;
            &.active {
              color: red;
            }
            .mint-cell-wrapper {
              padding: 0;
              background-image: none;
              .mint-cell-title {
                flex: none;
                font-size: 14px;
              }
              .mint-cell-value {
                padding-left: 4px;
                font-size: 14px;
                & > .active {
                  color: red;
                  &::before {
                    content: "\e608";
                    color: red;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
