import instance from '@/ts/axios.ts'

export const uploadPaper = async (workInfo: any, pdfDocument: File): Promise<boolean> => {
  const url = '/works/upload'
  try {
    // 创建FormData对象
    const formData = new FormData()
    console.log('上传论文信息:', workInfo)
    console.log('提交的数据包含PDF文件:', pdfDocument)
    // 将JSON对象转换为字符串，并添加到formData
    formData.append(
      'workInfo',
      new Blob([JSON.stringify(workInfo)], {
        type: 'application/json',
      }),
    )

    // 添加PDF文件
    formData.append('pdfFile', pdfDocument)

    const response = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

export const uploadPDF = async (userid: string | number, pdfFile: File): Promise<any> => {
  const url = '/works/getPdfData'
  try {
    // 创建FormData对象
    const formData = new FormData()

    console.log('上传PDF解析请求:', { userid, fileName: pdfFile.name })

    // 添加用户ID
    formData.append('userId', userid.toString())

    // 添加PDF文件
    formData.append('pdfFile', pdfFile)

    const response = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('PDF解析响应:', response.data)

    // 检查响应状态
    if (response.data.code === 200) {
      console.log('PDF解析成功:', response.data.data)
      return response.data
    } else {
      throw new Error(response.data.msg || 'PDF解析失败')
    }
  } catch (err) {
    console.error('PDF上传解析失败:', err)
    throw err
  }
}
