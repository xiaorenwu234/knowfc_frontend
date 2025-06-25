<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ArticlesTimeLine from '@/components/ArticlesTimeLine.vue'
import EditPersonalData from '@/components/EditPersonalData.vue'
import axios from 'axios'
import { API_CONFIG, buildApiUrl } from '@/config/api.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { followUser, unfollowUser } from '@/js/FollowUser.ts'

const windowSize = ref({
  width: window.innerWidth,
  height: window.innerHeight
})

const updateWindowSize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

const handleQuit = () => {
  localStorage.removeItem('user')
  router.push('/')
}

const ownerReference = ref('')
const userInfo = ref(null)
const route = useRoute()
const userIdOnDisplay = String(route.params.id)
const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_INFO.replace('id', userIdOnDisplay))
const following = ref(false)
const fetchUserInfo = async () => {
  await axios.get(url).then((res) => {
    userInfo.value = res.data.data
    // console.log(userInfo.value)
  })
}

const showModal = ref(false);
const reason = ref('');
const errorMessage = ref('');
const projectId = ref();

const openModal = (pId:number) => {
  showModal.value = true;
  reason.value = '';
  errorMessage.value = '';
  projectId.value=pId
};

const closeModal = () => {
  showModal.value = false;
  projectId.value=null;
};

const submit = async () => {
  if (!reason.value.trim()) {
    errorMessage.value = '必须填写申请理由';
    return;
  }
  try {
   await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.APPLY_FOR_PROJECT),{projectId:projectId.value,applicantId:JSON.parse(localStorage.getItem('user')||'').id,content:reason.value})
    closeModal();
    alert('申请已提交成功！');
    // 可以在这里添加成功后的回调逻辑
  } catch (error) {
    errorMessage.value = '提交失败，请重试';
    console.error('申请提交失败:', error);
  }
};

const handleFollow= async()=>{
  if(following.value)
    await unfollowUser(userIdOnDisplay)
  else
    await followUser(userIdOnDisplay)

  following.value = !following.value;
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
  fetchUserInfo()
  ownerReference.value = (userIdOnDisplay == (JSON.parse(localStorage.getItem('user') || '').id)) ? '我' : 'Ta'
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
    stars: 120
  },
  {
    id: 2,
    title: '项目二',
    description: '这是一个关于 Node.js 的项目。',
    status: '已完成',
    stars: 200
  },
  {
    id: 3,
    title: '项目三',
    description: '这是一个关于 Python 的项目。',
    status: '未开始',
    stars: 50
  }
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
            {{ userInfo?.username }}
          </div>
          <button v-if="ownerReference!='Ta'" class="btn w-full mx-auto" @click="showForm=true">修改个人信息</button>
          <button v-if="ownerReference!='Ta'" class="btn w-full mx-auto mt-6" @click="handleQuit">退出登陆</button>
          <button v-if="ownerReference=='Ta'" class ="btn mx-auto mt-6 w-24" :class="following? '':'btn-primary'" @click="handleFollow">{{following?"取关":"关注"}}</button>
        </div>
      </div>

      <div class="flex-1 mt-4">
        <div>
          <div class="font-bold text-xl">{{ ownerReference + '的科研项目' }}</div>
          <div class="flex w-full flex-wrap">
            <div v-for="project in projects" :key="project.id" class="w-1/2 pr-3 pt-2">
              <div class="border-[2px] rounded-xl h-full ">
                <div class="p-4">
                  <h3 class="text-base font-semibold text-blue-600">{{ project.title }}</h3>
                  <p class="text-gray-600 text-sm mt-4">{{ project.description }}</p>
                  <div class="mt-2 flex justify-between items-center">
                    <span class="text-sm text-yellow-500">⭐ {{ project.stars }}</span>
                  </div>
                </div>
                <div v-if="ownerReference=='Ta'" class="p-2 flex justify-end">
                  <button class='btn' @click="openModal(project.id)">申请加入项目</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="font-bold text-xl mt-4">{{ ownerReference + '的论文' }}</div>
          <ArticlesTimeLine class="mt-2"></ArticlesTimeLine>
        </div>
      </div>
    </div>
  </div>
  <EditPersonalData v-model:showForm="showForm"></EditPersonalData>
  <!-- 模态框 -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md mx-4">
      <h3 class="text-lg font-bold mb-4">申请理由</h3>
      <input
        v-model="reason"
        type="text"
        placeholder="输入申请理由"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <div class="text-red-500 text-sm mt-1" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="flex justify-end mt-4">
        <button @click="closeModal" class="mr-2 px-4 py-2 border border-gray-300 rounded">取消</button>
        <button @click="submit"  class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
