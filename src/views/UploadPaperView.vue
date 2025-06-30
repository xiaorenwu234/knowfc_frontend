<script setup>
import { ref } from 'vue';
// 导入上传函数 - 请根据实际文件路径调整
import { uploadPaper, uploadPDF } from '@/ts/Upload';
import { getUserId } from '@/ts/User';

// 使用 ref 创建响应式数据
const paperTitle = ref('');
const paperAbstract = ref('');
const paperSource = ref('');
const paperPublishDate = ref('');
const paperKeywords = ref('');
const paperAuthors = ref([]);
const paperType = ref('');
const selectedFile = ref(null);
const fileName = ref('尚未选择文件');
const isLoading = ref(false);
const isAnalyzing = ref(false);
const uploadProgress = ref(0);
const analyzingProgress = ref(0);
const isParsed = ref(false); // 标记是否已解析

// 处理文件选择变化的函数
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    fileName.value = file.name;
    
    // 自动解析PDF
    await analyzePDF(file);
  } else {
    selectedFile.value = null;
    fileName.value = '尚未选择文件';
    resetParsedData();
  }
};

// 解析PDF获取元信息
const analyzePDF = async (file) => {
  isAnalyzing.value = true;
  analyzingProgress.value = 0;
  isParsed.value = false;

  // 模拟解析进度
  const progressInterval = setInterval(() => {
    analyzingProgress.value += 20;
    if (analyzingProgress.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 300);

  try {
    // 调用真实的PDF解析API
    // 假设你有用户ID，可以从store、cookie或其他地方获取
    const userid = getUserId(); // 替换为实际的用户ID获取逻辑
    
    const response = await uploadPDF(userid, file);
    
    if (response.code === 200) {
      const data = response.data;
      
      // 填充解析到的数据
      paperTitle.value = data.title || '';
      paperType.value = data.type || '';
      paperAbstract.value = data.abstractContent || '';
      paperSource.value = data.source || '';
      paperPublishDate.value = data.publishDate || '';
      paperKeywords.value = data.keywords ? data.keywords.join(', ') : '';
      paperAuthors.value = data.authors || [];
      
      
      isParsed.value = true;
      showToast('PDF解析成功！请检查并修改信息后提交', 'success');
    } else {
      throw new Error(response.msg || '解析失败');
    }
  } catch (error) {
    console.error('PDF解析失败:', error);
    showToast('PDF解析失败，请手动填写论文信息', 'warning');
    resetParsedData();
  } finally {
    isAnalyzing.value = false;
    analyzingProgress.value = 0;
    clearInterval(progressInterval);
  }
};

// 重置解析数据
const resetParsedData = () => {
  paperTitle.value = '';
  paperAbstract.value = '';
  paperSource.value = '';
  paperPublishDate.value = '';
  paperKeywords.value = '';
  paperAuthors.value = [];
  isParsed.value = false;
};

// 处理表单提交的函数
const handleSubmit = async () => {
  if (!paperTitle.value || !paperAbstract.value || !selectedFile.value) {
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

  // 构建 workInfo 对象
  const workInfo = {
    title: paperTitle.value,
    abstractContent: paperAbstract.value,
    source: paperSource.value,
    publishDate: paperPublishDate.value,
    keywords: paperKeywords.value.split(',').map(k => k.trim()).filter(k => k),
    authors: paperAuthors.value,
    userId: getUserId(),
    type: 'paper'
  };

  try {
    // 调用上传函数
    const result = await uploadPaper(workInfo, selectedFile.value);
    
    console.log('上传成功:', result);
    showToast(`论文 "${paperTitle.value}" 提交成功！`, 'success');
    resetForm();
  } catch (error) {
    console.error('上传失败:', error);
    showToast('上传失败，请重试', 'error');
  } finally {
    isLoading.value = false;
    uploadProgress.value = 0;
    clearInterval(progressInterval);
  }
};

// 添加作者
const addAuthor = () => {
  paperAuthors.value.push({
    name: '',
    affiliation: ''
  });
};

// 删除作者
const removeAuthor = (index) => {
  paperAuthors.value.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  paperTitle.value = '';
  paperAbstract.value = '';
  paperSource.value = '';
  paperPublishDate.value = '';
  paperKeywords.value = '';
  paperAuthors.value = [];
  selectedFile.value = null;
  fileName.value = '尚未选择文件';
  isParsed.value = false;
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
          <h2 class="card-title text-3xl justify-center mb-2">📄 上传您的论文</h2>
          <p class="text-base-content/70">支持 PDF 格式文件，系统将自动解析论文信息</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 文件上传 -->
          <div class="form-control w-full mb-6">
            <label class="label">
              <span class="label-text font-semibold">📎 选择论文文件</span>
              <span class="label-text-alt text-error">*必填</span>
            </label>
            <input
              @change="handleFileChange"
              type="file"
              class="file-input file-input-bordered file-input-primary w-full"
              accept=".pdf"
              :disabled="isLoading || isAnalyzing"
              required
            />
            <label class="label">
              <span class="label-text-alt">
                {{ selectedFile ? `✅ ${fileName}` : '❌ 尚未选择文件' }}
              </span>
              <span class="label-text-alt">支持PDF格式，最大10MB</span>
            </label>
          </div>

          <!-- PDF解析进度条 -->
          <div v-if="isAnalyzing" class="mb-6">
            <div class="flex justify-between text-sm mb-2">
              <span>🔍 正在解析PDF...</span>
              <span>{{ analyzingProgress }}%</span>
            </div>
            <progress class="progress progress-secondary w-full" :value="analyzingProgress" max="100"></progress>
          </div>

          <!-- 解析成功提示 -->
          <div v-if="isParsed && !isAnalyzing" class="alert alert-success mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>✨ PDF解析完成！请检查并修改下方信息，然后提交</span>
          </div>

          <!-- 论文信息表单 -->
          <div v-if="selectedFile" class="space-y-4">
            <!-- 论文标题 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📝 论文标题</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <input
                v-model="paperTitle"
                type="text"
                placeholder="请输入论文标题"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading || isAnalyzing"
                required
              />
            </div>

            <!-- 论文摘要 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📖 论文摘要</span>
                <span class="label-text-alt text-error">*必填</span>
              </label>
              <textarea
                v-model="paperAbstract"
                class="textarea textarea-bordered h-32 focus:textarea-primary"
                placeholder="请简要描述论文的主要内容和研究成果..."
                :disabled="isLoading || isAnalyzing"
                required
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ paperAbstract.length }} 字符</span>
              </label>
            </div>

            <!-- 论文来源 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📚 论文来源</span>
              </label>
              <input
                v-model="paperSource"
                type="text"
                placeholder="如：IEEE Transactions, 学术会议名称等"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading || isAnalyzing"
              />
            </div>

            <!-- 发表日期 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">📅 发表日期</span>
              </label>
              <input
                v-model="paperPublishDate"
                type="date"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading || isAnalyzing"
              />
            </div>

            <!-- 关键词 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">🏷️ 关键词</span>
              </label>
              <input
                v-model="paperKeywords"
                type="text"
                placeholder="请用逗号分隔关键词，如：深度学习, 图像识别, CNN"
                class="input input-bordered w-full focus:input-primary"
                :disabled="isLoading || isAnalyzing"
              />
            </div>

            <!-- 作者信息 -->
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-semibold">👥 作者信息</span>
                <button 
                  type="button" 
                  @click="addAuthor"
                  class="btn btn-ghost btn-sm"
                  :disabled="isLoading || isAnalyzing"
                >
                  ➕ 添加作者
                </button>
              </label>
              
              <div v-for="(author, index) in paperAuthors" :key="index" class="flex gap-2 mb-2">
                <input
                  v-model="author.name"
                  type="text"
                  placeholder="作者姓名"
                  class="input input-bordered flex-1 focus:input-primary"
                  :disabled="isLoading || isAnalyzing"
                />
                <input
                  v-model="author.affiliation"
                  type="text"
                  placeholder="所属机构"
                  class="input input-bordered flex-1 focus:input-primary"
                  :disabled="isLoading || isAnalyzing"
                />
                <button 
                  type="button" 
                  @click="removeAuthor(index)"
                  class="btn btn-ghost btn-sm text-error"
                  :disabled="isLoading || isAnalyzing"
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
              :disabled="isLoading || isAnalyzing"
            >
              🔄 重置表单
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading || isAnalyzing || !selectedFile"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? '上传中...' : '📤 立即上传' }}
            </button>
          </div>
        </form>

        <!-- 帮助信息 -->
        <div class="divider">使用说明</div>
        <div class="bg-base-200 rounded-lg p-4">
          <ul class="text-sm space-y-1 text-base-content/70">
            <li>• 1️⃣ 选择PDF文件，系统将自动解析论文信息</li>
            <li>• 2️⃣ 检查并修改解析出的信息，确保准确性</li>
            <li>• 3️⃣ 点击"立即上传"完成论文提交</li>
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
</style>
