<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  addFolder,
  getChildrenFolders,
  changeFolderName,
  removeFolder,
  moveFolder,
  paperData,
  analyzePDF,
  uploadFile,
} from '@/ts/favorites.ts'
import { notify } from '@/ts/toast.ts'
import Loading from '@/components/loading.vue'

const i = ref(0)

// 定义类型
interface Folder {
  uuid: string
  title: string
  type?: string
}

interface ContextMenuState {
  show: boolean
  x: number
  y: number
  type: 'folder' | 'background'
  folderUuid: string | null
  isRenaming: boolean
  isCreating: boolean
  isUploading: boolean
  newName: string
}

interface CopiedFolder {
  uuid: string | null
  type: 'folder' | 'file' | null
  action: 'copy' | 'cut' | null
  fromId: string | null
}

const selectedFolderUuid = ref<string | null>(null)
const copiedFolder = ref<CopiedFolder>({
  uuid: null,
  action: null,
  type: 'folder',
})
const currentFolder = ref<Folder>({ uuid: '', title: 'root', type: 'folder' })

const folderPath = ref<Folder[]>([{ uuid: '', title: 'root' }])
const allFolders = ref<Folder[]>([])

// 上传相关状态
const showUploadModal = ref(false)
const uploadFolderPath = ref<Folder[]>([])
const uploadCurrentFolder = ref<Folder>({ uuid: '', title: 'root', type: 'folder' })
const uploadFolders = ref<Folder[]>([])

const contextMenu = ref<ContextMenuState>({
  show: false,
  x: 0,
  y: 0,
  type: 'folder',
  folderUuid: null,
  isRenaming: false,
  isCreating: false,
  isUploading: false,
  newName: '',
})

// 方法
const pasteFolder = async () => {
  if (!copiedFolder.value.uuid) return

  const [result, msg] = await moveFolder(
    copiedFolder.value.action,
    copiedFolder.value.type,
    copiedFolder.value.fromId,
    currentFolder.value.uuid,
  )

  if (result) {
    notify(
      'success',
      `文件夹已${copiedFolder.value.action === 'copy' ? '复制' : '剪切'}到当前文件夹`,
    )
  } else {
    notify('error', `操作失败: ${msg}`)
    return
  }

  const folders = await getChildrenFolders(currentFolder.value.uuid)
  handleFolders(folders.items)
  hideContextMenu()
}

const openFolder = async (folderUuid: string) => {
  const folder = allFolders.value.find((f) => f.uuid === folderUuid)
  if (folder.type === 'folder') {
    currentFolder.value = folder
    const folders = await getChildrenFolders(folderUuid)
    currentFolder.value = {
      uuid: folders.id,
      title: folder.title,
      type: 'folder',
    }
    handleFolders(folders.items)
    folderPath.value.push({
      uuid: currentFolder.value.uuid,
      title: currentFolder.value.title,
      type: 'folder',
    })
  } else {
    console.log('打开文件: ', folder.title)
  }
  hideContextMenu()
}

const renameFolder = () => {
  if (!contextMenu.value.folderUuid) return
  contextMenu.value.isRenaming = true
  contextMenu.value.newName =
    allFolders.value.find((f) => f.uuid === contextMenu.value.folderUuid)?.title || ''
  focusInput()
}

const createNewFolder = () => {
  contextMenu.value.isCreating = true
  contextMenu.value.newName = '新建文件夹'
  focusInput()
}

const uploadDocument = () => {
  showUploadModal.value = true
  initUploadModal()
  hideContextMenu()
}

const initUploadModal = async () => {
  const folders = await getChildrenFolders('')
  uploadCurrentFolder.value = { uuid: folders.id, title: 'root', type: 'folder' }
  uploadFolderPath.value = [{ uuid: folders.id, title: 'root', type: 'folder' }]
  uploadFolders.value = folders.items.map((item) => ({
    uuid: item.id,
    title: item.name,
    type: item.itemType || 'folder',
  }))
}

