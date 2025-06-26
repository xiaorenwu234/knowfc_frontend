<template>
    <div ref="searchBar" class="flex flex-col gap-2 p-4 sticky top-0 z-50 transition-all duration-300 mx-auto"
        :class="[isNearTop ? 'max-w-80' : 'max-w-3xl']"
        @focusin="isFocused = true" @focusout="isFocused = false;">
        <!-- 搜索框 -->
        <label class="input input-bordered flex items-center gap-2 rounded-full focus-within:shadow-2xl  focus-within:shadow-blue-400 transition-all bg-opacity-60 backdrop-blur-sm" >
            <input
                ref="searchInput"
                type="text"
                class="grow min-w-32"
                placeholder="Search"
                v-model="searchQuery"
                @keyup.enter="doSearch"
            />
            <!-- <kbd class="kbd kbd-sm">⌘</kbd> -->
            <kbd class="kbd kbd-sm">ctrl</kbd>
            <kbd class="kbd kbd-sm">K</kbd>
            <button  @click="doSearch" class="h-4 w-4 active:scale-125 transition-all duration-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-full w-full opacity-70">
                    <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"/>
                </svg>
            </button>
        </label>

        <div class="flex flex-col">
            <div class="flex items-center justify-between transition-all duration-300"
                :class="isFocused ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'">
                <button class="btn btn-xs glass gap-0" @click="showAdvancedSearch = !showAdvancedSearch">
                    <span class="font-bold">高级搜索</span>
                    <span v-if="!showAdvancedSearch" class="icon-[material-symbols--keyboard-double-arrow-right-rounded]"></span>
                    <span v-else class="icon-[material-symbols--keyboard-double-arrow-down-rounded]"></span>
                </button>
                <label class="swap swap-flip text-xl font-bold" @mousedown.prevent>
                    <input type="checkbox" />

                    <div class="swap-on btn glass btn-xs">🧑‍🎓用户搜索</div>
                    <div class="swap-off btn glass btn-xs">📚成果搜索</div>
                </label>
            </div>
        </div>

        <!-- 高级搜索区域 -->
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
        >
            <div v-show="showAdvancedSearch" class="flex flex-col gap-4 bg-white/70 backdrop-blur-lg rounded-3xl p-4" >
                <!-- 类型选择 -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium">类型选择</label>
                    <div class="flex flex-wrap gap-2" @mousedown.prevent>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input type="radio" name="type" class="radio radio-sm" value="works" v-model="selectedType" />
                            <span>成果</span>
                        </label>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input type="radio" name="type" class="radio radio-sm" value="users" v-model="selectedType" />
                            <span>用户</span>
                        </label>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input type="radio" name="type" class="radio radio-sm" value="problems" v-model="selectedType" />
                            <span>问题</span>
                        </label>
                    </div>
                </div>

                <!-- 时间范围选择 -->
                <div v-if="selectedType === 'works'" class="flex flex-col gap-2">
                    <label class="text-sm font-medium">时间范围</label>
                    <div class="flex flex-wrap gap-2" @mousedown.prevent>
                        <input
                            type="date"
                            class="input input-bordered grow"
                            v-model="dateRange.start"
                        />
                        <span class="self-center">至</span>
                        <input
                            type="date"
                            class="input input-bordered grow"
                            v-model="dateRange.end"
                        />
                    </div>
                </div>

                <!-- 学科领域选择 -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium">学科领域</label>
                    <div class="flex flex-wrap gap-2" @mousedown.prevent>
                        <label v-for="subject in subjects" :key="subject.value" class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-sm"
                                :value="subject.value"
                                v-model="selectedSubjects"
                            />
                            <span>{{ subject.label }}</span>
                        </label>
                    </div>
                </div>

                <!-- 所属机构选择 -->
                <div v-if="selectedType === 'users'" class="flex flex-col gap-2" @mousedown.stop>
                    <label class="text-sm font-medium">所属机构</label>
                    <input
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="输入所属机构"
                        v-model="selectedInstitution"
                    />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/search'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const searchBar = ref()
const searchInput = ref()

const doSearch = () => {
    searchStore.setContent(searchQuery.value)
    searchStore.setType(selectedType.value)
    searchStore.setField(selectedSubjects.value)
    searchStore.setInstitution(selectedInstitution.value)

    // 清除搜索内容
    searchQuery.value = ''
    // 清除高级搜索内容
    dateRange.value = {
        start: '',
        end: ''
    }
    selectedSubjects.value = []
    selectedInstitution.value = ''
    // 关闭高级搜索面板
    showAdvancedSearch.value = false

    searchInput.value.blur()

    searchStore.searchQuery.doSearch = true
}

// 高级搜索
const showAdvancedSearch = ref(false)

// 是否聚焦
const isFocused = ref(false)

// 是否接近顶部
const isNearTop = ref(false)

// 监听滚动事件
const handleScroll = () => {
    const sbPosition = searchBar.value.getBoundingClientRect().top
    if (sbPosition <= 100) {
        isNearTop.value = true
    } else {
        isNearTop.value = false
    }
}

// 全局快捷键处理
const handleGlobalKeydown = (e) => {
    // 检查是否按下 Ctrl+K
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault() // 阻止默认行为
        searchInput.value.focus()
    }
}

// 组件挂载时添加滚动监听和键盘事件监听
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleGlobalKeydown)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', handleGlobalKeydown)
})

const searchStore = useSearchStore()

// 搜索查询
const searchQuery = ref('')

// 日期范围
const dateRange = ref({
    start: '',
    end: ''
})

// 类型选择
const selectedType = ref('works')

// 学科领域选项
const subjects = [
    { label: '数学', value: 'math' },
    { label: '物理', value: 'physics' },
    { label: '化学', value: 'chemistry' },
    { label: '生物', value: 'biology' },
    { label: '计算机', value: 'computer' },
    { label: '文学', value: 'literature' },
    { label: '历史', value: 'history' },
    { label: '地理', value: 'geography' }
]

// 选中的学科领域
const selectedSubjects = ref([])

// 选中的所属机构
const selectedInstitution = ref('')
</script>
