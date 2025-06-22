<script setup lang="ts">
import Dock from './components/Dock.vue';
import { ref } from 'vue';
const hideOthers = ref(false);
const isNormal = ref(true);
const isLogin = ref(false);
const isCreatorView = ref(false);

function leaveHome() {
  document.getElementById('logo').classList.add('-mt-[84px]')
  document.getElementById('logo').classList.remove('mt-60')
  setTimeout(() => {
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }, 400)
}

function backHome() {
  document.getElementById('logo').classList.remove('-mt-[84px]')
  document.getElementById('logo').classList.add('mt-60')
  isCreatorView.value=false
  setTimeout(() => {
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }, 400)
}
</script>

<template>
  <div v-if="!hideOthers" class="fixed left-0 w-[100px] h-[100vh] flex flex-col justify-center z-50">

    <Dock @leaveHome="leaveHome" :show-dock="isNormal"></Dock>
  </div>
  <div class="flex flex-col">
    <div class="w-full h-screen z-0 flex justify-center items-center">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
