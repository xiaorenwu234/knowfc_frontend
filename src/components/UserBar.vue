<template>
    <!-- 按钮区 -->
  <div class="flex fixed right-6 mt-4 z-50 p-1 rounded-full bg-white shadow-lg bg-opacity-70" style="backdrop-filter: var(--glass-2);">
    <div v-if="showMessages &&hasNewChap" class="absolute left-[72px] bg-red-400 w-4 h-4 rounded-full"></div>
    <!-- 头像 -->
    <div ref="head" type="button" class="h-11 w-11 rounded-full overflow-hidden inline-flex items-center justify-center text-gray-700 origin-top drop-shadow-xl z-[52] normalAnimation" @mouseenter="showUserMenu=true" @mouseleave="leaveHead()" >
      <RouterLink v-if="isLogin" to="/Individual">
        <img :src="headSrc" class="image-full" alt="头像">
      </RouterLink>
      <button v-if="!isLogin" @click="$emit('tryLogin')">
        <img src="../assets/img/未登录.jpg" class="image-full" alt="头像">
      </button>
    </div>
    <!-- 消息 -->
    <div ref="message" class="normalAnimation h-6 w-6 my-auto m-2 rounded-full">
      <button @click="showMessMenu()" class="w-full h-full">
        <icon class="icon-[material-symbols--notifications-outline] w-full h-full" />
      </button>
    </div>
    <!-- 书架 -->
    <div ref="shelf" class="normalAnimation h-6 w-6 my-auto m-2 rounded-full">
      <RouterLink to="/Bookshelf/BookshelfIndex" class="w-full h-full">
        <icon class="icon-[mi--favorite] w-full h-full" />
      </RouterLink>
    </div>
    <!-- 历史 -->
    <div ref="history" class="normalAnimation h-6 w-6 my-auto m-2 rounded-full">
      <RouterLink to="/Individual/IndividualHistory" class="w-full h-full">
        <icon class="icon-[material-symbols--history] w-full h-full" />
      </RouterLink>
    </div>
    <!-- 投稿 -->
    <div class="h-11 w-11 my-auto rounded-full flex justify-center bg-sky-500/80 shadow-sm shadow-sky-500 z-[51]">
      <RouterLink :to="'/Creator/CreatorIndex/?uname='+username" class="w-6 h-6 my-auto">
        <icon class="icon-[material-symbols--upload] h-6 w-6 bg-white" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>