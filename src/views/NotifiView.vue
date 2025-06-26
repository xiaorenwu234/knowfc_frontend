<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6 mt-20">
      <h2 class="text-3xl font-extrabold text-gray-800">我的通知</h2>
      <div class="flex items-center gap-3">
        <span v-if="unreadCount > 0" class="text-blue-600 text-sm font-bold">未读 {{ unreadCount }} 条</span>
        <button class="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          @click="markAllAsRead" :disabled="notifiList.length === 0">全部已读</button>
        <button class="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
          @click="cleanupOldNotifications">清理历史</button>
      </div>
    </div>
    <div class="mb-4 flex flex-wrap gap-2">
      <button v-for="type in eventTypes" :key="type.value"
        @click="filterType = type.value; currentPage = 1; fetchNotifiList()" :class="[
          'px-3 py-1 rounded-full text-sm border transition',
          filterType === type.value
            ? 'bg-blue-700 text-white border-blue-700'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]">{{ type.label }}</button>
    </div>
    <div v-if="loading" class="text-gray-400 text-center py-10">加载中...</div>
    <div v-else-if="notifiList.length === 0" class="text-gray-400 text-center py-10">暂无通知</div>
    <div v-else>
      <ul>
        <li v-for="item in notifiList" :key="item.id"
          class="relative mb-4 p-5 rounded-xl shadow-sm border border-gray-100 transition bg-white hover:shadow-md"
          :style="{ opacity: item.readStatus ? 0.7 : 1 }" @click="handleRead(item)">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span v-if="!item.readStatus" class="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              <span class="font-medium text-gray-800 cursor-pointer hover:underline"
                @click.stop="handleTitleClick(item)">
                {{ getNotifTitle(item) }}
              </span>
            </div>
            <span class="text-xs text-gray-400">{{ formatTime(item.createTime) }}</span>
          </div>
          <div class="mt-2 text-gray-600 whitespace-pre-line">{{ getNotifText(item) }}</div>
          <!-- 项目邀请操作 -->
          <div v-if="item.eventType === '项目邀请' && !item.readStatus" class="mt-3 flex gap-2">
            <button class="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm shadow transition"
              @click.stop="acceptInvite(item)">同意</button>
            <button class="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm shadow transition"
              @click.stop="rejectInvite(item)">拒绝</button>
          </div>
          <!-- 系统通知带链接 -->
          <div v-else-if="item.eventType === '系统通知' && item.notifBody?.actionUrl" class="mt-3">
            <a :href="item.notifBody.actionUrl" target="_blank" class="text-blue-600 hover:underline text-sm">查看详情</a>
          </div>
        </li>
      </ul>
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8 select-none">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
          :disabled="currentPage === 1" @click="changePage(currentPage - 1)" aria-label="上一页">
          <span>&lt;</span>
        </button>
        <span v-for="page in totalPages" :key="page">
          <button class="w-8 h-8 mx-1 flex items-center justify-center rounded-full transition border" :class="currentPage === page
            ? 'bg-gray-700 text-white border-gray-700 shadow'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'" @click="changePage(page)">{{ page
            }}</button>
        </span>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
          :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" aria-label="下一页">
          <span>&gt;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { buildApiUrl } from '@/config/api'

const loading = ref(true)
const notifiList = ref([])
const unreadCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const filterType = ref('全部')
const router = useRouter()
let eventSource = null

const eventTypes = [
  { label: '全部', value: '全部' },
  { label: '项目邀请', value: '项目邀请' },
  { label: '项目申请', value: '项目申请' },
  { label: '成果被评论', value: '成果被评论' },
  { label: '用户关注', value: '用户关注' },
  { label: '系统通知', value: '系统通知' },
  { label: '问题收到回答', value: '问题收到回答' }
]

function formatTime(time) {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

// 获取当前用户ID
function getUserId() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id
}

// 获取通知列表（分页、类型筛选）
async function fetchNotifiList() {
  loading.value = true
  // const userId = getUserId()
  // if (!userId) {
  //   notifiList.value = []
  //   loading.value = false
  //   return
  // }
  // try {
  //   let url = `/notification/list/${userId}?page=${currentPage.value}&size=${pageSize.value}`
  //   if (filterType.value !== '全部') {
  //     url = `/notification/type/${userId}/${encodeURIComponent(filterType.value)}?page=${currentPage.value}&size=${pageSize.value}`
  //   }
  //   const res = await axios.get(buildApiUrl(url))
  //   console.log('获取通知列表', res)
  //   if (res.data && res.data.code === 0 && Array.isArray(res.data.data?.records)) {
  //     notifiList.value = res.data.data.records
  //     totalPages.value = res.data.data.pages || 1
  //   } else {
  //     notifiList.value = []
  //     totalPages.value = 1
  //   }
  // } catch (e) {
  //   notifiList.value = []
  //   totalPages.value = 1
  // }
  // ====== 模拟数据 start ======
  const allData = [
    {
      id: 1,
      eventType: '系统通知',
      readStatus: false,
      createTime: '2025-06-26T10:00:00',
      notifText: '',
      notifBody: {
        title: '系统升级通知',
        content: '平台将于本周末升级维护，请提前保存数据。',
        actionUrl: 'https://www.example.com/notice'
      }
    },
    {
      id: 2,
      eventType: '项目邀请',
      readStatus: false,
      createTime: '2025-06-25T15:30:00',
      notifText: '',
      notifBody: {
        projectName: 'AI科研协作平台',
        projectId: 1
      }
    },
    {
      id: 3,
      eventType: '项目申请',
      readStatus: true,
      createTime: '2025-06-24T09:20:00',
      notifText: '',
      notifBody: {
        projectName: '大数据分析项目',
        projectId: 2
      }
    },
    {
      id: 4,
      eventType: '成果被评论',
      readStatus: false,
      createTime: '2025-06-23T18:00:00',
      notifText: '',
      notifBody: {
        resourceTitle: 'AI论文：智能推荐系统',
        resourceType: 'paper',
        resourceId: 101
      }
    },
    {
      id: 5,
      eventType: '用户关注',
      readStatus: true,
      createTime: '2025-06-22T12:00:00',
      notifText: '',
      senderId: 7,
      notifBody: {}
    },
    {
      id: 6,
      eventType: '问题收到回答',
      readStatus: false,
      createTime: '2025-06-21T14:30:00',
      notifText: '',
      notifBody: {
        questionTitle: '如何优化深度学习模型？',
        questionId: 201
      }
    }
  ]
    // 分类筛选
  let filtered = allData
  if (filterType.value !== '全部') {
    filtered = allData.filter(item => item.eventType === filterType.value)
  }
  notifiList.value = filtered
  loading.value = false
  fetchUnreadCount()
}

