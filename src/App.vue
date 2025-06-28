<script setup lang="ts">
import DockBar from './components/DockBar.vue';
import Header from './components/Header.vue'
import UserGraph from './views/UserGraph.vue'
</script>

<template>
  <Header class="h-24 w-full fixed top-0 z-50"/>

  <!-- Dock栏 -->
  <div class="fixed right-0 w-auto h-[100vh] flex flex-col justify-center z-50">
    <DockBar />
  </div>

  <!-- 主体 -->
  <div class="flex-1 min-h-screen bg-container">
      <RouterView :key="$route.fullPath"></RouterView>
  </div>
<!--  <UserGraph></UserGraph>-->
</template>

<style scoped>
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
