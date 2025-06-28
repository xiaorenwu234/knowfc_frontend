<template>
  <!-- 按钮区 -->
  <div
    class="flex fixed right-6 mt-4 p-1 rounded-full bg-white/60 shadow-lg"
    style="backdrop-filter: var(--glass-2); z-index: 60"
  >
    <div
      v-if="showMessages && hasNewChap"
      class="absolute left-[72px] bg-red-400 w-4 h-4 rounded-full"
    ></div>
    <!-- 头像 -->
    <div
      ref="head"
      type="button"
      class="h-11 w-11 rounded-full overflow-hidden inline-flex items-center justify-center text-gray-700 origin-top drop-shadow-xl z-[52] normalAnimation"
      @mouseenter="showUserMenu = true"
      @mouseleave="leaveHead()"
    >
      <RouterLink v-if="computedIsLogin" :to="personalCenterPath">
        <img :src="getAvatar()" class="image-full" alt="头像" />
      </RouterLink>
      <RouterLink v-else to="/signin">
        <img src="../assets/default-avatar.png" class="image-full" alt="默认头像" />
      </RouterLink>
    </div>

    <!-- 消息 -->

    <div ref="message" class="normalAnimation h-6 w-6 my-auto m-2 rounded-full">
      <div
        class="w-3 h-3 bg-red-500 absolute translate-x-3 -translate-y-0.5 z-[60] rounded-full"
        v-if="unReadCount !== 0"
      ></div>
      <button @click="goToNotify()" class="w-full h-full z-[54]">
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
    <div class="relative">
      <div
        class="h-11 w-11 my-auto rounded-full flex justify-center bg-sky-500/80 shadow-sm shadow-sky-500 z-[51]"
      >
        <button @click="toggleUploadTypeMenu" class="w-6 h-6 my-auto">
          <icon class="icon-[material-symbols--upload] h-6 w-6 bg-white" />
        </button>
      </div>

      <!-- 投稿类型选择小卡片 -->
      <div
        v-if="showUploadTypeMenu"
        class="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]"
        @mouseleave="hideUploadTypeMenu"
      >
        <div class="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
          选择上传类型
        </div>
        <button
          @click="openUploadForm('paper')"
          class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <icon class="icon-[material-symbols--article-outline] w-4 h-4 mr-3" />
          上传论文
        </button>
        <button
          @click="openUploadForm('patent')"
          class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <icon class="icon-[material-symbols--license] w-4 h-4 mr-3" />
          上传专利
        </button>
        <button
          @click="openUploadForm('dataset')"
          class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <icon class="icon-[material-symbols--database] w-4 h-4 mr-3" />
          上传数据
        </button>
        <button
          @click="openUploadForm('batch')"
          class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <icon class="icon-[material-symbols--file-upload] w-4 h-4 mr-3" />
          批量导入
        </button>
      </div>
    </div>
  </div>

  <!-- 论文上传模态框 -->
  <div
    v-if="showPaperForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="hideAllForms"
  >
  </div>

  <!-- 专利上传模态框 -->
  <div
    v-if="showPatentForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="hideAllForms"
  >
  </div>

  <!-- 数据集上传模态框 -->
  <div
    v-if="showDatasetForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="hideAllForms"
  >
  </div>

  <!-- 批量导入模态框 -->
  <div
    v-if="showBatchForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="hideAllForms"
  >
    <div class="card bg-base-100 w-[700px] max-w-[95vw] max-h-[90vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide relative">
        <button
          @click="hideAllForms"
          class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10"
        >
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>
        <h2 class="card-title text-2xl mb-8 pr-8">批量导入</h2>
        <!-- 上传区域 -->
        <div class="mb-4">
          <input type="file" accept=".csv,.xlsx" @change="handleBatchFile" />
          <a href="/template.xlsx" class="ml-4 text-blue-500">下载模板（Excel/CSV）</a>
        </div>
        <div class="text-sm text-gray-500 mb-2">支持 .csv, .xlsx 格式，下载模板后按要求填写。</div>
        <!-- 解析中 -->
        <div v-if="batchLoading" class="flex items-center gap-2 text-blue-500 mb-4">
          <span class="loading loading-spinner loading-sm"></span> 解析中...
        </div>
        <!-- 数据预览 -->
        <div v-if="batchPreview.length">
          <div class="font-bold mb-2">数据预览（前20条）</div>
          <div class="overflow-x-auto max-h-60 mb-2">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th v-for="(col, idx) in batchColumns" :key="idx">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in batchPreview" :key="idx">
                  <td v-for="col in batchColumns" :key="col">{{ row[col] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 导入按钮 -->
        <div class="flex justify-end gap-2 mt-4">
          <button class="btn btn-ghost" @click="hideAllForms">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!batchPreview.length || batchLoading"
            @click="doBatchImport"
          >
            确认导入
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 导入结果弹窗 -->
  <div
    v-if="batchResult"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1100]"
  >
    <div class="bg-white rounded-xl p-8 shadow-xl w-[350px] text-center">
      <div v-if="batchResult.success && !batchResult.failedCount">
        <div class="text-2xl font-bold mb-2 text-green-600">导入成功</div>
        <div class="mb-4">新增 {{ batchResult.successCount }} 条数据</div>
        <button class="btn btn-primary w-full" @click="goToList">查看成果列表</button>
      </div>
      <div v-else>
        <div class="text-2xl font-bold mb-2 text-yellow-600">部分成功</div>
        <div class="mb-2">
          成功 {{ batchResult.successCount }} 条，失败 {{ batchResult.failedCount }} 条
        </div>
        <a :href="batchResult.errorLogUrl" class="text-blue-500 underline" download>下载失败报告</a>
        <button class="btn btn-primary w-full mt-4" @click="goToList">查看成果列表</button>
      </div>
      <button class="btn btn-ghost w-full mt-2" @click="closeBatchResult">关闭</button>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, onMounted, ref } from 'vue'
