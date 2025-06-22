<template>
    <div class="fixed w-screen h-24 z-10 blurblock"></div>
    <Logo />
    <UserBar />
</template>

<script setup>
import Logo from './Logo.vue';
import UserBar from './UserBar.vue';
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