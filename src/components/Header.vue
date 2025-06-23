<template>
    <div class="fixed w-screen h-24 z-10" :class="{ 'bg-white': isWhiteRoute, 'blurblock': !isWhiteRoute }" ></div>
    <Logo />
    <UserBar />
</template>

<script setup>
import Logo from './Logo.vue';
import UserBar from './UserBar.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pureWhite = [''];

const isWhiteRoute = computed(() => {
    return pureWhite.includes(route.path);
});
</script>

<style >
@import '../style.css';

.blurblock{
  mask: linear-gradient(black, black, transparent);
  backdrop-filter: blur(8px);
}

.window::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

</style>