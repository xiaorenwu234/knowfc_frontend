import instance from '@/ts/axios.ts'
import { API_CONFIG, buildApiUrl } from '@/config/api.ts'
import { getUserId } from '@/ts/User.ts'

export const getGraph = async (): Promise<any> => {
  const userId = getUserId()
  try {
    const response = await instance.get(buildApiUrl(API_CONFIG.ENDPOINTS.GET_GRAPH.replace('id', String(userId))))
    if (response.data.code === 200) {
      console.log('获取成功')
      return response.data.data
    } else {
      console.error('获取失败:', response.data.message)
      return []
    }
  } catch (err) {
    console.error('获取操作失败', err)
    return []
  }
}
