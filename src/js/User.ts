import { ref } from 'vue'
import instance from '@/js/axios.ts'
import { local } from 'd3'

const userName = ref('')
const id = ref(0)

export const getUserId = () => {
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = userInfo.id
  return userId
}

export const login = async (username: string, password: string): Promise<[boolean, string]> => {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  const url = '/users/login'

  return instance
    .post(url, formData)
    .then((res) => {
      console.log('Login successful:', res.data)
      userName.value = res.data.username
      id.value = res.data.id
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
