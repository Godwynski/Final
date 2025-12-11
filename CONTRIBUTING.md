# 🤝 Contributing to BlotterSys

Thank you for your interest in contributing to **BlotterSys**! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Expected Behavior

- ✅ Be respectful and considerate
- ✅ Welcome newcomers and help them get started
- ✅ Provide constructive feedback
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members

### Unacceptable Behavior

- ❌ Harassment, trolling, or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information
- ❌ Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment:**
   - Node.js 20.x or higher
   - Git
   - Code editor (VS Code recommended)

2. **Accounts:**
   - GitHub account
   - Supabase account (for testing)
   - MailerSend account (optional)

3. **Knowledge:**
   - TypeScript/JavaScript
   - React and Next.js
   - Basic SQL
   - Git workflow

### Fork and Clone

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/blottersys.git
   cd blottersys
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/blottersys.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Setup environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Build the project
npm run build

# Test in development
npm run dev
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

1. **Use TypeScript for all new code**
   - Define proper types and interfaces
   - Avoid `any` type unless absolutely necessary
   - Use type inference where possible

   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
     role: 'admin' | 'staff';
   }

   // ❌ Bad
   const user: any = { ... };
   ```

2. **Prefer interfaces over types for objects**
   ```typescript
   // ✅ Good
   interface CaseData {
     title: string;
     status: CaseStatus;
   }

   // ❌ Avoid (unless needed for unions)
   type CaseData = {
     title: string;
     status: CaseStatus;
   }
   ```

### React Components

1. **Use functional components with hooks**
   ```typescript
   // ✅ Good
   export function MyComponent({ prop }: Props) {
     const [state, setState] = useState();
     return <div>...</div>;
   }

   // ❌ Avoid class components
   class MyComponent extends React.Component { ... }
   ```

2. **Server vs Client Components**
   - Default to Server Components
   - Only use `'use client'` when necessary
   - Keep client components small and focused

3. **Component naming**
   - Use PascalCase for components
   - Use descriptive names
   - Suffix with component type if helpful

   ```typescript
   // ✅ Good
   CaseDetailsClient.tsx
   DashboardEvidenceList.tsx
   SubmitButton.tsx

   // ❌ Bad
   component.tsx
   thing.tsx
   ```

### File Organization

1. **Follow Next.js App Router conventions**
   - `page.tsx` for routes
   - `layout.tsx` for layouts
   - `loading.tsx` for loading states
   - `actions.ts` for server actions

2. **Group related files**
   ```
   app/dashboard/cases/
   ├── page.tsx          # Route page
   ├── actions.ts        # Server actions
   ├── loading.tsx       # Loading state
   └── [id]/             # Dynamic route
       ├── page.tsx
       └── actions.ts
   ```

3. **Use absolute imports**
   ```typescript
   // ✅ Good
   import { Button } from '@/components/ui/Button';

   // ❌ Avoid
   import { Button } from '../../../components/ui/Button';
   ```

### Styling

1. **Use Tailwind CSS utility classes**
   ```tsx
   // ✅ Good
   <div className="flex items-center gap-4 p-4 bg-white rounded-lg">

   // ❌ Avoid inline styles
   <div style={{ display: 'flex', padding: '16px' }}>
   ```

2. **Use consistent spacing**
   - Use Tailwind spacing scale (4, 8, 12, 16, etc.)
   - Be consistent with padding and margins

3. **Responsive design**
   - Mobile-first approach
   - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)

### Database Queries

1. **Use Row Level Security (RLS)**
   - Never bypass RLS in application code
   - Define policies in SQL

2. **Use proper error handling**
   ```typescript
   // ✅ Good
   const { data, error } = await supabase
     .from('cases')
     .select('*');

   if (error) {
     console.error('Error fetching cases:', error);
     return { error: error.message };
   }

   // ❌ Bad
   const data = await supabase.from('cases').select('*');
   ```

3. **Optimize queries**
   - Select only needed columns
   - Use proper indexes
   - Avoid N+1 queries

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```bash
# Feature
git commit -m "feat(cases): add bulk export to CSV functionality"

# Bug fix
git commit -m "fix(auth): resolve session expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(evidence): extract upload logic to separate hook"

# Performance
git commit -m "perf(dashboard): optimize case list query"
```

### Scope

Use the feature or module name:
- `auth`
- `cases`
- `evidence`
- `dashboard`
- `guest`
- `admin`
- `docs`

---

## Pull Request Process

### Before Submitting

1. **Ensure your code:**
   - ✅ Follows coding standards
   - ✅ Passes linting (`npm run lint`)
   - ✅ Builds successfully (`npm run build`)
   - ✅ Has been tested locally
   - ✅ Includes updated documentation

2. **Update documentation:**
   - Update README if needed
   - Add/update relevant docs in `docs/`
   - Update CHANGELOG.md

3. **Write a clear PR description:**
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Screenshots (if UI changes)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested in production-like environment
- [ ] Added/updated tests

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

### Review Process

1. **Automated checks** will run (linting, build)
2. **Maintainers will review** your code
3. **Address feedback** by pushing new commits
4. **Once approved**, your PR will be merged

### After Merge

1. **Delete your branch:**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your main branch:**
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Testing Requirements

### Manual Testing

Before submitting, test:

1. **Happy path** - Feature works as expected
2. **Edge cases** - Unusual inputs, empty states
3. **Error handling** - Invalid inputs, network errors
4. **Responsive design** - Mobile, tablet, desktop
5. **Cross-browser** - Chrome, Firefox, Safari (if possible)

### Test Checklist

For new features:
- [ ] Feature works in development
- [ ] Feature works in production build
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation, screen readers)

For bug fixes:
- [ ] Bug is reproducible before fix
- [ ] Bug is fixed after changes
- [ ] No regressions introduced
- [ ] Related functionality still works

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing behavior
- Fix a significant bug
- Add new dependencies
- Change environment variables
- Modify database schema

### What to Update

1. **README.md** - For major features or setup changes
2. **QUICK_START.md** - If setup process changes
3. **TROUBLESHOOTING.md** - For common issues you encountered
4. **docs/** - For technical details, architecture changes
5. **CHANGELOG.md** - For all changes
6. **Code comments** - For complex logic

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep it up-to-date

---

## Areas for Contribution

### High Priority

- 🐛 Bug fixes
- 📝 Documentation improvements
- ♿ Accessibility improvements
- 🌐 Internationalization (Tagalog/Filipino)
- 🧪 Test coverage

### Feature Requests

- Check existing issues first
- Discuss major features before implementing
- Follow the roadmap in `docs/11_ROADMAP.md`

### Good First Issues

Look for issues labeled:
- `good first issue`
- `documentation`
- `help wanted`

---

## Questions?

- 📖 Read the [documentation](./docs/00_INDEX.md)
- 💬 Open a discussion on GitHub
- 📧 Contact maintainers

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to BlotterSys! 🎉

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0
