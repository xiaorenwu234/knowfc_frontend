<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EditPersonalData from '@/components/EditPersonalData.vue'
import axios from 'axios'
import { API_CONFIG, buildApiUrl } from '@/config/api.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { checkFollowStatus, followUser, getFollowList, unfollowUser } from '@/js/FollowUser.ts'
import instance from '@/js/axios'
import { getUserId, logout } from '@/js/User'
import { notify } from '@/js/toast'
import type { ProjectSummary } from '@/js/ProjectSummary'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import UserGraph from "@/views/UserGraph.vue";

const windowSize = ref({
  width: window.innerWidth,
  height: window.innerHeight,
})

const updateWindowSize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const handleQuit = () => {
  logout()
  router.push('/')
}

const ownerReference = ref('Ta')
const userInfo = ref(null)
const route = useRoute()
const userIdOnDisplay = String(route.params.id)
const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_INFO.replace('id', userIdOnDisplay))
const following = ref(false)
const fetchUserInfo = async () => {
  await axios.get(url).then((res) => {
    userInfo.value = res.data.data
  })
}

const showModal = ref(false)
const reason = ref('')
const errorMessage = ref('')
const projectId = ref()
const categories = [
  `${ownerReference.value}创建的科研项目`,
  `${ownerReference.value}参与的科研项目`,
  `${ownerReference.value}的论文`,
  `${ownerReference.value}的科研人员网络`,
]

const openModal = (pId: number) => {
  showModal.value = true
  reason.value = ''
  errorMessage.value = ''
  projectId.value = pId
}

const closeModal = () => {
  showModal.value = false
  projectId.value = null
}

const submit = async () => {
  if (!reason.value.trim()) {
    errorMessage.value = '必须填写申请理由'
    return
  }
  try {
    await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.APPLY_FOR_PROJECT), {
      projectId: projectId.value,
      applicantId: getUserId(),
      content: reason.value,
    })
    closeModal()
    alert('申请已提交成功！')
    // 可以在这里添加成功后的回调逻辑
  } catch (error) {
    errorMessage.value = '提交失败，请重试'
    console.error('申请提交失败:', error)
  }
}

const handleFollow = async () => {
  if (following.value) await unfollowUser(userIdOnDisplay)
  else await followUser(userIdOnDisplay)

  following.value = !following.value
}
const showFollowModal = ref(false)
const showFollow = () => {
  showFollowModal.value = true
}
const handleCloseFollowModal = () => {
  showFollowModal.value = false
}

const getOwnerProjects = async () => {
  try {
    const res = await instance.get(`/project/getOwnerProjectByUserId/${userIdOnDisplay}`)
    if (res.data && res.data.code === 200) {
      projects.value = res.data.data
    } else {
      notify('error', '获取项目失败', res.data.msg)
    }
  } catch (error) {
    notify('error', '网络错误', error?.toString())
  }
}

const getParticipatedProjects = async () => {
  try {
    const res = await instance.get(`/project/getParticipatedProjectsByUserId/${userIdOnDisplay}`)
    if (res.data && res.data.code === 200) {
      participatedProjects.value = res.data.data
    } else {
      notify('error', '获取项目失败', res.data.msg)
    }
  } catch (error) {
    notify('error', '网络错误', error?.toString())
  }
}

const projects = ref<ProjectSummary[]>()
const participatedProjects = ref<ProjectSummary[]>()
const followList = ref()

