// API配置文件
export const API_CONFIG = {
  BASE_URL: 'http://39.107.99.145:8081',

  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    RESET_PASSWORD: '/users/change-password',
    SEND_VERIFICATION_CODE: '/users/send-verification-code',
    USER_INFO: '/users/id',
    UNREAD_MESSAGE_NUMBER: '/message/unread-count',
  }
}

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
