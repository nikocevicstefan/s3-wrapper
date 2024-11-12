# S3 Storage Backend Core

A powerful and type-safe wrapper for AWS S3 operations with support for presigned URLs and advanced permissions management.

## Installation

```bash
npm install @s3-storage/backend-core
# or
pnpm add @s3-storage/backend-core
# or
yarn add @s3-storage/backend-core
```

## Quick Start

```typescript
import { S3StorageClient } from "@s3-storage/backend-core";

const client = new S3StorageClient({
  region: "us-east-1",
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  defaultBucket: "my-bucket",
  endpoint: "https://custom-endpoint", // Optional: for S3-compatible services
  forcePathStyle: true, // Optional: defaults to true
});
```

## Core Operations

### Bucket Management

```typescript
// Check if bucket exists
const exists = await client.checkBucket("my-bucket");

// Create new bucket
await client.createBucket("new-bucket");

// Delete bucket
await client.deleteBucket("old-bucket");
```

### File Operations

```typescript
// Upload file
await client.uploadFile(
  "path/to/file.txt",
  Buffer.from("Hello World"),
  "text/plain"
);

// Download file
const fileContent = await client.downloadFile("path/to/file.txt");

// Delete file
await client.deleteFile("path/to/file.txt");

// List files
const files = await client.listFiles("prefix/");
```

## Presigned URLs

### Upload & Download URLs

```typescript
// Generate upload URL
const uploadUrl = await client.getPresignedUploadUrl(
  "path/to/file.txt",
  3600, // expires in 1 hour
  "text/plain" // optional content type
);

// Generate download URL
const downloadUrl = await client.getPresignedDownloadUrl(
  "path/to/file.txt",
  3600 // expires in 1 hour
);
```

### Advanced Presigned Operations

```typescript
// Generate delete URL
const deleteUrl = await client.getPresignedDeleteUrl("path/to/file.txt", 3600);

// Generate list URL (use with caution)
const listUrl = await client.getPresignedListUrl("prefix/", 3600);
```

## Permissions Management

### File ACL Operations

```typescript
// Update file permissions
await client.updateFilePermissions("path/to/file.txt", "public-read");

// Get file permissions
const permissions = await client.getFilePermissions("path/to/file.txt");

// Generate presigned URL for ACL updates
const aclUrl = await client.getPresignedAclUrl(
  "path/to/file.txt",
  "public-read",
  3600
);
```

Available ACL values:

- `private`
- `public-read`
- `public-read-write`
- `authenticated-read`

## Error Handling

The package includes custom error types for better error handling:

```typescript
import {
  S3StorageError,
  BucketNotFoundError,
  FileNotFoundError,
  UploadError,
} from "@s3-storage/backend-core";

try {
  await client.downloadFile("non-existent.txt");
} catch (error) {
  if (error instanceof FileNotFoundError) {
    console.log("File not found:", error.message);
  } else if (error instanceof S3StorageError) {
    console.log("S3 operation failed:", error.message);
  }
}
```

## Security Considerations

1. **Presigned URLs**
   - Always set appropriate expiration times
   - Use the shortest possible expiration for upload/delete operations
   - Consider implementing additional validation on the server side
   - Restrict content types to avoid security risks

```typescript
// Bad: Long, unrestricted expiration
const unsafeUrl = await client.getPresignedUploadUrl(
  "sensitive-report.pdf",
  30 * 24 * 3600 // 30 days! 🚨
);

// Good: Short, time-limited access
const safeUrl = await client.getPresignedUploadUrl(
  "sensitive-report.pdf",
  3600 // 1 hour expiration
);
```

2. **ACL Operations**

   - Use bucket policies instead of ACLs when possible
   - Be cautious with `public-read-write` permissions
   - Consider implementing role-based access control

```typescript
// Dangerous: Public read/write
await client.updateFilePermissions(
  "customer-data.json",
  "public-read-write" // NEVER DO THIS! 🚨
);

// Safer: Strict access control
await client.updateFilePermissions(
  "customer-data.json",
  "private", // Default to most restrictive
  {
    // Optional: Role-based access
    allowedRoles: ["data-admin", "compliance-officer"],
  }
);
```

3. **List Operations**
   - Avoid exposing bucket listings to unauthorized users
   - Use prefix filtering to limit exposed content
   - Consider implementing pagination for large buckets

```typescript
// Risky: Open listing
const allFiles = await client.listFiles(""); // 🚨 Dangerous!

// Safer: Restricted listing
const restrictedFiles = await client.listFiles("project-x/", {
  maxResults: 100,
  requireAuthentication: true,
  allowedPrefixes: ["project-x/approved/"],
});
```

## TypeScript Support

This package is written in TypeScript and includes type definitions. Configuration types are imported from `@s3-storage/types`:

```typescript
import type { S3ClientConfig } from "@s3-storage/types";

const config: S3ClientConfig = {
  region: "us-east-1",
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  defaultBucket: "my-bucket",
};
```

## Contributing

Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Advanced Security Configuration

### Role-Based Access Control

#### Example Configuration

```typescript
const client = new S3StorageClient({
  // ... basic config ...
  security: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedContentTypes: ["image/jpeg", "image/png", "application/pdf"],
    allowedPrefixes: ["public/", "uploads/"],
    deniedPrefixes: ["private/"],
    roleBasedAccess: {
      roles: {
        admin: {
          allowedOperations: [
            "read",
            "write",
            "delete",
            "list",
            "acl_read",
            "acl_write",
          ],
          allowedPrefixes: ["*"],
          maxFileSize: 100 * 1024 * 1024, // 100MB
        },
        editor: {
          allowedOperations: ["read", "write", "list"],
          allowedPrefixes: ["content/", "uploads/"],
          allowedContentTypes: ["image/jpeg", "image/png"],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        },
        viewer: {
          allowedOperations: ["read", "list"],
          allowedPrefixes: ["public/"],
        },
      },
      defaultRole: "viewer",
    },
  },
});
```

### Using Role-Based Operations

```typescript
// Upload with role validation
await client.uploadFile("uploads/image.jpg", imageBuffer, "image/jpeg", {
  role: "editor",
  metadata: {
    uploadedBy: "user123",
    department: "marketing",
  },
});

// Download with role validation
const file = await client.downloadFile("public/document.pdf", {
  role: "viewer",
});
```

### Security Features

1. **Content Type Restrictions**

   - Whitelist allowed content types
   - Role-specific content type restrictions
   - Prevent upload of potentially dangerous file types

2. **Size Limitations**

   - Global maximum file size
   - Role-specific size limits
   - Prevent denial of service through large files

3. **Prefix Controls**

   - Whitelist allowed prefixes
   - Blacklist denied prefixes
   - Role-specific prefix restrictions

4. **Role-Based Access Control**

   - Define granular permissions per role
   - Operation-level access control
   - Custom limits per role

5. **Metadata Management**
   - Add custom metadata to uploads
   - Track file ownership and attribution
   - Enable audit trails

### Best Practices

```typescript
// Good: Strict role-based upload
await client.uploadFile(
  "uploads/sensitive-doc.pdf",
  documentBuffer,
  "application/pdf",
  {
    role: "editor",
    metadata: {
      classification: "confidential",
      department: "legal",
      uploadedBy: "user123",
      uploadedAt: new Date().toISOString(),
    },
  }
);

// Good: Restricted download
await client.downloadFile("reports/q2-2023.xlsx", {
  role: "analyst",
  metadata: {
    accessReason: "quarterly-review",
    accessedAt: new Date().toISOString(),
  },
});
```
