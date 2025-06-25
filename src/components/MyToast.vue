<template>
  <div class="text-lg font-bold">{{ title }}</div>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
const { title, message } = defineProps<{
  title: string
  message: string
}>()
</script>
