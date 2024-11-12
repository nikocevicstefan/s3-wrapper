# Contributing Guide

Thank you for your interest in contributing to Obelius S3 Storage! This document provides guidelines and instructions for contributing to the project.

## 🛠 Tech Stack

- **PNPM**: Package management and workspace organization
- **Turborepo**: Build system and task runner
- **Changesets**: Version management and changelog generation
- **TypeScript**: Type-safe development
- **Commitlint**: Conventional commit enforcement
- **Husky**: Git hooks management

## 🚀 Getting Started

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Build all packages: `pnpm build`
4. Run tests: `pnpm test`

## 📦 Workspace Structure

```
.
├── packages/
│   ├── types/              # @obelius/s3-types
│   │   └── src/           # Type definitions
│   ├── core/              # @obelius/s3-core
│   │   └── src/           # Core S3 operations
│   ├── server/
│   │   ├── express/       # Express.js integration
│   │   └── fastify/       # Fastify integration
│   └── client/
│       ├── core/          # Client core functionality
│       ├── react/         # React components
│       └── vue/           # Vue components
```

## 💻 Development Workflow

### Common Commands

```bash
# Development
pnpm dev          # Start development mode
pnpm build        # Build all packages
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm clean        # Clean build artifacts

# Version Management
pnpm changeset    # Create a changeset
pnpm version      # Update versions
pnpm publish      # Publish packages
```

## 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
type(scope): description

# Examples
feat(core): add presigned URL generation
fix(types): correct S3Config interface
docs(readme): update installation instructions
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔄 Pull Request Process

1. Create a new branch:
   ```bash
   git checkout -b feat/your-feature
   # or
   git checkout -b fix/your-bugfix
   ```

2. Make your changes and commit using conventional commits

3. Create a changeset (for feature/fix changes):
   ```bash
   pnpm changeset
   ```

4. Push your changes and create a pull request

5. Ensure all checks pass and address any review comments

## 📋 Pull Request Guidelines

- Keep PRs focused on a single change
- Update documentation as needed
- Add tests for new features
- Follow the existing code style
- Squash commits before merging

## 🏗 Package Development

### Creating a New Package

1. Create package directory:
   ```bash
   mkdir packages/your-package
   ```

2. Initialize package:
   ```bash
   cd packages/your-package
   pnpm init
   ```

3. Add to workspace in `pnpm-workspace.yaml`

4. Set up TypeScript configuration

### Testing Changes

1. Run tests for specific package:
   ```bash
   pnpm test --filter @obelius/package-name
   ```

2. Build single package:
   ```bash
   pnpm build --filter @obelius/package-name
   ```

## 📚 Documentation

- Update README.md in affected packages
- Add JSDoc comments for public APIs
- Include examples for new features
- Update root README.md for major changes

## 🤝 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🆘 Need Help?

- Create an issue for bugs/features
- Review existing issues and PRs

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## 📝 Commit Guidelines

We use a combination of tools to ensure consistent and meaningful commits:

### Commitizen CLI

We use `pnpm commit` (or `npm run commit`) instead of `git commit` to create standardized commits. This command launches an interactive CLI that helps you format your commit message correctly.

```bash
# Stage your changes
git add .

# Use commitizen CLI instead of git commit
pnpm commit

# The CLI will prompt you for:
# 1. Type of change (feat, fix, docs, etc.)
# 2. Scope (which package or area)
# 3. Short description
# 4. Longer description (optional)
# 5. Breaking changes (if any)
# 6. Issues affected (if any)
```

### Complete Development Flow

1. **Make Changes**
   ```bash
   # Create feature branch
   git checkout -b feat/new-feature

   # Make your changes
   # Stage changes
   git add .
   ```

2. **Create Commit**
   ```bash
   # Use commitizen for structured commit
   pnpm commit
   # Follow the prompts:
   # ? Select the type of change: feat
   # ? What is the scope? core
   # ? Write a short description: add presigned URL feature
   # ? Provide a longer description? (optional)
   # ? Are there any breaking changes? No
   # ? Does this change affect any open issues? No
   ```

3. **Create Changeset** (for feature/fix changes)
   ```bash
   pnpm changeset
   # Follow the prompts:
   # ? Which packages would like to include? @obelius/s3-core
   # ? Which type of change is this for @obelius/s3-core? minor
   # ? Summary of changes: Added presigned URL generation feature
   ```

4. **Push Changes**
   ```bash
   git push origin feat/new-feature
   ```

### Commit Types

- `feat`: New feature or significant enhancement
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.

### Commit Format

```bash
type(scope): subject

[optional body]

[optional footer]

# Examples:
feat(core): add presigned URL generation
fix(types): correct S3Config interface
docs(readme): update installation instructions
style(core): format code according to new rules
```

### Automated Checks

Our setup includes:

1. **Husky**: Git hooks that run before commits
   - Validates commit message format
   - Runs linting checks
   - Ensures tests pass

2. **Commitlint**: Enforces conventional commit format
   - Checks commit message structure
   - Validates type and scope
   - Ensures proper formatting

3. **Changesets**: Version and changelog management
   - Tracks changes across packages
   - Generates changelogs
   - Manages version bumps

### Version Management Flow

1. **Local Development**
   ```bash
   # Make changes
   git add .
   pnpm commit
   pnpm changeset
   git push
   ```

2. **Automated Release Process**
   - GitHub Actions creates "Version Packages" PR
   - PR includes version bumps and changelog updates
   - Merging PR triggers automatic publishing

### Tips

- Keep commits focused and atomic
- Write clear, descriptive commit messages
- Create changesets for feature/fix changes
- Use appropriate commit types and scopes
- Reference issues in commits when applicable

### Common Issues

1. **Commit Failed**
   ```bash
   # If commit fails due to format:
   # 1. Check commit message format
   # 2. Use pnpm commit to ensure proper format
   ```

2. **Changeset Needed**
   ```bash
   # If changes require version bump:
   pnpm changeset
   # Commit the generated changeset file
   git add .changeset/*.md
   pnpm commit
   ```
