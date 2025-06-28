<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showForm = defineModel('showForm');
const selectedFolderId = ref<number | null>(null); // 选中的文件夹ID
const copiedFolder = ref<{ id: number | null; action: string | null }>({
  id: null,
  action: null,
}); // 保存复制的内容和操作名称

const allFolders = ref([
  { title: 'folder1', id: 1, type: 'folder' },
  { title: 'folder2', id: 2, type: 'folder' },
  { title: 'folder3', id: 3, type: 'folder' },
  { title: 'folder4', id: 4, type: 'folder' },
  { title: 'folder5', id: 5, type: 'folder' },
  { title: 'folder6', id: 6, type: 'folder' },
]);

// 右键菜单相关状态
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  type: '', // 'folder' 或 'background'
  folderId: null as number | null,
  isRenaming: false,
  newName: '',
});

// 监听键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (selectedFolderId.value !== null) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
      copiedFolder.value = { id: selectedFolderId.value, action: 'copy' }; // 保存复制操作
      console.log('已复制内容:', copiedFolder.value);
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'x') {
      copiedFolder.value = { id: selectedFolderId.value, action: 'cut' }; // 保存剪切操作
      console.log('已剪切内容:', copiedFolder.value);
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'v' && copiedFolder.value.id) {
      pasteFolder();
    }
  }
};

// 粘贴文件夹
const pasteFolder = () => {
  if (!copiedFolder.value.id) return;

  const folderToCopy = allFolders.value.find(f => f.id === copiedFolder.value.id);
  if (!folderToCopy) return;

  // 创建新文件夹
  const newId = Math.max(...allFolders.value.map(f => f.id)) + 1;
  const newFolder = {
    ...folderToCopy,
    id: newId,
    title: `${folderToCopy.title} (${copiedFolder.value.action === 'copy' ? '复制' : '剪切'})`
  };

  allFolders.value.push(newFolder);

  // 如果是剪切操作，删除原文件夹
  if (copiedFolder.value.action === 'cut') {
    allFolders.value = allFolders.value.filter(f => f.id !== copiedFolder.value.id);
  }

  copiedFolder.value = { id: null, action: null };
  hideContextMenu();
};

// 打开文件夹
const openFolder = (folderId: number) => {
  console.log('打开文件夹:', folderId);
  // 这里可以添加打开文件夹的逻辑
  hideContextMenu();
};

// 重命名文件夹
const renameFolder = () => {
  if (!contextMenu.value.folderId) return;
  contextMenu.value.isRenaming = true;
  contextMenu.value.newName = allFolders.value.find(f => f.id === contextMenu.value.folderId)?.title || '';
};

// 确认重命名
const confirmRename = () => {
  if (!contextMenu.value.folderId || !contextMenu.value.newName.trim()) return;

  const folder = allFolders.value.find(f => f.id === contextMenu.value.folderId);
  if (folder) {
    folder.title = contextMenu.value.newName;
  }

  contextMenu.value.isRenaming = false;
  hideContextMenu();
};

// 删除文件夹
const deleteFolder = () => {
  if (!contextMenu.value.folderId) return;

  allFolders.value = allFolders.value.filter(f => f.id !== contextMenu.value.folderId);
  selectedFolderId.value = null; // 清除选中状态
  hideContextMenu();
};

// 新建文件夹
const createNewFolder = () => {
  const newId = Math.max(...allFolders.value.map(f => f.id), 0) + 1;
  allFolders.value.push({
    title: `新建文件夹${newId}`,
    id: newId,
    type: 'folder'
  });
  hideContextMenu();
};

// 显示右键菜单
const showContextMenu = (event: MouseEvent, type: 'folder' | 'background', folderId: number | null = null) => {
  event.preventDefault();

  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    type,
    folderId,
    isRenaming: false,
    newName: ''
  };

  if (type === 'folder' && folderId) {
    selectedFolderId.value = folderId;
  } else {
    selectedFolderId.value = null;
  }
};

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenu.value.show = false;
};

