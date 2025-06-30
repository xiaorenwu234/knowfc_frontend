<template>
  <!-- 分类选择 -->
  <div class="mb-4">
    <label for="categorySelect" class="block text-lg font-semibold mb-2">选择科研成果类型</label>
    <select class="select select-info w-full px-4" v-model="selectedType" id="categorySelect">
      <option v-for="type in availableTypes" :key="type" :value="type">
        {{ translateType(type) }}
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
        <a :href="item.pdfUrl" class="text-blue-500 underline" target="_blank">下载 PDF</a>
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

// 接收父组件传来的 props
const props = defineProps({
  works: {
    type: Array,
    required: true,
  },
})

const selectedType = ref('') // 当前选择的科研成果类型
const pageSize = 3 // 每页展示的项目数
const currentPage = ref(1) // 当前页数

// 获取所有可用的分类类型
const availableTypes = computed(() => {
  const types = new Set(props.works.map((item) => item.type))
  return Array.from(types)
})

// 根据选中的分类筛选出对应的科研成果
const filteredWorks = computed(() => {
  // 如果选择了分类，则过滤
  return selectedType.value
    ? props.works.filter((item) => item.type === selectedType.value)
    : props.works // 如果没有选中分类，则返回所有科研成果
})

// 当前页面显示的科研成果
const currentPageWorks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return filteredWorks.value.slice(startIndex, endIndex)
})

// 类型翻译函数
const translateType = (type: string) => {
  const translations: { [key: string]: string } = {
    arxiv: 'arxiv',
    paper: '论文',
    data: '数据',
  }
  return translations[type] || type
}

// 总页数计算
const totalPages = computed(() => {
  return Math.ceil(filteredWorks.value.length / pageSize)
})

// 页码变更函数
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 默认选中第一个分类
watch(
  availableTypes,
  (types) => {
    if (types.length > 0) {
      selectedType.value = types[0]
    }
  },
  { immediate: true },
)

// 监听分类类型变化，重置当前页数为 1
watch(selectedType, () => {
  currentPage.value = 1
})

// 监听分类类型和页码，动态更新当前页数据
watch([selectedType, currentPage], () => {
  // 当选中类型或页码发生变化时，自动滚动回顶部
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
