<script setup lang="ts">
import DockBar from './components/DockBar.vue';
import Header from './components/Header.vue'
import { ref } from 'vue'
const hideOthers = ref(false)
const isNormal = ref(true)
const isLogin = ref(false)
const isCreatorView = ref(false)

function leaveHome() {
  logo.classList.add('-mt-[84px]')
  logo.classList.remove('mt-60')
  setTimeout(() => {
    const scrollEvent = new Event('scroll')
    window.dispatchEvent(scrollEvent)
  }, 400)
}
</script>

<template>
  <!-- 顶栏 -->
  <div class="h-24 w-full fixed top-0 z-50">
    <Header />
  </div>

  <!-- 下方内容区域 -->
  <div class="flex pt-24 min-h-screen">
    <!-- 侧边栏 -->
    <div v-if="!hideOthers" class="w-24 fixed left-0 top-24 bottom-0 flex flex-col justify-center z-40">
      <DockBar @leaveHome="leaveHome" :show-dock="isNormal"></DockBar>
    </div>

    <!-- 主体内容 -->
    <div class="flex-1 ml-24">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
