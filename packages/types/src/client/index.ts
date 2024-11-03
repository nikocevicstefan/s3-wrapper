import type {
  UploadOptions,
  UploadResult,
  DownloadOptions,
  DownloadResult,
  ListOptions,
  ListResult,
  PermissionOptions,
  StoragePermission
} from '../storage';

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
  
  // New methods for permission management
  getPermission(key: string): Promise<StoragePermission>;
  setPermission(key: string, options: PermissionOptions): Promise<void>;
} 