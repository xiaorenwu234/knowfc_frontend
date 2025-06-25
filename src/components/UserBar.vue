<template>
  <!-- 按钮区 -->
  <div class="flex fixed right-6 mt-4 z-50 p-1 rounded-full bg-white/60 shadow-lg" style="backdrop-filter: var(--glass-2);">
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
    <div class="relative">
      <div class="h-11 w-11 my-auto rounded-full flex justify-center bg-sky-500/80 shadow-sm shadow-sky-500 z-[51]">
        <button @click="toggleUploadTypeMenu" class="w-6 h-6 my-auto">
          <icon class="icon-[material-symbols--upload] h-6 w-6 bg-white" />
        </button>
      </div>
      
      <!-- 投稿类型选择小卡片 -->
      <div v-if="showUploadTypeMenu" 
           class="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]"
           @mouseleave="hideUploadTypeMenu">
        <div class="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
          选择上传类型
        </div>
        <button @click="openUploadForm('paper')" 
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <icon class="icon-[material-symbols--article-outline] w-4 h-4 mr-3" />
          上传论文
        </button>
        <button @click="openUploadForm('patent')" 
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <icon class="icon-[material-symbols--license] w-4 h-4 mr-3" />
          上传专利
        </button>
        <button @click="openUploadForm('dataset')" 
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <icon class="icon-[material-symbols--database] w-4 h-4 mr-3" />
          上传数据
        </button>
      </div>
    </div>
  </div>

  <!-- 论文上传模态框 -->
  <div v-if="showPaperForm" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"
       @click.self="hideAllForms">
    <div class="card bg-base-100 w-[600px] max-w-[90vw] max-h-[85vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide">
        <!-- 关闭按钮 -->
        <button @click="hideAllForms" 
                class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10">
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>
        
        <!-- 标题 -->
        <h2 class="card-title text-2xl mb-8 pr-8">填写论文详细信息</h2>

        <!-- 表单内容 -->
        <div class="space-y-6">
          <!-- 文章来源 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">文章来源</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   list="browsers" 
                   placeholder="请选择文章来源" />
            <datalist id="browsers">
              <option value="期刊"></option>
              <option value="会议"></option>
            </datalist>
          </div>

          <!-- 刊物名称 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">刊物名称</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入刊物名称" />
          </div>

          <!-- 文章标题 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">论文标题</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入论文标题" />
          </div>

          <!-- 作者信息 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">作者</span>
            </label>
            <textarea class="textarea textarea-bordered h-20" 
                      placeholder="请输入作者信息，多个作者用逗号分隔"></textarea>
          </div>

          <!-- 摘要 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">摘要</span>
            </label>
            <textarea class="textarea textarea-bordered h-32" 
                      placeholder="请输入论文摘要"></textarea>
          </div>

          <!-- 关键词 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">关键词</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入关键词，用逗号分隔" />
          </div>

          <!-- 发布日期 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">发布日期</span>
            </label>
            <input type="date" 
                   class="input input-bordered w-full" />
          </div>

          <!-- 期刊影响因子 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">期刊影响因子</span>
            </label>
            <input type="number" 
                   step="0.001"
                   class="input input-bordered w-full" 
                   placeholder="请输入影响因子" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">上传PDF文件</span>
            </label>
            <input type="file" 
                   accept=".pdf"
                   class="file-input file-input-bordered w-full" />
          </div>
        </div>
        
        <!-- 底部按钮 -->
        <div class="card-actions justify-end mt-8 pt-4 border-t border-base-300 bottom-0 bg-base-100">
          <button class="btn btn-ghost" @click="hideAllForms">取消</button>
          <button class="btn btn-primary">提交</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 专利上传模态框 -->
  <div v-if="showPatentForm" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"
       @click.self="hideAllForms">
    <div class="card bg-base-100 w-[600px] max-w-[90vw] max-h-[85vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide">
        <!-- 关闭按钮 -->
        <button @click="hideAllForms" 
                class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10">
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>
        
        <!-- 标题 -->
        <h2 class="card-title text-2xl mb-8 pr-8">填写专利详细信息</h2>

        <!-- 表单内容 -->
        <div class="space-y-6">
          <!-- 专利名称 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">专利名称</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入专利名称" />
          </div>

          <!-- 专利号 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">专利号</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入专利号" />
          </div>

          <!-- 专利类型 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">专利类型</span>
            </label>
            <select class="select select-bordered w-full">
              <option disabled selected>请选择专利类型</option>
              <option value="发明专利">发明专利</option>
              <option value="实用新型专利">实用新型专利</option>
              <option value="外观设计专利">外观设计专利</option>
            </select>
          </div>

          <!-- 发明人 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">发明人</span>
            </label>
            <textarea class="textarea textarea-bordered h-20" 
                      placeholder="请输入发明人信息，多个发明人用逗号分隔"></textarea>
          </div>

          <!-- 申请日期 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">申请日期</span>
            </label>
            <input type="date" 
                   class="input input-bordered w-full" />
          </div>

          <!-- 授权日期 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">授权日期</span>
            </label>
            <input type="date" 
                   class="input input-bordered w-full" />
          </div>

          <!-- 专利摘要 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">专利摘要</span>
            </label>
            <textarea class="textarea textarea-bordered h-32" 
                      placeholder="请输入专利摘要"></textarea>
          </div>

          <!-- 上传专利文件 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">上传专利文件</span>
            </label>
            <input type="file" 
                   accept=".pdf,.doc,.docx"
                   class="file-input file-input-bordered w-full" />
          </div>
        </div>
        
        <!-- 底部按钮 -->
        <div class="card-actions justify-end mt-8 pt-4 border-t border-base-300 bottom-0 bg-base-100">
          <button class="btn btn-ghost" @click="hideAllForms">取消</button>
          <button class="btn btn-primary">提交</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 数据集上传模态框 -->
  <div v-if="showDatasetForm" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"
       @click.self="hideAllForms">
    <div class="card bg-base-100 w-[600px] max-w-[90vw] max-h-[85vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide">
        <!-- 关闭按钮 -->
        <button @click="hideAllForms" 
                class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10">
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>
        
        <!-- 标题 -->
        <h2 class="card-title text-2xl mb-8 pr-8">填写数据集详细信息</h2>

        <!-- 表单内容 -->
        <div class="space-y-6">
          <!-- 数据集名称 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">数据集名称</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入数据集名称" />
          </div>

          <!-- 数据集类型 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">数据集类型</span>
            </label>
            <select class="select select-bordered w-full">
              <option disabled selected>请选择数据集类型</option>
              <option value="图像数据">图像数据</option>
              <option value="文本数据">文本数据</option>
              <option value="音频数据">音频数据</option>
              <option value="视频数据">视频数据</option>
              <option value="表格数据">表格数据</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <!-- 数据集描述 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">数据集描述</span>
            </label>
            <textarea class="textarea textarea-bordered h-32" 
                      placeholder="请详细描述数据集的内容、用途和特点"></textarea>
          </div>

          <!-- 数据规模 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">数据规模</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="例如：10万条记录、1000张图片等" />
          </div>

          <!-- 创建者 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">创建者</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入数据集创建者" />
          </div>

          <!-- 创建日期 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">创建日期</span>
            </label>
            <input type="date" 
                   class="input input-bordered w-full" />
          </div>

          <!-- 许可证 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">使用许可</span>
            </label>
            <select class="select select-bordered w-full">
              <option disabled selected>请选择使用许可</option>
              <option value="CC0">CC0 - 公共领域</option>
              <option value="CC BY">CC BY - 署名</option>
              <option value="CC BY-SA">CC BY-SA - 署名-相同方式共享</option>
              <option value="MIT">MIT许可证</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <!-- 上传数据集文件 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">上传数据集文件</span>
            </label>
            <input type="file" 
                   accept=".zip,.rar,.tar,.csv,.json,.xlsx"
                   class="file-input file-input-bordered w-full" 
                   multiple />
          </div>
        </div>
        
        <!-- 底部按钮 -->
        <div class="card-actions justify-end mt-8 pt-4 border-t border-base-300 bottom-0 bg-base-100">
          <button class="btn btn-ghost" @click="hideAllForms">取消</button>
          <button class="btn btn-primary">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 投稿类型选择菜单
const showUploadTypeMenu = ref(false)

// 各种表单的显示状态
const showPaperForm = ref(false)
const showPatentForm = ref(false)
const showDatasetForm = ref(false)

// 切换投稿类型菜单显示
const toggleUploadTypeMenu = () => {
  showUploadTypeMenu.value = !showUploadTypeMenu.value
}

// 隐藏投稿类型菜单
const hideUploadTypeMenu = () => {
  showUploadTypeMenu.value = false
}

// 打开对应的上传表单
const openUploadForm = (type) => {
  hideUploadTypeMenu()
  
  switch(type) {
    case 'paper':
      showPaperForm.value = true
      break
    case 'patent':
      showPatentForm.value = true
      break
    case 'dataset':
      showDatasetForm.value = true
      break
  }
}

// 隐藏所有表单
const hideAllForms = () => {
  showPaperForm.value = false
  showPatentForm.value = false
  showDatasetForm.value = false
}
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