<template>
  <view class="content">
    <scroll-refresh ref="refresh" :scrollHeight="height" @refresh="onRefresh">
      <view class="item" v-for="(item, index) in list" :key="index">
        <text>骑上我心爱的小摩托</text>
      </view>
    </scroll-refresh>
  </view>
</template>

<script>
import ScrollRefresh from '@/components/scroll-refresh/index'
export default {
  components: {
    ScrollRefresh
  },

  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      height: '500px'
    }
  },
  onLoad() {},
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.$refs.refresh.reset()
      }, 1000)
    }
  }
}
</script>

<style>
.item {
  height: 60px;
  line-height: 60px;
  background-color: #fdcdcc;
}
</style>