// 点击文件夹
const selectFolder = (folderId: number) => {
  selectedFolderId.value = folderId;
};

// 点击外部区域时取消选中状态和右键菜单
const handleClickOutside = () => {
  selectedFolderId.value = null;
  hideContextMenu();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', hideContextMenu);
});
</script>

<template>
  <div
    v-if="showForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    @click.self="showForm = false"
  >
    <div
      class="card bg-base-100 w-[60vw] max-w-[90vw] max-h-[85vh] h-[60vh] shadow-xl overflow-hidden"
      @click.self="handleClickOutside"
      @contextmenu="showContextMenu($event, 'background')"
    >
      <div class="card-body p-8 overflow-y-auto scrollbar-hide" @click="handleClickOutside">
        <!-- 关闭按钮 -->
        <button
          @click="showForm = false"
          class="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle z-10"
        >
          <icon class="icon-[material-symbols--close] w-5 h-5" />
        </button>

        <h2 class="card-title text-2xl mb-8 pr-8">我的收藏夹</h2>

        <div class="w-full" @click="handleClickOutside">
          <div class="flex flex-wrap" style="justify-content: space-between">
            <div
              class="w-[140px] relative"
              v-for="folder in allFolders"
              :key="folder.id"
              @click.stop="selectFolder(folder.id)"
              @contextmenu.stop="showContextMenu($event, 'folder', folder.id)"
            >
              <img src="@/assets/folder.png" alt="文件夹" />
              <div
                v-if="selectedFolderId === folder.id"
                class="absolute inset-0 bg-gray-500 bg-opacity-40 rounded-xl"
              ></div>
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
      <template v-if="contextMenu.type === 'folder' && contextMenu.folderId">
        <div v-if="!contextMenu.isRenaming" class="flex flex-col">
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="openFolder(contextMenu.folderId)"
          >
            打开
          </button>
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="renameFolder"
          >
            重命名
          </button>
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="copiedFolder = { id: contextMenu.folderId, action: 'copy' }; hideContextMenu()"
          >
            复制
          </button>
          <button
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="copiedFolder = { id: contextMenu.folderId, action: 'cut' }; hideContextMenu()"
          >
            剪切
          </button>
          <button
            v-if="copiedFolder.id"
            class="px-4 py-2 text-left hover:bg-gray-100"
            @click="pasteFolder"
          >
            粘贴
          </button>
          <button
            class="px-4 py-2 text-left text-red-500 hover:bg-gray-100"
            @click="deleteFolder"
          >
            删除
          </button>
        </div>
        <div v-else class="p-2">
          <input
            v-model="contextMenu.newName"
            class="border rounded px-2 py-1 w-full"
            @keyup.enter="confirmRename"
            @keyup.escape="hideContextMenu"
            autofocus
          />
          <div class="flex justify-end mt-2 space-x-2">
            <button
              class="px-2 py-1 text-sm bg-gray-200 rounded"
              @click="hideContextMenu"
            >
              取消
            </button>
            <button
              class="px-2 py-1 text-sm bg-blue-500 text-white rounded"
              @click="confirmRename"
            >
              确认
            </button>
          </div>
        </div>
      </template>
      <template v-else-if="contextMenu.type === 'background'">
        <button
          class="px-4 py-2 text-left hover:bg-gray-100 w-full"
          @click="createNewFolder"
        >
          <span class="flex items-center">
            <icon class="icon-[material-symbols--create-new-folder] w-5 h-5 mr-2" />
            新建文件夹
          </span>
        </button>
        <button
          v-if="copiedFolder.id"
          class="px-4 py-2 text-left hover:bg-gray-100 w-full"
          @click="pasteFolder"
        >
          <span class="flex items-center">
            <icon class="icon-[material-symbols--content-paste] w-5 h-5 mr-2" />
            粘贴
          </span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
