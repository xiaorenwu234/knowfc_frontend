<template>
  <div class="min-h-screen bg-gradient-to-r flex flex-col">
    <div class="max-w-[120rem] w-[80vw] mx-auto flex flex-col flex-1">
      <!-- 顶部大色块 -->
      <div
        class="h-[320px] bg-gradient-to-r from-blue-800 to-blue-900 rounded-t-2xl px-4 md:px-12 pb-8 text-white flex items-end"
      >
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
            class="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-3 cursor-pointer transition hover:scale-105"
            @click="goToUser(project.owner?.id)"
          />
          <div class="text-lg text-left opacity-90 max-w-80">
            <div class="font-semibold mb-1">{{ project.owner?.title || '' }}</div>
            <div class="text-xs">{{ project.owner?.institution || '' }}</div>
          </div>
        </div>
      </div>
      <!-- 下方内容区 -->
      <div
        class="flex flex-col h-screen md:flex-row gap-8 px-4 pb-12 bg-white rounded-b-2xl shadow-xl -mt-6"
      >
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
                <img
                  :src="member.avatar || '/default-avatar.png'"
                  class="w-8 h-8 rounded-full object-cover cursor-pointer transition hover:scale-110"
                  @click="goToUser(member.id)"
                />
                <div>
                  <div class="font-medium text-gray-800 text-sm">
                    {{ member.username || '成员' }}
                  </div>
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
                <a
                  @click="scrollToSection('intro')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'intro'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline',
                  ]"
                >
                  项目简介
                </a>
                <a
                  @click="scrollToSection('terms')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'terms'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline',
                  ]"
                >
                  合作条款
                </a>
                <a
                  @click="scrollToSection('members')"
                  :class="[
                    'block cursor-pointer transition-colors px-2 py-1 rounded',
                    activeSection === 'members'
                      ? 'text-gray-800 bg-gray-200 font-bold'
                      : 'text-blue-700 hover:underline',
                  ]"
                >
                  项目成员
                </a>
              </div>
            </div>
            <div class="space-y-3">
              <button
                v-if="isJoined"
                class="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-xl cursor-not-allowed shadow"
                disabled
              >
                已加入项目
              </button>

              <button
                v-else
                class="w-full bg-blue-700 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition-colors shadow"
                @click="applyProject"
              >
                申请加入项目
              </button>
              <button
                v-if="
                  user &&
                  user.id &&
                  project.owner &&
                  project.owner.id &&
                  user.id !== project.owner.id
                "
                class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow"
                @click="contactOwner"
              >
                联系负责人
              </button>
              <button
                class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow"
                @click="openInviteDialog"
              >
                邀请成员
              </button>
            </div>
            <!-- 邀请弹窗 -->
            <div
              v-if="showInviteDialog"
              class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
              <div class="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl">
                <h3 class="text-lg font-bold mb-4 text-gray-800">邀请成员加入项目</h3>

                <!-- 搜索框 -->
                <input
                  v-model="searchKeyword"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                  placeholder="请输入用户名、机构或研究领域关键字"
                  @keyup.enter="searchUsers"
                />

                <!-- 搜索结果 -->
                <div v-if="searchResults.length === 0" class="text-gray-400 text-sm mb-2">
                  暂无搜索结果
                </div>
                <ul>
                  <li
                    v-for="user in searchResults"
                    :key="user.id"
                    class="flex items-center justify-between py-1"
                  >
                    <label class="flex items-center gap-2">
                      <input type="checkbox" v-model="selectedUserIds" :value="user.id" />
                      <span>{{ user.username }}（{{ user.institution || '未知机构' }}）</span>
                    </label>
                  </li>
                </ul>

                <div class="flex justify-end gap-2 mt-4">
                  <button
                    @click="closeInviteDialog"
                    class="px-4 py-1 rounded border border-gray-300 bg-gray-50 text-gray-700"
                  >
                    取消
                  </button>
                  <button
                    @click="sendInvites"
                    class="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    发送邀请
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import axios from 'axios'
import { getUserId } from '@/js/User'

const router = useRouter()
const route = useRoute()
const project = ref({
  name: '',
  projectInfo: '',
  cooperationTerms: '',
  owner: {},
  members: [],
  createTime: '',
})

