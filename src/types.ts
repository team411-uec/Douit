export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface TermFragment extends BaseEntity {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isTemplate: boolean;
  templateParams: string[];
  currentVersion: number;
  createdBy: string;
}

export interface FragmentRef {
  fragmentId: string;
  order: number;
  parameterValues: Record<string, string>;
}

export interface TermSet extends BaseEntity {
  title: string;
  description?: string;
  userId: string;
  currentVersion: number;
}

export interface User {
  name: string;
  email: string;
  icon?: string;
  role: string;
  team?: string;
  createdAt: Date;
}

export interface UnderstoodRecord extends BaseEntity {
  userId: string;
  fragmentId: string;
  acceptanceLevel: number;
}

export interface UseFragmentDetailResult {
  fragment: TermFragment | null;
  isLoading: boolean;
  isUnderstood: boolean;
  error: string | null;
  handleUnderstandingChange: (understood: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
}
