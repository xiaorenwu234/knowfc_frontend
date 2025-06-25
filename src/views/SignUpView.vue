<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import {sendVerificationCode, signup} from "@/js/User.ts";

const showCountDown = ref(false)
const countDownValue = ref(59)
const hasSent = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')


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

const handleRegister = async () => {
  // 表单验证
  if (!username.value.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (!email.value.trim()) {
    errorMessage.value = '请输入合法邮箱'
    return
  }
  if (!verificationCode.value.trim()) {
    errorMessage.value = '请输入验证码'
    return
  }
  if (!password.value.trim()) {
    errorMessage.value = '请输入密码'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  const [success,message] = await signup(username.value, password.value, email.value, verificationCode.value)
  if(success){
    alert('注册成功，请登录')
    router.push('signin')
  } else {
    alert(message || '注册失败，请稍后重试')
    errorMessage.value = message || '注册失败，请稍后重试'
  }
}

const handleVerifyCode = async () => {
  if (!email.value.trim()) {
    errorMessage.value = '请输入合法邮箱'
    return
  }

  const [success, message] = await sendVerificationCode(email.value)
  if(success){
    alert('验证码已发送，请注意查收')
    startCountDown()
  } else {
    alert(message || '发送验证码失败，请稍后重试')
    errorMessage.value = message || '发送验证码失败，请稍后重试'
  }
}
</script>

<template>
  <div class="w-screen flex overflow-hidden relative" style="height: calc(100vh)">
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

      <input
        value=""
        class="blind-check"
        type="checkbox"
        id="blind-input2"
        name="blindcheck"
        hidden=""
      />

      <form class="form">
        <div class="title">注 册</div>

        <label class="label_input" for="username-input">用户名</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="username"
          id="username-input"
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

        <label class="label_input" for="verification-code-input">验证码</label>
        <div class="verification-container">
          <input
            spellcheck="false"
            class="input"
            type="text"
            name="verification-code"
            id="verification-code-input"
            v-model="verificationCode"
          />
          <div class="verification-button-container">
            <span class="countdown" v-if="showCountDown">
              <span
                :style="`--value: ${countDownValue}`"
                aria-live="polite"
                aria-label="59"
                >{{ countDownValue }}</span
              >
            </span>
            <span class="countdown-text" v-if="showCountDown"> 秒后重新发送 </span>
            <div class="button" @click="handleVerifyCode" v-else>
              {{ hasSent ? '重新发送验证码' : '发送验证码' }}
            </div>
          </div>
        </div>

        <label class="label_input" for="password-input">密 码</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="password"
          id="password-input"
          v-model="password"
        />

        <label class="label_input" for="confirm-password-input">确认密码</label>
        <input
          spellcheck="false"
          class="input"
          type="text"
          name="confirm-password"
          id="confirm-password-input"
          v-model="confirmPassword"
          @keyup.enter="handleRegister"
        />

        <!-- 错误消息显示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          class="submit"
          type="button"
          @click="handleRegister"
          :disabled="isLoading"
        >
          {{ isLoading ? '注册中...' : '注 册' }}
        </button>
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
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.verification-container .input {
  flex: 1;
  width: 100%;
}

.verification-button-container {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4d4d4d;
  z-index: 4;
}

.verification-button-container .button {
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  z-index: 4;
  position: relative;
  border: none;
  padding: 4px 8px;
  min-width: var(--blind-w);
  border-radius: 4px;
  background-color: #fff;
  color: #4d4d4d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
  "Lucida Sans", Arial, sans-serif;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.verification-button-container .button:before {
  content: "";
  position: absolute;
  left: calc((var(--input-px) / 2) * -1);
  top: 0;
  height: 100%;
  width: 1px;
  background: #8f8f8f;
}

.verification-button-container .button:hover {
  color: #262626;
  background-color: #f2f2f2;
}

.verification-button-container .countdown {
  color: #4d4d4d;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
  "Lucida Sans", Arial, sans-serif;
  white-space: nowrap;
}

.verification-button-container .countdown-text {
  color: #4d4d4d;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
  "Lucida Sans", Arial, sans-serif;
  white-space: nowrap;
}
</style>
