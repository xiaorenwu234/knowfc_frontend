<template>
  <div class="h-full w-full p-4 md:p-8 px-10 md:px-20 mt-28">
    <div class="flex w-full mx-8 gap-4">
      <div class="w-2/3 gap-4">
        <RecommendationWindow />
      </div>
      <div class="flex flex-col w-1/3">
        <div class="flex flex-col gap-4 sticky top-24">
          <div class="bg-white rounded-2xl p-6">
            <TimeLine />
          </div>
          <div class="bg-white rounded-2xl">
            <MyFooter />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyFooter from '@/components/MyFooter.vue'
import RecommendationWindow from '@/components/RecommendationWindow.vue'
import TimeLine from '@/components/TimeLine.vue'
</script>

<style scoped>
</style>
