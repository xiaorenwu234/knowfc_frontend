import instance from '@/js/axios.ts'
import { getUserId } from '@/js/User.ts'

export const getArticleContent = async (articleId: string): Promise<string> => {
  const url = '/works/content'

  try {
    const response = await instance.get(url, {
      params: {
        id: articleId,
      },
    })
    return response.data.data
  } catch (err) {
    console.error('获取文章内容失败:', err)
    return ''
  }
}

export const getArticleLike = async (articleId: number): Promise<boolean> => {
  const url = `/works/like/${workId}/${getUserId()}`
  try {
    const response = await instance.get(url)
    if (response.data.code === 200) {
      return response.data.data
    }
    return false
  } catch (err) {
    console.error('获取文章点赞状态失败:', err)
    return false
  }
}

export const likeArticle = async (articleId: number): Promise<boolean> => {
  const url = '/works/like'
  const data = {
    userId: getUserId(),
    workId: articleId,
  }

  try {
    const response = await instance.post(url, data)
    if (response.data.code === 200) {
      return true
    } else {
      console.error('点赞失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('点赞请求失败:', err)
    return false
  }
}

export const cancelLikeArticle = async (articleId: number): Promise<boolean> => {
  const url = '/works/unlike'
  const data = {
    userId: getUserId(),
    workId: articleId,
  }
  try {
    const response = await instance.post(url, data)
    if (response.data.code === 200) {
      return true
    } else {
      console.error('取消点赞失败:', response.data.message)
      return false
    }
  } catch (err) {
    console.error('取消点赞请求失败:', err)
    return false
  }
}
