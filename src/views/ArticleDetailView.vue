<template>
  <div class="flex flex-col h-full ">

    <div class="w-full">
      <div class="h-[380px] bg-gradient-to-r from-orange-800 to-orange-900 flex items-start px-8 py-6 text-white">

        <div id="title" class="flex-1 flex flex-col justify-evenly h-full">
          <!-- 面包屑导航 -->
          <div class="text-sm opacity-90">
            <span class="hover:underline cursor-pointer">Home</span>
            <span class="mx-2">></span>
            <span class="hover:underline cursor-pointer">{{ articleData.journal }}</span>
            <span class="mx-2">></span>
            <span>Article</span>
          </div>

          <!-- 文章标题 -->
          <h1 class="text-2xl font-bold leading-tight my-4 max-w-4xl">
            {{ articleData.title }}
          </h1>

          <!-- 文章信息 -->
          <div class="text-sm opacity-90 flex flex-wrap items-center gap-4">
            <span>{{ articleData.type }}</span>
            <span>|</span>
            <span>Published: {{ articleData.publishDate }}</span>
            <span>({{ articleData.year }})</span>
            <button class="underline hover:no-underline transition-all">Cite this article</button>
          </div>
        </div>

        <!-- 右侧期刊封面和信息 -->
        <div class="ml-8 flex-shrink-0 flex flex-col items-start justify-center h-full mr-[180px]">
          <img
            :src="articleData.coverImage"
            alt="Journal Cover"
            class="w-32 h-48 object-cover rounded shadow-lg mb-3"
          />
          <div class="text-lg text-left opacity-90 max-w-80">
            <div class="font-semibold mb-1">{{ articleData.journal }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-grow flex flex-col md:flex-row">
      <!-- 文章内容部分 -->
      <div class="w-full md:w-2/3 bg-white shadow-sm p-16">
        <!-- 作者信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">作者：</h3>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">✓</span>
              </span>
              <span>被引用量</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">△</span>
              </span>
              <span>fwci指数</span>
            </div>
          </div>
        </div>

        <!-- 摘要部分 -->
        <div id="abstract" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">摘要</h2>
          <div class="text-gray-700 leading-relaxed">
            <p class="mb-4">{{ articleData.abstract || '文章摘要内容将在这里显示...' }}</p>
          </div>
        </div>

        <!-- 相关文章推荐 -->
        <div id="related" class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">其他人正在查看类似内容</h3>
          <div class="space-y-3">
            <div v-for="(article, index) in relatedArticles" :key="index"
                 class="p-3 bg-white rounded border hover:shadow-md transition-shadow cursor-pointer">
              <h4 class="font-medium text-blue-600 hover:underline">{{ article.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ article.authors }}</p>
            </div>
          </div>
        </div>

        <!-- 引用部分 -->
        <div id="citations" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">引用</h2>
          <p class="text-gray-600">{{ articleData.citations || '无' }}</p>
        </div>

        <!-- 作者信息详细 -->
        <div id="authors" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">作者信息</h2>
          <div class="space-y-4">
            <div v-for="(author, index) in articleData.authors" :key="index"
                 class="p-4 border rounded-lg">
              <h4 class="font-semibold">{{ author.name }}</h4>
              <p class="text-sm text-gray-600">{{ author.affiliation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧索引部分 -->
      <div class="w-full md:w-1/3 bg-white shadow-sm p-6">
        <div class="sticky top-24">
          <div class="bg-gray-100 rounded-lg overflow-hidden">
            <!-- 索引标题 -->
            <div class="bg-gray-200 px-4 py-2 flex">
              <span class="flex-1 font-semibold">概块</span>
              <span class="text-blue-600 cursor-pointer hover:underline">引用</span>
            </div>

            <!-- 索引内容 -->
            <div class="p-4 space-y-3">
              <a @click="scrollToSection('title')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'title'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline'
                ]">
                标题
              </a>
              <a @click="scrollToSection('abstract')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'abstract'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline'
                ]">
                摘要
              </a>
              <a @click="scrollToSection('related')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'related'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline'
                ]">
                相关文章
              </a>
              <a @click="scrollToSection('citations')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'citations'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline'
                ]">
                引用
              </a>
              <a @click="scrollToSection('authors')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'authors'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline'
                ]">
                作者信息
              </a>
            </div>
          </div>

          <!-- 下载和操作按钮 -->
          <div class="mt-6 space-y-3">
            <button class="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
              下载 PDF
            </button>
            <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
              收藏文章
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeSection = ref('') // 默认激活相关文章

// 文章数据
const articleData = ref({
  title: "AI-generated or AI touch-up? Identifying AI contribution in text data",
  type: "Original Paper",
  publishDate: "07 December 2024",
  year: "2024",
  journal: "International Journal of Data Science and Analytics",
  coverImage: "image.png",
  abstract: "本文探讨了AI在文本数据中的贡献识别问题，提出了一种新的方法来区分AI生成的内容和AI辅助编辑的内容...",
  citations: "无",
  authors: [
    {
      name: "张三",
      affiliation: "某某大学计算机学院",
    }
  ]
})

// 相关文章数据
const relatedArticles = ref([
  {
    title: "Deep Learning Approaches for Text Generation",
    authors: "Smith, J. et al."
  },
  {
    title: "Detecting AI-Generated Content in Academic Papers",
    authors: "Wang, L. & Chen, M."
  }
])

// 平滑滚动到指定区域
const scrollToSection = (sectionId) => {
  // 设置当前激活的章节
  activeSection.value = sectionId

  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>
