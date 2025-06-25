import instance from "@/js/axios.ts";

export const getArticleContent = async (articleId: string): Promise<string> => {
  const url = '/works/content'

  try{
    const response = await instance.get(url, {
      params:{
        'id': articleId
      }
    })
    return response.data.data;
  }
  catch(err){
    console.error('获取文章内容失败:', err);
    return '';
  }
}
