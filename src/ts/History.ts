import instance from '@/ts/axios.ts'

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