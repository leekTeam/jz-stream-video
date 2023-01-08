<script lang="ts" setup>
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useTheme } from '@/composables'
import { BASE_URL_KEY } from '@/constant/storage'
import { useThemeStore } from '@/store'

useTheme()

const themeStore = useThemeStore()

const formData = ref({
  baseUrl: '',
})

const formRules = {
  baseUrl: {
    type: 'url',
    required: true,
    message: '请输入 正确的API URL',
    trigger: ['change', 'blur'],
  },
}

const formRef = ref()

onLoad(() => {
  formData.value.baseUrl = uni.getStorageSync(BASE_URL_KEY)
})

onReady(() => {
  formRef.value.setRules(formRules)
})

const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid)
      uni.setStorageSync(BASE_URL_KEY, formData.value.baseUrl)
  })
}
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
    <u-form ref="formRef" :model="formData" :label-width="120" :error-type="['toast']">
      <u-form-item label="API URL" prop="baseUrl">
        <u-input v-model="formData.baseUrl" />
      </u-form-item>
    </u-form>
    <u-button type="primary" @click="onSubmit">
      保存
    </u-button>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  padding: 24rpx;

  .u-btn {
    margin-top: 40rpx;
  }
}
</style>
