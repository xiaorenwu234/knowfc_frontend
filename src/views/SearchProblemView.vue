<template>
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto px-4 py-6">

        <div class="flex gap-6">
          <!-- 左侧内容区域 (2/3) -->
          <div class="flex-1 lg:w-2/3">
            <div class="space-y-6">
              <div
                v-for="question in questions"
                :key="question.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <!-- 问题标题 -->
                <h2 class="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                  {{ question.title }}
                </h2>

                <!-- 问题内容 -->
                <div class="prose prose-gray max-w-none mb-4">
                  <div
                    :ref="el => setContentRef(el, question.id)"
                    :data-content="question.content"
                    :class="[
                      'text-gray-700 leading-relaxed transition-all duration-300 cursor-pointer hover:bg-gray-50 rounded p-2',
                      (!expandedQuestions.has(question.id) && questionsNeedExpand.has(question.id))  ? 'content-collapsed' : 'content-expanded'
                    ]"
                    @click="navigateToQuestion(question.id)"
                  ></div>
                </div>

                <!-- 阅读全文/收起按钮 -->
                <button
                    v-if="questionsNeedExpand.has(question.id)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center"
                    @click="expandContent(question.id)"
                    >
                    {{ expandedQuestions.has(question.id) ? '收起' : '阅读全文' }}
                    <svg
                        class="w-4 h-4 ml-1 transition-transform duration-200"
                        :class="expandedQuestions.has(question.id) ? 'rotate-180' : ''"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    </button>

              </div>
            </div>
          </div>

          <!-- 右侧发布区域 (1/3) -->
          <div class="w-full lg:w-1/3">
            <div class="sticky top-6 space-y-6">
              <!-- 发布问题卡片 -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">发布问题</h3>
                <p class="text-gray-600 text-sm mb-4">分享你的疑问，获得专业解答</p>
                <button
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  @click="showPublishDialog = true"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                  </svg>
                  <span>发布新问题</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 发布问题对话框 -->
      <div
        v-if="showPublishDialog"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeDialog"
      >
        <div
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- 对话框头部 -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">发布新问题</h3>
            <button
              class="text-gray-400 hover:text-gray-600 transition-colors"
              @click="showPublishDialog = false"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>

          <!-- 对话框内容 -->
          <div class="p-6 space-y-6">
            <!-- 问题标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">问题标题</label>
              <input
                v-model="newQuestion.title"
                type="text"
                placeholder="请输入问题标题"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <!-- 问题描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">问题描述</label>
              <textarea
                v-model="newQuestion.description"
                rows="8"
                placeholder="请详细描述您的问题..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              ></textarea>
            </div>
          </div>

          <!-- 对话框底部 -->
          <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="showPublishDialog = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              @click="submitQuestion"
            >
              发布问题
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import Vditor from 'vditor'
  import 'vditor/dist/index.css'
  import { searchProblem } from '@/ts/Problem'
  import { useSearchStore } from '@/stores/search'
  import { useRouter } from 'vue-router'
  const searchStore = useSearchStore()
  const router = useRouter()

  // 响应式数据
  const showPublishDialog = ref(false)
  const contentRefs = ref(new Map())
  const expandedQuestions = ref(new Set())
  const questionsNeedExpand = ref(new Set())

  // 问题数据
  const questions = ref([])

    // 新问题表单
    const newQuestion = ref({
      title: '',
      content: '还没有人回答噢',
      description: '',
    })

    // 方法
    const setContentRef = (el, questionId) => {
    if (el) {
        contentRefs.value.set(questionId, el)
        // 立即渲染内容
        renderQuestionContent(questionId, el)
    }
    }

    const renderQuestionContent = (questionId, element) => {
    const question = questions.value.find(q => q.id === questionId)
    if (question && element) {
        Vditor.preview(element, question.content, {
        theme: 'classic',
        mode: 'dark',
        hljs: {
            style: 'github'
        },
        math: {
            inlineDigit: true
        }
        })

        // 延迟检查，确保 Vditor 渲染完成
        setTimeout(() => {
            checkIfNeedExpand(questionId, element)
        }, 100)
    }
}

const checkIfNeedExpand = (questionId, element) => {
    if (element) {
        const collapsedHeight = 120 // 7.5rem = 120px
        const actualHeight = element.scrollHeight

        console.log(`Question ${questionId}: actualHeight=${actualHeight}, collapsedHeight=${collapsedHeight}`) // 调试信息

        if (actualHeight > collapsedHeight) {
            questionsNeedExpand.value.add(questionId)
        } else {
            questionsNeedExpand.value.delete(questionId)
        }
    }
}

    const expandContent = (questionId) => {
    // 切换展开状态
    if (expandedQuestions.value.has(questionId)) {
        expandedQuestions.value.delete(questionId)
    } else {
        expandedQuestions.value.add(questionId)
    }

    // 重新渲染内容以确保 Markdown 正确显示
    nextTick(() => {
        const ref = contentRefs.value.get(questionId)
        if (ref) {
        renderQuestionContent(questionId, ref)
        }
    })
    }

    const closeDialog = () => {
      showPublishDialog.value = false
    }

    const submitQuestion = () => {
      if (!newQuestion.value.title.trim()) {
        alert('请输入问题标题')
        return
      }

      if (!newQuestion.value.content.trim()) {
        alert('请输入问题描述')
        return
      }

      // 重置表单
      newQuestion.value = { title: '', content: ''}

      showPublishDialog.value = false
      alert('问题发布成功！')
    }


    const initSearch = async () => {
    try {
      const results = await searchProblem(searchStore.searchQuery.content)
      console.log('Search results:', results)
      // 将搜索结果映射到 questions 数组
      questions.value = results.content.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content
      }))
    } catch (error) {
      console.error('Search failed:', error)

    }
  }

  initSearch()

  const navigateToQuestion = (questionId) => {
    router.push(`/problem?id=${questionId}`)
  }

    // 生命周期
    onMounted(async () => {
    await nextTick()

    // 延迟初始化内容渲染，确保DOM完全准备好
    setTimeout(() => {
        questions.value.forEach(question => {
            const ref = contentRefs.value.get(question.id)
            if (ref) {
                renderQuestionContent(question.id, ref)
            }
        })
    }, 50)
})
  </script>

  <style>
  /* 折叠状态 - 限制高度并添加渐变遮罩 */
  .content-collapsed {
    max-height: 7.5rem; /* 约5行的高度 */
    overflow: hidden;
    position: relative;
  }

  .content-collapsed::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2rem;
    background: linear-gradient(transparent, white);
    pointer-events: none;
  }

  /* 展开状态 */
  .content-expanded {
    max-height: none;
    overflow: visible;
  }

  /* 移除原来的 line-clamp 样式 */
  </style>
