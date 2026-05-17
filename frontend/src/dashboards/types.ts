import { ReactNode } from 'react';

export interface DashboardProps {
  className?: string;
  children?: ReactNode;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'pharmacist' | 'doctor' | 'patient' | 'registration_staff' | 'lab_staff' | 'admin';
  permissions: string[];
}

export interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

