<template>
  <div class='form-lists' @click='areaSelect'>
    <div class='lab'>
      {{item.lab}}：
    </div>
    <div class='value selec-box'>
        {{ detailAddress ? detailAddress : '没有选项' }}
    </div>
    <div class=''>
      <svg style='height:15px;fill:#000000a5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'>
        <path d='M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z'
        />
      </svg>
    </div>
    <!-- 地址选择 -->
    <div @click.stop>
      <mt-popup class="popup-address" v-model="popupVisible" position="bottom">
        <address-select 
          :province="province" 
          :city="city" 
          :area="area" 
          :street="street" 
          :provinceCode="provinceCode" 
          :wholeCode="wholeCode" 
          :provinceList="provinceList"
          :areaList="areaList"
          :cityList="cityList"
          :streetList="streetList"
          :wheels="wheels" 
          v-if="popupVisible"
          @selection="handleSelection"
          @closeAddressPanel="closeAddressPanel">
        </address-select>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import addressSelect from '../address-select'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'list-select-address',
  props: ['item'],
  data() {
    return {
      address: '',
      popupVisible: false,
      wholeCode: '',
      province: '',
      city: '',
      area: '',
      street: '',
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      streetCode: '', 
      wheels: '',
      detailAddress: ''
    };
  },
  components: {
    addressSelect
  },
  watch: {
    item: {
      handler (newVal) {
        this.province = newVal.province
        this.city = newVal.city
        this.area = newVal.area
        this.street = newVal.street
        this.wholeCode = newVal.codeId
        this.provinceCode = newVal.extraId
        this.wheels = newVal.wheels
        this.detailAddress = [this.province, this.city, this.area, this.street].join(' ').trim()
      },
      immediate:true,
      deep: true
    },
  },
  computed:{
    ...mapState({
      provinceList: state => state.pcasCode.address.province,
      areaList: state => state.pcasCode.address.area,
      cityList: state => state.pcasCode.address.city,
      streetList: state => state.pcasCode.address.street
    }),
  },
  methods: {
    ...mapActions(['getDistricts']),
    ...mapMutations(['clear']),
    // 展开地区选项
    areaSelect() {
      this.popupVisible = true
      // 初始化数据
      this.initAddressSelection()
    },
    // 关闭地区选项
    closeAddressPanel () {
      this.popupVisible = false
    },
    // 处理地址返回值
    async handleSelection (val) {
      let {type, value} = val
      // store handle
      this.clear(type)
      await this.getDistricts({type: this.nextArea(type), code: value.code})
      // 处理台湾省 等地
      if(this.cityList.length === 0){
        this.$emit('selected', value)
        this.popupVisible = false
        return
      }
      if(type === 'street' && Number.parseInt(this.wheels) === 4){
        this.$emit('selected', value)
        return
      } else if (type === 'area' && Number.parseInt(this.wheels) === 3){
        this.$emit('selected', value)
        return
      }
    },
    nextArea(type) {
      const currentType = type.toString().trim()
      switch (currentType) {
        case 'province':
          return 'city'
          break;
        case 'city':
          return 'area'
          break;
        case 'area':
          return 'street'
          break;
      }
    },
    // 初始化地区数据
    initAddressSelection() {
      // 区域划分规则 省: area_id   市:[0, 4)   区:[0, 6)   县: [0, 9)
      this.provinceCode = this.item.extraId.toString() // 省份code
      this.wholeCode = this.item.codeId.toString() // code 集合
      let wholeCodeLength = this.wholeCode.length ? this.wholeCode.length : 0 // 长度判断该地址为哪个等级
      switch (wholeCodeLength) {
        case 2:
          this.getDistricts({type: 'province', code: 0})
          break;
        case 4:
          this.cityCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          break;
        case 6:
          this.cityCode = this.wholeCode.substr(0, 4)
          this.areaCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          this.getDistricts({type: 'area', code: this.cityCode})
          break;
        case 9:
          this.cityCode = this.wholeCode.substr(0, 4)
          this.areaCode = this.wholeCode.substr(0, 6)
          this.streetCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          this.getDistricts({type: 'area', code: this.cityCode})
          this.getDistricts({type: 'street', code: this.areaCode})
          break;
        default:
          this.getDistricts({type: 'province', code: 0})
          break;
      }
    }
  }
}
</script>
<style scoped>
.text-grey {
  color: rgba(0, 0, 0, 0.5);
}
.popup-address{
  width: 100%;
}
</style>

