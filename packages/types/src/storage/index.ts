export interface StorageFile {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
  etag?: string;
  permission?: StoragePermission;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  tagging?: Record<string, string>;
  acl?: StoragePermission;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  key: string;
  etag: string;
  location: string;
}

export interface DownloadOptions {
  responseType?: "blob" | "arraybuffer" | "stream";
  onProgress?: (progress: number) => void;
}

export interface DownloadResult {
  data: Blob | ArrayBuffer | ReadableStream;
  metadata?: Record<string, string>;
  contentType?: string;
}

export interface ListOptions {
  prefix?: string;
  maxKeys?: number;
  delimiter?: string;
  continuationToken?: string;
}

export interface ListResult {
  files: StorageFile[];
  prefixes: string[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

export type StoragePermission = "private" | "public-read" | "public-read-write";

export interface PermissionOptions {
  acl: StoragePermission;
} 