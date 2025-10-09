export interface OffshoreIndustry {
  id: number;
  name: string;
  code?: string;
}

export interface OffshoreCenterBase {
  id: number;
  name: string;
  logo?: string;
  regionId?: number;
  region?: {
    id: number;
    name: string;
    code?: string;
    regionType?: string;
  } | null;
  centerTypeId?: number;
  centerType?: {
    id: number;
    name: string;
    code?: string;
    description?: string;
    color?: string;
  } | null;
  country?: string;
  city?: string;
  address?: string;
  description?: string;
  introduction?: string;
  environment?: string;
  successCasesDetail?: string;
  internationalServices?: string;
  resourceAdvantages?: string;
  area?: string;
  establishedYear?: number;
  serviceCount?: number;
  successCases?: number;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  isRecommended?: boolean;
  status?: number;
  rating?: number;
  reviewComment?: string;
  reviewTime?: string;
  viewCount?: number;
  createdTime?: string;
  updatedTime?: string;
  industryIds?: number[];
  industries?: OffshoreIndustry[];
}

export type OffshoreCenterItem = OffshoreCenterBase;

export type OffshoreCenterDetail = OffshoreCenterBase & {
  favorites?: number;
  totalViews?: number;
};

export interface OffshoreQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  regionId?: number | string;
  centerTypeId?: number | string;
  status?: number | string;
  isRecommended?: number | string;
  sortBy?: string;
  sortOrder?: string;
}

export interface OffshoreSubmitPayload {
  name: string;
  logo?: string;
  regionId?: number;
  centerTypeId?: number;
  country?: string;
  city?: string;
  address?: string;
  description?: string;
  introduction?: string;
  environment?: string;
  successCasesDetail?: string;
  internationalServices?: string;
  resourceAdvantages?: string;
  area?: string;
  establishedYear?: number;
  serviceCount?: number;
  successCases?: number;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  isRecommended?: boolean;
  status?: number;
  rating?: number;
  reviewComment?: string;
  reviewTime?: string;
  viewCount?: number;
  industryIds?: number[];
}

export interface OffshoreStats {
  todayViews: number;
  totalViews: number;
  monthlyViews: number;
  applications: number;
  favorites: number;
}
