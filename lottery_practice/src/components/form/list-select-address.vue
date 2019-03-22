<template>
  <div class='form-lists' @click='areaSelect'>
    <!-- 验证表单用 -->
    <input type="hidden" v-validate="{required: true}" name="address" v-model="options.codeId">
    <div class='lab'>
      {{options.lab}}：
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
          :province="this.options.province"
          :city="this.options.city"
          :area="this.options.area"
          :street="this.options.street"
          :provinceCode="provinceCode"
          :wholeCode="wholeCode"
          :provinceList="provinceList"
          :areaList="areaList"
          :cityList="cityList"
          :streetList="streetList"
          :wheels="this.options.wheels"
          v-if="popupVisible"
          @selection="handleSelection"
          @closeAddressPanel="closeAddressPanel">
        </address-select>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import addressSelect from './components/address-select'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'list-select-address',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      popupVisible: false,
      wholeCode: '',
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      streetCode: '',
      options: {} // 深拷贝 props 数据
    }
  },
  components: {
    addressSelect
  },
  watch: {
    value: {
      handler (n) {
        // 深拷贝一份数据给当前组件
        this.options = JSON.parse(JSON.stringify(n))
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState({
      provinceList: state => state.pcasCode.address.province,
      areaList: state => state.pcasCode.address.area,
      cityList: state => state.pcasCode.address.city,
      streetList: state => state.pcasCode.address.street
    }),
    // 当前的地区名称
    detailAddress () {
      let province = this.options.province || ''
      let city = this.options.city || ''
      let area = this.options.area || ''
      let street = this.options.street || ''
      return [province, city, area, street].join(' ').trim()
    }
  },
  methods: {
    ...mapActions(['getDistricts']),
    ...mapMutations(['clear']),
    // 展开地区选项
    areaSelect () {
      this.popupVisible = true
      // 初始化数据
      this.initAddressSelection()
    },
    // 关闭地区选项
    closeAddressPanel () {
      this.popupVisible = false
    },
    /**
     * @method handleSelection
     * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
     * @param {Object} value 地区返回值
     */
    async handleSelection (val) {
      let {type, value} = val
      // 当重新选择的时候，清除下级数据，用于处理数据闪烁问题
      this.clear(type)
      // 获取下一级数据
      await this.getDistricts({type: this.nextArea(type), code: value.code})
      // 处理台湾省 等地
      if (this.cityList.length === 0) {
        this.emit(value)
        this.popupVisible = false
        return
      }
      if (type === 'street' && Number.parseInt(this.options.wheels) === 4) {
        this.emit(value)
      } else if (type === 'area' && Number.parseInt(this.options.wheels) === 3) {
        this.emit(value)
      }
    },
    emit (v) {
      this.options.codeId = v.code || ''
      this.options.extraId = v.extraId || ''
      this.options.province = v.province || ''
      this.options.city = v.city || ''
      this.options.area = v.area || ''
      this.options.street = v.street || ''
      this.$emit('input', this.options)
    },
    nextArea (type) {
      if (!type) {
        return
      }
      const currentType = type.toString().trim()
      switch (currentType) {
        case 'province':
          return 'city'
        case 'city':
          return 'area'
        case 'area':
          return 'street'
      }
    },
    // 初始化地区数据
    initAddressSelection () {
      // 区域划分规则 省: area_id   市:[0, 4)   区:[0, 6)   县: [0, 9)
      this.provinceCode = this.options.extraId.toString() // 省份code
      this.wholeCode = this.options.codeId.toString() // code 集合
      let wholeCodeLength = this.wholeCode.length ? this.wholeCode.length : 0 // 长度判断该地址为哪个等级
      switch (wholeCodeLength) {
        case 2:
          this.getDistricts({type: 'province', code: 0})
          break
        case 4:
          this.cityCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          break
        case 6:
          this.cityCode = this.wholeCode.substr(0, 4)
          this.areaCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          this.getDistricts({type: 'area', code: this.cityCode})
          break
        case 9:
          this.cityCode = this.wholeCode.substr(0, 4)
          this.areaCode = this.wholeCode.substr(0, 6)
          this.streetCode = this.wholeCode
          this.getDistricts({type: 'province', code: 0})
          this.getDistricts({type: 'city', code: this.provinceCode})
          this.getDistricts({type: 'area', code: this.cityCode})
          this.getDistricts({type: 'street', code: this.areaCode})
          break
        default:
          this.getDistricts({type: 'province', code: 0})
          break
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
