<script setup lang="ts">
import DockBar from './components/DockBar.vue';
import Header from './components/Header.vue'
import { ref } from 'vue'
const hideOthers = ref(false)
const isNormal = ref(true)
const isLogin = ref(false)
const isCreatorView = ref(false)
</script>

<template>
  <!-- 顶栏 -->
  <div class="h-24 w-full fixed top-0 z-50" v-if="!hideOthers">
    <Header />
  </div>

  <!-- Dock栏 -->
  <div v-if="!hideOthers" class="fixed right-0 w-auto h-[100vh] flex flex-col justify-center z-50">
    <DockBar />
  </div>

  <!-- 主体 -->
  <div class="flex-1 min-h-screen bg-container">
      <RouterView></RouterView>
  </div>
</template>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f0f2ff 0%, #fff1f9 100%);
}
.bg-container {
  background-image: url('/mountain.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  min-height: 100vh;
}
</style>
