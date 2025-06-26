import instance from '@/js/axios.ts'
import {getUserId} from '@/js/User.ts'
import {list} from 'postcss'

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

export const sendChatMessage = (content: string, receiverId: number) => {
  const formData = new FormData()
  formData.append('content', content)
  formData.append('senderId', getUserId())
  formData.append('receiverId', receiverId.toString())
  const url = '/message/send'

  instance.post(url, formData, {})
    .then((res) => {
      console.log('Message sent successfully:', res.data)
    })
    .catch((err) => {
      console.error('Error sending message:', err)
    })
}

export const getUnreadCount = async (): Promise<number> => {
  const url = '/message/unread-count'
  try {
    const res = await instance.get(url, {
      params: {
        'userId': getUserId().toString(),
      }
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
        'userId': getUserId().toString(),
        'otherUserId': contactId.toString(),
      }
    })
    return response.data[0] || {}
  }
  catch (error) {
    console.error('获取特定联系人失败:', error)
    return {}
  }
}
