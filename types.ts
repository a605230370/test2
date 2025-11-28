export type Region = 'global' | 'china';
export type Category = 'tech' | 'business' | 'creators';

export interface TrendItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  score?: number; // Calculated relevance score
  platform?: string; // e.g., "YouTube", "WeChat"
  url?: string; // Link to the source
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface FetchResult {
  trends: TrendItem[];
  sources: GroundingSource[];
  rawText: string;
}

export const USER_KNOWLEDGE_BASE_URL = 'https://aozalj10qx.feishu.cn/wiki/B5Low8Kc5ilfVRkE0cKcUv0EnAf?table=tbl8p6f9tqcBxEMH&view=vewNoB8yWC';

export const CATEGORIES: { id: Category; label: string; icon: string; promptDesc: string }[] = [
  { 
    id: 'tech', 
    label: '行业新技术', 
    icon: '🚀',
    promptDesc: 'latest AI technology breakthroughs, research papers, model releases, and dev tools' 
  },
  { 
    id: 'business', 
    label: '商业案例', 
    icon: '💼',
    promptDesc: 'successful AI implementation case studies in companies, startups, and enterprise solutions' 
  },
  { 
    id: 'creators', 
    label: 'UP主/博主推荐', 
    icon: '🎥',
    promptDesc: 'popular opinions, tutorials, or reviews from top AI influencers, YouTubers, or tech bloggers' 
  },
];

export const REGIONS: { id: Region; label: string; icon: string }[] = [
  { id: 'china', label: '国内平台 (China)', icon: '🇨🇳' },
  { id: 'global', label: '国际视野 (Global)', icon: '🌍' },
];