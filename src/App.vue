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

  <!-- Dock栏 -->
  <div v-if="!hideOthers" class="fixed right-0 w-auto h-[100vh] flex flex-col justify-center z-50">
    <DockBar />
  </div>

  <!-- 主体 -->
  <div class="flex-1 pt-24">
      <RouterView></RouterView>
  </div>
</template>

<style scoped>

</style>
