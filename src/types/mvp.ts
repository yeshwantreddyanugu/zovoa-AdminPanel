
export interface MvpFormDto {
  requestId: string;
  id:number;
  title: string;
  type: string;
  description: string;
  targetAudience: string;
  platform: string;
  prompt: string;
  contactEmail: string;
  contactPhone: string;
  price: number;
  isPaid: boolean;
  assignedTo: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Submitted' | 'In Progress' | 'Completed';
  progress: number;
  estimatedCompletion: string | null;
  nextMilestone: string | null;
  demoUrl: string | null;
  live_url: string | null;
  pdfUrl: string | null;
  createdAt: string;
  lastUpdated: string;
  milestones: Milestone[];
  activities: Activity[];
  files: FileAttachment[];
}

export interface Milestone {
  id?: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
}

export interface Activity {
  id?: string;
  message: string;
  timestamp: string;
}

export interface FileAttachment {
  filename: string;
  url: string;
}

export interface MvpApiResponse {
  data: MvpFormDto[];
  total: number;
  page: number;
  size: number;
}

export interface ApiFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  isPaid?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}


export interface ThreeDWebsiteTemplet {
  id: number;
  title: string;
  description: string;
  modelUrl: string;
  demoUrl: string;
  tags: string;
  price: number;
  brandNicheId: string;
  createdAt: string;
}

export interface ThreeDWebsiteForm {
  id: number;
  website_id: number;
  uid: string;
  name: string;
  number: string;
  email: string;
  templet_id: string;
  createdAt: string;
}

export interface CreateThreeDTemplateRequest {
  title: string;
  description: string;
  modelUrl: string;
  demoUrl: string;
  tags: string;
  price: number;
  brandNicheId: string;
}

export interface PaginationResponse<T> {
  content: T[];
  number: number;       // current page number
  size: number;         // page size
  totalElements: number; // total items
  totalPages: number;    // total pages
}
