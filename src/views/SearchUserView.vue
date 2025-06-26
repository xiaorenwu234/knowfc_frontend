// @ts-check
<template>
  <div class="max-w-6xl mx-auto w-full">
    <!-- 结果统计和操作 -->
    <div class="flex justify-between items-center mb-6 sticky top-20 z-50">
      <div class="text-sm text-gray-600">
        显示 {{ startIndex }}-{{ endIndex }} 共 {{ totalResults }} 条结果
      </div>
      <div class="flex gap-4 items-center">
        <select v-model="sortBy" class="select select-bordered select-sm">
          <option value="relevance">相关度</option>
          <option value="createdAt">注册时间</option>
        </select>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- 左侧过滤器 -->
      <div class="space-y-6">
        <!-- 机构过滤器 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body p-4">
            <h3 class="font-semibold mb-3 flex justify-between items-center">
              所属机构
              <button class="btn btn-xs btn-circle" @click="showInstitutions = !showInstitutions">
                <span v-if="showInstitutions">-</span>
                <span v-else>+</span>
              </button>
            </h3>
            <div v-show="showInstitutions" class="space-y-2">
              <input
                v-model="institutionFilter"
                type="text"
                placeholder="搜索机构"
                class="input input-bordered input-sm w-full mb-2"
              />
              <div class="max-h-40 overflow-y-auto">
                <label v-for="inst in institutions" :key="inst" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="selectedInstitutions"
                    :value="inst"
                    class="checkbox checkbox-sm"
                  />
                  <span class="text-sm">{{ inst }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 研究领域过滤器 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body p-4">
            <h3 class="font-semibold mb-3 flex justify-between items-center">
              研究领域
              <button class="btn btn-xs btn-circle" @click="showFields = !showFields">
                <span v-if="showFields">-</span>
                <span v-else>+</span>
              </button>
            </h3>
            <div v-show="showFields" class="space-y-2">
              <input
                v-model="fieldFilter"
                type="text"
                placeholder="搜索研究领域"
                class="input input-bordered input-sm w-full mb-2"
              />
              <div class="max-h-40 overflow-y-auto">
                <label v-for="field in researchFields" :key="field" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="selectedFields"
                    :value="field"
                    class="checkbox checkbox-sm"
                  />
                  <span class="text-sm">{{ field }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧搜索结果 -->
      <div class="md:col-span-3 space-y-6">
        <PersonCard
          v-for="user in searchResults"
          :key="user.id"
          :person="user"
          class="hover:shadow-lg transition-shadow"
        />
        
        <!-- 分页控件 -->
        <div class="flex justify-center mt-8" v-if="totalPages > 1">
          <div class="join">
            <button 
              class="join-item btn btn-sm" 
              :disabled="currentPage === 0"
              @click="changePage(currentPage - 1)"
            >
              «
            </button>
            <button class="join-item btn btn-sm">{{ currentPage + 1 }} / {{ totalPages }}</button>
            <button 
              class="join-item btn btn-sm" 
              :disabled="currentPage >= totalPages - 1"
              @click="changePage(currentPage + 1)"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSearchStore } from '@/stores/search'
import PersonCard from '@/components/PersonCard.vue'
import { searchUsers, type SearchParams, type User } from '@/js/User'

// 搜索相关
const sortBy = ref<'relevance' | 'createdAt'>('relevance')
const currentPage = ref(0)
const pageSize = ref(10)
const totalResults = ref(0)
const totalPages = ref(0)
const searchResults = ref<User[]>([])

// 计算显示的结果范围
const startIndex = computed(() => currentPage.value * pageSize.value + 1)
const endIndex = computed(() => Math.min((currentPage.value + 1) * pageSize.value, totalResults.value))

// 过滤器相关
const showInstitutions = ref(true)
const showFields = ref(true)
const institutionFilter = ref('')
const fieldFilter = ref('')
const selectedInstitutions = ref<string[]>([])
const selectedFields = ref<string[]>([])

// 示例数据 - 实际应用中可能需要从API获取
const institutions = ref([
  '清华大学',
  '北京大学',
  '浙江大学',
  '复旦大学',
  '上海交通大学'
])

const researchFields = ref([
  '计算机科学',
  '人工智能',
  '机器学习',
  '数据挖掘',
  '自然语言处理'
])

// 搜索函数
const searchStore = useSearchStore()

const performSearch = async () => {
  try {
    const params: SearchParams = {
      keyword: searchStore.searchQuery.content,
      institution: selectedInstitutions.value.length > 0 ? selectedInstitutions.value.join(',') : undefined,
      fields: selectedFields.value.length > 0 ? selectedFields.value : undefined,
      page: currentPage.value,
      size: pageSize.value,
      sortBy: sortBy.value
    }

    const response = await searchUsers(params)
    searchResults.value = response.data.content
    totalResults.value = response.data.totalElements
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
    totalResults.value = 0
    totalPages.value = 0
  }
}

// 页面切换
const changePage = (newPage: number) => {
  currentPage.value = newPage
  performSearch()
}

// 监听搜索条件变化
watch([searchStore.searchQuery, sortBy, selectedInstitutions, selectedFields], () => {
  if (searchStore.searchQuery.doSearch) {
    currentPage.value = 0 // 重置页码
    performSearch()
  }
})

// 初始化搜索
performSearch()
</script>