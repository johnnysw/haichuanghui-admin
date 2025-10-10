export interface EventRegistrationQuery {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  phone?: string;
}

export interface EventRegistrationItem {
  id: number;
  eventId: number;
  userId: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  notes?: string;
  status: number;
  checkIn?: boolean;
  checkInTime?: string;
  createdTime: string;
  updatedTime?: string;
}

export interface EventRegistrationListResponse {
  list: EventRegistrationItem[];
  total: number;
  pageSize: number;
  currentPage: number;
}

export interface EventRegistrationDetail extends EventRegistrationItem {
  notes?: string;
  user?: {
    id: number;
    username: string;
    email?: string;
    phone?: string;
  } | null;
}

