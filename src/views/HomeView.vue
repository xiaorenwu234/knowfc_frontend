<template>
  <div class="h-full w-full p-4 md:p-8 px-10 md:px-20">
    <div class="mt-24 max-w-md my-10 text-center mx-auto">
      <h1
        class="mb-5 font-bold galada-regular text-6xl mx-2 align-baseline"
        style="color: white; text-shadow: rgb(153, 36, 0) 6px 6px 3px"
      >
        KnowFC
      </h1>
      <p class="mb-5" style="color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
    </div>
    <div class="container max-w-3xl mx-auto mb-8 sticky top-0 z-50">
      <SearchBar />
    </div>
    <div class="flex w-full mx-8 my-8 gap-4">
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
import SearchBar from '@/components/SearchBar.vue'
import TimeLine from '@/components/TimeLine.vue'
</script>

<style scoped>
</style>
