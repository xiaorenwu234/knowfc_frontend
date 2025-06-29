import instance from '@/ts/axios.ts'
import { getUserId } from '@/ts/User.ts'

export const getChildrenFolders = async (uuid: string = ''): Promise<any> => {
  console.log('uuid:', uuid)
  const url = '/library/get'
  try {
    const response = await instance.get(url, {
      params: {
        userId: getUserId().toString(),
        id: uuid,
      },
    })
    console.log(response.data.data.items)
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
    console.log(response.data)
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
    console.log(response.data)
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
    console.log(response.data)
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
  console.log('move folder:', mode, fromId, toId)
  const url = '/library/move'
  const formData = new FormData()
  formData.append('mode', mode)
  formData.append('fromItemType', fromItemType)
  formData.append('fromId', fromId)
  formData.append('toId', toId)
  try{
    const response = await instance.post(url, formData, {})
    console.log(response.data)
    if (response.data.code === 200) {
      return [true, '文件夹移动成功'] as [boolean, string]
    } else {
      return [false, response.data.msg] as [boolean, string]
    }
  }
  catch (error) {
    console.error('Error moving folder:', error)
    return [false, '文件夹移动失败'] as [boolean, string]
  }
}
