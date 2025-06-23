<template>
  <div class="h-full w-full  p-4 md:p-8 px-10 md:px-20">
    <!-- 搜索区域 -->
    <div class="container max-w-3xl mx-auto mb-8 sticky top-0 z-50">
      <!-- <h2 class="text-lg font-semibold mb-4">搜索文章、期刊、书籍、作者、视频</h2> -->
      <SearchBar />

    </div>

    <!-- 结果区域 -->
    <div class="max-w-6xl mx-auto w-full" v-if="hasSearched">
      <!-- 结果统计和操作 -->
      <div class="flex justify-between items-center mb-6">
        <div class="text-sm text-gray-600">
          显示 {{ startIndex }}-{{ endIndex }} 共 {{ totalResults }} 条结果
        </div>
        <div class="flex gap-4 items-center">
          <select v-model="searchType" class="select select-bordered select-sm">
            <option value="article">文章</option>
            <option value="user">用户</option>
          </select>
          <select v-model="sortBy" class="select select-bordered select-sm">
            <option value="relevance">相关度</option>
            <option value="date">发布日期</option>
            <option value="citations">引用次数</option>
          </select>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 左侧过滤器 -->
        <div class="space-y-6">
          <!-- 内容类型过滤器 -->
          <div class="card bg-base-100 shadow">
            <div class="card-body p-4">
              <h3 class="font-semibold mb-3 flex justify-between items-center">
                内容类型
                <button class="btn btn-xs btn-circle">
                  <span v-if="showContentType">-</span>
                  <span v-else>+</span>
                </button>
              </h3>
              <div v-show="showContentType" class="space-y-2">
                <label v-for="type in contentTypes" :key="type.id" class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    :checked="type.checked"
                    @change="toggleContentType(type.id)"
                    class="checkbox checkbox-sm" 
                  />
                  <span class="text-sm">{{ type.name }} ({{ type.count }})</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 发布日期过滤器 -->
          <div class="card bg-base-100 shadow">
            <div class="card-body p-4">
              <h3 class="font-semibold mb-3">发布日期</h3>
              <div class="space-y-2">
                <label v-for="period in datePeriods" :key="period.id" class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    :checked="period.id === selectedDatePeriod"
                    @change="selectedDatePeriod = period.id"
                    name="date-period"
                    class="radio radio-sm" 
                  />
                  <span class="text-sm">{{ period.name }}</span>
                </label>
                <div v-if="selectedDatePeriod === 'custom'" class="mt-2 space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      v-model="customDateRange.start"
                      placeholder="起始年份" 
                      class="input input-bordered input-sm"
                    />
                    <input 
                      type="number" 
                      v-model="customDateRange.end"
                      placeholder="结束年份" 
                      class="input input-bordered input-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧搜索结果 -->
        <div class="md:col-span-3 space-y-6">
          <div v-for="result in searchResults" :key="result.id" class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            <div class="card-body">
              <div class="flex justify-between items-start">
                <div>
                  <div class="badge badge-sm mb-2">{{ result.type }}</div>
                  <h3 class="card-title text-primary hover:underline cursor-pointer">
                    {{ result.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-2">{{ result.authors.join(', ') }}</p>
                  <p class="text-sm mt-2">{{ result.description }}</p>
                  <div class="text-sm text-gray-600 mt-2">
                    发布于 {{ result.publishDate }}
                  </div>
                </div>
                <img 
                  v-if="result.coverImage" 
                  :src="result.coverImage" 
                  :alt="result.title"
                  class="w-24 h-32 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import { useSearchStore } from '@/stores/search'

// 搜索相关
const searchQuery = ref('')
const hasSearched = ref(false)
const totalResults = ref(601528)
const startIndex = ref(1)
const endIndex = ref(20)
const sortBy = ref('relevance')
const searchType = ref('article')

const searchStore = useSearchStore()
watch(searchStore, () => {
  if(searchStore.doSearch){
    handleSearch()
    searchStore.doSearch = false
  }
})

// 内容类型过滤器
const showContentType = ref(true)
const contentTypes = ref([
  { id: 'article', name: '文章', count: 4299358, checked: false },
  { id: 'research', name: '研究文章', count: 3827112, checked: false },
  { id: 'chapter', name: '章节', count: 1797979, checked: false },
  { id: 'conference', name: '会议论文', count: 651337, checked: false },
  { id: 'review', name: '综述', count: 158325, checked: false },
])

// 发布日期过滤器
const selectedDatePeriod = ref('3months')
const customDateRange = ref({
  start: '',
  end: ''
})
const datePeriods = ref([
  { id: '3months', name: '最近3个月' },
  { id: '6months', name: '最近6个月' },
  { id: '12months', name: '最近12个月' },
  { id: '24months', name: '最近24个月' },
  { id: 'custom', name: '自定义日期范围' },
])

// 搜索结果
const searchResults = ref([
  {
    id: 1,
    type: '图书',
    title: 'Metrics for Test Reporting: Analysis and Reporting for Effective Test Management',
    authors: ['Frank Witte'],
    description: '软件开发过程中定期向管理层报告项目进展和问题是很重要的。本书介绍了如何...',
    publishDate: '2024',
    coverImage: '/path/to/cover1.jpg'
  },
  {
    id: 2,
    type: '图书',
    title: 'Hands-on Test-Driven Development: Using Ruby, Ruby on Rails, and RSpec',
    authors: ['Greg Donald'],
    description: '学习如何通过先编写失败测试，然后实现应用程序代码来正确测试Ruby和Ruby on Rails应用程序...',
    publishDate: '2024',
    coverImage: '/path/to/cover2.jpg'
  },
  {
    id: 1,
    type: '图书',
    title: 'Metrics for Test Reporting: Analysis and Reporting for Effective Test Management',
    authors: ['Frank Witte'],
    description: '软件开发过程中定期向管理层报告项目进展和问题是很重要的。本书介绍了如何...',
    publishDate: '2024',
    coverImage: '/path/to/cover1.jpg'
  },
  {
    id: 2,
    type: '图书',
    title: 'Hands-on Test-Driven Development: Using Ruby, Ruby on Rails, and RSpec',
    authors: ['Greg Donald'],
    description: '学习如何通过先编写失败测试，然后实现应用程序代码来正确测试Ruby和Ruby on Rails应用程序...',
    publishDate: '2024',
    coverImage: '/path/to/cover2.jpg'
  },
])

const handleSearch = () => {
  hasSearched.value = true
  
}

const toggleContentType = (typeId) => {
  const type = contentTypes.value.find(t => t.id === typeId)
  if (type) {
    type.checked = !type.checked
  }
}
</script> 