const navigateUploadFolder = async (folderUuid: string) => {
  const folder = uploadFolders.value.find((f) => f.uuid === folderUuid)
  if (folder && folder.type === 'folder') {
    const folders = await getChildrenFolders(folderUuid)
    uploadCurrentFolder.value = {
      uuid: folders.id,
      title: folder.title,
      type: 'folder',
    }
    uploadFolders.value = folders.items.map((item) => ({
      uuid: item.id,
      title: item.name,
      type: item.itemType || 'folder',
    }))
    uploadFolderPath.value.push({
      uuid: uploadCurrentFolder.value.uuid,
      title: uploadCurrentFolder.value.title,
      type: 'folder',
    })
  }
}

const jumpUploadFolder = async (folderUuid: string) => {
  for (let i = 0; i < uploadFolderPath.value.length; i++) {
    if (uploadFolderPath.value[i].uuid === folderUuid) {
      uploadCurrentFolder.value = uploadFolderPath.value[i]
      const folders = await getChildrenFolders(folderUuid)
      uploadFolders.value = folders.items.map((item) => ({
        uuid: item.id,
        title: item.name,
        type: item.itemType || 'folder',
      }))
      uploadFolderPath.value = uploadFolderPath.value.slice(0, i + 1)
      return
    }
  }
}

const isLoading = ref(false)
const showAIResults = ref(false)
const file = ref(null)
const showModal = ref(false)
const modal = ref(null)

watch(showModal, (newVal) => {
  if (newVal) {
    modal.value?.showModal() // 显示模态框
  } else {
    modal.value?.close() // 关闭模态框
  }
})

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    file.value = input.files[0]
    paperData.value = {
      title: '',
      authors: [],
      abstractContent: '',
      keywords: [],
      publishDate: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      type: '',
      source: '',
    }
    showAIResults.value = true
    isLoading.value = true
    showModal.value = true
    const [result, msg] = await analyzePDF(file.value)
    console.log('okok')
    isLoading.value = false
    if (result) {
      notify('success', `文件 ${file.value.name}解析完成`)
    } else {
      notify('error', `解析失败失败: ${msg}`)
    }
    // showUploadModal.value = false
  }
}

const focusInput = async () => {
  await nextTick()
  const input = document.querySelector('.rename-input') as HTMLInputElement
  if (input) {
    input.focus()
    input.select()
  }
}

const confirmNameChange = async () => {
  if (contextMenu.value.isRenaming && contextMenu.value.folderUuid) {
    const folder = allFolders.value.find((f) => f.uuid === contextMenu.value.folderUuid)
    if (folder && contextMenu.value.newName.trim()) {
      const [result, message] = await changeFolderName(
        contextMenu.value.folderUuid,
        contextMenu.value.newName,
      )
      if (result) {
        notify('success', `重命名成功`)
        folder.title = contextMenu.value.newName
      } else {
        notify('error', `重命名失败: ${message}`)
      }
    } else {
      notify('error', `文件夹名称不能为空`)
    }
  } else if (contextMenu.value.isCreating) {
    if (contextMenu.value.newName.trim()) {
      const [result, uuid] = await addFolder(contextMenu.value.newName, currentFolder.value.uuid)
      if (result) {
        allFolders.value.push({
          title: contextMenu.value.newName,
          uuid: uuid,
          type: 'folder',
        })
        notify('success', `新建文件夹成功`)
      } else {
        notify('error', `新建文件夹失败，请稍后再试`)
      }
    }
  }
  resetInputState()
}

const cancelInput = () => {
  resetInputState()
}

const resetInputState = () => {
  contextMenu.value.isRenaming = false
  contextMenu.value.isCreating = false
  contextMenu.value.isUploading = false
  contextMenu.value.newName = ''
  hideContextMenu()
}

const deleteFolder = async () => {
  if (!contextMenu.value.folderUuid) return
  const [result, message] = await removeFolder(contextMenu.value.folderUuid)
  if (result) {
    notify('success', `删除成功`)
    allFolders.value = allFolders.value.filter((f) => f.uuid !== contextMenu.value.folderUuid)
    selectedFolderUuid.value = null
  } else {
    notify('error', `删除失败: ${message}`)
    return
  }
  hideContextMenu()
}

