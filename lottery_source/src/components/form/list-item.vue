<template>
  <div class="form-lists ">
    <div class="lab">{{item.lab}}：</div>
    <div class="value">
      <input class="input" type="text" v-model="inValue" :placeholder="item.placeholder" @blur="checkValue"
      />
    </div>
    <div class="" v-if="(show || isfocus) && item.verifyFn(inValue)">
      <svg xmlns="http://www.w3.org/2000/svg" style="height:15px;fill:green" viewBox="0 0 512 512">
        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
        />
      </svg>
    </div>
    <div v-if="(show || isfocus)  && !item.verifyFn(inValue)">
      <svg xmlns="http://www.w3.org/2000/svg" style="height:15px;fill:red" viewBox="0 0 384 512">
        <path d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    name:'list-item',
    props: ['item', 'extraVal'],
    data: function() {
      return {
        isfocus: false
      }
    },
    methods: {
      checkValue () {
        this.isfocus = true;
        // if (!this.item.verifyFn(this.item.value)) {
        //   this.$emit('isErr', {lab: this.item.lab})
        // }
      }
    },
    updated () {
      if(this.extraVal) {
        this.item.value = this.extraVal
      }
    },
    computed: {
      show () {
        let state = (this.item.value ) ? true: false;
        // if (state && !this.item.verifyFn(this.item.value)) {
        //   this.$emit('isErr', {lab: this.item.lab})
        // }
        return state
      },
      inValue: {
        get () {
          if(this.item) {
            return this.item.value
          } else {
            return ''
          }
        },
        set(v) {
          this.item.value = v.trim()
        }
      }
    }
  }
</script>
