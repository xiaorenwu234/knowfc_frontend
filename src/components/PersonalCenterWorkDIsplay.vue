<template>
  <!-- 分类选择 -->
  <div class="mb-4">
    <label for="categorySelect" class="block text-lg font-semibold mb-2">选择科研成果类型</label>
    <select
      id="categorySelect"
      v-model="selectedType"
      class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-for="type in availableTypes" :key="type" :value="type">{{ translateType(type) }}
      </option>
    </select>
  </div>

  <!-- 展示选择的科研成果 -->
  <div class="flex flex-wrap gap-4">
    <div
      v-for="(item, index) in currentPageWorks"
      :key="index"
      class="w-full p-4 border rounded-lg bg-white shadow-lg"
    >
      <h3 class="text-xl font-semibold text-blue-600">{{ item.title }}</h3>
      <p class="text-sm text-gray-600 mt-2">来源: {{ item.source || '无' }}</p>
      <p class="text-sm text-gray-500 mt-1">发布日期: {{ item.publishDate }}</p>
      <p class="text-sm text-gray-500 mt-2">作者: {{ item.authors?.join(', ') || '未知' }}</p>
      <div class="mt-4">
        <a :href="item.pdfUrl" class="text-blue-500 underline" target="_blank">下载</a>
      </div>
    </div>
  </div>

  <!-- 分页 -->
  <div class="flex justify-center mt-6">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 border rounded-md mr-2 hover:bg-gray-200 transition-colors"
    >
      上一页
    </button>
    <span class="text-lg font-medium">{{ currentPage }} / {{ totalPages }}</span>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 border rounded-md ml-2 hover:bg-gray-200 transition-colors"
    >
      下一页
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue'

const props = defineProps({
  works: {
    type: Array,
    required: true
  }
})

const selectedType = ref('')
const pageSize = 3
const currentPage = ref(1)

const availableTypes = computed(() => {
  const types = new Set(props.works.map(item => item.type))
  return Array.from(types)
})

const filteredWorks = computed(() => {
  return selectedType.value
    ? props.works.filter(item => item.type === selectedType.value)
    : props.works
})

const currentPageWorks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return filteredWorks.value.slice(startIndex, endIndex)
})

const translateType = (type: string) => {
  const translations: { [key: string]: string } = {
    arxiv: 'arxiv',
    paper: '论文',
    data: '数据'
  }
  return translations[type] || type
}

const totalPages = computed(() => {
  return Math.ceil(filteredWorks.value.length / pageSize)
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(availableTypes, (types) => {
  if (types.length > 0) {
    selectedType.value = types[0]
  }
}, { immediate: true })

watch(selectedType, () => {
  currentPage.value = 1
})

watch([selectedType, currentPage], () => {
  document.documentElement.scrollTop = 0
})
</script>

<style scoped>
/* 翻页按钮的hover效果 */
button:hover {
  background-color: #f1f1f1;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
