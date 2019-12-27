<template>
  <scroll-view
    class="scroll-view"
    :scroll-y="scrollY"
    :style="{height: scrollHeight}"
    :scroll-with-animation="scrollWithAnimation"
    :lower-threshold="lowerThresHold"
    :enable-back-to-top="enableBackToTop"
    @scroll="onScroll"
    @scrolltolower="onScrollTolower"
    @scrolltoupper="onScrollToupper"
  >
    <view class="refresh-content refresh-container" @touchstart="touchstart" @touchmove.capture="touchmove" @touchend="touchend" :animation="animationData">
      <view class="refresh-load" :style="{top: `-${loader.height}px`}">
        <view class="refresh-load__content">
          <view class="refresh-pull-arrow" :class="[status.className]" />
          <view class="refresh-load__text">
            <view>{{status.tip}}</view>
          </view>
        </view>
      </view>
      <slot />
    </view>
  </scroll-view>
</template>

<script>
const REFRESH_STATUS = {
  DOWN: {
    tip: '下拉刷新',
    className: 'refresh-pull-down'
  },
  UP: {
    tip: '松开刷新',
    className: 'refresh-pull-up'
  },
  REFRESH: {
    tip: '正在加载',
    className: 'refreshing'
  }
}

const SYSTEM = {
  ANDROID: 'android',
  IOS: 'ios'
}

/**
 *  回到顶部
 */
export default {
  name: 'scroll-refresh',
  props: {
    scrollHeight: {
      type: String,
      default: `100%`
    },
    enableBackToTop: {
      type: Boolean,
      default: true
    },
    lowerThresHold: {
      type: Number,
      default: 50
    },
    scrollWithAnimation: Boolean,
    /* 是否禁用下拉刷新 touch 事件 */
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      scrollY: true,
      scrollTop: 0,
      status: REFRESH_STATUS.DOWN,
      animationData: {},
      systemName: SYSTEM.ANDROID,
      animation: {},
      isLoading: false, // 是否正在加载
      isMoved: false, // 是否执行触摸移动
      startTouchY: 0,
      yDelta: 0, // 刷新组件 Y 轴偏移量
      loader: {}
    }
  },

  created() {
    this.initAnimation()
    this.setSystemModel()
    this.setRefreshRect()
  },

  methods: {
    /**
     * 动画初始化
     */
    initAnimation() {
      const animation = uni.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      })
      this.animation = animation
      this.animationData = animation.export()
    },

    /**
     * 初始化系统信息
     */
    setSystemModel() {
      const systemInfo = uni.getSystemInfoSync()
      if (/iPhone/.test(systemInfo.model)) {
        this.systemName = SYSTEM.IOS
      }
    },

    /**
     * 初始化刷新组件信息
     */
    setRefreshRect() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('.refresh-load')
        .boundingClientRect(res => {
          this.loader = res
        })
        .exec()
    },

    /**
     * 滚动事件监听
     */
    onScroll(event) {
      this.scrollTop = event.detail.scrollTop
      this.$emit('scroll', event)
    },

    /**
     * 滚动到顶部触发事件
     */
    onScrollToupper(event) {
      this.$emit('scrolltoupper', event)
    },

    /**
     * 滚动到底部触发事件
     */
    onScrollTolower(event) {
      this.$emit('scrolltolower', event)
    },

    /**
     * 触摸开始事件
     */
    touchstart(event) {
      if (this.disabled || this.isLoading) {
        return
      }
      this.isMoved = false
      this.startTouchY = event.touches[0].clientY
    },

    /**
     * 触摸移动事件
     */
    touchmove(event) {
      if (this.disabled || this.isLoading) {
        return
      }

      const endTouchY = event.changedTouches[0].clientY
      const dy = endTouchY - this.startTouchY

      if (this.scrollTop > 0 || dy <= 0) {
        return
      }

      this.scrollY = false
      this.isMoved = true

      const yDelta = this.systemName === 'ios' ? dy * 0.3 : dy * 0.5
      this.yDelta = yDelta

      const outOfRange = yDelta > this.loader.height
      this.status = yDelta > this.loader.height ? REFRESH_STATUS.UP : REFRESH_STATUS.DOWN
      this.execAnimation(yDelta)
    },

    /**
     * 触摸停止
     */
    touchend(event) {
      if (this.isLoading || !this.isMoved) {
        return
      }

      // 滑动距离大于下拉组件高度为临界条件
      if (this.yDelta >= this.loader.height && !this.disabled) {
        this.isLoading = true
        this.status = REFRESH_STATUS.REFRESH
        this.execAnimation(this.loader.height, 300)
        this.$emit('refresh')
      } else {
        this.reset()
      }
      this.isMoved = false
      this.scrollY = false
    },

    /**
     * 重置刷新组件状态
     */
    reset() {
      this.status = REFRESH_STATUS.DOWN
      this.isLoading = false
      this.execAnimation(0, 300)
    },

    /**
     * 执行动画
     * @param {number} yDelta y轴偏移距离
     * @param {number} duration 动画执行时间
     */
    execAnimation(yDelta, duration = 0) {
      this.animation.translate3d(0, yDelta, 0).step({
        duration
      })
      this.animationData = this.animation.export()
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-view {
  .refresh-content {
    position: relative;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  .refresh-load {
    position: absolute;
    left: 0;
    right: 0;
    background-color: #f5f5f5;
    width: 100%;
    padding: 8px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .refresh-load .refresh-load__content {
    width: 260px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .refresh-load .refresh-load__content .refresh-load__text > view {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .refresh-pull-arrow {
    width: 20px;
    height: 20px;
    visibility: visible;
    margin-right: 20px;
    background: no-repeat center;
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2MTQ3Mjc1MDE1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMwMTkiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTU1Ny4xNzY0NzEgODgzLjYyMTY0N2wyNjMuNDM5MDU4LTMwMS4wODYxMThhMzAuMTE3NjQ3IDMwLjExNzY0NyAwIDAgMSA0NS4zNTcxNzcgMzkuNjY0OTQybC0zMTYuMjM1Mjk0IDM2MS40MTE3NjRhMzAuMTE3NjQ3IDMwLjExNzY0NyAwIDAgMS00NS4zNTcxNzcgMGwtMzE2LjIzNTI5NC0zNjEuNDExNzY0YTMwLjExNzY0NyAzMC4xMTc2NDcgMCAxIDEgNDUuMzU3MTc3LTM5LjY2NDk0MmwyNjMuNDM5MDU4IDMwMS4wODYxMThWOTAuMzUyOTQxYTMwLjExNzY0NyAzMC4xMTc2NDcgMCAwIDEgNjAuMjM1Mjk1IDB2NzkzLjI2ODcwNnoiIGZpbGw9IiM3MDcwNzAiIHAtaWQ9IjMwMjAiPjwvcGF0aD48L3N2Zz4=');
    background-size: cover;
    z-index: 10;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
  }

  .refresh-pull-down {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  .refresh-pull-up {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .refreshing {
    width: 24px;
    height: 24px;
    background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=');
    -webkit-animation: rotate 1s 0s linear infinite;
    animation: rotate 1s 0s linear infinite;
  }

  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>
