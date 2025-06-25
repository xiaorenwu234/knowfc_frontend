export interface Work {
  id: string;
  title: string;
  authors: string[];
  fields: string[];
  keywords: string[];
  abstract: string;
  date: Date;
  type: 'arxiv';
  source: string;
  likes: number;
  comments: number;
}