const showContextMenu = (
  event: MouseEvent,
  type: 'folder' | 'background',
  folderUuid: string | null = null,
) => {
  event.preventDefault()

  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    type,
    folderUuid,
    isRenaming: false,
    isCreating: false,
    isUploading: false,
    newName: '',
  }

  if (type === 'folder' && folderUuid) {
    selectedFolderUuid.value = folderUuid
  } else {
    selectedFolderUuid.value = null
  }
}

const hideContextMenu = () => {
  if (
    !contextMenu.value.isRenaming &&
    !contextMenu.value.isCreating &&
    !contextMenu.value.isUploading
  ) {
    contextMenu.value.show = false
  }
}

const selectFolder = (folderUuid: string) => {
  selectedFolderUuid.value = folderUuid
}

const handleClickOutside = () => {
  selectedFolderUuid.value = null
  if (
    !contextMenu.value.isRenaming &&
    !contextMenu.value.isCreating &&
    !contextMenu.value.isUploading
  ) {
    hideContextMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (selectedFolderUuid.value !== null) {
    const selectedFolder = allFolders.value.find(
      (folder) => folder.uuid === selectedFolderUuid.value,
    )
    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
      copiedFolder.value = {
        uuid: selectedFolder.uuid,
        action: 'copy',
        type: selectedFolder.type,
        fromId: selectedFolder.uuid,
      }
      notify('success', `文件已复制`)
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'x') {
      copiedFolder.value = {
        uuid: selectedFolder.uuid,
        action: 'cut',
        type: selectedFolder.type,
        fromId: selectedFolder.uuid,
      }
      notify('success', `文件已剪切`)
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'v' && copiedFolder.value.uuid) {
      pasteFolder()
    }
  }
}

const handleCopy = (folderUuid: string | null) => {
  if (folderUuid) {
    const selectedFolder = allFolders.value.find((folder) => folder.uuid === folderUuid.value)
    copiedFolder.value = {
      uuid: folderUuid,
      action: 'copy',
      type: selectedFolder?.type || 'folder',
      fromId: folderUuid,
    }
    hideContextMenu()
  }
}

const handleCut = (folderUuid: string | null) => {
  if (folderUuid) {
    const selectedFolder = allFolders.value.find((folder) => folder.uuid === folderUuid.value)
    copiedFolder.value = {
      uuid: folderUuid,
      action: 'cut',
      type: selectedFolder?.type || 'folder',
      fromId: folderUuid,
    }
    console.log(copiedFolder.value)
    hideContextMenu()
  }
}

const jumpFolder = async (folderUuid: string) => {
  for (let i = 0; i < folderPath.value.length; i++) {
    if (folderPath.value[i].uuid === folderUuid) {
      currentFolder.value = folderPath.value[i]
      const folders = await getChildrenFolders(folderUuid)
      currentFolder.value = {
        uuid: folderUuid,
        title: folderPath.value[i].title,
        type: 'folder',
      }
      handleFolders(folders.items)
      folderPath.value = folderPath.value.slice(0, i + 1)
      return
    }
  }
}

const handleFolders = (folders: any[]) => {
  allFolders.value = []
  for (const folder of folders) {
    allFolders.value.push({
      uuid: folder.id || `folder-${i.value++}`,
      title: folder.name,
      type: folder.itemType || 'folder',
    })
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', hideContextMenu)
  const folders = await getChildrenFolders('')
  currentFolder.value = { uuid: folders.id, title: 'root', type: 'folder' }
  handleFolders(folders.items)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', hideContextMenu)
})

const returnRouter = () => {
  window.history.back()
}

