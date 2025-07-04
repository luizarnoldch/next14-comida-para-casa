export type SocialDetail = {
  id_detail: string;
  url: string;
  socialPlatform: string;
  manual_description?: string | null;
  id_job?: string;
};

export type SocialStats = {
  totalLinks: number;
  tiktok: number;
  instagram: number;
  facebook: number;
  other: number;
  details: SocialDetail[];
};

export type EmpresaSummary = {
  empresa: string;
  stats: SocialStats;
  id_job: string;
};
