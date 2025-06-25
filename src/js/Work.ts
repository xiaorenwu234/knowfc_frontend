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
interface Author{
  id:number;
  name:string;
}
