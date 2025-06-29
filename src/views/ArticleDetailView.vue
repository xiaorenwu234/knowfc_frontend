<template>
  <div class="flex flex-col h-full">
    <div class="w-full">
      <div
        class="h-[380px] bg-gradient-to-r from-orange-800 to-orange-900 flex items-start px-8 py-6 text-white"
      >
        <div id="title" class="flex-1 flex flex-col justify-evenly h-full">
          <!-- 面包屑导航 -->
          <div class="text-sm opacity-90">
            <span class="hover:underline cursor-pointer">Home</span>
            <span class="mx-2">></span>
            <span>{{ articleDetail.type }}</span>
            <span class="mx-2">></span>
            <span>{{ articleDetail.title }}</span>
            <span class="mx-2">></span>
            <span>Article</span>
          </div>

          <!-- 文章标题 -->
          <h1 class="text-2xl font-bold leading-tight my-4 max-w-4xl">
            {{ articleDetail.title }}
          </h1>

          <!-- 文章信息 -->
          <div class="text-sm opacity-90 flex flex-wrap items-center gap-4">
            <span>{{ articleDetail.type }}</span>
            <span>|</span>
            <span>发布日期: {{ articleDetail.date }}</span>
          </div>

          <div class="flex items-center gap-6 text-white font-medium -mb-10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="inline w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
              点赞数：{{ articleDetail.likes }}
            </span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="inline w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              评论数：{{ articleDetail.comments ? articleDetail.comments.length : 0 }}
            </span>
          </div>
        </div>

        <!-- 右侧期刊封面和信息 -->
        <div class="ml-8 flex-shrink-0 flex flex-col items-start justify-center h-full mr-[180px]">
          <img
            :src="articleData.coverImage"
            alt="Journal Cover"
            class="w-32 h-40 object-cover rounded shadow-lg mb-3"
          />
          <div class="text-lg text-left opacity-90 max-w-80">
            <div class="font-semibold mb-1">{{ articleDetail.source }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-grow flex flex-col md:flex-row">
      <!-- 文章内容部分 -->
      <div class="w-full md:w-2/3 bg-white shadow-sm p-16">
        <!-- 作者信息 -->
        <div class="mb-6">
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span class="text-lg font-semibold text-gray-800">
              作者：{{
                articleDetail.authors
                  ? articleDetail.authors.map((author) => author.name).join(', ')
                  : '暂无作者信息'
              }}
            </span>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">✓</span>
              </span>
              <span>被引用量：11</span>
            </div>
          </div>
        </div>

        <!-- 摘要部分 -->
        <div id="abstract" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">摘要</h2>
          <div class="text-gray-700 leading-relaxed">
            <p class="mb-4">{{ articleDetail.abstract || '文章摘要内容将在这里显示...' }}</p>
          </div>
        </div>
        <!-- 相关文章推荐 -->
        <div id="related" class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">其他人正在查看类似内容</h3>
          <div class="space-y-3">
            <div
              v-for="(article, index) in relatedArticles"
              :key="index"
              class="p-3 bg-white rounded border hover:shadow-md transition-shadow cursor-pointer"
            >
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
            <div
              v-for="(author, index) in articleDetail.authors"
              :key="index"
              class="p-4 border rounded-lg"
            >
              <h4 class="font-semibold">姓名：{{ author.name }}</h4>
              <p class="text-sm text-gray-600 mt-2">所属机构：{{ author.affiliation }}</p>
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <div id="comments" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">评论区</h2>
          <div
            class="space-y-4 mb-4"
            v-for="(comment, index) in articleDetail.comments"
            :key="index"
          >
            <div class="p-4 border rounded-lg bg-gray-50">
              <div class="flex items-center gap-2 mb-2">
                <img
                  class="w-8 h-8 rounded-full flex items-center justify-center aspect-square"
                  :src="comment.avatar"
                  alt="头像"
                />
                <span class="font-semibold text-gray-800">{{ comment.username }}</span>
                <span class="text-xs text-gray-400 mt-1">2024-06-30</span>
              </div>
              <div class="text-gray-700 leading-relaxed">
                {{ comment.content }}
              </div>
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
              <a
                @click="scrollToSection('title')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'title'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                标题
              </a>
              <a
                @click="scrollToSection('abstract')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'abstract'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                摘要
              </a>
              <a
                @click="scrollToSection('related')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'related'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                相关文章
              </a>
              <a
                @click="scrollToSection('citations')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'citations'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                引用
              </a>
              <a
                @click="scrollToSection('authors')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'authors'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                作者信息
              </a>
              <a
                @click="scrollToSection('comments')"
                :class="[
                  'block cursor-pointer transition-colors',
                  activeSection === 'comments'
                    ? 'text-gray-600 bg-gray-200 px-2 py-1 rounded'
                    : 'text-blue-600 hover:underline',
                ]"
              >
                评论区
              </a>
            </div>
          </div>

          <!-- 下载和操作按钮 -->
          <div class="mt-6 space-y-3">
            <button
              class="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              <a :href="router.resolve({ name: 'UserProfile', params: { id: articleId as string } }).href" target="_blank"
                >查看 PDF</a
              >
            </button>
            <button
              class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
              :class="{ 'bg-orange-50 border-orange-700 text-orange-700': liked_statement }"
              @click="handleLike"
            >
              {{ liked_statement ? '已点赞' : '点赞文章' }}
            </button>

            <!--            <button-->
            <!--              class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"-->
            <!--            >-->
            <!--              收藏文章-->
            <!--            </button>-->
            <button
              class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
              @click="toggleCommentEditor"
            >
              评论文章
            </button>
            <div v-if="showCommentEditor" class="bg-white rounded-lg shadow-sm p-4 mt-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">写评论</h3>
                <button
                  @click="closeCommentEditor"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                v-model="commentContent"
                rows="4"
                class="w-full border rounded p-2 mb-2"
                placeholder="请输入您的评论..."
              ></textarea>
              <div class="flex items-center gap-3">
                <button
                  @click="submitComment"
                  class="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
                >
                  发布评论
                </button>
                <button
                  @click="closeCommentEditor"
                  class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cancelLikeArticle, getArticleLike, likeArticle, sendComment } from '@/ts/ArticleDetail.js'
