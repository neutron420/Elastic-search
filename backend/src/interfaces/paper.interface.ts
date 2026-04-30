export interface IResearchPaper {
  id?: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  category: string;
  keywords: string[];
  citationsCount: number;
  price: number;
  language: string;
  journal: string;
  doi: string;
}

export interface SearchQuery {
  q?: string;
  category?: string;
  minCitations?: number;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  sortBy?: 'relevance' | 'date' | 'citations' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
