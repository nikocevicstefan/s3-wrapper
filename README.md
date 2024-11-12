# Obelius S3 Storage

A type-safe, secure S3 storage solution with framework integrations.

## Package Structure

```markdown 
packages/
├── types/ # @obelius/s3-types
├── core/ # @obelius/s3-core
├── server/ # Server integrations
│ ├── express/ # @obelius/s3-server-express
│ └── fastify/ # @obelius/s3-server-fastify
└── client/ # Client integrations
├── core/ # @obelius/s3-client-core
├── react/ # @obelius/s3-client-react
└── vue/ # @obelius/s3-client-vue

### Packages Overview

#### Core Packages
- `@obelius/s3-types` - Shared TypeScript definitions
- `@obelius/s3-core` - Core S3 operations with security features

#### Server Integration
- `@obelius/s3-server-express` - Express.js middleware & routes
- `@obelius/s3-server-fastify` - Fastify plugin & routes

#### Client Integration
- `@obelius/s3-client-core` - Framework-agnostic client operations
- `@obelius/s3-client-react` - React hooks & components
- `@obelius/s3-client-vue` - Vue composables & components