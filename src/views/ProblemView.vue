<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- 问题标题 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4 leading-relaxed">
          {{ questionData.title }}
        </h1>

        <!-- 问题描述 -->
        <div class="text-gray-700 mb-4 leading-relaxed">
          <!-- 描述内容 -->
          <div
            ref="descriptionRef"
            :style="{
              maxHeight: showFullDescription ? 'none' : '6rem',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }"
            class="relative"
          >
            <p class="whitespace-pre-wrap">{{ questionData.description }}</p>
            <!-- 渐变遮罩效果 -->
            <div
              v-if="!showFullDescription && showToggleButton"
              class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- 展开/收起按钮 -->
          <button
            v-if="showToggleButton"
            @click="toggleDescription"
            class="text-blue-500 hover:text-blue-600 text-sm mt-2 flex items-center gap-1 transition-colors"
          >
            {{ showFullDescription ? '收起' : '显示全部' }}
            <icon
              :class="
                showFullDescription
                  ? 'icon-[material-symbols--expand-less]'
                  : 'icon-[material-symbols--expand-more]'
              "
              class="w-4 h-4 transition-transform"
            />
          </button>
        </div>

        <div class="flex items-center gap-3 mb-4">
          <button
            @click="toggleAnswerEditor"
            class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <icon class="icon-[material-symbols--edit] w-4 h-4" />
            写回答
          </button>
        </div>
      </div>

      <!-- 写回答编辑器 -->
      <div v-if="showAnswerEditor" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">写回答</h3>
          <button
            @click="closeAnswerEditor"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <icon class="icon-[material-symbols--close] w-5 h-5" />
          </button>
        </div>

        <!-- Vditor 编辑器容器 -->
        <div ref="vditorContainer" class="mb-4"></div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-3">
          <button
            @click="submitAnswer"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            发布回答
          </button>
          <button
            @click="closeAnswerEditor"
            class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>

      <!-- 回答列表 -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- 回答列表 -->
        <div class="divide-y divide-gray-200">
          <div v-for="answer in answers" :key="answer.id" class="p-6">
            <!-- 用户信息 -->
            <div class="flex items-start gap-3 mb-4">
              <div class="avatar">
                <div
                  class="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium"
                >
                  <img :src="answer.avatar" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3
                    class="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                    @click="goToUserProfile(answer.userId)"
                  >
                    {{ answer.author }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- 回答内容 -->
            <div class="text-gray-700 leading-relaxed mb-4">
              <div :ref="(el) => setAnswerRef(el, answer.id)" class="vditor-reset"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { getQuestionDetail, getAnswers, submitAnswerTo } from '@/ts/Problem'
import { useRoute, useRouter } from 'vue-router'
import { getUserName } from '@/ts/User'

const route = useRoute()
const router = useRouter()

const userName = getUserName()
console.log('当前用户:', userName)

// 控制问题描述的展开状态
const showFullDescription = ref(false)

// 控制是否显示展开/收起按钮
const showToggleButton = ref(false)

// 描述内容的引用
const descriptionRef = ref(null)

// 控制回答编辑器的显示状态
const showAnswerEditor = ref(false)

// Vditor 编辑器实例
let contentEditor = null
const vditorContainer = ref(null)

const questionId = route.query.id // 假设路由参数名为 id

const goToUserProfile = (userId) => {
  router.push(`/personal-center/${userId}`)
}

// 渲染 Markdown 内容
const setAnswerRef = (el, answerId) => {
  if (el) {
    const answer = answers.value.find((a) => a.id === answerId)
    if (answer) {
      Vditor.preview(el, answer.content, {
        hljs: {
          style: 'github',
        },
        markdown: {
          toc: true,
        },
      })
    }
  }
}

// 问题数据
const questionData = ref({
  title: '',
  description: '',
})

const loadQuestionDetail = async () => {
  if (questionId) {
    try {
      const data = await getQuestionDetail(questionId)
      if (data) {
        questionData.value.title = data.title
        questionData.value.description = data.content
        // 重新检查内容高度
        await nextTick()
        checkContentHeight()
      }
    } catch (error) {
      console.error('加载问题详情失败:', error)
    }
  }
}

// 检查内容高度是否需要显示展开/收起按钮
const checkContentHeight = async () => {
  await nextTick()
  if (descriptionRef.value) {
    const element = descriptionRef.value
    // 临时移除高度限制获取真实高度
    const originalMaxHeight = element.style.maxHeight
    element.style.maxHeight = 'none'
    const fullHeight = element.scrollHeight

    // 恢复原始高度设置
    element.style.maxHeight = originalMaxHeight

    // 如果内容高度超过96px，则显示展开/收起按钮
    showToggleButton.value = fullHeight > 96
  }
}

// 切换问题描述的展开/收起状态
const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

// 显示回答编辑器
const toggleAnswerEditor = async () => {
  showAnswerEditor.value = !showAnswerEditor.value

  if (showAnswerEditor.value) {
    await nextTick()
    initVditor()
  } else {
    destroyVditor()
  }
}

// 关闭回答编辑器
const closeAnswerEditor = () => {
  showAnswerEditor.value = false
  destroyVditor()
}

// 初始化 Vditor 编辑器
const initVditor = () => {
  if (vditorContainer.value && !contentEditor) {
    contentEditor = new Vditor(vditorContainer.value, {
      height: 360,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      placeholder: '请输入您的回答...',
      after: () => {
        console.log('Vditor 编辑器初始化完成')
      },
    })
  }
}

// 销毁 Vditor 编辑器
const destroyVditor = () => {
  if (contentEditor) {
    contentEditor.destroy()
    contentEditor = null
  }
}

// 提交回答
const submitAnswer = () => {
  if (contentEditor) {
    const content = contentEditor.getValue()
    if (content.trim()) {
      // 这里添加提交回答的逻辑
      submitAnswerTo(questionId, content)
      console.log('回答内容:', content)

      // 添加新回答到回答列表
      const newAnswer = {
        id: answers.value.length + 1,
        author: userName, // 这里应该是实际的用户名
        content: content,
        likes: 0,
      }

      answers.value.unshift(newAnswer)

      // 关闭编辑器
      closeAnswerEditor()

      // 这里可以添加成功提示
      alert('回答发布成功！')
    } else {
      alert('请输入回答内容')
    }
  }
}

// 回答数据
const answers = ref([])

// 加载回答列表
const loadAnswers = async () => {
  if (questionId) {
    try {
      const data = await getAnswers(questionId)
      if (data && data.length > 0) {
        answers.value = data.map((item) => ({
          id: item.id,
          userId: item.userId,
          author: item.username,
          avatar: item.userAvatar,
          content: item.content,
        }))
      }
    } catch (error) {
      console.error('加载回答失败:', error)
    }
  }
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
  checkContentHeight()
  loadQuestionDetail()
  loadAnswers()
})
</script>

<style scoped></style>
