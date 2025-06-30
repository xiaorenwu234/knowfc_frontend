import instance from '@/ts/axios.ts'

export const fetchWorkAbstract = async (workId: string): Promise<string> => {
  const url = `/ai/article/summary/${workId}`
  const response = await instance.fetch(url)
  if (response.data.code === 200) {
    return response.data.data
  } else {
    console.error(response.data.message)
  }
}
