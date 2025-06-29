import instance from '@/ts/axios.ts'
import { getUserId } from '@/ts/User.ts'
import { ref } from 'vue'

export const getChildrenFolders = async (uuid: string = ''): Promise<any> => {
  const url = '/library/get'
  try {
    const response = await instance.get(url, {
      params: {
        userId: getUserId().toString(),
        id: uuid,
      },
    })
    return response.data.data
  } catch (err) {
    console.error('Error fetching folders:', err)
    return []
  }
}

export const addFolder = async (
  name: string,
  parentId: string,
  description: string = '',
): Promise<[boolean, string]> => {
  const url = '/library/create'
  const formData = new FormData()
  formData.append('name', name)
  formData.append('parentId', parentId)
  formData.append('description', description)
  formData.append('userId', getUserId().toString())
  try {
    const response = await instance.post(url, formData, {})
    if (response.data.code === 200) {
      return [true, response.data.data.id] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error creating folder:', error)
    return [false, '文件夹创建失败'] as [boolean, string]
  }
}

export const removeFolder = async (uuid: string): Promise<[boolean, string]> => {
  const url = '/library/del'
  try {
    const response = await instance.delete(url, {
      params: {
        id: uuid,
        userId: getUserId().toString(),
      },
    })
    if (response.data.code === 200) {
      return [true, '文件夹删除成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error deleting folder:', error)
    return [false, '文件夹删除失败'] as [boolean, string]
  }
}

export const changeFolderName = async (
  uuid: string,
  newName: string,
): Promise<[boolean, string]> => {
  const url = '/library/update'
  const formData = new FormData()
  formData.append('id', uuid)
  formData.append('name', newName)
  formData.append('userId', getUserId().toString())
  formData.append('description', '')
  try {
    const response = await instance.post(url, formData, {})
    if (response.data.code === 200) {
      return [true, '文件夹重命名成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error renaming folder:', error)
    return [false, '文件夹重命名失败'] as [boolean, string]
  }
}

export const moveFolder = async (
  mode: string,
  fromItemType: string,
  fromId: string,
  toId: string,
): Promise<[boolean, string]> => {
  const url = '/library/move'
  const formData = new FormData()
  formData.append('mode', mode)
  formData.append('fromItemType', fromItemType)
  formData.append('fromId', fromId)
  formData.append('toId', toId)
  try {
    const response = await instance.post(url, formData, {})
    if (response.data.code === 200) {
      return [true, '文件夹移动成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error moving folder:', error)
    return [false, '文件夹移动失败'] as [boolean, string]
  }
}

export const paperData = ref({
  title: '',
  authors: [],
  abstractContent: '',
  keywords: [],
  publishDate: '',
  journal: '',
  volume: '',
  issue: '',
  pages: '',
  type: '',
  source: '',
})

export const analyzePDF = async (pdfFile: File): Promise<[boolean, string]> => {
  const url = '/paper/getPaperData'
  console.log(pdfFile.name)
  const formData = new FormData()
  formData.append('pdfFile', pdfFile)
  formData.append('userId', getUserId().toString())
  try {
    const response = await instance.post(url, formData)
    console.log(response.data)
    if (response.data.code !== 200) {
      console.error('获取论文数据失败:', response.data.msg)
      return [false, '获取论文数据失败'] as [boolean, string]
    }
    paperData.value = response.data.data
    return [true, '获取论文数据成功'] as [boolean, string]
  } catch (error) {
    console.error('Error fetching paper data:', error)
    return [false, '获取论文数据失败'] as [boolean, string]
  }
}

export const uploadFile = async (folderId: string, pdfFile: File): Promise<[boolean, string]> => {
  const url = '/paper/upload'
  const formData = new FormData()
  formData.append('pdfFile', pdfFile)
  formData.append('userId', getUserId().toString())
  formData.append('libraryId', folderId)
  formData.append(
    'paperInfo',
    new Blob([JSON.stringify(paperData.value)], {
      type: 'application/json',
    }),
  )

  try {
    const response = await instance.post(url, formData)
    if (response.data.code === 200) {
      return [true, '文件上传成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return [false, '文件上传失败'] as [boolean, string]
  }
}

export const deleteFile = async (fileId: string): Promise<[boolean, string]> => {
  const url = '/paper/del'
  try {
    const response = await instance.delete(url, {
      params: {
        id: fileId,
        userId: getUserId().toString(),
      },
    })
    console.log(response.data)
    if (response.data.code === 200) {
      return [true, '文件删除成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return [false, '文件删除失败'] as [boolean, string]
  }
}

export const getFileInfo = async (fileId: string): Promise<any> => {
  const url = '/paper/get'
  try {
    const response = await instance.get(url, {
      params: {
        userId: getUserId().toString(),
        id: fileId,
      },
    })
    return response.data.data
  } catch (err) {
    console.error('Error fetching file info:', err)
    return {}
  }
}

export const renameFile = async (fileId: string, newName: string): Promise<[boolean, string]> => {
  const url = '/paper/update'
  const fileInfo = await getFileInfo(fileId)
  fileInfo.name = newName
  const formData = new FormData()
  formData.append('userId', getUserId().toString())
  formData.append('id', fileId)
  formData.append(
    'paperInfo',
    new Blob([JSON.stringify(fileInfo)], {
      type: 'application/json',
    }),
  )
  try {
    const response = await instance.post(url, formData)
    if (response.data.code === 200) {
      return [true, '文件重命名成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  } catch (error) {
    console.error('Error renaming file:', error)
    return [false, '文件重命名失败'] as [boolean, string]
  }
}
