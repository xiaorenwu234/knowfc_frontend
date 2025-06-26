import instance from '@/js/axios.ts'
import { useUserStore } from '@/stores/user'
import type { Store } from 'pinia'
import type { Ref } from 'vue'

// Interfaces for the search response
interface Author {
  id: number
  name: string
  affiliation: string
}

interface Field {
  id: number
  name: string
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  degree: string
  title: string
  institution: string
  researchArea: string
  bio: string
  avatar: string
  userType: number
  status: number
  createdAt: string
}

interface SortObject {
  sorted: boolean
  empty: boolean
  unsorted: boolean
}

interface PageableObject {
  paged: boolean
  pageNumber: number
  pageSize: number
  offset: number
  sort: SortObject
  unpaged: boolean
}

interface PageUser {
  totalElements: number
  totalPages: number
  pageable: PageableObject
  size: number
  content: User[]
  number: number
  sort: SortObject
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

interface SearchResponse {
  code: number
  msg: string
  data: PageUser
  timestamp: number
}

export interface SearchParams {
  keyword?: string
  institution?: string
  fields?: string[]
  page?: number
  size?: number
  sortBy?: 'relevance' | 'createdAt'
}

let store: Store;
let userStore = () => {
  if (!store) {
    store = useUserStore()
    userStore = () => store
  }
  return store
}

export const getUserId = () => {
  // const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  // const userId = userInfo.id
  // const store = useUserStore()
  return 2
}

export const login = async (username: string, password: string): Promise<[boolean, string]> => {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  const url = '/users/login'
  const store = userStore()
  store.setUserName('')
  store.setId(0)

  return instance
    .post(url, formData)
    .then((res) => {
      console.log('Login successful:', res.data)
      store.setUserName(res.data.username)
      store.setId(res.data.data.id)
      if (res.data.code == 200) {
        localStorage.setItem('user',JSON.stringify(res.data.data))
        return [true, '登录成功'] as [boolean, string]
      } else {
        return [false, res.data.message] as [boolean, string]
      }
    })
    .catch((err) => {
      console.error('Error during login:', err)
      return [false, '登录失败'] as [boolean, string]
    })
}

export const signup = async (username: string, password: string, email: string, verificationCode: string): Promise<[boolean, string]> => {
  const url = '/users/register'
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('email', email)
  formData.append('verificationCode', verificationCode)

  return instance
    .post(url, formData)
    .then((res) => {
      console.log(res)
      if (res.data.code == 200) {
        return [true, '注册成功'] as [boolean, string]
      } else {
        return [false, res.data.message] as [boolean, string]
      }
    })
    .catch((err) => {
      console.error('Error during signup:', err)
      return [false, '注册失败'] as [boolean, string]
    })
}

export const sendVerificationCode = async (email: string): Promise<[boolean, string]> => {
  const url = '/users/send-verification-code'
  const formData = new FormData()
  formData.append('email', email)

  return instance
    .post(url, formData)
    .then((res) => {
      console.log(res)
      if (res.data.code == 200) {
        return [true, '验证码发送成功'] as [boolean, string]
      } else {
        return [false, res.data.message] as [boolean, string]
      }
    })
    .catch((err) => {
      console.error('Error during send verification code:', err)
      return [false, '验证码发送失败'] as [boolean, string]
    })
}

export const searchUsers = async (params: SearchParams): Promise<SearchResponse> => {
  const url = '/users/search'

  // Convert params to URLSearchParams for GET request
  const searchParams = new URLSearchParams()

  if (params.keyword) {
    searchParams.append('keyword', params.keyword)
  }
  if (params.institution) {
    searchParams.append('institution', params.institution)
  }
  if (params.fields && params.fields.length > 0) {
    params.fields.forEach(field => {
      searchParams.append('fields', field)
    })
  }
  if (typeof params.page === 'number') {
    searchParams.append('page', params.page.toString())
  }
  if (typeof params.size === 'number') {
    searchParams.append('size', params.size.toString())
  }
  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy)
  }

  return instance
    .get(`${url}?${searchParams.toString()}`)
    .then((res) => {
      console.log('Search successful:', res.data)
      return res.data as SearchResponse
    })
    .catch((err) => {
      console.error('Error during search:', err)
      throw err
    })
}
