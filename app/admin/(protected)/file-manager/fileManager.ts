// types/fileManager.ts
export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
  fileType?: string;
  slug?: string;
  itemCount?: number;
  type?: string;
  filePath?: string;
  id?: number;
  caption?: string | null;
  title?: string;
}

export interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FileManagerState {
  currentPath: string;
  items: FileItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  viewMode: "grid" | "table";
  pagination: PaginationInfo | null;
}
