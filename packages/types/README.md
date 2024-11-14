# S3 Wrapper Types Package

## Overview

The `s3-types` package provides a comprehensive set of TypeScript interfaces and types that define the structure and behavior of an S3 storage client. This package is designed to be used in conjunction with an S3 client implementation, ensuring type safety and consistency across your application.

## Installation

To install the package, use your preferred package manager:

```bash
npm install @obelius/s3-types
```

or

```bash
yarn add @obelius/s3-types
```

## Usage

This package exports various types and interfaces that can be used to define the configuration, operations, and responses for an S3 storage client. Below is a brief overview of the main types and interfaces provided by this package.

### Config Types

#### `S3Config`

Defines the configuration options for an S3 client.

```typescript
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
```

### Error Types

#### `StorageError`

A custom error class that extends the built-in `Error` class, used to represent errors specific to storage operations.

```typescript
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "StorageError";
  }
}
```

### Client Interface

#### `StorageClient`

Defines the interface for an S3 storage client, including methods for uploading, downloading, deleting, listing, and managing permissions for files.

```typescript
export interface StorageClient {
  upload(
    file: File | Buffer | Blob,
    key: string,
    options?: UploadOptions,
  ): Promise<UploadResult>;
  download(key: string, options?: DownloadOptions): Promise<DownloadResult>;
  delete(key: string): Promise<void>;
  list(options?: ListOptions): Promise<ListResult>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  getPermission(key: string): Promise<StoragePermission>;
  setPermission(key: string, options: PermissionOptions): Promise<void>;
}
```

### Storage Types

#### `StorageFile`

Represents a file stored in S3, including metadata such as the key, size, last modified date, content type, and permission.

```typescript
export interface StorageFile {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
  etag?: string;
  permission?: StoragePermission;
}
```

#### `UploadOptions`

Options for uploading a file to S3, including content type, metadata, tagging, ACL, and progress callbacks.

```typescript
export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  tagging?: Record<string, string>;
  acl?: StoragePermission;
  onProgress?: (progress: number) => void;
}
```

#### `UploadResult`

The result of an upload operation, including the key, ETag, and location of the uploaded file.

```typescript
export interface UploadResult {
  key: string;
  etag: string;
  location: string;
}
```

#### `DownloadOptions`

Options for downloading a file from S3, including response type and progress callbacks.

```typescript
export interface DownloadOptions {
  responseType?: "blob" | "arraybuffer" | "stream";
  onProgress?: (progress: number) => void;
}
```

#### `DownloadResult`

The result of a download operation, including the data, metadata, and content type.

```typescript
export interface DownloadResult {
  data: Blob | ArrayBuffer | ReadableStream;
  metadata?: Record<string, string>;
  contentType?: string;
}
```

#### `ListOptions`

Options for listing files in S3, including prefix, max keys, delimiter, and continuation token.

```typescript
export interface ListOptions {
  prefix?: string;
  maxKeys?: number;
  delimiter?: string;
  continuationToken?: string;
}
```

#### `ListResult`

The result of a list operation, including the list of files, prefixes, and pagination information.

```typescript
export interface ListResult {
  files: StorageFile[];
  prefixes: string[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}
```

#### `StoragePermission`

Defines the possible permissions for a file in S3.

```typescript
export type StoragePermission = "private" | "public-read" | "public-read-write";
```

#### `PermissionOptions`

Options for setting the permission of a file in S3.

```typescript
export interface PermissionOptions {
  acl: StoragePermission;
}
```

### Security Types

#### `S3ClientConfig`

Defines the configuration options for an S3 client, including security settings.

```typescript
export interface S3ClientConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  defaultBucket: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  security?: S3SecurityConfig;
}
```

#### `S3SecurityConfig`

Defines security configuration options for an S3 client, including file size limits, allowed content types, and role-based access control.

```typescript
export interface S3SecurityConfig {
  maxFileSize?: number; // in bytes
  allowedContentTypes?: string[];
  allowedPrefixes?: string[];
  deniedPrefixes?: string[];
  roleBasedAccess?: RoleBasedAccessConfig;
}
```

#### `RoleBasedAccessConfig`

Defines role-based access control configuration, including roles and their permissions.

```typescript
export interface RoleBasedAccessConfig {
  roles: Record<string, RolePermissions>;
  defaultRole?: string;
}
```

#### `RolePermissions`

Defines the permissions for a specific role, including allowed operations, prefixes, file size limits,

```typescript
export interface RolePermissions {
  allowedOperations: S3Operation[];
  allowedPrefixes?: string[];
  maxFileSize?: number;
  allowedContentTypes?: string[];
}
```

#### `S3Operation`

Defines the possible operations that can be performed on an S3 file.

```typescript
export type S3Operation =
  | "read"
  | "write"
  | "delete"
  | "list"
  | "acl_read"
  | "acl_write"
  | "presigned_upload"
  | "presigned_download"
  | "presigned_delete"
  | "presigned_list";
```

#### `OperationOptions`

Options for performing an operation on an S3 file, including role, content type, content length, and metadata.

```typescript
export interface OperationOptions {
  role?: string;
  contentType?: string;
  contentLength?: number;
  metadata?: Record<string, string>;
}
```

#### `PresignedUrlOptions`

Base options for generating a presigned URL, including bucket, role, and metadata.

```typescript
export interface PresignedUrlOptions {
  bucket?: string;
  role?: string;
  metadata?: Record<string, string>;
}
```

#### `PresignedUploadUrlOptions`

Options for generating a presigned upload URL, including content type and maximum file size.

```typescript
export interface PresignedUploadUrlOptions extends PresignedUrlOptions {
  contentType?: string;
  maxSize?: number;
}
```

#### `PresignedDownloadUrlOptions`

Options for generating a presigned download URL, including response content type and disposition.

```typescript
export interface PresignedDownloadUrlOptions extends PresignedUrlOptions {
  responseContentType?: string;
  responseContentDisposition?: string;
}
```

#### `PresignedListUrlOptions`

Options for generating a presigned list URL, including maximum keys and delimiter.

```typescript
export interface PresignedListUrlOptions extends PresignedUrlOptions {
  maxKeys?: number;
  delimiter?: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
