<script setup lang="ts">
import DockBar from './components/DockBar.vue'
import Logo from './components/Logo.vue'
import UserBar from './components/UserBar.vue'
import SearchBar from './components/SearchBar.vue'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { hideHeader } from '@/ts/hidePaths.js'

const route = useRoute()
const pureWhite = ['']

const isWhiteRoute = computed(() => {
  return pureWhite.includes(route.path)
})

const isHidden = ref(false)
const inHome = ref(false)
const showSearch = ref(false)

// 监听路由变化控制 header 显示
watch(
  () => route.path,
  (newPath) => {
    isHidden.value = hideHeader.includes(newPath)
    inHome.value = newPath === '/'
    showSearch.value = newPath === '/' || newPath.startsWith('/search')
  },
  { immediate: true },
)
</script>

<template>
  <!-- Dock栏 -->
  <div class="fixed right-0 w-auto h-[100vh] flex flex-col justify-center z-50">
    <DockBar />
  </div>
  <div class="bg-container w-screen h-screen fixed top-0 left-0 z-0">

  </div>

  <div class="w-screen sticky top-0 flex flex-col">
    <!-- 遮罩 -->
    <div
      class="fixed w-screen h-24 z-30"
      :class="{
        'bg-white': isWhiteRoute,
        blurblock: !isWhiteRoute,
        'opacity-0': isHidden,
        '-translate-y-24': isHidden,
      }"
    ></div>

    <!-- 左上logo -->
    <Logo class="z-50 fixed" :class="{ 'opacity-0': isHidden, '-translate-y-24': isHidden }" />

    <!-- 右上用户栏 -->
    <div :class="{ 'opacity-0': isHidden, '-translate-y-24': isHidden }">
      <UserBar class="z-50 fixed" />
    </div>

    <!-- 首页logo -->
    <div
      v-if="inHome"
      class="mt-24 my-4 text-center mx-auto top-0 w-full flex flex-col items-center justify-center"
    >
      <h1
        class="mb-5 font-bold galada-regular text-6xl mx-2 align-baseline"
        style="color: white; text-shadow: rgb(153, 36, 0) 6px 6px 3px"
      >
        KnowFC
      </h1>
      <p class="mb-5 max-w-md" style="color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
    </div>

    <!-- 搜索栏 -->
    <SearchBar v-if="showSearch" class="z-40 sticky top-0" :class="{ 'opacity-0': isHidden,'-translate-y-24': isHidden}"/>

    <!-- 主体 -->
    <div class="flex-1 min-h-screen z-0 " :class="{'mt-[-112px]': showSearch}">
      <RouterView :key="$route.fullPath"></RouterView>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';
.bg-container {
  background-image: url('/mountain.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  min-height: 100vh;
}

.blurblock {
  mask: linear-gradient(black, black, transparent);
  backdrop-filter: blur(8px);
}

.window::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
