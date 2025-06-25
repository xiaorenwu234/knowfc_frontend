<template>
  <div class="card shadow-xl">
    <div class="card-body">
      <h2 class="text-xl font-bold hover:underline cursor-pointer">{{ work.title }}</h2>
      <!-- display authors in <a> with comma separated -->
      <p class="text-sm text-gray-600">
        <span v-for="(author, index) in work.authors" :key="index">
          <a :href="`/author/${author}`" class="text-blue-900 hover:underline">{{ author }}</a>
          <span v-if="index < work.authors.length - 1">, </span>
        </span>
      </p>
      <div class="text-gray-500 my-1 text-justify line-clamp-3">
        {{ work.abstract }}
      </div>

      <div class="flex">
        <!-- work.date 显示为 2023-10-01 的格式 -->
        <div>
          {{ new Intl.DateTimeFormat('zh-CN').format(work.date) }}
        </div>
        <div class="divider divider-horizontal"></div>
        <div>
          {{ work.source }}
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="overflow-scroll flex-nowrap">
          <div class="badge badge-outline badge-info mx-1" v-for="(f, i) in work.fields" :key="i">
            {{ f }}
          </div>
        </div>
        <!-- <div class="divider divider-horizontal"></div> -->
        <!-- <div>
          关键词
          <div
            class="badge badge-outline badge-success mx-1"
            v-for="(k, i) in work.keywords"
            :key="i"
          >
            {{ k }}
          </div>
        </div> -->
        <div class="flex items-center gap-1 ml-auto">
          <i class="icon-[mdi--thumb-up]"></i>
          {{ work.likes || 0 }}
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="flex items-center gap-1">
          <i class="icon-[mdi--comment]"></i>
          {{ work.comments || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Work } from '@/js/Work'

const { work } = defineProps<{ work: Work }>()
</script>

<style scoped>
.badge-soft {
  color: var(--badge-color, var(--color-base-content));
  background-color: color-mix(
    in oklab,
    var(--badge-color, var(--color-base-content)) 8%,
    var(--color-base-100)
  );
  border-color: color-mix(
    in oklab,
    var(--badge-color, var(--color-base-content)) 10%,
    var(--color-base-100)
  );
  background-image: none;
}

@supports (color: color-mix(in lab, red, red)) {
  .badge-soft {
    background-color: color-mix(
      in oklab,
      var(--badge-color, var(--color-base-content)) 8%,
      var(--color-base-100)
    );
    border-color: color-mix(
      in oklab,
      var(--badge-color, var(--color-base-content)) 10%,
      var(--color-base-100)
    );
  }
}
</style>
