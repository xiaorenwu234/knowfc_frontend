<script setup>
import { ref } from 'vue';
// 导入上传函数 - 请根据实际文件路径调整
import { uploadPaper } from '@/ts/Upload';
import { getUserId } from '@/ts/User';

// 使用 ref 创建响应式数据
const patentTitle = ref('');
const patentAbstract = ref('');
const patentId = ref('');
const patentClassId = ref('');
const patentPublishDate = ref('');
const patentKeywords = ref('');
const patentAuthors = ref([]);
const patentSource = ref('');
const selectedFile = ref(null);
const fileName = ref('尚未选择文件');
const isLoading = ref(false);
const uploadProgress = ref(0);

// 专利类型选项
const patentClassIds = [
  { value: 'invention', label: '发明专利' },
  { value: 'utility', label: '实用新型专利' },
  { value: 'design', label: '外观设计专利' }
];

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
  if (!patentTitle.value || !patentAbstract.value || !selectedFile.value) {
    showToast('请填写必填字段并选择一个文件！', 'error');
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

  // 构建 patentInfo 对象
  const patentInfo = {
    type: 'patent',
    title: patentTitle.value,
    abstractContent: patentAbstract.value,
    patentId: patentId.value,
    patentClassId: patentClassId.value,
    publishDate: patentPublishDate.value,
    keywords: patentKeywords.value.split(',').map(k => k.trim()).filter(k => k),
    authors: patentAuthors.value,
    source: patentSource.value,
    userId: getUserId()
  };
    console.log('准备上传的专利信息:', patentInfo);
  try {
    // TODO: 调用后端专利上传接口
    const result = await uploadPaper(patentInfo, selectedFile.value);
    
    console.log('专利上传成功:', result);
    showToast(`专利 "${patentTitle.value}" 提交成功！`, 'success');
    resetForm();
  } catch (error) {
    console.error('专利上传失败:', error);
    showToast('上传失败，请重试', 'error');
  } finally {
    isLoading.value = false;
    uploadProgress.value = 0;
    clearInterval(progressInterval);
  }
};

// 添加发明人
const addInventor = () => {
  patentAuthors.value.push({
    name: '',
    affiliation: ''
  });
};

// 删除发明人
const removeInventor = (index) => {
  patentAuthors.value.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  patentTitle.value = '';
  patentAbstract.value = '';
  patentId.value =  '';
  patentClassId.value = '';
  patentPublishDate.value = '';
  patentKeywords.value = '';
  patentAuthors.value = [];
  patentSource.value = '';
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
          <h2 class="card-title text-3xl justify-center mb-2">🔬 上传您的专利</h2>
          <p class="text-base-content/70">支持 PDF 格式文件，请手动填写专利信息</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 文件上传 -->
          <div class="form-control w-full mb-6">
            <label class="label">
              <span class="label-text font-semibold">📎 选择专利文件</span>
              <span class="label-text-alt text-error">*必填</span>
            </label>
            <input
              @change="handleFileChange"
              type="file"
              class="file-input file-input-bordered file-input-primary w-full"
              accept=".pdf,.doc,.docx"
              :disabled="isLoading"
              required
            />
            <label class="label">
              <span class="label-text-alt">
                {{ selectedFile ? `✅ ${fileName}` : '❌ 尚未选择文件' }}
              </span>
              <span class="label-text-alt">支持PDF、DOC、DOCX格式，最大10MB</span>
            </label>
          </div>

          <!-- 专利信息表单 -->
          <div class="space-y-4">
            <!-- 专利标题 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📝 专利标题</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <input
                v-model="patentTitle"
                type="text"
                placeholder="请输入专利标题"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading"
                required
              />
            </div>

            <!-- 专利号 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">🔢 专利号</span>
              </label>
              <input
                v-model="patentId"
                type="text"
                placeholder="如：CN202110000000.0"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading"
              />
            </div>

            <!-- 专利类型和状态 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-semibold">📋 专利类型</span>
                </label>
                <select
                  v-model="patentClassId"
                  class="select select-bordered w-full focus:select-primary"
                  :disabled="isLoading"
                >
                  <option value="">请选择专利类型</option>
                  <option v-for="type in patentClassIds" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-semibold">🎉 授权日期</span>
                </label>
                <input
                  v-model="patentPublishDate"
                  type="date"
                  class="input input-bordered w-full focus:input-primary"
                  :disabled="isLoading"
                />
              </div>
            </div>


            <!-- 专利摘要 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📖 专利摘要</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <textarea
                v-model="patentAbstract"
                class="textarea textarea-bordered h-32 focus:textarea-primary"
                placeholder="请简要描述专利的技术方案、技术效果和应用前景..."
                :disabled="isLoading"
                required
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ patentAbstract.length }} 字符</span>
              </label>
            </div>

            <!-- 申请人 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">🏢 申请人</span>
              </label>
              <input
                v-model="patentSource"
                type="text"
                placeholder="如：北京大学、华为技术有限公司等"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading"
              />
            </div>

            <!-- 关键词 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">🏷️ 关键词</span>
              </label>
              <input
                v-model="patentKeywords"
                type="text"
                placeholder="请用逗号分隔关键词，如：人工智能, 机器学习, 图像处理"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading"
              />
            </div>

            <!-- 发明人信息 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">👥 发明人信息</span>
                <button 
                  type="button" 
                  @click="addInventor"
                  class="btn btn-ghost btn-sm"
                  :disabled="isLoading"
                >
                  ➕ 添加发明人
                </button>
              </label>
              
              <div v-for="(inventor, index) in patentAuthors" :key="index" class="flex gap-2 mb-2">
                <input
                  v-model="inventor.name"
                  type="text"
                  placeholder="发明人姓名"
                  class="input input-bordered flex-1 focus:input-primary"
                  :disabled="isLoading"
                />
                <input
                  v-model="inventor.affiliation"
                  type="text"
                  placeholder="所属机构"
                  class="input input-bordered flex-1 focus:input-primary"
                  :disabled="isLoading"
                />
                <button 
                  type="button" 
                  @click="removeInventor(index)"
                  class="btn btn-ghost btn-sm text-error"
                  :disabled="isLoading"
                >
                  ❌
                </button>
              </div>
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
            <li>• 1️⃣ 选择专利文件（PDF、DOC、DOCX格式）</li>
            <li>• 2️⃣ 填写专利的详细信息，包括标题、摘要等必填项</li>
            <li>• 3️⃣ 添加发明人信息和关键词</li>
            <li>• 4️⃣ 点击"立即上传"完成专利提交</li>
            <li>• ⚠️ 文件大小限制：最大 10MB</li>
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