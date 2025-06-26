<template>
  <div class="flex w-screen h-screen bg-gray-100 overflow-hidden">
    <!-- 侧边栏部分保持不变 -->
    <div
      ref="sidebar"
      class="relative bg-white border-r border-gray-200 transition-all duration-300 ease-in-out"
      :style="{
        width: isMobileView ? '40%' : sidebarWidth + 'px',
        transform: isMobileView && isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
        position: isMobileView ? 'absolute' : 'relative',
        zIndex: isMobileView ? 10 : 'auto',
        height: '100%',
      }"
    >
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold">联系人</h2>
        <button @click="toggleCollapse" class="md:hidden p-1 rounded-md hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </div>

      <div class="overflow-y-auto h-[calc(100%-56px)]">
        <div
          v-for="contact in contactPersonList"
          :key="contact.chatWithUserId"
          @click="selectContact(contact)"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center"
          :class="{ 'bg-blue-50': activeContact?.chatWithUserId === contact.chatWithUserId }"
        >
          <img
            class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 shrink-0"
            :src="contact.chatWithAvatar"
            alt="头像"
          />
          <div class="overflow-hidden">
            <p class="font-medium truncate w-36">{{ contact.chatWithUsername }}</p>
            <p class="text-sm text-gray-500 truncate w-36">{{ contact.lastMessage }}</p>
          </div>
        </div>
      </div>

      <!-- 侧边栏尺寸调整控件 -->
      <div
        v-show="!isMobileView && !isCollapsed"
        class="absolute top-0 right-0 w-1 h-full cursor-ew-resize"
        @mousedown.prevent="startResize"
      ></div>
    </div>

    <!-- 聊天区域部分 -->
    <div class="flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out">
      <!-- 聊天头部 -->
      <div class="bg-white border-b border-gray-200 p-3.5 flex items-center">
        <button
          @click="toggleCollapse"
          v-if="isCollapsed"
          class="mr-3 p-1 rounded-md hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            />
          </svg>
        </button>
        <div v-if="activeContact" class="flex items-center">
          <img
            class="w-8 h-8 rounded-full aspect-square flex items-center justify-center mr-2"
            :src="activeContact.chatWithAvatar"
            alt="头像"
          />
          <h2 class="font-medium">{{ activeContact.chatWithUsername }}</h2>
        </div>
        <div v-else class="text-gray-500">请选择联系人</div>
      </div>

      <!-- 消息显示区域 -->
      <div ref="chatArea" class="flex-1 overflow-y-auto p-4 bg-gray-50" v-if="activeContact">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="mb-4 flex"
          :class="message.isMe ? 'justify-end' : 'justify-start'"
        >
          <template v-if="!message.isMe">
            <img
              class="w-10 h-10 rounded-full flex items-center justify-center mr-2 shrink-0 translate-y-5"
              :src="message.senderAvatar"
              alt="头像"
            />
          </template>

          <div class="flex flex-col max-w-xs md:max-w-md">
            <p
              v-if="!message.isMe"
              class="text-xs text-gray-500 mt-1"
              :class="message.isMe ? 'text-right self-end' : 'text-left self-start'"
            >
              {{ activeContact.chatWithUsername }}
            </p>
            <div
              class="inline-block px-4 py-2 rounded-lg"
              :class="{
                'bg-blue-500 text-white': message.isMe,
                'bg-white border border-gray-200': !message.isMe,
              }"
            >
              {{ message.content }}
            </div>
            <p
              class="text-xs text-gray-500 mt-1"
              :class="message.isMe ? 'text-right self-end' : 'text-left self-start'"
            >
              {{ formatTime(message.sendDate) }}
            </p>
          </div>

          <template v-if="message.isMe">
            <img
              class="w-10 h-10  rounded-full flex items-center justify-center ml-2 shrink-0" :src = "message.senderAvatar" alt="头像"
            />

          </template>
        </div>
      </div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-400">
        请从左侧选择联系人开始聊天
      </div>

      <!-- 消息输入区域 -->
      <div class="bg-white border-t border-gray-200 p-3" v-if="activeContact">
        <div class="flex">
          <textarea
            v-model="newMessage"
            ref="textarea"
            @input="resizeTextarea"
            placeholder="输入消息..."
            class="flex-1 border border-gray-300 rounded-l-md px-4 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 overflow-hidden"
            rows="1"
            :maxlength="MAX_MESSAGE_LENGTH"
          ></textarea>
          <button
            @click="sendMessage"
            class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
          >
            发送
          </button>
        </div>
        <div class="text-right text-xs text-gray-400 mt-1">
          最大长度：{{ newMessage.length }} / {{ MAX_MESSAGE_LENGTH }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import '@/js/chat.ts'
import { getChatDetail, getChatList, readMessages } from '@/js/chat.ts'
import { getUserId } from '@/js/User.ts'

const MAX_MESSAGE_LENGTH = 100

const contactPersonList = ref([])

const activeContact = ref(null)
const messages = ref([])
const newMessage = ref('')
const textarea = ref(null)

const isCollapsed = ref(false)
const sidebarWidth = ref(256)
const windowWidth = ref(window.innerWidth)
const chatArea = ref(null)

// 自动展开 textarea
const resizeTextarea = () => {
  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.style.height = textarea.value.scrollHeight + 'px'
      scrollToBottom()
    }
  })
}

const scrollToBottom = () => {
  if (chatArea.value) {
    chatArea.value.scrollTop = chatArea.value.scrollHeight
  }
}

const isMobileView = computed(() => windowWidth.value < 768)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (isMobileView.value) {
    isCollapsed.value = true
  } else {
    isCollapsed.value = false
    sidebarWidth.value = 256
  }
}

const startResize = (e) => {
  const startX = e.clientX
  const startWidth = sidebarWidth.value

  const onMouseMove = (e) => {
    sidebarWidth.value = Math.min(Math.max(200, startWidth + e.clientX - startX), 400)
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectContact = async (contact) => {
  activeContact.value = contact
  readMessages(contact.chatWithUserId, getUserId())
  // 加载聊天消息
  messages.value = await getChatDetail(contact.chatWithUserId)

  console.log(messages.value)

  if (isMobileView.value) {
    isCollapsed.value = true
  }
  nextTick(() => {
    scrollToBottom()
    resizeTextarea()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !activeContact.value) return

  const msg = {
    content: newMessage.value,
    sendDate: new Date(),
    isMe: true,
  }

  messages.value.push(msg)
  // 更新联系人的最后一条消息
  if (activeContact.value) {
    activeContact.value.lastMessage = newMessage.value
  }
  newMessage.value = ''
  resizeTextarea()
  nextTick(scrollToBottom)
}

const formatTime = (dateStr) => {
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  handleResize()
  contactPersonList.value = await getChatList()
  console.log(contactPersonList.value)
  if (contactPersonList.value.length > 0 && !isMobileView.value) {
    await selectContact(contactPersonList.value[0])
  }
  console.log(activeContact.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
