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
    <div class="h-11 w-11 my-auto rounded-full flex justify-center bg-sky-500/80 shadow-sm shadow-sky-500 z-[51]">
      <button @click="toggleUploadMenu" class="w-6 h-6 my-auto">
        <icon class="icon-[material-symbols--upload] h-6 w-6 bg-white" />
      </button>
    </div>
  </div>

    <!-- 投稿模态框 -->
    <div v-if="showUploadMenu" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
       @click.self="hideUploadMenu">
    <div class="card bg-base-100 w-[600px] max-w-[90vw] max-h-[85vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide">
        <!-- 关闭按钮 -->
        <button @click="hideUploadMenu" 
                class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10">
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>
        
        <!-- 标题 -->
        <h2 class="card-title text-2xl mb-8 pr-8">填写文章详细信息</h2>

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
              <span class="label-text text-base font-medium">文章标题</span>
            </label>
            <input type="text" 
                   class="input input-bordered w-full" 
                   placeholder="请输入文章标题" />
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
                      placeholder="请输入文章摘要"></textarea>
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
        <div class="card-actions justify-end mt-8 pt-4 border-t border-base-300 sticky bottom-0 bg-base-100">
          <button class="btn btn-ghost" @click="hideUploadMenu">取消</button>
          <button class="btn btn-primary">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 投稿菜单显示状态
const showUploadMenu = ref(false)

// 切换投稿菜单显示
const toggleUploadMenu = () => {
  showUploadMenu.value = !showUploadMenu.value
}

// 隐藏投稿菜单
const hideUploadMenu = () => {
  showUploadMenu.value = false
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