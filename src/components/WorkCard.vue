<template>
  <div class="card shadow-xl">
    <div class="card-body">
      <RouterLink :to="`/article-detail?id=${work.id}`" class="text-xl font-bold hover:underline cursor-pointer">{{ work.title }}</RouterLink>
      <p class="text-sm text-gray-600">
        <span v-for="(author, index) in work.authors" :key="index">
          <a :href="`/personal-center/${author.id}`" class="text-blue-900 hover:underline">{{ author.name }}</a>
          <span v-if="index < work.authors.length - 1">, </span>
        </span>
      </p>
      <div class="text-gray-500 my-1 text-justify line-clamp-3">
        {{ work.abstract }}
      </div>

      <div class="flex">
        <div>
          {{ work.date }}
        </div>
        <div class="divider divider-horizontal"></div>
        <div>
          {{ work.source }}
        </div>
        <div class="divider divider-horizontal"></div>
        <div ref="scroll-container" class="scroll-container overflow-scroll whitespace-nowrap">
          <div ref="scroll-track" class="scroll-track">
            <div
              class="badge badge-outline mx-1"
              :class="getBadgeClass(f)"
              v-for="(f, i) in work.fields"
              :key="i"
            >
              {{ f }}
            </div>
          </div>
        </div>
        <div class="mr-8"></div>
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
          {{ work.comments.length || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Work } from '@/js/Work'
import { onMounted, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router';

const { work } = defineProps<{ work: Work }>()

const container = useTemplateRef('scroll-container')
const track = useTemplateRef('scroll-track')

function startScroll() {
  const containerWidth = container.value!.clientWidth
  const contentWidth = track.value!.scrollWidth
  const distance = contentWidth - containerWidth

  if (distance <= 0) {
    track.value!.style.animation = 'none'
    track.value!.style.transform = 'translateX(0)'
    return
  }

  const speed = 50
  const duration = distance / speed

  track.value!.style.animation = `scroll-left ${duration}s linear forwards alternate infinite`

  const styleSheet = document.styleSheets[0]
  const animationName = 'scroll-left'

  for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
    const rule = styleSheet.cssRules[i]
    if ((rule as unknown as CSSKeyframesRule).name === animationName) {
      styleSheet.deleteRule(i)
    }
  }

  styleSheet.insertRule(
    `
      @keyframes ${animationName} {
        0%   { transform: translateX(0); }
        10%  { transform: translateX(0); }
        90%  { transform: translateX(-${distance}px); }
        100%  { transform: translateX(-${distance}px); }
      }
    `,
    styleSheet.cssRules.length,
  )
}

onMounted(() => startScroll())
window.addEventListener('resize', () => {
  track.value!.style.animation = 'none'
  startScroll()
})

const colors = [
  'badge-primary',
  'badge-secondary',
  'badge-accent',
  'badge-info',
  'badge-success',
  'badge-warning',
  'badge-error',
]

const getBadgeClass = (name: string) => {
  const idx = name.charCodeAt(0) % 7
  return colors[idx]
}
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

.scroll-container:hover .scroll-track {
  animation-play-state: paused !important;
}
</style>
