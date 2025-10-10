export interface EventQueryParams {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  eventTypeId?: string;
  regionId?: string;
  status?: string;
}

export interface EventForm {
  id?: number;
  title: string;
  organizer: string;
  eventTypeId?: number | null;
  regionId?: number | null;
  coOrganizers?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  location?: string;
  onlineUrl?: string;
  description?: string;
  summary?: string;
  schedule?: string;
  faq?: string;
  contactInfo?: string;
  maxParticipants?: number | null;
  registrationFee?: number | null;
  priceNote?: string;
  status: number;
  poster?: string;
  tags?: string[];
  highlights?: any[];
  isRecommended?: boolean;
}

export interface EventInfo extends EventForm {
  id: number;
  registrationCount?: number;
  isFull?: boolean;  // 是否已满
  displayStatus?: string;  // 派生状态
  viewCount?: number;
  createdTime?: string;
  updatedTime?: string;
  eventType?: OptionItem | null;
  region?: OptionItem | null;
}

export interface EventListResponse {
  list: EventInfo[];
  total: number;
  pageSize: number;
  currentPage: number;
}

export interface OptionItem {
  id: number;
  name: string;
}

export interface EventDrawerSubmitPayload {
  data: EventForm;
  mode: "create" | "edit";
}

