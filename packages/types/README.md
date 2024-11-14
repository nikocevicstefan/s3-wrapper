# @obelius/s3-types

This package provides TypeScript type definitions and interfaces for interacting with AWS S3. It is part of the `s3-wrapper` project, designed to simplify and standardize interactions with AWS S3 across your applications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Type Definitions](#type-definitions)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the `@obelius/s3-types` package, use npm or yarn:

```bash
npm install @obelius/s3-types
```

or

```bash
yarn add @obelius/s3-types
```

## Usage

Import the types and interfaces from the package into your TypeScript project:

```typescript
import { S3Object, S3Bucket, S3ClientConfig } from "@obelius/s3-types";

// Example usage
const config: S3ClientConfig = {
  region: "us-west-2",
  credentials: {
    accessKeyId: "your-access-key-id",
    secretAccessKey: "your-secret-access-key",
  },
};

const bucket: S3Bucket = {
  name: "my-bucket",
  region: "us-west-2",
};

const object: S3Object = {
  key: "path/to/object",
  bucket: bucket,
  metadata: {
    contentType: "application/json",
  },
};

console.log(config, bucket, object);
```

## Type Definitions

The `@obelius/s3-types` package includes the following type definitions:

### `S3ClientConfig`

Configuration options for the AWS S3 client.

```typescript
interface S3ClientConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}
```

### `S3Bucket`

Represents an S3 bucket.

```typescript
interface S3Bucket {
  name: string;
  region: string;
}
```

### `S3Object`

Represents an S3 object.

```typescript
interface S3Object {
  key: string;
  bucket: S3Bucket;
  metadata?: {
    contentType?: string;
    contentLength?: number;
    // Add other metadata fields as needed
  };
}
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

### Explanation

- **Installation**: Provides instructions on how to install the package using npm or yarn.
- **Usage**: Shows how to import and use the types and interfaces in a TypeScript project.
- **Type Definitions**: Describes the main type definitions provided by the package.
- **Contributing**: Encourages contributions and provides a link to the contributing guidelines.
- **License**: Specifies the license under which the package is distributed.

This README should give users a clear understanding of how to use the `@obelius/s3-types` package and encourage contributions to the project.
```