const submitFile = async () => {
  const [result, msg] = await uploadFile(uploadCurrentFolder.value.uuid, file.value)
  if (result) {
    notify('success', `文件上传成功`)
    showModal.value = false
    showUploadModal.value=false
  } else {
    notify('error', `文件上传失败: ${msg}`)
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="returnRouter()"
  >
    <div
      class="card bg-base-100 w-screen h-screen shadow-xl overflow-hidden rounded-none"
      @click.self="handleClickOutside"
      @contextmenu="showContextMenu($event, 'background')"
    >
      <div class="card-body p-8 overflow-y-auto scrollbar-hide" @click="handleClickOutside">
        <button
          @click="returnRouter()"
          class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10"
        >
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>

        <h2 class="card-title text-2xl mb-4 pr-8">我的收藏夹</h2>

        <div class="w-full" id="favoritesBody" @click="handleClickOutside">
          <div class="w-full">
            <div class="flex items-center mb-4">
              <span
                v-for="(folder, index) in folderPath"
                :key="folder.uuid"
                class="text-sm text-gray-600"
                @click.stop="jumpFolder(folder.uuid)"
              >
                <span class="cursor-pointer hover:underline">{{ folder.title }}</span>
                <span v-if="index < folderPath.length - 1" class="mx-1.5">></span>
              </span>
            </div>
          </div>
          <div class="w-full grid grid-cols-auto-fill-140 gap-4 justify-center">
            <div
              class="w-[140px] relative"
              v-for="folder in allFolders"
              :key="folder.uuid"
              @click.stop="selectFolder(folder.uuid)"
              @contextmenu.stop="showContextMenu($event, 'folder', folder.uuid)"
              @dblclick.stop="openFolder(folder.uuid)"
            >
              <img src="@/assets/folder.png" alt="文件夹" v-if="folder.type === 'folder'" />
              <img src="@/assets/pdf.png" alt="pdf文件" v-else />
              <div
                v-if="selectedFolderUuid === folder.uuid"
                class="absolute inset-0 bg-gray-500 bg-opacity-40 rounded-xl"
              />
              <div class="w-full flex">
                <span class="m-auto">{{ folder.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed bg-white shadow-lg rounded-md py-1 z-[1100] min-w-[160px]"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click.stop
    >
      <template
        v-if="contextMenu.type === 'folder' && contextMenu.folderUuid && !contextMenu.isRenaming"
      >
        <div class="flex flex-col">
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="openFolder(contextMenu.folderUuid)"
          >
            打开
          </button>
          <button class="px-4 py-2 text-left hover:bg-gray-100" @click="renameFolder">
            重命名
          </button>
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="handleCopy(contextMenu.folderUuid)"
          >
            复制
          </button>
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="handleCut(contextMenu.folderUuid)"
          >
            剪切
          </button>
          <button
            v-if="copiedFolder.uuid"
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="pasteFolder"
          >
            粘贴
          </button>
          <button class="px-4 py-2 text-left hover:bg-gray-100" @click="uploadDocument">
            上传文献
          </button>
          <button class="px-4 py-2 text-left text-red-500 hover:bg-gray-100" @click="deleteFolder">
            删除
          </button>
        </div>
      </template>

      <template v-else-if="contextMenu.type === 'background' && !contextMenu.isCreating">
        <button class="px-4 py-2 text-left hover:bg-gray-100 w-full" @click="createNewFolder">
          <span class="flex items-center">
            <icon class="icon-[material-symbols--create-new-folder] w-5 h-5 mr-2" />
            新建文件夹
          </span>
        </button>
        <button class="px-4 py-2 text-left hover:bg-gray-100 w-full" @click="uploadDocument">
          <span class="flex items-center">
            <icon class="icon-[material-symbols--upload] w-5 h-5 mr-2" />
            上传文献
          </span>
        </button>
        <button
          v-if="copiedFolder.uuid"
          class="px-4 py-2 text-left hover:bg-gray-100 w-full"
          @click="pasteFolder"
        >
          <span class="flex items-center">
            <icon class="icon-[material-symbols--content-paste] w-5 h-5 mr-2" />
            粘贴
          </span>
        </button>
      </template>

      <!-- 输入框 -->
      <div v-if="contextMenu.isRenaming || contextMenu.isCreating" class="p-2">
        <input
          v-model="contextMenu.newName"
          class="rename-input border rounded px-2 py-1 w-full"
          @keyup.enter="confirmNameChange"
          @keyup.escape="cancelInput"
          autofocus
        />
        <div class="flex justify-end mt-2 space-x-2">
          <button class="px-2 py-1 text-sm bg-gray-200 rounded" @click="cancelInput">取消</button>
          <button
            class="px-2 py-1 text-sm bg-blue-500 text-white rounded"
            @click="confirmNameChange"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 上传文献弹窗 -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200]"
      @click.self="showUploadModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-1/3 max-w-2xl min-w-[400px] max-h-[80vh] flex flex-col"
      >
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">选择上传位置</h3>
        </div>

        <div class="p-4 border-b">
          <div class="flex items-center">
            <span
              v-for="(folder, index) in uploadFolderPath"
              :key="folder.uuid"
              class="text-sm text-gray-600"
              @click.stop="jumpUploadFolder(folder.uuid)"
            >
              <span class="cursor-pointer hover:underline">{{ folder.title }}</span>
              <span v-if="index < uploadFolderPath.length - 1" class="mx-1.5">></span>
            </span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div class="">
            <div
              v-for="folder in uploadFolders.filter((f) => f.type === 'folder')"
              :key="folder.uuid"
              class="flex items-center px-2 py-0.5 cursor-pointer hover:bg-gray-100 rounded"
              @click="navigateUploadFolder(folder.uuid)"
            >
              <img src="@/assets/folder.png" alt="文件夹" class="w-6 h-6 mr-1" />
              <span class="text-sm">{{ folder.title }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 border-t flex justify-between items-center">
          <div>
            <span class="text-sm">当前文件夹: {{ uploadCurrentFolder.title }}</span>
          </div>
          <div class="flex space-x-2">
            <button
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              @click="showUploadModal = false"
            >
              取消
            </button>
            <label
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              <input
                type="file"
                class="hidden"
                @change="handleFileUpload"
                accept=".pdf,application/pdf"
              />
              选择文件
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <dialog ref="modal" class="modal" :class="{ 'modal-open': showModal }">
    <div class="modal-box">
      <div class="min-h-[450px] w-full flex">
        <div v-if="isLoading" class="m-auto">
          <Loading></Loading>
        </div>
        <div v-else class="flex flex-col min-h-[450px] w-full">
          <div class="flex-1">
            <label for="pdf_title" class="mt-6 ml-1 font-bold">论文名称</label>
            <input
              v-model="paperData.title"
              id="pdf_title"
              type="text"
              placeholder="论文名称"
              class="w-full my-2 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
            />

            <label for="pdf_source" class="mt-6 ml-1 font-bold">论文来源</label>
            <input
              v-model="paperData.source"
              id="pdf_source"
              type="text"
              placeholder="论文来源"
              class="w-full my-2 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
            />

            <label for="publish_date" class="mt-6 ml-1 font-bold">发布日期</label>
            <input
              v-model="paperData.publishDate"
              id="publish_date"
              type="text"
              placeholder="发布日期"
              class="w-full my-2 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
            />

            <label for="pdf_keywords" class="mt-6 ml-1 font-bold">关键词</label>
            <input
              v-model="paperData.keywords"
              id="pdf_keywords"
              type="text"
              placeholder="关键词"
              class="w-full my-2 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
            />

            <label for="pdf_authors" class="mt-6 ml-1 font-bold">作者</label>
            <input
              v-model="paperData.authors"
              id="pdf_authors"
              type="text"
              placeholder="作者"
              class="w-full my-2 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none text-base"
            />
          </div>
          <div class="modal-action flex w-full">
            <div class="flex-1"></div>
            <form method="dialog">
              <button class="btn" @click="showModal = false">关 闭</button>
              <button class="btn btn-info ml-2" @click="submitFile">上 传</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.grid-cols-auto-fill-140 {
  grid-template-columns: repeat(auto-fill, 140px);
}
</style>
