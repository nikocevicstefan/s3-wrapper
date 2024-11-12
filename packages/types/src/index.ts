// ============================================================================
// Config Types
// ============================================================================

export interface S3Config {
  region: string;
  bucket: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
  forcePathStyle?: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "StorageError";
  }
}

// ============================================================================
// Client Interface
// ============================================================================

export interface StorageClient {
  upload(
    file: File | Buffer | Blob,
    key: string,
    options?: UploadOptions
  ): Promise<UploadResult>;
  download(key: string, options?: DownloadOptions): Promise<DownloadResult>;
  delete(key: string): Promise<void>;
  list(options?: ListOptions): Promise<ListResult>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  getPermission(key: string): Promise<StoragePermission>;
  setPermission(key: string, options: PermissionOptions): Promise<void>;
}

// ============================================================================
// Storage Types
// ============================================================================

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

export interface S3ClientConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  defaultBucket: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  security?: S3SecurityConfig;
}

export interface S3SecurityConfig {
  maxFileSize?: number; // in bytes
  allowedContentTypes?: string[];
  allowedPrefixes?: string[];
  deniedPrefixes?: string[];
  roleBasedAccess?: RoleBasedAccessConfig;
}

export interface RoleBasedAccessConfig {
  roles: Record<string, RolePermissions>;
  defaultRole?: string;
}

export interface RolePermissions {
  allowedOperations: S3Operation[];
  allowedPrefixes?: string[];
  maxFileSize?: number;
  allowedContentTypes?: string[];
}

export type S3Operation = 
  | 'read'
  | 'write'
  | 'delete'
  | 'list'
  | 'acl_read'
  | 'acl_write'
  | 'presigned_upload'
  | 'presigned_download'
  | 'presigned_delete'
  | 'presigned_list';

export interface OperationOptions {
  role?: string;
  contentType?: string;
  contentLength?: number;
  metadata?: Record<string, string>;
}

export interface PresignedUrlOptions {
  bucket?: string;
  role?: string;
  metadata?: Record<string, string>;
}

export interface PresignedUploadUrlOptions extends PresignedUrlOptions {
  contentType?: string;
  maxSize?: number;
}

export interface PresignedDownloadUrlOptions extends PresignedUrlOptions {
  responseContentType?: string;
  responseContentDisposition?: string;
}

export interface PresignedListUrlOptions extends PresignedUrlOptions {
  maxKeys?: number;
  delimiter?: string;
}
