<template>
  <div class="min-h-screen bg-gradient-to-r  flex flex-col">
    <div class="max-w-[120rem] w-[80vw] mx-auto flex flex-col flex-1">
      <!-- 顶部大色块 -->
      <div class="h-[320px] bg-gradient-to-r from-blue-800 to-blue-900 rounded-t-2xl px-4 md:px-12 pb-8 text-white flex items-end">
        <div class="flex-1">
          <div class="text-sm opacity-90 mb-2">
            <span class="hover:underline cursor-pointer">Home</span>
            <span class="mx-2">></span>
            <span>Project</span>
          </div>
          <h1 class="text-4xl font-extrabold mb-4 drop-shadow-lg">
            {{ project.name || '项目名称' }}
          </h1>
          <div class="text-base opacity-90 flex flex-wrap items-center gap-4">
            <span>负责人：{{ project.owner?.username || '未知' }}</span>
            <span>|</span>
            <span>创建时间：{{ formatTime(project.createTime) }}</span>
          </div>
        </div>
        <div class="ml-auto flex flex-col items-center justify-end h-full">
          <img
            :src="project.owner?.avatar || '/default-avatar.png'"
            alt="负责人头像"
            class="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-3"
          />
          <div class="text-lg text-left opacity-90 max-w-80">
            <div class="font-semibold mb-1">{{ project.owner?.title || '' }}</div>
            <div class="text-xs">{{ project.owner?.institution || '' }}</div>
          </div>
        </div>
      </div>
      <!-- 下方内容区 -->
      <div class="flex flex-col h-screen md:flex-row gap-8 px-4 pb-12 bg-white rounded-b-2xl shadow-xl -mt-6">
        <!-- 主体卡片 -->
        <div class="flex-1 pt-8">
          <!-- 项目简介 -->
          <div id="project-intro" class="mb-10 scroll-mt-32">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">项目简介</h2>
            <div class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ project.projectInfo || '暂无简介' }}
            </div>
          </div>
          <!-- 合作条款 -->
          <div id="project-terms" class="mb-10 scroll-mt-32">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">合作条款</h2>
            <div class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ project.cooperationTerms || '暂无合作条款' }}
            </div>
          </div>
          <!-- 项目成员 -->
          <div id="project-members" class="mb-4 scroll-mt-32">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">项目成员</h2>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="member in project.members"
                :key="member.id"
                class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shadow-sm"
              >
                <img :src="member.avatar || '/default-avatar.png'" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-medium text-gray-800 text-sm">{{ member.username || '成员' }}</div>
                  <div class="text-xs text-gray-500">{{ member.title || member.degree || '' }}</div>
                </div>
              </div>
              <div v-if="!project.members?.length" class="text-gray-400">暂无成员</div>
            </div>
          </div>
        </div>
        <!-- 右侧操作区 -->
        <div class="w-full md:w-80 flex-shrink-0 pt-8">
          <div class="sticky top-32">
            <div class="bg-gray-50 rounded-2xl shadow-lg mb-6 overflow-hidden">
              <div class="bg-gray-100 px-6 py-3 font-semibold text-gray-700">项目导航</div>
              <div class="p-6 space-y-3">
                <a @click="scrollToSection('intro')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'intro'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline'
                  ]">
                  项目简介
                </a>
                <a @click="scrollToSection('terms')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'terms'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline'
                  ]">
                  合作条款
                </a>
                <a @click="scrollToSection('members')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'members'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline'
                  ]">
                  项目成员
                </a>
              </div>
            </div>
            <div class="space-y-3">
              <button class="w-full bg-blue-700 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition-colors shadow">
                加入项目
              </button>
              <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow">
                联系负责人
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeSection = ref('intro')

const project = ref({
  name: 'AI智能医疗协作项目',
  projectInfo: '本项目致力于AI在医疗领域的创新应用，欢迎各领域专家参与。',
  cooperationTerms: '合作公开透明，成果共享，署名按贡献排序。',
  owner: {
    username: '张三',
    avatar: '',
    title: '教授',
    institution: '清华大学'
  },
  members: [
    { id: 1, username: '李四', avatar: '', title: '副教授', degree: '博士' },
    { id: 2, username: '王五', avatar: '', title: '讲师', degree: '硕士' }
  ],
  createTime: Date.now()
})

function formatTime(time) {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

function scrollToSection(section) {
  activeSection.value = section
  let id = ''
  if (section === 'intro') id = 'project-intro'
  if (section === 'terms') id = 'project-terms'
  if (section === 'members') id = 'project-members'
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>