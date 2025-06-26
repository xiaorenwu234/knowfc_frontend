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

export const getFollowList = async (page:Number):Promise<any[]> => {
  const url = '/follow/list'
  const userId = getUserId()
  try {
    const response = await instance.post(url, {
      params: {
        userId: userId,
        page: page,
      }
    })
    if (response.data.code === 200) {
      console.log('获取成功')
      console.log(response.data.data)
      return response.data.data
    } else {
      console.error('获取失败:', response.data.message)
      return [];
    }
  } catch (err) {
    console.error('获取操作失败', err)
    return [];
  }
}
