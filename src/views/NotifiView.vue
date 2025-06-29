<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6 mt-20">
      <h2 class="text-3xl font-extrabold text-gray-800">我的通知</h2>
      <div class="flex items-center gap-3">
        <span v-if="unreadCount > 0" class="text-blue-600 text-sm font-bold">未读 {{ unreadCount }} 条</span>
        <button class="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          @click="markAllAsRead" :disabled="notifiList.length === 0">
          全部已读
        </button>
        <button class="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
          @click="cleanupOldNotifications">
          清理历史
        </button>
      </div>
    </div>
    <div class="mb-4 flex flex-wrap gap-2">
      <button v-for="type in eventTypes" :key="type.value" @click="
        filterType = type.value,
        currentPage = 1,
        fetchNotifiList()
        " :class="[
          'px-3 py-1 rounded-full text-sm border transition',
          filterType === type.value
            ? 'bg-blue-700 text-white border-blue-700'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]">
        {{ type.label }}
      </button>
    </div>
    <div v-if="loading" class="text-gray-400 text-center py-10">加载中...</div>
    <div v-else-if="notifiList.length === 0" class="text-gray-400 text-center py-10">暂无通知</div>
    <div v-else>
      <div class="overflow-y-auto rounded-xl" style="max-height: 600px; min-height: 500px">
        <ul>
          <li v-for="item in notifiList" :key="item.id"
            class="relative mb-4 p-5 rounded-xl shadow-sm border border-gray-100 transition bg-white hover:shadow-md"
            :style="{ opacity: item.readStatus ? 0.7 : 1 }"
            @click="item.eventType !== '项目申请' ? handleRead(item) : null">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span v-if="!item.readStatus" class="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                <span class="font-medium text-gray-800 cursor-pointer hover:underline"
                  @click.stop="handleTitleClick(item)">
                  {{ getNotifTitle(item) }}
                </span>
              </div>


              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ formatTime(item.createTime) }}</span>
                <button @click.stop="deleteNotification(item.id)" title="删除通知"
                  class="ml-3 p-1 rounded hover:bg-red-100 transition-colors text-black hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24"
                    height="24">
                    <path fill-rule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.499.058l.346-9z"
                      clip-rule="evenodd" />
                  </svg>
                </button>



              </div>

            </div>
            <div class="mt-2 text-gray-600 whitespace-pre-line">{{ getNotifText(item) }}</div>
            <!-- 项目邀请操作 -->
            <div v-if="(item.eventType === '项目邀请' || item.eventType === '项目申请') && !item.readStatus"
              class="mt-3 flex gap-2">
              <button class="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm shadow transition"
                @click.stop="openConfirm('accept', item)">
                同意
              </button>
              <button class="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm shadow transition"
                @click.stop="openConfirm('reject', item)">
                拒绝
              </button>
            </div>
            <!-- 系统通知带链接 -->
            <div v-else-if="item.eventType === '系统通知' && item.notifBody?.actionUrl" class="mt-3">
              <a :href="item.notifBody.actionUrl" target="_blank" class="text-blue-600 hover:underline text-sm">查看详情</a>
            </div>
            <!-- 确认弹窗 -->
            <div v-if="showConfirm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div class="bg-white rounded-xl p-6 w-80 shadow-xl">
                <div class="text-lg font-bold mb-4 text-gray-800">
                  {{ confirmType === 'accept' ? '确认同意该项目邀请？' : '确认拒绝该项目邀请？' }}
                </div>
                <div class="flex justify-end gap-3">
                  <button @click="closeConfirm"
                    class="px-4 py-1 rounded border border-gray-300 bg-gray-50 text-gray-700">
                    取消
                  </button>
                  <button @click="handleConfirm(item)"
                    class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
                    确定
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-15 select-none">
        <div class="flex justify-center items-center gap-2 mt-20 select-none">
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
            :disabled="currentPage === 0" @click="changePage(currentPage - 1)" aria-label="上一页">
            <span>&lt;</span>
          </button>
          <button v-for="page in totalPages" :key="page" @click="changePage(page - 1)" :class="currentPage === page - 1
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            " class="w-8 h-8 flex items-center justify-center rounded-full border transition">
            {{ page }}
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
            :disabled="currentPage === totalPages - 1" @click="changePage(currentPage + 1)" aria-label="下一页">
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { buildApiUrl } from '@/config/api'
import { getUserId } from '@/ts/User'

const loading = ref(true)
const notifiList = ref([])
const unreadCount = ref(0)
const currentPage = ref(0)
const pageSize = ref(4)
const totalPages = ref(1)
const filterType = ref('全部')
const router = useRouter()
const showConfirm = ref(false)
const confirmType = ref('') // 'accept' 或 'reject'
const confirmItem = ref(null)

function openConfirm(type, item) {
  confirmType.value = type
  confirmItem.value = item
  showConfirm.value = true
}
function closeConfirm() {
  showConfirm.value = false
  confirmType.value = ''
  confirmItem.value = null
}
let eventSource = null

const eventTypes = [
  { label: '全部', value: '全部' },
  { label: '项目邀请处理', value: '项目邀请处理' },
  { label: '项目邀请', value: '项目邀请' },
  { label: '项目申请', value: '项目申请' },
  { label: '成果被评论', value: '成果被评论' },
  { label: '用户关注', value: '用户关注' },
  { label: '系统通知', value: '系统通知' },
  { label: '问题收到回答', value: '问题收到回答' },

]

