import type { User } from '@/js/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const detail = ref<User>({
      id: 0,
      email: '',
      username: '',
      password: '',
      degree: '',
      title: '',
      institution: '',
      researchArea: '',
      bio: '',
      avatar: '',
      userType: 0,
      status: 0,
      createdAt: ''
    })

    const setUserName = (name: string) => {
      detail.value.username = name
    }

    const setId = (userId: number) => {
      detail.value.id = userId
    }

    const setAvatar = (avatarUrl: string) => {
      detail.value.avatar = avatarUrl
    }

    const setDetail = (user: User) => {
      detail.value = user
    }

    return { detail, setUserName, setId, setAvatar, setDetail }
  },
  { persist: true },
)
