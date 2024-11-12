import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsV2Command,
  PutObjectAclCommand,
  GetObjectAclCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  S3ClientConfig,
  S3SecurityConfig,
  OperationOptions,
  S3Operation,
} from "@obelius/s3-types";

export class S3StorageClient {
  private client: S3Client;
  private defaultBucket: string;
  private security?: S3SecurityConfig;

  constructor(config: S3ClientConfig) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle ?? true,
    });
    this.defaultBucket = config.defaultBucket;
    this.security = config.security;
  }

  /**
   * Checks if a bucket exists and is accessible
   */
  async checkBucket(bucket?: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadBucketCommand({ Bucket: bucket || this.defaultBucket })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a new bucket
   */
  async createBucket(bucket?: string): Promise<void> {
    await this.client.send(
      new CreateBucketCommand({ Bucket: bucket || this.defaultBucket })
    );
  }

  /**
   * Deletes a bucket
   */
  async deleteBucket(bucket?: string): Promise<void> {
    await this.client.send(
      new DeleteBucketCommand({ Bucket: bucket || this.defaultBucket })
    );
  }

  /**
   * Validates an operation against security configuration
   */
  private validateOperation(
    operation: S3Operation,
    key: string,
    options?: OperationOptions
  ): void {
    if (!this.security) return;

    // Validate content type
    if (
      options?.contentType &&
      this.security.allowedContentTypes?.length &&
      !this.security.allowedContentTypes.includes(options.contentType)
    ) {
      throw new Error(`Content type ${options.contentType} is not allowed`);
    }

    // Validate file size
    if (
      options?.contentLength &&
      this.security.maxFileSize &&
      options.contentLength > this.security.maxFileSize
    ) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.security.maxFileSize} bytes`
      );
    }

    // Validate prefix restrictions
    if (this.security.allowedPrefixes?.length) {
      const hasAllowedPrefix = this.security.allowedPrefixes.some(
        (prefix: string) => key.startsWith(prefix)
      );
      if (!hasAllowedPrefix) {
        throw new Error(`Access to prefix in key ${key} is not allowed`);
      }
    }

    if (this.security.deniedPrefixes?.length) {
      const hasDeniedPrefix = this.security.deniedPrefixes.some(
        (prefix: string) => key.startsWith(prefix)
      );
      if (hasDeniedPrefix) {
        throw new Error(`Access to prefix in key ${key} is denied`);
      }
    }

    // Validate role-based access
    if (options?.role && this.security.roleBasedAccess) {
      const roleConfig = this.security.roleBasedAccess.roles[options.role];
      if (!roleConfig) {
        throw new Error(`Role ${options.role} is not configured`);
      }

      if (!roleConfig.allowedOperations.includes(operation)) {
        throw new Error(
          `Operation ${operation} is not allowed for role ${options.role}`
        );
      }

      if (
        roleConfig.allowedPrefixes?.length &&
        !roleConfig.allowedPrefixes.some((prefix) => key.startsWith(prefix))
      ) {
        throw new Error(
          `Access to key ${key} is not allowed for role ${options.role}`
        );
      }

      if (
        options.contentType &&
        roleConfig.allowedContentTypes?.length &&
        !roleConfig.allowedContentTypes.includes(options.contentType)
      ) {
        throw new Error(
          `Content type ${options.contentType} is not allowed for role ${options.role}`
        );
      }

      if (
        options.contentLength &&
        roleConfig.maxFileSize &&
        options.contentLength > roleConfig.maxFileSize
      ) {
        throw new Error(
          `File size exceeds maximum allowed size for role ${options.role}`
        );
      }
    }
  }

  /**
   * Enhanced uploadFile with security validations
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
    options?: OperationOptions & { bucket?: string }
  ): Promise<void> {
    this.validateOperation("write", key, {
      ...options,
      contentType,
      contentLength: Buffer.byteLength(body as any),
    });

    await this.client.send(
      new PutObjectCommand({
        Bucket: options?.bucket || this.defaultBucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: options?.metadata,
      })
    );
  }

  /**
   * Enhanced downloadFile with security validations
   */
  async downloadFile(
    key: string,
    options?: OperationOptions & { bucket?: string }
  ): Promise<Buffer> {
    this.validateOperation("read", key, options);

    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: options?.bucket || this.defaultBucket,
        Key: key,
      })
    );

    return Buffer.from(await response.Body!.transformToByteArray());
  }

  /**
   * Deletes a file from S3
   */
  async deleteFile(key: string, bucket?: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket || this.defaultBucket,
        Key: key,
      })
    );
  }

  /**
   * Lists files in a bucket
   */
  async listFiles(prefix?: string, bucket?: string) {
    const response = await this.client.send(
      new ListObjectsV2Command({
        Bucket: bucket || this.defaultBucket,
        Prefix: prefix,
      })
    );

    return response.Contents || [];
  }

  /**
   * Generates a presigned URL for file upload with security validations
   */
  async getPresignedUploadUrl(
    key: string,
    expiresIn: number = 3600,
    options?: {
      contentType?: string;
      bucket?: string;
      role?: string;
      maxSize?: number;
      metadata?: Record<string, string>;
    }
  ): Promise<string> {
    // Validate operation before generating URL
    this.validateOperation("write", key, {
      role: options?.role,
      contentType: options?.contentType,
      contentLength: options?.maxSize,
    });

    // Enforce reasonable expiration limits
    const maxExpiration = 24 * 3600; // 24 hours
    if (expiresIn > maxExpiration) {
      throw new Error(`Expiration time cannot exceed ${maxExpiration} seconds`);
    }

    const command = new PutObjectCommand({
      Bucket: options?.bucket || this.defaultBucket,
      Key: key,
      ContentType: options?.contentType,
      Metadata: options?.metadata,
    });

    // Note: Content-Type can be enforced via ContentType parameter,
    // but content-length cannot be enforced in presigned URLs.
    // These should be validated on the client side before upload.

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generates a presigned URL for file download with security validations
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
    options?: {
      bucket?: string;
      role?: string;
      responseContentType?: string;
      responseContentDisposition?: string;
    }
  ): Promise<string> {
    // Validate operation before generating URL
    this.validateOperation("read", key, {
      role: options?.role,
    });

    const command = new GetObjectCommand({
      Bucket: options?.bucket || this.defaultBucket,
      Key: key,
      ResponseContentType: options?.responseContentType,
      ResponseContentDisposition: options?.responseContentDisposition,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generates a presigned URL for deleting a file with security validations
   */
  async getPresignedDeleteUrl(
    key: string,
    expiresIn: number = 3600,
    options?: {
      bucket?: string;
      role?: string;
    }
  ): Promise<string> {
    // Validate operation before generating URL
    this.validateOperation("delete", key, {
      role: options?.role,
    });

    // Enforce short expiration for delete operations
    const maxDeleteExpiration = 3600; // 1 hour
    if (expiresIn > maxDeleteExpiration) {
      throw new Error(
        `Delete URL expiration cannot exceed ${maxDeleteExpiration} seconds`
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: options?.bucket || this.defaultBucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generates a presigned URL for listing objects with security validations
   */
  async getPresignedListUrl(
    prefix: string,
    expiresIn: number = 3600,
    options?: {
      bucket?: string;
      role?: string;
      maxKeys?: number;
      delimiter?: string;
    }
  ): Promise<string> {
    // Validate operation before generating URL
    this.validateOperation("list", prefix, {
      role: options?.role,
    });

    const command = new ListObjectsV2Command({
      Bucket: options?.bucket || this.defaultBucket,
      Prefix: prefix,
      MaxKeys: options?.maxKeys || 1000,
      Delimiter: options?.delimiter,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Updates file ACL permissions
   */
  async updateFilePermissions(
    key: string,
    acl: "private" | "public-read" | "public-read-write" | "authenticated-read",
    bucket?: string
  ): Promise<void> {
    await this.client.send(
      new PutObjectAclCommand({
        Bucket: bucket || this.defaultBucket,
        Key: key,
        ACL: acl,
      })
    );
  }

  /**
   * Generates a presigned URL for updating file permissions
   */
  async getPresignedAclUrl(
    key: string,
    acl: "private" | "public-read" | "public-read-write" | "authenticated-read",
    expiresIn: number = 3600,
    options?: {
      bucket?: string;
      role?: string;
    }
  ): Promise<string> {
    // Validate operation before generating URL
    this.validateOperation("acl_write", key, {
      role: options?.role,
    });

    // Enforce short expiration for ACL operations
    const maxAclExpiration = 3600; // 1 hour
    if (expiresIn > maxAclExpiration) {
      throw new Error(
        `ACL URL expiration cannot exceed ${maxAclExpiration} seconds`
      );
    }

    const command = new PutObjectAclCommand({
      Bucket: options?.bucket || this.defaultBucket,
      Key: key,
      ACL: acl,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Gets file permissions
   */
  async getFilePermissions(key: string, bucket?: string) {
    const response = await this.client.send(
      new GetObjectAclCommand({
        Bucket: bucket || this.defaultBucket,
        Key: key,
      })
    );
    return response.Grants;
  }
}