function formatTime(time) {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

// 获取通知列表（分页、类型筛选）
async function fetchNotifiList() {
  loading.value = true
  const userId = getUserId()
  if (!userId) {
    notifiList.value = []
    loading.value = false
    return
  }
  try {
    let url = `/notification/list/${userId}?page=${currentPage.value}&size=${pageSize.value}`
    if (filterType.value !== '全部') {
      url = `/notification/type/${userId}/${encodeURIComponent(filterType.value)}?page=${currentPage.value}&size=${pageSize.value}`
    }
    const res = await axios.get(buildApiUrl(url))
    console.log('获取通知列表:', res.data) // 调试输出
    // 这里根据你的实际返回结构调整
    if (res.data && res.data.code === 200) {
      const result = res.data.data
      if (Array.isArray(result)) {
        // 如果是数组，说明是类型过滤接口的结构
        notifiList.value = result
        totalPages.value = 1 // 你可以自己计算分页
      } else if (Array.isArray(result?.content)) {
        // 如果是分页结构（content 内嵌），说明是“全部”接口
        notifiList.value = result.content
        totalPages.value = result.totalPages || 1
      } else {
        notifiList.value = []
        totalPages.value = 1
      }
    }
  } catch {
    notifiList.value = []
    totalPages.value = 1
  }
  loading.value = false
  fetchUnreadCount()
}
// 监听分页和分类变化，自动刷新
watch([currentPage, filterType], () => {
  fetchNotifiList()
})
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
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
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
  if (item.eventType === '项目邀请处理' && item.notifBody?.projectName)
    return `项目邀请处理：${item.notifBody.projectName}`
  if (item.eventType === '项目申请' && item.notifBody?.projectName)
    return `项目申请：${item.notifBody.projectName}`
  if (item.eventType === '成果被评论' && item.notifBody?.resourceTitle)
    return `评论：${item.notifBody.resourceTitle}`
  if (item.eventType === '用户关注') return '新关注'
  if (item.eventType === '问题收到回答' && item.notifBody?.questionTitle)
    return `回答：${item.notifBody.questionTitle}`
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
  if (
    (item.eventType === '项目邀请' || item.eventType === '项目申请') &&
    item.notifBody?.projectId
  ) {
    router.push({ path: `/project/${item.notifBody.projectId}` })
    return
  }
  if (item.eventType === '项目邀请处理' && item.notifBody?.projectId) {
    router.push({ path: `/project/${item.notifBody.projectId}` })
    return
  }
  if (
    item.eventType === '成果被评论' &&
    item.notifBody?.resourceType &&
    item.notifBody?.resourceId
  ) {
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

/**
 * 处理确认邀请的函数
 *
 * @param item 项目邀请信息
 * @returns 无返回值
 */
async function handleProjectApply(item, accept) {
  try {
    // 构建 query 参数
    const queryParams = new URLSearchParams({
      projectId: item.notifBody?.projectId,
      applicantId: item.senderId,
      isAccepted: accept ? 'true' : 'false'
    }).toString()
    console.log('处理项目申请参数:', queryParams) // 调试输出
    const url = buildApiUrl(`/project/handleApply?${queryParams}`)

    // 发送 POST 请求（query 参数形式）
    const res = await axios.post(url)

    if (res.data?.code === 200) {
      item.readStatus = true // 标记为已读
      alert('操作成功')
    } else {
      const msg = res.data?.msg || '未知错误'
      if (msg === '用户已经是该项目的成员') {
        item.readStatus = true // 标记为已读
        // 已读处理，不弹窗，直接刷新通知列表或忽略
        alert('操作失败: ' + msg)
      } else {
        alert('操作失败: ' + msg)
      }
    }

  } catch (err) {
    alert('网络错误，操作失败')
    console.error(err)
  }
}


// 修改 handleConfirm 使其支持项目申请和项目邀请的处理
async function handleConfirm(item) {
  if (!confirmItem.value) return

  const accept = confirmType.value === 'accept'

  if (item.eventType === '项目申请') {
    // 调用项目申请处理接口
    await handleProjectApply(item, accept)
  } else if (item.eventType === '项目邀请') {
    // 现有的项目邀请处理逻辑（伪代码演示，原代码完整）
    const inviterId = item.senderId
    const inviteeId = item.receiverId
    const projectId = item.notifBody?.projectId
    if (!inviterId || !inviteeId || !projectId) {
      console.error('缺少必要字段')
      return
    }
    console.log('处理项目邀请参数:', { inviterId, inviteeId, projectId, isAccepted: accept }) // 调试输出
    try {
      const res = await axios.post(
        buildApiUrl('/project/handleInvite'),
        { inviterId, inviteeId, projectId, isAccepted: accept }
      )
      console.log('处理项目邀请响应:', res.data) // 调试输出
      if (res.data?.code === 200) {

        alert('操作成功')
      } else {
        alert('操作失败: ' + (res.data?.msg || '未知错误'))
      }
      item.readStatus = true // 标记为已读
    } catch (err) {
      alert('网络错误，操作失败')
      console.error(err)
    }
  }

  closeConfirm()
}
async function deleteNotification(notificationId) {
  if (!notificationId) return
  if (!confirm('确定要删除这条通知吗？')) return

  try {
    await axios.delete(buildApiUrl(`/notification/del/${notificationId}`), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    // 删除成功后刷新列表和未读数
    fetchNotifiList()
    fetchUnreadCount()
  } catch (error) {
    console.error('删除通知失败：', error)
    alert('删除失败，请稍后再试')
  }
}
</script>
