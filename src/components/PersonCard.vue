<template>
  <div class="card shadow-xl bg-white">
    <div class="card-body flex-row gap-8 items-center">
      <template v-if="!person">
        <div class="skeleton h-24 w-24 rounded-full"></div>
        <div class="flex flex-col grow gap-4">
          <div class="skeleton h-6 w-3/4"></div>
          <div class="skeleton h-24 w-full"></div>
          <div class="skeleton h-6 w-full"></div>
        </div>
      </template>
      <template v-else>
        <img :src="person.avatar || '/default-avatar.png'" class="h-24 w-24 rounded-full" />
        <div class="flex flex-col grow gap-1">
          <div class="flex">
            <RouterLink
              :to="`/personal-center/${person.id}`"
              class="text-xl font-bold hover:underline cursor-pointer"
              >{{ person.username }}</RouterLink
            >
            <div class="ml-auto" v-if="person.email">
              <!-- email icon and url -->
              <a
                :href="`mailto:${person.email}`"
                class="text-blue-900 flex items-center gap-1 hover:underline"
              >
                <i class="icon-[mdi--email]"></i> {{ person.email }}
              </a>
            </div>
          </div>
          <div class="text-gray-500 my-1 text-justify line-clamp-3">
            {{ person.bio || '暂无个人简介' }}
          </div>
          <div class="flex flex-wrap gap-y-1">
            <div class="flex items-center gap-1">
              <i class="icon-[mdi--office-building]"></i>
              {{ person.institution || '暂无所属机构' }}
            </div>
            <div class="divider divider-horizontal"></div>
            <div class="flex items-center gap-1">
              <i class="icon-[mdi--school]"></i>
              {{ person.degree || '暂无学位信息' }}
            </div>
            <div class="divider divider-horizontal"></div>
            <div class="flex items-center gap-1">
              <i class="icon-[mdi--account-tie]"></i>
              {{ person.title || '暂无职称信息' }}
            </div>
            <div class="divider divider-horizontal"></div>
            <div class="flex items-center gap-1">
              <i class="icon-[mdi--lightbulb-on]"></i>
              {{ person.researchArea || '暂无研究领域' }}
            </div>

            <div class="mr-8"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '@/js/Person'
import { RouterLink } from 'vue-router'

const { person } = defineProps<{ person: Person | null }>()
</script>

<style scoped></style>
