import { ref } from 'vue'

const password = ref('')
const username = ref('')
const email = ref('')

const login = (username: string, password: string): boolean => {
  return true
}

const register = (username: string, password: string, email: string): boolean => {
  return true
}

const resetPassword = (email: string): boolean => {
  return true
}
