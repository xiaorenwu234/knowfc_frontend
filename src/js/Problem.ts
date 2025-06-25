import instance from '@/js/axios.ts'
import { getUserId } from '@/js/User.ts'

export const getQuestionDetail = async (questionId: string): Promise<any> => {
    const url = `/question/${questionId}`
  
    try {
      const response = await instance.get(url)
      if (response.data.code === 200) {
        return response.data.data
      }
      return null
    } catch (err) {
      console.error('获取题目详情失败:', err)
      return null
    }
  }

  export const getAnswers = async (questionId: string): Promise<any[]> => {
    const url = `/answer/question/${questionId}`
  
    try {
      const response = await instance.get(url)
      if (response.data.code === 200) {
        return response.data.data || []
      }
      return []
    } catch (err) {
      console.error('获取问题回答失败:', err)
      return []
    }
  }

  export const submitAnswerTo = async (questionId: string, content: string) => {
    const url = `/answer`
    const data = {
      questionId: parseInt(questionId),
      content: content,
      userId: getUserId()
    }
    console.log('提交回答数据:', data)
    try {
      const response = await instance.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('提交回答:', response.data)
      if (response.data.code === 200) {
        console.log('回答提交成功:', response.data)
        return true
      }
      return false
    } catch (err) {
      console.error('提交回答失败:', err)
      return false
    }
  }

  // ...existing code...

export const searchProblem = async (keyword: string): Promise<any[]> => {
    const url = '/question/search'
    const formData = new FormData()
    formData.append('keyword', keyword)
    formData.append('page', '0')
    formData.append('size', '10')
    
    // 将 FormData 转换为 URLSearchParams
    const params = new URLSearchParams()
    for (const [key, value] of formData.entries()) {
      params.append(key, value.toString())
    }
    
    try {
      const response = await instance.get(`${url}?${params.toString()}`)
      console.log('搜索问题结果:', response.data)
      if (response.data.code === 200) {
        return response.data.data || []
      }
      return []
    } catch (err) {
      console.error('搜索问题失败:', err)
      return []
    }
  }



