import { getUserId } from '@/js/User.ts'
import instance from '@/js/axios.ts'

export const followUser = async (authorId: string): Promise<boolean> => {
  const url = '/follow/user'
  const userId = getUserId()
  try {
    const response = await instance.post(url,null, {
      params: {
        followingId: Number(authorId),
        followerId: userId
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

export const unfollowUser = async (authorId: string): Promise<boolean> => {
  const url = '/follow/user'
  const userId = getUserId()
  try {
    const response = await instance.delete(url, {
      params: {
        followingId: Number(authorId),
        followerId: userId
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

export const checkFollowStatus = async (followingId: string): Promise<boolean> => {
  const url = '/follow/check'
  const userId = getUserId()
  try {
    const response = await instance.get(url, {
      params: {
        followingId: followingId,
        followerId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('获取关注状态成功')
      console.log(response.data.data)
      return response.data.data
    } else {
      console.error('获取关注状态失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('获取关注状态操作失败', err)
    return false
  }
}

export interface IFollowUserListItem {
  id: number
  email: string
  username: string
  degree: string
  title: string
  institution: string
  researchArea: string
  bio: string
  avatar: string
  followedAt: string
}

export const getFollowList = async (userId:string):Promise<IFollowUserListItem[]> => {
  const url = '/follow/list'
  try {
    const response = await instance.get(url, {
      params: {
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('获取成功')
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

export const getFanList = async (userId:string):Promise<IFollowUserListItem[]> => {
  const url = '/follow/fans'
  try {
    const response = await instance.get(url, {
      params: {
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('获取成功')
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

export const getFollowCount = async (userId:string):Promise<number> => {
  const url = '/follow/count'
  try {
    const response = await instance.get(url, {
      params: {
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('获取成功')
      return response.data.data
    } else {
      console.error('获取失败:', response.data.message)
      return 0;
    }
  } catch (err) {
    console.error('获取操作失败', err)
    return 0;
  }
}

export const getFanCount = async (userId:string):Promise<number> => {
  const url = '/follow/fans-count'
  try {
    const response = await instance.get(url, {
      params: {
        userId: userId
      }
    })
    if (response.data.code === 200) {
      console.log('获取成功')
      return response.data.data
    } else {
      console.error('获取失败:', response.data.message)
      return 0;
    }
  } catch (err) {
    console.error('获取操作失败', err)
    return 0;
  }
}



