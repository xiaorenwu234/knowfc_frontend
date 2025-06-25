import instance from '@/js/axios.ts'

export interface Work {
  id: string;
  title: string;
  authors: Author[];
  fields: string[];
  keywords: string[];
  abstract: string;
  date: Date;
  type: 'arxiv';
  source: string;
  likes: number;
  comments: number;
}

interface Author {
  id: number;
  name: string;
}

interface APIResponse {
  code: number;
  msg: string;
  data: {
    content: Array<{
      id: number;
      title: string;
      authors: Author[];
      fields: Array<{ id: number; name: string }>;
      keywords: string[] | null;
      abstractContent: string;
      publish_date: string;
      type: string;
      source: string | null;
      likes: number;
      comments: any[];
    }>;
  };
}

export async function searchWorks(title: string): Promise<Work[]> {
  try {
    const { data } = await instance.get<APIResponse>('/works/search', {
      params: {
        title
      }
    });
    
    if (data.code !== 200) {
      throw new Error(`API Error: ${data.msg}`);
    }

    return data.data.content.map(item => ({
      id: item.id.toString(),
      title: item.title,
      authors: item.authors,
      fields: item.fields.map(f => f.name),
      keywords: item.keywords || [],
      abstract: item.abstractContent,
      date: new Date(item.publish_date),
      type: 'arxiv',
      source: item.source || '',
      likes: item.likes,
      comments: item.comments.length
    }));
  } catch (error) {
    console.error('Error fetching works:', error);
    throw error;
  }
}
