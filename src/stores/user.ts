import type { User } from '@/js/User'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const empty: User = {
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
      createdAt: '',
    }

    const detail = reactive<User>({ ...empty })

    const setUserName = (name: string) => {
      detail.username = name
    }

    const setId = (userId: number) => {
      detail.id = userId
    }

    const setAvatar = (avatarUrl: string) => {
      detail.avatar = avatarUrl
    }

    const setDetail = (user: User) => {
      Object.assign(detail, user)
    }

    const clearDetail = () => {
      Object.assign(detail, empty)
      console.log('User detail cleared')
    }

    return { detail, setUserName, setId, setAvatar, setDetail, clearDetail }
  },
  { persist: true },
)
