# S3 Storage

This repository contains the S3 Storage wrapper package that simplifies interactions with AWS S3 across different frameworks and platforms.

## Package Structure

```markdown
packages/
  types/      # Shared TypeScript types
  backend/
    core/     # Core S3 interactions, presigned URLs, etc
    express/  # Express middleware & routes
    fastify/  # Fastify plugin & routes
  frontend/
    core/     # Framework-agnostic upload logic, presigned URL handling
    react/    # React hooks & components
    vue/      # Vue composables & components
```

### Packages Overview

#### Shared

- `types/` - Common TypeScript type definitions shared across all packages

#### Backend

- `backend/core/` - Core functionality for S3 operations including bucket management, presigned URL generation, and direct S3 interactions
- `backend/express/` - Express.js integration providing middleware and routes for S3 operations
- `backend/fastify/` - Fastify plugin and routes for seamless S3 integration

#### Frontend

- `frontend/core/` - Framework-agnostic upload logic and presigned URL handling
- `frontend/react/` - React-specific implementations including hooks and components for S3 uploads
- `frontend/vue/` - Vue.js composables and components for S3 file management
