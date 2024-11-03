# Contributing Guide

This repository uses a monorepo setup with several tools to ensure consistent development practices and versioning. Here's what you need to know to get started.

## 🛠 Tech Stack

- **PNPM**: Package management and workspace organization
- **Turborepo**: Build system and task runner
- **Changesets**: Version management and changelog generation
- **TypeScript**: Type-safe development
- **Commitlint**: Conventional commit enforcement
- **Husky**: Git hooks management

## 📦 Initial Setup

1. Install dependencies:

```bash
pnpm install
```

This will automatically:

- Install all project dependencies
- Set up git hooks via husky
- Configure commit message validation

## 💻 Development Workflow

### Common Commands

```bash
pnpm dev # Start development environment
pnpm build # Build all packages
pnpm test # Run tests
pnpm lint # Run linting
pnpm clean # Clean build artifacts
pnpm format # Format code with prettier
```

### Making Changes

1. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Commit your changes using either:

#### Option 1: Interactive commit message helper

```bash
pnpm commit
```

#### Option 2: Traditional git commit (must follow conventional commit format)

```bash
git commit -m "type(scope): description"
```

#### Conventional Commit Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### Version Management

When making changes that should be released:

1. Create a changeset:

```bash
pnpm changeset
```

2. Follow the interactive prompt to:

   - Select changed packages
   - Specify change type (major/minor/patch)
   - Provide change description

3. Commit the generated changeset file

## 🏗 Project Structure

├── .changeset/ # Changeset files
├── .husky/ # Git hooks
├── packages/ # Workspace packages
├── docs/ # Documentation
├── turbo.json # Turborepo configuration
├── pnpm-workspace.yaml # PNPM workspace configuration
└── package.json # Root package configuration

## 🔍 Code Quality

The project enforces:

- Conventional commits through commitlint
- Type safety through TypeScript
- Code formatting through Prettier
- Code quality through ESLint

## 📝 Release Process

1. Collect all changesets:

```bash
pnpm changeset version
```

2. Review the changes and update CHANGELOG.md files

3. Publish packages:

```bash
pnpm publish-packages
```

## ⚙️ Configuration Files

- `.npmrc`: PNPM configuration
- `turbo.json`: Turborepo pipeline configuration
- `tsconfig.json`: TypeScript configuration
- `commitlint.config.js`: Commit message rules
- `.changeset/config.json`: Changeset configuration

## 🤝 Best Practices

1. **Commits**:

   - Use conventional commit format
   - Keep commits focused and atomic
   - Provide clear, descriptive commit messages

2. **Code**:

   - Follow TypeScript best practices
   - Maintain consistent code style

3. **Documentation**:
   - Update docs for API changes
   - Include inline comments for complex logic
   - Keep README files up to date

## 🚀 CI/CD

(To add CI/CD specific documentation when implemented)

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Turborepo Documentation](https://turbo.build/repo)
- [PNPM Workspace](https://pnpm.io/workspaces)
