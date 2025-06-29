import instance from '@/ts/axios.ts'

export interface IHistory {
  id: number,
  type: string,
  paperId: string,
  workTitle: string,
  authors: Array<string> | string,
  isCollected: boolean
}

export const getHistory = async (userId: string | number): Promise<any> => {
  const url = `/read-history/getByUserId/${userId}`
  try {
    console.log('获取用户阅读历史:', userId)

    const response = await instance.get(url)

    console.log('阅读历史响应:', response.data)

    // 检查响应状态
    if (response.data.code === 200) {
      console.log('获取阅读历史成功:', response.data.data)
      return response.data
    } else {
      throw new Error(response.data.msg || '获取阅读历史失败')
    }
  } catch (err) {
    console.error('获取阅读历史失败:', err)
    throw err
  }
}

export const deleteHistory = async (userId: number, paperId: string): Promise<any> => {
  const url = `/read-history/delete/${userId}/${paperId}`
  try {
    const response = await instance.delete(url)

    // 检查响应状态
    if (response.data.code === 200) {
      console.log('删除阅读历史成功:', response.data.data)
      return response.data
    } else {
      throw new Error(response.data.msg || '删除阅读历史失败')
    }
  } catch (err) {
    console.error('删除阅读历史失败:', err)
    throw err
  }
}

interface ReadingUpsertRequest {
  userId: number,
  paperId: string,
  newDuration: number,
  lastPosition: number,
}

export const addHistory = async (userId: number, paperId: string, newDuration = 0, lastPosition = 0): Promise<any> => {
  const url = '/read-history/update'
  try {
    const param: ReadingUpsertRequest = { userId, paperId, newDuration, lastPosition }
    const response = await instance.post(url, param, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // 检查响应状态
    if (response.data.code === 200) {
      return response.data
    } else {
      throw new Error(response.data.msg || '添加阅读历史失败')
    }
  } catch (err) {
    console.error('添加阅读历史失败:', err)
    throw err
  }
}
