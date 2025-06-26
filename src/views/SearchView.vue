<template>
  <div class="h-full w-full p-4 md:p-8 px-10 md:px-20">
    <!-- 搜索区域 -->
    <div class="container max-w-3xl mx-auto mb-8 sticky top-0 z-50 mt-80">
      <SearchBar />

    </div>

    <!-- 结果区域 -->
    <RouterView v-if="hasSearched"></RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import { useSearchStore } from '@/stores/search'

// 搜索相关
const hasSearched = ref(false)
const router = useRouter()

const searchStore = useSearchStore()

watch(searchStore, async () => {
  if (searchStore.searchQuery.doSearch) {
    await handleSearch()
    searchStore.searchQuery.doSearch = false
  }
})

const handleSearch = async () => {
  hasSearched.value = true

  
  // 根据routerType跳转到不同的路由
  await router.push(`/search/${searchStore.searchQuery.type}`)
}
</script> 