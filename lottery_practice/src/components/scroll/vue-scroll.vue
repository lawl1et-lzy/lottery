<template>
  <div class="bscroll-wrapper" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
const DEFAULT_BOUNCE = {top: false, bottom: false, left: false, right: false}
export default {
  name: 'VueScroll',
  data () {
    return {
      scroll: ''
    }
  },
  props: {
    /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
    probeType: {
      type: Number,
      default: 2
    },
    tag: {
      type: Boolean,
      default: false
    },
    eventPassthrough: {
      type: String,
      default: ''
    },
    bounce: {
      type: Object,
      default () {
        return {
          top: false,
          bottom: false,
          left: false,
          right: false
        }
      }
    },
    /**
       * 点击列表是否派发click事件
       */
    click: {
      type: Boolean,
      default: true
    },
    /**
       * 是否开启横向滚动
       */
    scrollX: {
      type: Boolean,
      default: false
    },

    scrollY: {
      type: Boolean,
      default: true
    },
    /**
       * 是否派发滚动事件
       */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
       * 列表的数据
       */
    data: {
      type: Array,
      default: null
    },
    /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
       * 是否派发列表滚动开始的事件
       */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    touchEnd: {
      type: Boolean,
      default: false
    },
    /**
       * 当数据更新后，刷新scroll的延时。
       */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    this._initScroll()
  },
  methods: {
    _initScroll () {
      if (!this.$refs.scrollWrapper) {
        return
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        bounce: Object.assign({}, DEFAULT_BOUNCE, this.bounce),
        click: this.click,
        scrollX: this.scrollX,
        tag: this.tag,
        eventPassthrough: this.eventPassthrough,
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
      // 派发 scroll 对象
      this.$emit('scrollObj', this.scroll)
      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      this.scroll.on('beforeScrollStart', (pos) => {
        this.$emit('beforeScrollStart', pos)
      })
      this.scroll.on('scrollStart', (pos) => {
        this.$emit('scrollStart', pos)
      })

      if (this.touchEnd) {
        this.scroll.on('touchEnd', (pos) => {
          this.$emit('touchEnd', pos)
        })
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on('touchend', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown')
          }
        })
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable && this.scroll.disable()
    },
    enable () {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable && this.scroll.enable()
    },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh && this.scroll.refresh()
    },
    scrollTo () {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}

</script>

<style scoped>
.bscroll-wrapper{
  overflow: hidden;
  height: 100%;
}
</style>
