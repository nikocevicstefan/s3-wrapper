export class S3StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'S3StorageError';
  }
}

export class BucketNotFoundError extends S3StorageError {
  constructor(bucket: string) {
    super(`Bucket "${bucket}" not found`);
    this.name = 'BucketNotFoundError';
  }
}

export class FileNotFoundError extends S3StorageError {
  constructor(key: string) {
    super(`File "${key}" not found`);
    this.name = 'FileNotFoundError';
  }
}

export class UploadError extends S3StorageError {
  constructor(message: string) {
    super(`Upload failed: ${message}`);
    this.name = 'UploadError';
  }
} 