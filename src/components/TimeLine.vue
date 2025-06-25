<template>
  <!-- Timeline -->
  <div>
    <!-- Item -->
    <div class="flex gap-x-3" v-for="(m, i) in messages" :key="i">
      <!-- Left Content -->
      <div class="min-w-14 text-end">
        <span class="text-xs text-gray-500">{{ m.time }}</span>
      </div>
      <!-- End Left Content -->

      <!-- Icon -->
      <div
        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200"
      >
        <div class="relative z-10 size-7 flex justify-center items-center">
          <div class="size-2 rounded-full bg-gray-400"></div>
        </div>
      </div>
      <!-- End Icon -->

      <!-- Right Content -->
      <div class="grow pt-0.5 pb-8">
        <h3 class="flex gap-x-1.5 font-semibold text-gray-800">{{ m.title }}</h3>
        <p class="mt-1 text-sm text-gray-600">{{ m.content }}</p>
        <RouterLink
          type="button"
          class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          :to="personalCenterPath(m.userId)"
        >
          <img
            class="shrink-0 size-4 rounded-full"
            :src="m.avatar"
            alt="Avatar"
          />
          {{ m.user }}
        </RouterLink>
      </div>
      <!-- End Right Content -->
    </div>
    <!-- End Item -->
  </div>
  <!-- End Timeline -->
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const personalCenterPath = (userId:string) => {
  return "/personal-center/" + userId
}

const messages = ref([
  {
    time: '12:05PM',
    title: 'Created "Preline in React" task',
    content: 'Find more detailed instructions here.',
    user: 'James Collins',
    userId: '1',
    avatar:
      'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80',
  },
  {
    time: '12:05PM',
    title: 'Release v5.2.0 quick bug fix 🐞',
    content: '',
    user: 'James Collins',
    userId: '1',
    avatar: 'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80',
  },
  {
    time: '12:05PM',
    title: 'Marked "Install Charts" completed',
    content: 'Finally! You can check it out here.',
    user: 'James Collins',
    userId: '1',
    avatar:
      'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80',
  },
])
</script>

<style scoped></style>
