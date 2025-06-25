<!-- filepath: e:\KFC\knowfc_frontend\src\views\NotifiView.vue -->
<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-3xl font-extrabold mb-6 mt-20 text-gray-800">我的通知</h2>
    <div v-if="loading" class="text-gray-400 text-center py-10">加载中...</div>
    <div v-else-if="notifiList.length === 0" class="text-gray-400 text-center py-10">暂无通知</div>
    <!-- 固定高度，无滚动条 -->
    <div class="relative h-[560px]">
      <ul>
        <li
          v-for="item in pagedList"
          :key="item.id"
          class="relative mb-4 p-5 rounded-xl shadow-sm border border-gray-100 transition bg-white hover:shadow-md"
          :style="{ opacity: item.readStatus ? 0.7 : 1 }"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-800">{{ renderTitle(item) }}</span>
              <span v-if="!item.readStatus" class="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
            <span class="text-xs text-gray-400">{{ formatTime(item.createTime) }}</span>
          </div>
          <div class="mt-2 text-gray-600">{{ renderContent(item) }}</div>
          <div v-if="item.eventType === 'project_invite' && !item.readStatus" class="mt-3 flex gap-2">
            <button
              class="px-4 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm shadow transition"
              @click="acceptInvite(item)">同意</button>
          </div>
          <div v-else class="absolute inset-0 cursor-pointer" @click="handleClick(item)" style="z-index:1"></div>
        </li>
      </ul>
    </div>
    <!-- 分页控件，放在消息框下方 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12 select-none">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
        :disabled="currentPage === 1" @click="currentPage--" aria-label="上一页">
        <span>&lt;</span>
      </button>
      <span v-for="page in totalPages" :key="page">
        <button class="w-8 h-8 mx-1 flex items-center justify-center rounded-full transition border"
          :class="currentPage === page
            ? 'bg-gray-700 text-white border-gray-700 shadow'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'"
          @click="currentPage = page">{{ page }}</button>
      </span>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
        :disabled="currentPage === totalPages" @click="currentPage++" aria-label="下一页">
        <span>&gt;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import router from '@/router'

const loading = ref(true)
const notifiList = ref([])
const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => Math.ceil(notifiList.value.length / pageSize))
const pagedList = computed(() =>
    notifiList.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

function renderTitle(item) {
    switch (item.eventType) {
        case 'comment':
            return `${item.notifBody.senderName} 评论了你`
        case 'project_invite':
            return `${item.notifBody.senderName} 邀请你加入项目`
        case 'result_update':
            return `${item.notifBody.senderName} 更新了成果`
        case 'followed_user_result':
            return `你关注的${item.notifBody.senderName} 发布了新成果`
        case 'followed_user_project':
            return `你关注的${item.notifBody.senderName} 发布了新项目`
        default:
            return '新通知'
    }
}

function renderContent(item) {
    return item.notifText || ''
}

function formatTime(time) {
    if (!time) return ''
    return new Date(time).toLocaleString()
}

function handleClick(item) {
    let target = '/'
    switch (item.eventType) {
        case 'comment':
            if (item.notifBody.questionId) {
                target = `/Problem?id=${item.notifBody.questionId}`
            } else if (item.notifBody.resultId) {
                target = `/article-detail?id=${item.notifBody.resultId}`
            }
            break
        case 'result_update':
        case 'followed_user_result':
            if (item.notifBody.resultId) {
                target = `/article-detail?id=${item.notifBody.resultId}`
            }
            break
        case 'followed_user_project':
            if (item.notifBody.projectId) {
                target = `/project/${item.notifBody.projectId}`
            }
            break
        default:
            target = '/'
    }
    router.push(target)
}

function acceptInvite(item) {
    item.readStatus = true // 前端模拟已读
    if (item.notifBody.projectId) {
        router.push(`/project/${item.notifBody.projectId}`)
    }
}

onMounted(() => {
    setTimeout(() => {
        notifiList.value = [
            {
                id: '1',
                eventType: 'comment',
                receiverId: 1,
                senderId: 2,
                notifBody: { senderName: '张三', questionId: 123 },
                notifText: '你的科研问题有了新评论！',
                createTime: Date.now(),
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '2',
                eventType: 'project_invite',
                receiverId: 1,
                senderId: 3,
                notifBody: { senderName: '李四', projectId: 456 },
                notifText: '邀请你加入“AI研究”项目',
                createTime: Date.now() - 3600000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '3',
                eventType: 'followed_user_result',
                receiverId: 1,
                senderId: 4,
                notifBody: { senderName: '王五', resultId: 789 },
                notifText: '王五发布了新论文《AI驱动的未来》',
                createTime: Date.now() - 7200000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '4',
                eventType: 'followed_user_project',
                receiverId: 1,
                senderId: 5,
                notifBody: { senderName: '赵六', projectId: 321 },
                notifText: '赵六发布了新项目“智能医疗”',
                createTime: Date.now() - 10800000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '5',
                eventType: 'result_update',
                receiverId: 1,
                senderId: 6,
                notifBody: { senderName: '孙七', resultId: 654 },
                notifText: '孙七更新了成果《深度学习新进展》',
                createTime: Date.now() - 14400000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '6',
                eventType: 'comment',
                receiverId: 1,
                senderId: 7,
                notifBody: { senderName: '周八', questionId: 987 },
                notifText: '周八评论了你的问题！',
                createTime: Date.now() - 18000000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '7',
                eventType: 'project_invite',
                receiverId: 1,
                senderId: 8,
                notifBody: { senderName: '吴九', projectId: 111 },
                notifText: '吴九邀请你加入“量子计算”项目',
                createTime: Date.now() - 21600000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            },
            {
                id: '8',
                eventType: 'followed_user_result',
                receiverId: 1,
                senderId: 9,
                notifBody: { senderName: '郑十', resultId: 222 },
                notifText: '郑十发布了新成果《区块链技术》',
                createTime: Date.now() - 25200000,
                readTime: null,
                readStatus: false,
                pushChannels: []
            }
        ]
        loading.value = false
    }, 800)
})
</script>