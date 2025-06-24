<template>
  <div class="min-h-screen bg-white">
    <!-- 顶部标题栏 -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div class="flex items-center gap-4 ml-32">
        <icon class="icon-[material-symbols--history] w-8 h-8 text-gray-700" />
        <h1 class="text-2xl font-bold text-gray-900">历史记录</h1>
      </div>
    </div>

    <!-- 历史内容 -->
    <div class="px-6 py-4">
      <!-- 文章列表 - 列表式布局 -->
      <div class="space-y-3 max-w-6xl mx-auto">
        <div 
          v-for="item in historyData" 
          :key="item.id"
          class="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-all cursor-pointer"
          @click="viewArticle(item)">
          
          <div class="flex items-center p-4">
            <!-- 内容信息 -->
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {{ item.title }}
              </h3>
              
              <div class="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <div class="flex items-center gap-1">
                  <icon :class="getTypeIcon(item.type)" class="w-4 h-4" />
                  <span>{{ item.author }}</span>
                </div>
              </div>

              <!-- 标签 -->
              <div class="flex items-center gap-2">
                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {{ getTypeLabel(item.type) }}
                </span>
                <span v-if="item.isCollected" class="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                  已收藏
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2 ml-4">
              <button 
                @click.stop="toggleCollect(item)"
                class="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                <icon :class="item.isCollected ? 'icon-[material-symbols--star]' : 'icon-[material-symbols--star-outline]'" class="w-5 h-5" />
              </button>
              <button 
                @click.stop="removeFromHistory(item.id)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <icon class="icon-[material-symbols--delete-outline] w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="historyData.length === 0" class="text-center py-16">
        <icon class="icon-[material-symbols--history] w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">暂无浏览记录</h3>
        <p class="text-sm text-gray-500">开始浏览一些内容吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 历史记录数据
const historyData = ref([
  {
    id: 1,
    type: 'article',
    title: '文章1',
    author: '作者1',
    isCollected: false
  },
  {
    id: 2,
    type: 'article',
    title: '文章2',
    author: '作者2',
    isCollected: true
  },
  {
    id: 3,
    type: 'article',
    title: '文章3',
    author: '作者3',
    isCollected: false
  },
  {
    id: 4,
    type: 'article',
    title: '文章4',
    author: '作者4',
    isCollected: false
  },
  {
    id: 5,
    type: 'dataset',
    title: '机器学习常用数据集汇总',
    author: '数据科学家',
    isCollected: true
  },
  {
    id: 6,
    type: 'patent',
    title: '基于深度学习的图像识别方法及系统',
    author: '某某大学',
    isCollected: false
  }
])

const getTypeIcon = (type) => {
  const iconMap = {
    article: 'icon-[material-symbols--article]',
    video: 'icon-[material-symbols--play-circle]',
    dataset: 'icon-[material-symbols--database]',
    patent: 'icon-[material-symbols--license]'
  }
  return iconMap[type] || 'icon-[material-symbols--description]'
}

const getTypeLabel = (type) => {
  const labelMap = {
    article: '文章',
    video: '视频',
    dataset: '数据集',
    patent: '专利'
  }
  return labelMap[type] || '其他'
}

const viewArticle = (item) => {
  // 跳转到文章详情页
  console.log('查看文章:', item)
}

const toggleCollect = (item) => {
  item.isCollected = !item.isCollected
}

const removeFromHistory = (id) => {
  const index = historyData.value.findIndex(item => item.id === id)
  if (index > -1) {
    historyData.value.splice(index, 1)
  }
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>