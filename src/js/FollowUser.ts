import { getUserId } from '@/js/User.ts'
import instance from '@/js/axios.ts'

export const followUser = async (authorId: string): Promise<Boolean> => {
  const url = '/follow/add'
  const userId = getUserId()
  console.log(userId)
  try {
    const response = await instance.post(url, {
      params: {
        authorId: authorId,
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('关注成功')
      return true
    } else {
      console.error('关注失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('关注操作失败', err)
    return false
  }
}

export const unfollowUser = async (authorId: string): Promise<Boolean> => {
  const url = '/follow/del'
  const userId = getUserId()
  try {
    const response = await instance.post(url, {
      params: {
        authorId: authorId,
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('取消关注成功')
      return true
    } else {
      console.error('取消关注失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('取消关注操作失败', err)
    return false
  }
}
