<template>
  <div class="about">
    <h1>{{ `${area}平方米` }}</h1>
    <div>{{ user.name }}</div>
    <BaseView></BaseView>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      area: '',
      user: {
        name: ''
      }
    }
  },

  computed: {
    radius: {
      get() {
        return this.area
      },
      set(value) {
        this.area = value * value
      }
    }
  },

  created() {
    this.user = {
      name: 'stone'
    }
  }
}
</script>

<style lang="less">
</style>