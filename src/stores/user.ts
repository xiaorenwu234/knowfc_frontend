import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userName = ref('')
  const id = ref(0)

  const setUserName = (name: string) => {
    userName.value = name
  }

  const setId = (userId: number) => {
    id.value = userId
  }

  return { userName, id, setUserName, setId }
})
