<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import { useThemeStore } from '@/store'
import ThemePopup from '@/components/theme-popup/index.vue'
import { getUserInfo, login } from '@/api/wechat'
import { WECHAT_ACCESS_TOKEN, WECHAT_OPENID, WECHAT_USERINFO } from '@/constant/storage'

const userInfo = shallowRef<TWechatUserInfo>({} as TWechatUserInfo)

const showSex = computed(() => !!userInfo.value.sex)

const sexIcon = computed(() => userInfo.value.sex === 1 ? 'man' : 'woman')

const systemInfo = uni.getSystemInfoSync()

const themeStore = useThemeStore()

const themePopupRef = ref()

const openThemePopup = () => {
  themePopupRef.value.openPopup()
}

const goDownloadDetail = () => {
  uni.navigateTo({
    url: '/pages/download/detail',
  })
}

const goDownload = () => {
  uni.navigateTo({
    url: '/pages/download/index',
  })
}

const goStoragePage = () => {
  uni.navigateTo({
    url: '/pages/storage/index',
  })
}

const goApiSetting = () => {
  uni.navigateTo({
    url: '/pages/api/setting',
  })
}

const getStorageUserInfo = () => {
  const storageInfo = uni.getStorageSync(WECHAT_USERINFO)
  if (storageInfo)
    userInfo.value = storageInfo
}

onReady(() => {
  getStorageUserInfo()
})

const handleLogin = async () => {
  if (userInfo.value.nickname)
    return

  uni.showLoading({ title: '登陆中', mask: true })
  try {
    const { access_token, openid }: any = await login()
    uni.setStorageSync(WECHAT_ACCESS_TOKEN, access_token)
    uni.setStorageSync(WECHAT_OPENID, openid)
    const res = await getUserInfo({ access_token, openid })
    uni.setStorageSync(WECHAT_USERINFO, res)
    getStorageUserInfo()
  }
  finally {
    uni.hideLoading()
  }
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view :style="themeStore.themeStyles">
    <view :style="{ height: `${systemInfo.statusBarHeight}px` }" class="status-bar" />
    <view class="user-info" @click="handleLogin">
      <u-avatar class="headimgurl" size="large" :show-sex="showSex" :sex-icon="sexIcon" :src="userInfo.headimgurl" />
      <view class="nickname">
        {{ userInfo.nickname || '点击登陆' }}
      </view>
    </view>
    <u-cell-group>
      <u-cell-item icon="file-text" title="离线中心" @click="goDownloadDetail" />
      <u-cell-item icon="download" title="下载中心" @click="goDownload" />
      <u-cell-item icon="bookmark" title="皮肤" @click="openThemePopup" />
      <u-cell-item icon="setting" title="缓存设置" @click="goStoragePage" />
      <u-cell-item icon="setting" title="API设置" @click="goApiSetting" />
    </u-cell-group>
    <ThemePopup ref="themePopupRef" />
  </view>
</template>

<style lang="scss" scoped>
.status-bar {
  background-color: $u-type-primary;
}

.user-info {
  padding: 48rpx 24rpx;
  display: flex;
  align-items: center;
  background-color: $u-type-primary;
  overflow: hidden;
  color: #FFFFFF;
  box-sizing: border-box;
  :deep(.headimgurl) {
    flex-shrink: 0;
    .u-avatar__sex {
      color: $u-type-primary;
      &--man {
        background-color: #FFFFFF;
      }

      &--woman {
        background-color: #FFFFFF;
      }

      &--none {
        background-color: #FFFFFF;
      }
    }
  }
  .nickname {
    flex: 1;
    padding-left: 48rpx;
    box-sizing: border-box;
    font-size: 36rpx;
  }
}
</style>
