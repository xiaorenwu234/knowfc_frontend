import instance from '@/js/axios.ts'

export interface Work {
  id: string;
  title: string;
  authors: Author[];
  fields: string[];
  keywords: string[];
  abstract: string;
  date: string;
  type: 'arxiv';
  source: string;
  likes: number;
  comments: Comment[];
  pdf_url: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: Author;
}

interface Author {
  id: number;
  name: string;
}

interface APIResponseList {
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
      pdf_url: string;
    }>;
  };
}


interface APIResponse {
  code: number;
  msg: string;
  data: {
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
    pdf_url: string;
  };
}


export async function searchWorks(title: string): Promise<Work[]> {
  try {
    const { data } = await instance.get<APIResponseList>('/works/search', {
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
      date: item.publish_date,
      type: 'arxiv',
      source: item.source || '',
      likes: item.likes,
      comments: item.comments,
      pdf_url: item.pdf_url
    }));
  } catch (error) {
    console.error('Error fetching works:', error);
    throw error;
  }
}

export async function getWorkDetail(id: string): Promise<Work> {
  try {
    const { data } = await instance.get<APIResponse>('/works/content', {
      params: {
        id
      }
    });

    if (data.code !== 200) {
      throw new Error(`API Error: ${data.msg}`);
    }

    const item = data.data;
    return {
      id: item.id.toString(),
      title: item.title,
      authors: item.authors,
      fields: item.fields.map(f => f.name),
      keywords: item.keywords || [],
      abstract: item.abstractContent,
      date: item.publish_date,
      type: 'arxiv',
      source: item.source || '',
      likes: item.likes,
      comments: item.comments,
      pdf_url: item.pdf_url
    };
  } catch (error) {
    console.error('Error fetching work detail:', error);
    throw error;
  }
}