function formatTime(time) {
  if (!time) return ''
  return new Date(time).toLocaleString()
}
const userid = getUserId()
const isJoined = computed(() => {
  if (!userid) return false
  if (project.value.owner?.id === userid) return true
  return project.value.members?.some((m) => m.id === userid)
})
const activeSection = ref('intro')
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
const id = route.params.id || route.query.id
// 获取项目详情
async function fetchProject() {
  const id = route.params.id || route.query.id
  if (!id) return
  try {
    // 用 buildApiUrl 拼接完整后端地址
    const res = await axios.get(buildApiUrl(`/project/getProjectById/${id}`))
    console.log('获取项目详情', res.data)
    if (res.data && res.data.code === 200 && res.data.data) {
      project.value = {
        ...res.data.data,
        owner: res.data.data.owner || {},
        members: Array.isArray(res.data.data.members) ? res.data.data.members : [],
      }
    }
  } catch (e) {
    console.error('获取项目失败', e)
  }
  // project.value = {
  //     id: 1,
  //     name: 'AI科研协作平台',
  //     projectInfo: '本项目旨在打造一个面向高校师生的AI科研协作与知识共享平台。',
  //     cooperationTerms: '欢迎有AI、前端、后端开发经验的同学加入，需每周参与例会。',
  //     owner: {
  //         id: 1,
  //         username: 'Dr. Zhang',
  //         avatar: 'https://knowfc.oss-cn-beijing.aliyuncs.com/avatar/3d.jpg',
  //         title: '教授',
  //         institution: '清华大学计算机系'
  //     },
  //     members: [
  //         {
  //             id: 2,
  //             username: 'Alice',
  //             avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  //             title: '博士生'
  //         },
  //         {
  //             id: 3,
  //             username: 'Bob',
  //             avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  //             degree: '硕士生'
  //         }
  //     ],
  //     createTime: '2025-06-24T14:02:13.031071'
  // }
}
function goToUser(userId) {
  if (userId) {
    router.push({ path: `/personal-center/${userId}` })
  }
}
const applying = ref(false)
async function applyProject() {
  if (applying.value) return
  applying.value = true
  try {
    if (!userid) {
      alert('请先登录')
      applying.value = false
      return
    }
    // 用 FormData 构造参数
    const formData = new FormData()
    formData.append('projectId', project.value.id)
    formData.append('applicantId', userid)
    formData.append('content', '申请加入项目')
    const res = await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.APPLY_FOR_PROJECT), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res.data && res.data.code === 0) {
      alert('申请已提交')
    } else {
      alert(res.data.msg || '申请失败')
    }
  } catch (e) {
    alert('网络错误')
  }
  applying.value = false
}

function contactOwner() {
  router.push({ path: '/chat', query: { userId: project.value.owner?.id, msg: 'hello' } })
}

onMounted(() => {
  fetchProject()
})

const showInviteDialog = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])
const selectedUserIds = ref([])
function openInviteDialog() {
  showInviteDialog.value = true
  searchKeyword.value = ''
  searchResults.value = []
  selectedUserIds.value = []
}

function closeInviteDialog() {
  showInviteDialog.value = false
}

// 搜索用户
async function searchUsers() {
  try {
    const params = new URLSearchParams()
    if (searchKeyword.value) params.append('keyword', searchKeyword.value)
    params.append('size', '10')
    params.append('sortBy', 'relevance')

    const res = await axios.get(buildApiUrl('/users/search'), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params,
    })
    console.log('搜索结果', res.data)
    searchResults.value = Array.isArray(res.data?.data?.content) ? res.data.data.content : []
  } catch (e) {
    searchResults.value = []
  }
}

// 发送邀请
async function sendInvites() {
  const inviterId = user.id
  const projectId = id || prompt('请输入项目ID')

  if (!projectId) return alert('缺少项目ID')

  for (const inviteeId of selectedUserIds.value) {
    await axios.post(
      buildApiUrl('/project/invite'),
      {
        inviterId,
        inviteeId,
        projectId,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [
          (data) =>
            Object.entries(data)
              .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
              .join('&'),
        ],
      },
    )
  }

  alert('邀请发送成功')
  closeInviteDialog()
}
</script>