import { getWorkDetail } from '@/ts/Work.js'

const router = useRouter()
const activeSection = ref('') // 默认激活相关文章
const route = useRoute()
const articleId = route.query.id
const articleDetail = ref({})
const getArticleDetail = async (articleId: string) => {
  articleDetail.value = await getWorkDetail(articleId)
  console.log(articleDetail.value)
  liked_statement.value = await getArticleLike(articleId)
}
onMounted(async () => {
  await getArticleDetail(articleId as string)

  // publishDate.value = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(articleDetail.date))
  console.log(articleDetail.value)
})
// 文章数据
const articleData = ref({
  title: 'AI-generated or AI touch-up? Identifying AI contribution in text data',
  type: 'Original Paper',
  publishDate: '07 December 2024',
  year: '2024',
  journal: 'International Journal of Data Science and Analytics',
  coverImage: 'brand-logomark-primary-large.jpg',
  abstract:
    '本文探讨了AI在文本数据中的贡献识别问题，提出了一种新的方法来区分AI生成的内容和AI辅助编辑的内容...',
  citations: '无',
  authors: [
    {
      name: '张三',
      affiliation: '某某大学计算机学院',
    },
  ],
})

// 相关文章数据
const relatedArticles = ref([
  {
    title: 'Deep Learning Approaches for Text Generation',
    authors: 'Smith, J. et al.',
  },
  {
    title: 'Detecting AI-Generated Content in Academic Papers',
    authors: 'Wang, L. & Chen, M.',
  },
])

// 平滑滚动到指定区域
const scrollToSection = (sectionId: string) => {
  // 设置当前激活的章节
  activeSection.value = sectionId

  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const liked_statement = ref(false)

const handleLike = async () => {
  if (!liked_statement.value) {
    if (await likeArticle(articleId)) {
      liked_statement.value = true
      articleDetail.value.likes += 1 // 增加点赞数
    }
  } else {
    if (await cancelLikeArticle(articleId)) {
      liked_statement.value = false
      articleDetail.value.likes -= 1
    }
  }
}

const showCommentEditor = ref(false)
const commentContent = ref('')

const toggleCommentEditor = () => {
  showCommentEditor.value = !showCommentEditor.value
}

const closeCommentEditor = () => {
  showCommentEditor.value = false
  commentContent.value = ''
}

const submitComment = async () => {
  await sendComment(articleId, commentContent.value)
  closeCommentEditor()
  await getArticleDetail(articleId)
}
</script>
