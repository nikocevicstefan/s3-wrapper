# S3 Wrapper - TypeScript Types

## Overview

This package provides a comprehensive set of TypeScript types and interfaces for interacting with an S3-compatible storage service. It is designed to be used in conjunction with an S3 client library, offering a robust and type-safe way to manage storage operations, permissions, and configurations.

## Features

- **Config Types**: Define and manage S3 configuration settings.
- **Error Handling**: Custom error types for better error management.
- **Client Interface**: A unified interface for S3 client operations.
- **Storage Types**: Detailed types for files, upload/download options, and permissions.
- **Security Configurations**: Advanced security settings including role-based access control.

## Installation

To install this package, use npm or yarn:

```bash
npm install @obelius/s3-types
```

or

```bash
yarn add @obelius/s3-types
```

## Usage

### Config Types

Define your S3 configuration using the `S3Config` interface:

```ts
import { S3Config } from "@obelius/s3-types";

const s3Config: S3Config = {
  region: "us-west-2",
  bucket: "my-bucket",
  credentials: {
    accessKeyId: "your-access-key",
    secretAccessKey: "your-secret-key",
  },
  endpoint: "https://s3.example.com",
  forcePathStyle: true,
};
```

### Error Types

Handle storage errors with the `StorageError` class:

```ts
import { StorageError } from "@obelius/s3-types";

try {
  // Your S3 operation here
} catch (error) {
  if (error instanceof StorageError) {
    console.error(`Storage error: ${error.code} - ${error.message}`);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
```

### Client Interface

Implement the `StorageClient` interface to create a type-safe S3 client:

```ts
import { StorageClient, UploadOptions, UploadResult } from "@obelius/s3-types";

class MyS3Client implements StorageClient {
  async upload(
    file: File | Buffer | Blob,
    key: string,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    // Implementation here
  }

  async download(
    key: string,
    options?: DownloadOptions,
  ): Promise<DownloadResult> {
    // Implementation here
  }

  // Implement other methods...
}
```

### Storage Types

Use the provided types for file metadata, upload/download options, and more:

```ts
import { StorageFile, UploadOptions, DownloadOptions } from "@obelius/s3-types";

const file: StorageFile = {
  key: "example.txt",
  size: 1024,
  lastModified: new Date(),
  contentType: "text/plain",
};

const uploadOptions: UploadOptions = {
  contentType: "text/plain",
  metadata: { "custom-key": "custom-value" },
};

const downloadOptions: DownloadOptions = {
  responseType: "blob",
  onProgress: (progress) => console.log(`Download progress: ${progress}%`),
};
```

### Security Configurations

Configure advanced security settings using the `S3SecurityConfig` and related interfaces:

```ts
import { S3SecurityConfig, RoleBasedAccessConfig } from "@obelius/s3-types";

const securityConfig: S3SecurityConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedContentTypes: ["image/png", "image/jpeg"],
  roleBasedAccess: {
    roles: {
      admin: {
        allowedOperations: ["read", "write", "delete"],
        allowedPrefixes: ["admin-"],
      },
      user: {
        allowedOperations: ["read"],
        maxFileSize: 5 * 1024 * 1024, // 5 MB
      },
    },
    defaultRole: "user",
  },
};
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the TypeScript community for their continuous support and contributions.
- Inspired by the need for a robust and type-safe S3 client interface.

---

For more details, please refer to the source code and type definitions in the `src` directory.
