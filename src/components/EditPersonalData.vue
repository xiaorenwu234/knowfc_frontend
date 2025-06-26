<script setup lang="ts">
import {changeUserInfo, getUserName} from "@/js/User.ts";
import {onMounted} from "vue";

const showForm = defineModel('showForm')
const submitChange = async () => {
  await changeUserInfo()
}

</script>

<template>
  <div
    v-if="showForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="showForm = false"
  >
    <div class="card bg-base-100 w-[600px] max-w-[90vw] max-h-[85vh] shadow-xl overflow-hidden">
      <div class="card-body p-8 overflow-y-auto scrollbar-hide">
        <!-- 关闭按钮 -->
        <button
          @click="showForm = false"
          class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10"
        >
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>

        <h2 class="card-title text-2xl mb-8 pr-8">修改个人信息</h2>

        <div class="space-y-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">用户名</span>
            </label>
            <input type="text" disabled class="input input-bordered w-full" :placeholder="getUserName()"/>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">邮箱</span>
            </label>
            <input type="text" class="input input-bordered w-full" disabled />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">工作单位</span>
            </label>
            <input type="text" class="input input-bordered w-full" placeholder="请输入工作单位" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">职称</span>
            </label>
            <input type="text" class="input input-bordered w-full" placeholder="请输入职称" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base font-medium">个人简介</span>
            </label>
            <textarea class="input input-bordered w-full h-32" placeholder="请输入个人简介" rows="4"></textarea>          </div>
        </div>
        <div
          class="card-actions justify-end mt-8 pt-4 border-t border-base-300 bottom-0 bg-base-100"
        >
          <button class="btn w-20" @click="showForm = false">取消</button>
          <button class="btn btn-primary text-white w-20" @click="submitChange">修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
