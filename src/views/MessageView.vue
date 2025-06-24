<template>
  <div class="flex w-screen h-screen bg-gray-100 overflow-hidden">
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
          v-for="contact in contacts"
          :key="contact.id"
          @click="selectContact(contact)"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center"
          :class="{ 'bg-blue-50': activeContact?.id === contact.id }"
        >
          <div
            class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 shrink-0"
          >
            {{ contact.name.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <p class="font-medium truncate w-36">{{ contact.name }}</p>
            <p class="text-sm text-gray-500 truncate w-36">{{ contact.lastMessage }}</p>
          </div>
        </div>
      </div>

      <div
        v-show="!isMobileView && !isCollapsed"
        class="absolute top-0 right-0 w-1 h-full cursor-ew-resize"
        @mousedown.prevent="startResize"
      ></div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out">
      <div class="bg-white border-b border-gray-200 p-3 flex items-center">
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
          <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
            {{ activeContact.name.charAt(0) }}
          </div>
          <h2 class="font-medium">{{ activeContact.name }}</h2>
        </div>
        <div v-else class="text-gray-500">请选择联系人</div>
      </div>

      <div ref="chatArea" class="flex-1 overflow-y-auto p-4 bg-gray-50" v-if="activeContact">
        <div
          v-for="(message, index) in activeContact.messages"
          :key="index"
          class="mb-4 flex"
          :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
        >
          <template v-if="message.sender !== 'me'">
            <div
              class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-2 shrink-0 translate-y-5"
            >
              {{ activeContact.name.charAt(0) }}
            </div>
          </template>

          <div class="flex flex-col max-w-xs md:max-w-md">
            <p
              v-if="message.sender !== 'me'"
              class="text-xs text-gray-500 mt-1"
              :class="message.sender === 'me' ? 'text-right self-end' : 'text-left self-start'"
            >
              {{ activeContact.name }}
            </p>
            <div
              class="inline-block px-4 py-2 rounded-lg"
              :class="{
                'bg-blue-500 text-white': message.sender === 'me',
                'bg-white border border-gray-200': message.sender !== 'me',
              }"
            >
              {{ message.text }}
            </div>
            <p
              class="text-xs text-gray-500 mt-1"
              :class="message.sender === 'me' ? 'text-right self-end' : 'text-left self-start'"
            >
              {{ formatTime(message.time) }}
            </p>
          </div>

          <template v-if="message.sender === 'me'">
            <div
              class="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center ml-2 shrink-0"
            >
              我
            </div>
          </template>
        </div>
      </div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-400">
        请从左侧选择联系人开始聊天
      </div>

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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const MAX_MESSAGE_LENGTH = 100

const contacts = ref([
  {
    id: 1,
    name: '张三',
    lastMessage: '你好，最近怎么样？你好，最近怎么样？你好，最近怎么样？',
    messages: [
      { text: '你好！', sender: 'them', time: new Date(Date.now() - 3600000) },
      { text: '最近怎么样？', sender: 'them', time: new Date(Date.now() - 3500000) },
      { text: '我很好，谢谢关心！', sender: 'me', time: new Date(Date.now() - 3400000) },
    ],
  },
  {
    id: 2,
    name: '李四',
    lastMessage: '项目进展如何？',
    messages: [
      { text: '项目进展如何？', sender: 'them', time: new Date(Date.now() - 86400000) },
      { text: '正在进行中，下周可以完成', sender: 'me', time: new Date(Date.now() - 86000000) },
    ],
  },
  {
    id: 3,
    name: '王五',
    lastMessage: '周末有空吗？',
    messages: [
      { text: '周末有空吗？', sender: 'them', time: new Date(Date.now() - 172800000) },
      { text: '有空，有什么计划？', sender: 'me', time: new Date(Date.now() - 172000000) },
    ],
  },
])

const activeContact = ref(null)
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

const selectContact = (contact) => {
  activeContact.value = contact
  if (isMobileView.value) {
    isCollapsed.value = true
  }
  nextTick(() => {
    scrollToBottom()
    resizeTextarea()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const msg = {
    text: newMessage.value,
    sender: 'me',
    time: new Date(),
  }

  activeContact.value.messages.push(msg)
  activeContact.value.lastMessage = newMessage.value
  newMessage.value = ''
  resizeTextarea()
  nextTick(scrollToBottom)
}

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  if (contacts.value.length > 0 && !isMobileView.value) {
    activeContact.value = contacts.value[0]
    nextTick(() => {
      resizeTextarea()
      scrollToBottom()
    })
  }
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
