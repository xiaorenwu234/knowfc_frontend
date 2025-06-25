import instance from '@/js/axios.ts'
import { getUserId } from '@/js/User.ts'
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

export const getChatDetail = async (chatId: number): Promise<{ content: string; isMe: boolean }[]> => {
  const url = '/message/chat';
  try {
    const res = await instance.get(url, {
      params: {
        userId1: 1,
        userId2: 2,
        page:0,
        size:100
      },
    });
    console.log(res.data.data.content)
    return res.data.data.content.map((item: { senderId: number; content: string }) => ({
      ...item,
      isMe: item.senderId === getUserId(),
    }));
  } catch (err) {
    console.error('Error fetching chat detail:', err);
    return [];
  }
};
