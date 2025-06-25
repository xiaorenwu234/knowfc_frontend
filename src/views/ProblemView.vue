<template>
    <div class="min-h-screen bg-gray-50">
      <!-- 主要内容区域 -->
      <div class="max-w-5xl mt-24 mx-auto px-4 py-6">
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
                transition: 'max-height 0.3s ease'
              }"
              class="relative">
              <p class="whitespace-pre-wrap">{{ questionData.description }}</p>
              <!-- 渐变遮罩效果 -->
              <div 
                v-if="!showFullDescription && showToggleButton" 
                class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none">
              </div>
            </div>
            
            <!-- 展开/收起按钮 -->
            <button 
              v-if="showToggleButton"
              @click="toggleDescription" 
              class="text-blue-500 hover:text-blue-600 text-sm mt-2 flex items-center gap-1 transition-colors">
              {{ showFullDescription ? '收起' : '显示全部' }}
              <icon :class="showFullDescription ? 'icon-[material-symbols--expand-less]' : 'icon-[material-symbols--expand-more]'" 
                    class="w-4 h-4 transition-transform" />
            </button>
          </div>

          <div class="flex items-center gap-3 mb-4">
            <button 
              @click="toggleAnswerEditor"
              class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
              class="text-gray-400 hover:text-gray-600 transition-colors">
              <icon class="icon-[material-symbols--close] w-5 h-5" />
            </button>
          </div>
          
          <!-- Vditor 编辑器容器 -->
          <div ref="vditorContainer" class="mb-4"></div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center gap-3">
            <button 
              @click="submitAnswer"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              发布回答
            </button>
            <button 
              @click="closeAnswerEditor"
              class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
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
                  <div class="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium">
                    {{ answer.author.slice(0, 1) }}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900">{{ answer.author }}</h3>
                    <button class="btn btn-sm btn-outline text-blue-500 border-blue-500 hover:bg-blue-500 px-3 py-1 text-xs">
                      + 关注
                    </button>
                  </div>
                </div>
              </div>
  
              <!-- 回答内容 -->
              <div class="text-gray-700 leading-relaxed mb-4">
                    <div :ref="el => setAnswerRef(el, answer.id)" class="vditor-reset"></div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
 import { ref, onMounted, nextTick } from 'vue'
  import Vditor from 'vditor'
  import 'vditor/dist/index.css'
  
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

  // 渲染 Markdown 内容
  const setAnswerRef = (el, answerId) => {
    if (el) {
        const answer = answers.value.find(a => a.id === answerId)
        if (answer) {
        Vditor.preview(el, answer.content, {
            hljs: {
            style: 'github'
            },
            markdown: {
            toc: true,
            }
        })
        }
    }
  }
  
  // 问题数据
  const questionData = ref({
    title: '如何看待清华校长李路明在2025年本科生毕业典礼上讲话称张校"发表了中国第一篇人工智能领域论文"？',
    description: `今年以来，"张校老师发表了中国第一篇人工智能领域论文"的说法突然盛行，虽然觉得可笑，但终归没上大雅之堂。但现在居然连清华校长在这么庄严的场合下讲断，这就让人很无语了。

首先需要明确的是，人工智能作为一个学科领域，其发展历史可以追溯到20世纪50年代。而中国在这一领域的起步虽然相对较晚，但也有着悠久的历史。

对于"第一篇论文"的说法，我们需要从几个维度来考虑：一是时间维度，二是内容维度，三是发表平台的权威性。不同的标准可能会得出不同的结论。

更重要的是，学术研究应该注重的是其科学价值和对学科发展的贡献，而不是简单的"第一"标签。我们应该以更加客观和理性的态度来看待学术史上的各种说法。

希望大家能够理性讨论，共同推动学术环境的健康发展。`
  })
  
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
        console.log('回答内容:', content)
        
        // 添加新回答到回答列表
        const newAnswer = {
          id: answers.value.length + 1,
          author: '当前用户', // 这里应该是实际的用户名
          content: content,
          likes: 0
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
  const answers = ref([
    {
      id: 1,
      author: 'NO1WDS',
      content: '## 可以参考这个回答：\n\n严格意义上是中国大陆的第一篇IJCAI+',
      likes: 22,
    },
    {
      id: 2,
      author: '学术研究者',
      content: '这个说法需要从历史背景来看。中国在人工智能领域的起步确实比较早，但是要说"第一篇"这个表述可能需要更严谨的考证。建议大家理性看待，重要的是推动学科发展。',
      likes: 156,
    },
    {
      id: 3,
      author: '历史档案员',
      content: '从档案资料来看，这个问题比较复杂。需要明确"人工智能"的定义范围，以及"中国第一篇"的具体标准。不同的定义可能会得出不同的结论。',
      likes: 89,
    },
    {
      id: 4,
      author: 'AI观察者',
      content: '建议大家回归学术本质，不要过分纠结于"第一"的称号。重要的是认真做研究，推动学科进步。每个时代都有每个时代的贡献。',
      likes: 67,
    }
  ])
  
  onMounted(() => {
    // 组件挂载后的初始化逻辑
    checkContentHeight()
  })
  </script>
  
  <style scoped>  
  </style>