// 获取未读数
async function fetchUnreadCount() {
  const userId = getUserId()
  if (!userId) {
    unreadCount.value = 0
    return
  }
  try {
    const res = await axios.get(buildApiUrl(`/notification/unread/count/${userId}`))
    unreadCount.value = res.data?.data ?? 0
  } catch {
    unreadCount.value = 0
  }
}

// SSE实时推送
function setupSSE() {
  const userId = getUserId()
  if (!userId) return
  eventSource = new window.EventSource(buildApiUrl(`/notification/sse?id=${userId}`))
  eventSource.onmessage = () => {
    fetchNotifiList()
  }
}
onMounted(() => {
  fetchNotifiList()
  setupSSE()
})
onBeforeUnmount(() => {
  if (eventSource) eventSource.close()
})

// 分页切换
function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchNotifiList()
}

// 标记单条已读
async function handleRead(item) {
  if (!item.readStatus) {
    await axios.put(buildApiUrl(`/notification/read/${item.id}`))
    fetchNotifiList()
  }
}
// 标记全部已读
async function markAllAsRead() {
  const userId = getUserId()
  if (!userId) return
  await axios.put(buildApiUrl(`/notification/read/all/${userId}`))
  fetchNotifiList()
}

// 清理历史通知
async function cleanupOldNotifications() {
  const days = prompt('请输入要保留的天数（如30），为空则全部清理：')
  await axios.delete(buildApiUrl('/notification/cleanup'), { params: days ? { days } : {} })
  fetchNotifiList()
}

// 获取通知标题
function getNotifTitle(item) {
  if (item.eventType === '系统通知' && item.notifBody?.title) return item.notifBody.title
  if (item.eventType === '项目邀请' && item.notifBody?.projectName) return `项目邀请：${item.notifBody.projectName}`
  if (item.eventType === '项目申请' && item.notifBody?.projectName) return `项目申请：${item.notifBody.projectName}`
  if (item.eventType === '成果被评论' && item.notifBody?.resourceTitle) return `评论：${item.notifBody.resourceTitle}`
  if (item.eventType === '用户关注') return '新关注'
  if (item.eventType === '问题收到回答' && item.notifBody?.questionTitle) return `回答：${item.notifBody.questionTitle}`
  return item.eventType || '通知'
}

// 获取通知内容
function getNotifText(item) {
  return item.notifText || item.notifBody?.content || ''
}

// 点击标题跳转
function handleTitleClick(item) {
  if (item.eventType === '系统通知' && item.notifBody?.actionUrl) {
    window.open(item.notifBody.actionUrl, '_blank')
    return
  }
  if ((item.eventType === '项目邀请' || item.eventType === '项目申请') && item.notifBody?.projectId) {
    router.push({ path: `/project/${item.notifBody.projectId}` })
    return
  }
  if (item.eventType === '成果被评论' && item.notifBody?.resourceType && item.notifBody?.resourceId) {
    if (item.notifBody.resourceType === 'paper') {
      router.push({ path: '/article-detail', query: { id: item.notifBody.resourceId } })
    } else if (item.notifBody.resourceType === 'project') {
      router.push({ path: `/project/${item.notifBody.resourceId}` })
    } else if (item.notifBody.resourceType === 'question') {
      router.push({ path: '/Problem', query: { id: item.notifBody.resourceId } })
    }
    return
  }
  if (item.eventType === '问题收到回答' && item.notifBody?.questionId) {
    router.push({ path: '/Problem', query: { id: item.notifBody.questionId } })
    return
  }
  if (item.eventType === '用户关注' && item.senderId) {
    router.push({ path: `/personal-center/${item.senderId}` })
    return
  }
}

// 同意项目邀请
async function acceptInvite(item) {
  await axios.post(buildApiUrl('/project/invite/accept'), { notifId: item.id })
  fetchNotifiList()
}

// 拒绝项目邀请
async function rejectInvite(item) {
  await axios.post(buildApiUrl('/project/invite/reject'), { notifId: item.id })
  fetchNotifiList()
}
</script>