const updateAvatar = async (avatar: File) => {
  const formData = new FormData()
  formData.append('avatar', avatar)
  try {
    const response = await axios.post('/users/update-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (response.data.code === 200) {
      notify('success', '头像更新成功')
      fetchUserInfo()
    } else {
      notify('error', '头像更新失败', response.data.msg)
    }
  } catch (error) {
    notify('error', '网络错误', error?.toString())
  }
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
  fetchUserInfo()
  ownerReference.value = userIdOnDisplay == getUserId().toString() ? '我' : 'Ta'
  getOwnerProjects()
  getParticipatedProjects()
  checkFollowStatus(userIdOnDisplay).then((res) => {
    following.value = res
  })
  getFollowList(userIdOnDisplay).then((res) => {
    followList.value = res
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
})

const showForm = ref(false)
const showCreateModal = ref(false)
const createForm = ref({
  name: '',
  projectInfo: '',
  cooperationTerms: '',
})
const createError = ref('')

const openCreateModal = () => {
  showCreateModal.value = true
  createForm.value = { name: '', projectInfo: '', cooperationTerms: '' }
  createError.value = ''
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const submitCreate = async () => {
  if (
    !createForm.value.name.trim() ||
    !createForm.value.projectInfo.trim() ||
    !createForm.value.cooperationTerms.trim()
  ) {
    createError.value = '所有字段均为必填'
    return
  }
  try {
    const id = getUserId()
    if (!id) {
      createError.value = '请先登录'
      return
    }
    const formData = new FormData()
    formData.append('name', createForm.value.name)
    formData.append('projectInfo', createForm.value.projectInfo)
    formData.append('cooperationTerms', createForm.value.cooperationTerms)
    formData.append('ownerId', id.toString())
    const res = await axios.post(buildApiUrl('/project/create'), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res.data && (res.data.code === 0 || res.data.code === 200)) {
      alert('项目创建成功！')
      closeCreateModal()
      // 可选：刷新项目列表
    } else {
      createError.value = res.data.msg || '创建失败'
    }
  } catch (e) {
    createError.value = '网络错误'
  }
}
</script>

<template>
  <div class="w-screen h-screen pt-24 bg-white z-10 px-20">
    <div class="flex flex-col sm:flex-row w-full h-full p-6 sm:p-0">
      <div
        class="flex sm:flex-col items-center sm:items-start sm:w-[28%] sm:min-h-[250px] gap-4 sm:gap-0"
      >
        <div class="w-full sm:flex sm:justify-center">
          <img
            class="w-[140px] aspect-square sm:w-[calc(100%-50px)] rounded-full border-2 mx-auto sm:mx-0 mt-4"
            :src="userInfo?.avatar || '/image.png'"
            alt="头像"
          />
        </div>

        <div class="flex flex-col sm:block sm:my-[25px] w-full sm:w-auto mx-auto">
          <div class="text-2xl text-gray-600 tracking-wide mb-4 sm:mb-[25px] text-center">
            {{ userInfo?.username }}
          </div>
          <button v-if="ownerReference != 'Ta'" class="btn w-full mx-auto mt-6" @click="showFollow">
            关注列表
          </button>
          <button
            v-if="ownerReference != 'Ta'"
            class="btn w-full mx-auto mt-6"
            @click="showForm = true"
          >
            修改个人信息
          </button>
          <button v-if="ownerReference != 'Ta'" class="btn w-full mx-auto mt-6" @click="handleQuit">
            退出登录
          </button>
          <button
            v-if="ownerReference == 'Ta'"
            class="btn mx-auto mt-6 w-24"
            :class="following ? '' : 'btn-primary'"
            @click="handleFollow"
          >
            {{ following ? '取关' : '关注' }}
          </button>
        </div>
      </div>
      <div class="flex-1 mt-4 bg-white px-2 py-2 rounded-2xl min-h-screen">
        <TabGroup>
          <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab v-for="category in categories" as="template" :key="category" v-slot="{ selected }">
              <button
                :class="[
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-40 hover:bg-white/[0.12] hover:text-white',
                ]"
              >
                {{ category }}
              </button>
            </Tab>
          </TabList>

          <TabPanels class="mt-2 transition-all">
            <TabPanel
              v-for="(c, idx) in categories"
              :key="idx"
              :class="[
                'rounded-xl bg-white p-3 flex flex-col gap-4',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              ]"
            >
              <template v-if="idx === 0">
                <div class="flex w-full flex-wrap">
                  <div v-for="project in projects" :key="project.id" class="w-1/2">
                    <div class="border-[2px] rounded-xl h-full">
                      <div class="p-4">
                        <h3 class="text-base font-semibold text-blue-600">
                          <RouterLink :to="`/project/${project.id}`">{{ project.name }}</RouterLink>
                        </h3>
                        <p class="text-gray-600 text-sm mt-4 line-clamp-3">
                          {{ project.projectInfo }}
                        </p>
                        <p class="text-gray-600 text-sm mt-4">
                          <span class="badge badge-outline mr-2">合作条件</span>
                          {{ project.cooperationTerms }}
                        </p>
                      </div>
                      <div v-if="ownerReference == 'Ta'" class="p-2 flex justify-end">
                        <button class="btn" @click="openModal(project.id)">申请加入项目</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  v-if="ownerReference == '我'"
                  class="ml-4 btn-sm mb-2 h-12 text-white btn btn-primary"
                  @click="openCreateModal"
                >
                  创建项目
                </button>
              </template>
              <template v-else-if="idx === 1">
                <div class="flex w-full flex-wrap mt-4">
                  <div v-for="project in participatedProjects" :key="project.id" class="w-1/2">
                    <div class="border-[2px] rounded-xl h-full">
                      <div class="p-4">
                        <h3 class="text-base font-semibold text-blue-600">
                          <RouterLink :to="`/project/${project.id}`">{{ project.name }}</RouterLink>
                        </h3>
                        <p class="text-gray-600 text-sm mt-4 line-clamp-3">
                          {{ project.projectInfo }}
                        </p>
                        <p class="text-gray-600 text-sm mt-4">
                          <span class="badge badge-outline mr-2">合作条件</span>
                          {{ project.cooperationTerms }}
                        </p>
                      </div>
                      <div v-if="ownerReference == 'Ta'" class="p-2 flex justify-end">
                        <button class="btn" @click="openModal(project.id)">申请加入项目</button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="idx === 3">
                <UserGraph></UserGraph>
              </template>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
  <EditPersonalData v-model:showForm="showForm"></EditPersonalData>
  <!-- 模态框 -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg w-full max-w-md mx-4">
      <h3 class="text-lg font-bold mb-4">申请理由</h3>
      <input
        v-model="reason"
        type="text"
        placeholder="输入申请理由"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="text-red-500 text-sm mt-1" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="flex justify-end mt-4">
        <button @click="closeModal" class="mr-2 px-4 py-2 border border-gray-300 rounded">
          取消
        </button>
        <button @click="submit" class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
      </div>
    </div>
  </div>
  <!-- 创建项目弹窗 -->
  <!-- 创建项目弹窗（美化版） -->
  <div
    v-if="showCreateModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative animate-fade-in">
      <button
        @click="closeCreateModal"
        class="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-xl font-bold transition-colors"
        aria-label="关闭"
      >
        ×
      </button>
      <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center tracking-wide">创建个人项目</h3>
      <div class="space-y-4">
        <input
          v-model="createForm.name"
          type="text"
          placeholder="项目名称"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
        />
        <input
          v-model="createForm.projectInfo"
          type="text"
          placeholder="项目描述"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
        />
        <input
          v-model="createForm.cooperationTerms"
          type="text"
          placeholder="合作条件"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
        />
        <div class="text-red-500 text-sm" v-if="createError">{{ createError }}</div>
      </div>
      <div class="flex justify-end gap-3 mt-8">
        <button
          @click="closeCreateModal"
          class="px-6 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition font-medium"
        >
          取消
        </button>
        <button
          @click="submitCreate"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
        >
          确定
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="showFollowModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg w-full max-w-md mx-4">
      <h3 class="text-lg font-bold mb-4">关注列表</h3>
      <div class="flex flex-col">
        <div v-if="followList.length > 0">
          <RouterLink
            :to="`/personal-center/${user.id}`"
            v-for="user in followList"
            :key="user.id"
            class="flex items-center mb-4"
          >
            <img :src="user.avatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <p class="font-semibold">{{ user.username }}</p>
              <p class="text-sm text-gray-500">{{ user.title }} at {{ user.institution }}</p>
              <p class="text-xs text-gray-400">{{ user.researchArea }}</p>
            </div>
          </RouterLink>
        </div>
        <div v-else>暂无关注</div>
        <div class="btn mt-4" @click="handleCloseFollowModal">关闭</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
