<template>
  <div>
    <slot :item="IData"></slot>
  </div>
</template>

<script>
export default {
  name: 'form-item',
  props:['IData'],
  data: function() {
    return {
      item:{}
    }
  },
  methods: {
    initItem() {
      this.item = (this.$children[0] && this.$children[0].item) ? this.$children[0].item : this.IData
    }
  },
  mounted() {
    this.initItem()
  },
  updated() {
    this.initItem()
  }
}
</script>

<style scoped>

</style>