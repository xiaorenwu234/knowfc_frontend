<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'

const showCountDown = ref(false)
const countDownValue = ref(59)
const hasSent = ref(false)

const startCountDown = () => {
  if (showCountDown.value) return
  showCountDown.value = true
  countDownValue.value = 59
  hasSent.value = true

  const timer = setInterval(() => {
    if (countDownValue.value > 0) {
      countDownValue.value -= 1
    } else {
      clearInterval(timer)
      showCountDown.value = false
    }
  }, 1000)
}

const username = ref('')
const password = ref('')
const email = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
</script>

<template>
  <div class="w-screen h-screen flex overflow-hidden relative">
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

      <input
        value=""
        class="blind-check"
        type="checkbox"
        id="blind-input"
        name="blindcheck"
        hidden=""
      />
      <label for="blind-input" class="blind_inputx">
        <span class="hide">隐藏密码</span>
        <span class="show">显示密码</span>
      </label>

      <div
        class="flex count"
        style="position: absolute; z-index: 4; bottom: 310px; right: 40px; color: #4d4d4d"
      >
        <span class="countdown font-mono text-xl mr-1" v-if="showCountDown">
          <span
            :style="`--value: ${countDownValue}`"
            aria-live="polite"
            aria-label="59"
            style="color: #4d4d4d"
            >{{ countDownValue }}</span
          >
        </span>
        <span class="font-mono text-md" v-if="showCountDown"> 秒后重新发送 </span>
        <div class="button" @click="startCountDown" v-else>
          {{ hasSent ? '重新发送验证码' : '发送验证码' }}
        </div>
      </div>

      <form class="form">
        <div class="title">注 册</div>

        <label class="label_input" for="email-input">用户名</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="username"
          id="email-input"
          v-model="username"
        />

        <label class="label_input" for="email-input">邮 箱</label>
        <input
          spellcheck="false"
          class="input"
          type="email"
          name="email"
          id="email-input"
          v-model="email"
        />

        <label class="label_input" for="email-input">验证码</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="verification-code"
          id="email-input"
          :style="{ paddingRight: showCountDown ? '150px' : '100px' }"
          v-model="verificationCode"
        />

        <label class="label_input" for="password-input">密 码</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="password"
          id="password-input"
          v-model="password"
        />

        <label class="label_input" for="password-input">确认密码</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="password"
          id="password-input"
          v-model="confirmPassword"
        />

        <button class="submit" type="button">注 册</button>
        <div @click="router.push('signin')" class="text-blue-500 hover:underline jump">
          已有账号？登录
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

.verification-container {
  display: flex;
  align-items: center;
  gap: 8px; /* 输入框和按钮之间的间距 */
}

.verification-container .input {
  flex: 1; /* 输入框占据剩余空间 */
}

.verification-container .button {
  padding: 0.5rem 1rem;
  background-color: #0969da;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.verification-container .button:hover {
  background-color: #074c9a;
}

.verification-container .countdown {
  color: #4d4d4d;
  font-size: 14px;
}
</style>
