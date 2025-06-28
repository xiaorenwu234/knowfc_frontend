<template>
  <div>
    <div class="flex gap-x-3" v-for="(m, i) in messages" :key="i">
      <!-- 左侧时间 -->
      <div class="min-w-14 text-end">
        <span class="text-xs text-gray-500">{{ m.time }}</span>
      </div>

      <!-- 时间线圆点 -->
      <div
        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200"
      >
        <div class="relative z-10 size-7 flex justify-center items-center">
          <div class="size-3 rounded-full bg-blue-600"></div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="grow pt-0.5 pb-8">
        <h3 class="flex gap-x-1.5 font-semibold text-gray-800">{{ m.title }}</h3>
        <p class="mt-1 text-sm text-gray-600">{{ m.content }}</p>
        <button
          type="button"
          class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        >
          <img
            class="shrink-0 size-4 rounded-full"
            :src="m.avatar || 'https://default-avatar.example.com/default.png'"
            alt="Avatar"
          />
          {{ m.user }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped></style>
