import instance from '@/ts/axios.ts'
import { getUserId } from '@/ts/User.ts'
import { list } from 'postcss'

export const getChatList = async (): Promise<any[]> => {
  const url = '/message/chat-list'
  try {
    const res = await instance.get(url, {
      params: {
        userId: getUserId(),
      },
    })
    return res.data.data || []
  } catch (err) {
    console.error('获取聊天列表失败:', err)
    return []
  }
}

export const getChatDetail = async (
  chatId: number,
): Promise<{ content: string; isMe: boolean }[]> => {
  const url = '/message/chat'
  try {
    const res = await instance.get(url, {
      params: {
        userId1: getUserId(),
        userId2: chatId.toString(),
        page: 0,
        size: 100,
      },
    })
    console.log(res.data.data.content)
    return res.data.data.content.map((item: { senderId: number; content: string }) => ({
      ...item,
      isMe: item.senderId === getUserId(),
    }))
  } catch (err) {
    console.error('Error fetching chat detail:', err)
    return []
  }
}

export const readMessages = (receiverId: number, senderId: number) => {
  const url = '/message/mark-read'
  const formData = new FormData()
  formData.append('receiverId', receiverId.toString())
  formData.append('senderId', senderId.toString())
  instance
    .post(url, formData, {})
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.error('Error marking messages as read:', err)
    })
}

export const sendChatMessage = async (
  content: string,
  receiverId: number,
): Promise<[boolean, string]> => {
  const formData = new FormData()
  formData.append('content', content)
  formData.append('senderId', getUserId())
  formData.append('receiverId', receiverId.toString())
  const url = '/message/send'

  try {
    const res = await instance.post(url, formData, {})
    if (res.data.code === 200) {
      return [true, '消息发送成功']
    }
    return [false, res.data.msg]
  } catch (err) {
    console.error('Error sending message:', err)
    return [false, '消息发送失败']
  }
}

export const getUnreadCount = async (): Promise<number> => {
  const url = '/message/unread-count'
  try {
    const res = await instance.get(url, {
      params: {
        userId: getUserId().toString(),
      },
    })
    return res.data.data || 0
  } catch (err) {
    console.error('获取未读消息数量失败:', err)
    return 0
  }
}

export const getSpecificContact = async (contactId: number): Promise<any> => {
  const url = '/message/chat-with-user'

  console.log(getUserId().toString())
  console.log(contactId.toString())

  try {
    const response = await instance.get(url, {
      params: {
        userId: getUserId(),
        otherUserId: contactId,
      },
    })
    console.log(response.data.data)
    return response.data.data[0] || {}
  } catch (error) {
    console.error('获取特定联系人失败:', error)
    return {}
  }
}
