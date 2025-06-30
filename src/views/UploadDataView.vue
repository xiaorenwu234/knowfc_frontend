<script setup>
import { ref } from 'vue';
// 导入上传函数 - 请根据实际文件路径调整
import { uploadPaper } from '@/ts/Upload';
import { getUserId } from '@/ts/User';

// 使用 ref 创建响应式数据
const datasetTitle = ref('');
const datasetAbstract = ref('');
const selectedFile = ref(null);
const fileName = ref('尚未选择文件');
const isLoading = ref(false);
const uploadProgress = ref(0);

// 处理文件选择变化的函数
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    fileName.value = file.name;
  } else {
    selectedFile.value = null;
    fileName.value = '尚未选择文件';
  }
};

// 处理表单提交的函数
const handleSubmit = async () => {
  if (!datasetTitle.value || !datasetAbstract.value || !selectedFile.value) {
    showToast('请填写必填字段并选择一个数据集文件！', 'error');
    return;
  }

  isLoading.value = true;
  uploadProgress.value = 0;

  // 模拟上传进度
  const progressInterval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 200);

  // 构建 datasetInfo 对象
  const datasetInfo = {
    type: 'data',
    title: datasetTitle.value,
    abstractContent: datasetAbstract.value,
    userId: getUserId()
  };
  
  console.log('准备上传的数据集信息:', datasetInfo);
  
  try {
    // TODO: 调用后端数据集上传接口
    const result = await uploadPaper(datasetInfo, selectedFile.value);
    
    console.log('数据集上传成功:', result);
    showToast(`数据集 "${datasetTitle.value}" 提交成功！`, 'success');
    resetForm();
  } catch (error) {
    console.error('数据集上传失败:', error);
    showToast('上传失败，请重试', 'error');
  } finally {
    isLoading.value = false;
    uploadProgress.value = 0;
    clearInterval(progressInterval);
  }
};

// 重置表单
const resetForm = () => {
  datasetTitle.value = '';
  datasetAbstract.value = '';
  selectedFile.value = null;
  fileName.value = '尚未选择文件';
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
};

// 显示提示消息
const showToast = (message, type) => {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} fixed top-4 right-4 w-auto z-50`;
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : type === 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}" />
    </svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
};
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl w-full max-w-4xl">
      <div class="card-body">
        <!-- 页面标题 -->
        <div class="text-center mb-6">
          <h2 class="card-title text-3xl justify-center mb-2">📊 上传您的数据集</h2>
          <p class="text-base-content/70">支持 ZIP 格式文件，请手动填写数据集信息</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 文件上传 -->
          <div class="form-control w-full mb-6">
            <label class="label">
              <span class="label-text font-semibold">📎 选择数据集文件</span>
              <span class="label-text-alt text-error">*必填</span>
            </label>
            <input
              @change="handleFileChange"
              type="file"
              class="file-input file-input-bordered file-input-primary w-full"
              accept=".pdf, .zip,.rar,.7z"
              :disabled="isLoading"
              required
            />
            <label class="label">
              <span class="label-text-alt">
                {{ selectedFile ? `✅ ${fileName}` : '❌ 尚未选择文件' }}
              </span>
              <span class="label-text-alt">支持ZIP、RAR、7Z格式，最大50MB</span>
            </label>
          </div>

          <!-- 数据集信息表单 -->
          <div class="space-y-4">
            <!-- 数据集标题 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📝 数据集标题</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <input
                v-model="datasetTitle"
                type="text"
                placeholder="请输入数据集标题，如：ImageNet 1K"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading"
                required
              />
            </div>

            <!-- 数据集摘要 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📖 数据集摘要</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <textarea
                v-model="datasetAbstract"
                class="textarea textarea-bordered h-32 focus:textarea-primary"
                placeholder="请详细描述数据集的内容、数据来源、数据规模、应用场景等信息..."
                :disabled="isLoading"
                required
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ datasetAbstract.length }} 字符</span>
              </label>
            </div>
          </div>

          <!-- 上传进度条 -->
          <div v-if="isLoading" class="mb-6">
            <div class="flex justify-between text-sm mb-2">
              <span>上传进度</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <progress class="progress progress-primary w-full" :value="uploadProgress" max="100"></progress>
          </div>

          <!-- 按钮组 -->
          <div class="card-actions justify-between mt-6">
            <button 
              type="button" 
              @click="resetForm"
              class="btn btn-ghost"
              :disabled="isLoading"
            >
              🔄 重置表单
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading || !selectedFile"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? '上传中...' : '🚀 立即上传' }}
            </button>
          </div>
        </form>

        <!-- 帮助信息 -->
        <div class="divider">使用说明</div>
        <div class="bg-base-200 rounded-lg p-4">
          <ul class="text-sm space-y-1 text-base-content/70">
            <li>• 1️⃣ 选择数据集压缩文件（ZIP、RAR、7Z格式）</li>
            <li>• 2️⃣ 填写数据集标题，请使用简洁明了的名称</li>
            <li>• 3️⃣ 详细描述数据集的摘要信息</li>
            <li>• 4️⃣ 点击"立即上传"完成数据集提交</li>
            <li>• ⚠️ 文件大小限制：最大 50MB</li>
            <li>• 💡 建议在压缩包中包含README文件说明数据格式</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 文件输入框悬停效果 */
.file-input:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* 进度条动画 */
.progress {
  transition: all 0.3s ease;
}

/* 网格布局在小屏幕上的适配 */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>