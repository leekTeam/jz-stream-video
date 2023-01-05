<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore, useThemeStore } from '@/store'
import { classTopLayerGet } from '@/api/sound'
import { themeOptions } from '@/config/theme'
import { useTheme } from '@/composables'

const title = ref('Hello')
const appStore = useAppStore()
const themeStore = useThemeStore()

useTheme()

const list = [
  {
    cate_name: '待收货',
  },
  {
    cate_name: '待付款',
  },
  {
    cate_name: '待评价',
    cate_count: 5,
  },
]
const current = ref(0)

onMounted(() => {
  classTopLayerGet().then((res) => {
    console.log(res)
  })
})
</script>

<template>
  <view class="content" :style="themeStore.themeStyles">
    <u-tabs
      v-model="current"
      :active-color="themeStore.primaryColor"
      name="cate_name"
      count="cate_count"
      :list="list"
      :is-scroll="false"
    />
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">
        {{ title }}123123大苏打撒旦
      </text>
      {{ appStore.count }}
    </view>
    <view class="theme-box">
      <view
        v-for="item in themeOptions"
        :key="item.value"
        :style="
          {
            'background-color': item.color,
          }
        "
        class="theme-box-item"
        @click="themeStore.updateTheme(item.value)"
      >
        {{ item.label }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.u-tabs {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.theme-box {
  display: flex;
  align-items: center;

  &-item {
    width: 150rpx;
    height: 150rpx;
    color: #FFFFFF;
    margin: 0 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
