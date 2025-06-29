<template>
  <div ref="header" class="transition-all duration-300 ease-in-out sticky top-0">
    <div
      class="fixed w-screen h-24 z-10"
      :class="{ 'bg-white': isWhiteRoute, blurblock: !isWhiteRoute }"
    ></div>
    <Logo class="z-[9999] fixed"/>
    <UserBar class="z-[9999] fixed"/>
    <SearchBar class="z-[9999] sticky top-0 "/>
  </div>
</template>


<script setup lang="ts">
import Logo from './com/Logo.vue'
import UserBar from './UserBar.vue'
import SearchBar from './SearchBar.vue'
import { ref, computed, useTemplateRef, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { hideHeader } from '@/ts/hidePaths.js'

const route = useRoute()
const pureWhite = ['']

const isWhiteRoute = computed(() => {
  return pureWhite.includes(route.path)
})

const header = useTemplateRef('header')
const isHidden = ref(false)

// 监听路由变化控制 header 显示
watch(
  () => route.path,
  (newPath) => {
    if (!header.value) return

    isHidden.value = hideHeader.includes(newPath)
    let shouldHide = false
    for (const hidePath of hideHeader){
        if (newPath.startsWith(hidePath)){
            shouldHide = true
            break
        }
    }
    isHidden.value = shouldHide

    if (isHidden.value) {
      header.value.classList.add('-translate-y-24')
      header.value.classList.add('opacity-0')
    } else {
      header.value.classList.remove('-translate-y-24')
      header.value.classList.remove('opacity-0')
    }
  },
  { immediate: true },
)
</script>

<style>
@import '../style.css';

.blurblock {
  mask: linear-gradient(black, black, transparent);
  backdrop-filter: blur(8px);
}

.window::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
