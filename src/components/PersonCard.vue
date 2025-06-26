<template>
  <div class="card shadow-xl">
    <div class="card-body flex-row gap-8 items-center">
      <img :src="person.avatar" class="h-24 w-24 rounded-full" />
      <div class="flex flex-col grow gap-1">
        <div class="flex">
          <RouterLink
            :to="`/personal-center?id=${person.id}`"
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

        <div class="flex">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '@/js/Person'
import { onMounted, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const { person } = defineProps<{ person: Person }>()
</script>

<style scoped></style>
