import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userName = ref('')
    const id = ref(0)
    const avatar = ref('')

    const setUserName = (name: string) => {
      userName.value = name
    }

    const setId = (userId: number) => {
      id.value = userId
    }

    const setAvatar = (avatarUrl: string) => {
      avatar.value = avatarUrl
    }

    return { userName, id, avatar, setUserName, setId, setAvatar }
  },
  { persist: true },
)
