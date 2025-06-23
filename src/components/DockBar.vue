<template>
    <div ref="dock" class="transition-all duration-300 ease-in-out flex flex-col justify-around fixed left-4 justify-self-center h-auto w-[60px] z-50 border-[1px] rounded-full backdrop-blur-md bg-gray-200/50  py-[6px] px-[7px] shadow-md">
        <RouterLink v-for="dockItem in dockItems" :to="dockItem['path']">
            <div class="transition w-full aspect-square border-[1px] rounded-full flex my-1 hover:scale-125 hover:bg-gray-300 shadow-md">
                <i :class="dockItem['icon']" class="h-6 w-6 m-auto"></i>
            </div>
        </RouterLink>

        <div class="w-full border-[1px] border-gray-600 my-2"></div>

        <button class="transition w-full aspect-square border-[1px] rounded-full flex my-1 hover:scale-125 hover:bg-gray-300 shadow-md" @click="changeTheme()">
            <i :class="theme" class="h-6 w-6 m-auto"></i>
        </button>
        <button class="transition w-full aspect-square border-[1px] rounded-full flex my-1 hover:scale-125 hover:bg-gray-300 shadow-md">
            <i class="icon-[material-symbols--settings] h-6 w-6 m-auto"></i>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useTemplateRef, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'

const dockItems = ref([
    {
        icon: "icon-[material-symbols--home]",
        path:"/",
    },{
        icon: "icon-[mingcute--fire-line]",
        path:"/"
    },{
        icon: "icon-[mingcute--classify-2-fill]",
        path:"/"
    },{
        icon: "icon-[mdi--bookshelf]",
        path:"/"
    }])
const isDark = ref(false)
const theme = computed(() => {
    return isDark.value ? 'icon-[ph--moon-bold]' : 'icon-[ph--sun-bold]';
})
const props=defineProps(['showDock','changeUserName'])
const showDock = computed(() => props.showDock)
const route = useRoute()
const dock = useTemplateRef('dock')
const hidePath = ['/chat', '/article-detail']
const isHidden = ref(false)

// 监听路由变化控制 dock 显示
watch(() => route.path, (newPath) => {
    if (!dock.value) return
    
    isHidden.value = hidePath.includes(newPath)
    if (isHidden.value) {
        dock.value.classList.add('-translate-x-32')
        dock.value.classList.add('opacity-0')
    } else {
        dock.value.classList.remove('-translate-x-32')
        dock.value.classList.remove('opacity-0')
    }
}, { immediate: true })

const handleMouseMove = (e: MouseEvent) => {
    if (!dock.value || !isHidden.value) return
    
    if (e.clientX <= 96) {
        dock.value.classList.remove('-translate-x-32')
        dock.value.classList.remove('opacity-0')
    } else {
        dock.value.classList.add('-translate-x-32')
        dock.value.classList.add('opacity-0')
    }
}

onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
})

function changeTheme() {
    isDark.value = !isDark.value
}

</script>

<style scoped>
.dock {
  /* Dock styles here */
}
</style>
