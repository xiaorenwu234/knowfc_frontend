<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import {login} from "@/js/User.ts";

const password = ref('')
const username = ref('')

const handleLogin = async () => {
  if (!username.value.trim()) {
    alert('请输入用户名')
    return
  }
  if (!password.value.trim()) {
    alert('请输入密码')
    return
  }
  const [success, message] = await login(username.value, password.value)
  if(success){
    alert('登录成功')
    router.push('/')
  }
  else{
    alert(message)
  }
}
</script>

<template>
  <div class="w-screen h-screen flex overflow-hidden relative" style="height: calc(100vh)">
    <img src="@/assets/background.png" alt="背景" class="background-image1 absolute" />
    <img src="@/assets/background.png" alt="背景" class="background-image2 absolute" />

    <div class="card m-auto">
      <input
        value=""
        class="blind-check"
        type="checkbox"
        id="blind-input"
        name="blindcheck"
        hidden=""
      />
      <label for="blind-input" class="blind_input">
        <span class="hide">隐藏密码</span>
        <span class="show">显示密码</span>
      </label>

      <form class="form">
        <div class="title">登 录</div>

        <label class="label_input" for="username-input">用户名</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="username"
          id="username-input"
          v-model="username"
        />

        <div class="frg_pss">
          <label class="label_input" for="password-input">密 码</label>
          <div class="hover:underline translate-y-0.5" @click="router.push('forget-password')">
            忘记密码？
          </div>
        </div>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="password"
          id="password-input"
          v-model="password"
        />
        <button class="submit" type="button" @click="handleLogin">登 录</button>
        <div @click="router.push('signup')" class="text-blue-500 hover:underline jump">
          还没有账号？注册
        </div>
      </form>

      <label for="blind-input" class="avatar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey"
        >
          <ellipse cx="53.7" cy="33" rx="8.3" ry="8.2" fill="#89664c"></ellipse>
          <ellipse cx="53.7" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3"></ellipse>
          <ellipse cx="10.2" cy="33" rx="8.2" ry="8.2" fill="#89664c"></ellipse>
          <ellipse cx="10.2" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3"></ellipse>
          <g fill="#89664c">
            <path
              d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2"
            ></path>
            <path
              d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4"
            ></path>
          </g>
          <path
            d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7"
            fill="#e0ac7e"
          ></path>
          <g fill="#3b302a" class="monkey-eye-nose">
            <path
              d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1"
            ></path>
            <path
              d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1"
            ></path>
            <ellipse cx="40.7" cy="31.7" rx="3.5" ry="4.5" class="monkey-eye-r"></ellipse>
            <ellipse cx="23.3" cy="31.7" rx="3.5" ry="4.5" class="monkey-eye-l"></ellipse>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey-hands"
        >
          <path fill="#89664C" d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z"></path>
          <path
            fill="#FFD6BB"
            d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8
	s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8"
          ></path>
          <path fill="#89664C" d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21-4-21L54.8,32.5z"></path>
          <path
            fill="#FFD6BB"
            d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8
	s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8"
          ></path>
        </svg>
      </label>
    </div>
  </div>
</template>

<style scoped>
@import '../css/SignIn.css';

.background-image1 {
  width: 900px;
  height: auto;
  left: -450px;
  top: -100px;
  opacity: 0;
  transform: translate(-150%, -150%);
  animation: slideInTopLeft 1s ease forwards;
  z-index: -1;
}

@keyframes slideInTopLeft {
  0% {
    opacity: 0;
    transform: translate(-150%, -150%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.background-image2 {
  width: 900px;
  height: auto;
  right: -450px;
  bottom: -100px;
  opacity: 0;
  transform: translate(150%, 150%);
  animation: slideInBottomRight 1s ease forwards;
  z-index: -1;
}

@keyframes slideInBottomRight {
  0% {
    opacity: 0;
    transform: translate(150%, 150%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
</style>