import router from '@/router/index.js'
import { getAvatar, getUserId } from '@/js/User.js'
import { getUnreadCount } from '@/js/chat.js'

const personalCenterPath = ref('')

// 投稿类型选择菜单
const showUploadTypeMenu = ref(false)

router.beforeEach((to, from, next) => {
  if (computedIsLogin.value)
    personalCenterPath.value = '/personal-center/' + getUserId()
  next()
})

// 切换投稿类型菜单显示
const toggleUploadTypeMenu = () => {
  showUploadTypeMenu.value = !showUploadTypeMenu.value
}

// 隐藏投稿类型菜单
const hideUploadTypeMenu = () => {
  showUploadTypeMenu.value = false
}

const handleBatchFile = async (e) => {
  if (!computedIsLogin.value) {
    // 统一风格弹窗提醒
    window.$message
      ? window.$message.warning('请先登录后再进行批量导入')
      : alert('请先登录后再进行批量导入')
    return
  }
  const file = e.target.files[0]
  if (!file) return
  batchLoading.value = true
  batchPreview.value = []
  batchColumns.value = []
  // 模拟解析延时和数据
  setTimeout(() => {
    batchColumns.value = ['标题', '作者', '年份']
    batchPreview.value = Array.from({ length: 20 }, (_, i) => ({
      标题: `示例论文${i + 1}`,
      作者: `作者${i + 1}`,
      年份: 2020 + (i % 4),
    }))
    batchLoading.value = false
  }, 1000)
}

const doBatchImport = async () => {
  batchLoading.value = true
  // 模拟导入延时和结果
  setTimeout(() => {
    // 随机模拟部分成功或全部成功
    const isAllSuccess = Math.random() > 0.5
    if (isAllSuccess) {
      batchResult.value = {
        success: true,
        successCount: 20,
        failedCount: 0,
        errorLogUrl: '',
      }
    } else {
      batchResult.value = {
        success: false,
        successCount: 15,
        failedCount: 5,
        errorLogUrl: '/mock-error-log.xlsx',
      }
    }
    batchLoading.value = false
  }, 1200)
}

const computedIsLogin = computed(() => {
  return getUserId() !== 0
})

const closeBatchResult = () => {
  batchResult.value = null
  hideAllForms()
}

const goToList = () => {
  batchResult.value = null
  hideAllForms()
  // 跳转到成果列表页面
  router.push(personalCenterPath.value)
}

const goToNotify = () => {
  if (computedIsLogin.value && personalCenterPath.value) {
    router.push(`/personal-notify/${getUserId()}`)
  } else {
    window.$message ? window.$message.warning('请先登录后查看通知') : alert('请先登录后查看通知')
  }
}

const unReadCount = ref(0)

onMounted(async () => {
  unReadCount.value = await getUnreadCount()
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
