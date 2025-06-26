import instance from '@/js/axios.ts'

export const uploadPaper = async (workInfo: any, pdfDocument: File): Promise<boolean> => {
    const url = '/works/upload'
    
    try {
      // 创建FormData对象
      const formData = new FormData()
      
      // 将JSON对象转换为字符串，并添加到formData
      formData.append('workInfo', new Blob([JSON.stringify(workInfo)], {
        type: 'application/json'
      }))
      
      // 添加PDF文件
      formData.append('pdfFile', pdfDocument)
      
      const response = await instance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('上传论文响应:', response.data)
      if (response.data.code === 200) {
        console.log('论文上传成功:', response.data)
        return true
      }
      return false
    } catch (err) {
      console.error('上传论文失败:', err)
      return false
    }
  }