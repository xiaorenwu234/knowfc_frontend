import instance from '@/ts/axios.ts'
import { getUserId } from '@/ts/User.ts'

export const addFavor = async (workId: string): Promise<Boolean> => {
  const url = '/favor/add'
  const userId = getUserId()
  try {
    const response = await instance.post(url, {
      params: {
        workId: workId,
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('收藏成功')
      return true
    } else {
      console.error('收藏失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('收藏操作失败', err)
    return false
  }
}
export const cancelFavor = async (workId: string): Promise<Boolean> => {
  const url = '/favor/del'
  const userId = getUserId()
  try {
    const response = await instance.post(url, {
      params: {
        workId: workId,
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('取消收藏成功')
      return true
    } else {
      console.error('取消收藏失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('取消收藏操作失败', err)
    return false
  }
}
