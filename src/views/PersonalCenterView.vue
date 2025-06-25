<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ArticlesTimeLine from '@/components/ArticlesTimeLine.vue'
import EditPersonalData from '@/components/EditPersonalData.vue'
import axios from 'axios'
import { API_CONFIG, buildApiUrl } from '@/config/api.ts'
import { useRoute } from 'vue-router'
import  router from '@/router'

const windowSize = ref({
  width: window.innerWidth,
  height: window.innerHeight,
})

const updateWindowSize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const handleQuit = ()=>{
  localStorage.removeItem('user');
  router.push('/')
}

const ownerReference = ref('');
const userInfo = ref(null);
const route = useRoute()
const userId= String(route.params.id)
const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_INFO.replace('id',userId))
const fetchUserInfo = async() => {
  await axios.get(url).then((res) => {
    userInfo.value=res.data.data
    console.log(userInfo.value)
  })
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
  fetchUserInfo()
  ownerReference.value=(userId==(JSON.parse(localStorage.getItem('user')||'').id))?'我':'Ta'
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
})

const projects = ref([
  {
    id: 1,
    title: '项目一',
    description: '这是一个关于 Vue.js 的项目。',
    status: '进行中',
    stars: 120,
  },
  {
    id: 2,
    title: '项目二',
    description: '这是一个关于 Node.js 的项目。',
    status: '已完成',
    stars: 200,
  },
  {
    id: 3,
    title: '项目三',
    description: '这是一个关于 Python 的项目。',
    status: '未开始',
    stars: 50,
  },
])

const showForm = ref(false)
</script>

<template>
  <div class="w-screen h-screen pt-24 bg-white z-10">
    <div class="flex flex-col sm:flex-row w-full h-full p-6 sm:p-0">
      <div
        class="flex sm:flex-col items-center sm:items-start sm:w-[28%] sm:min-h-[250px] gap-4 sm:gap-0"
      >
        <div class="w-full sm:flex sm:justify-center">
          <img
            class="w-[140px] aspect-square sm:w-[calc(100%-50px)] rounded-full border-2 mx-auto sm:mx-0 mt-4"
            src="/image.png"
            alt="头像"
          />
        </div>

        <div class="flex flex-col sm:block sm:my-[25px] w-full sm:w-auto mx-auto">
          <div
            class="text-2xl text-gray-600 tracking-wide mb-4 sm:mb-[25px] text-center "
          >
            {{userInfo?.username}}
          </div>
          <button class="btn w-full mx-auto" @click="showForm=true">修改个人信息</button>
          <button class="btn w-full mx-auto mt-6" @click="handleQuit">退出登陆</button>
        </div>
      </div>

      <div class="flex-1 mt-4">
        <div>
          <div class="font-bold text-xl">{{ownerReference+'的科研项目'}}</div>
          <div class="flex w-full flex-wrap">
            <div v-for="project in projects" :key="project.id" class="w-1/2 pr-3 pt-2">
              <div class="border-[2px] rounded-xl h-full">
                <div class="p-4">
                  <h3 class="text-base font-semibold text-blue-600">{{ project.title }}</h3>
                  <p class="text-gray-600 text-sm mt-4">{{ project.description }}</p>
                  <div class="mt-2 flex justify-between items-center">
                    <span class="text-sm text-yellow-500">⭐ {{ project.stars }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="font-bold text-xl mt-4">{{ownerReference+'的论文'}}</div>
          <ArticlesTimeLine class="mt-2"></ArticlesTimeLine>
        </div>
      </div>
    </div>
  </div>
  <EditPersonalData v-model:showForm="showForm"></EditPersonalData>
</template>

<style scoped></style>
