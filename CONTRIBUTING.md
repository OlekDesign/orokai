# Contributing to Orokai

Thank you for your interest in contributing to Orokai! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/orokai.git
   cd orokai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the established patterns
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   npm run lint        # Check code style
   npm run build       # Ensure it builds
   npm run preview     # Test production build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat: add user authentication system
fix: resolve wallet balance calculation error
docs: update API documentation
style: format code with prettier
refactor: simplify transaction processing logic
```

## 🏗 Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // implementation
};

// ❌ Bad
const fetchUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Components

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Use proper prop typing with interfaces

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### CSS/Tailwind

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use semantic class names for custom CSS
- Prefer Tailwind utilities over custom CSS

```tsx
// ✅ Good
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-sm">
  <div className="flex-1">Content</div>
</div>

// ❌ Avoid custom CSS when Tailwind utilities exist
<div className="custom-card-layout">
  <div className="custom-content">Content</div>
</div>
```

## 📁 File Organization

### Component Structure

```
src/components/
├── ui/                 # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/            # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ...
├── features/          # Feature-specific components
│   ├── auth/
│   ├── trading/
│   └── portfolio/
└── shared/            # Shared components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── ...
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserData.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types**: PascalCase (`UserTypes.ts`)

## 🧪 Testing Guidelines

### Testing Strategy

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows

### Writing Tests

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔍 Code Review Process

### Before Submitting a PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated if needed
- [ ] Self-review completed

### PR Requirements

1. **Clear Description**
   - What changes were made?
   - Why were they made?
   - How to test the changes?

2. **Screenshots/Videos**
   - For UI changes, include before/after screenshots
   - For complex interactions, include screen recordings

3. **Testing Instructions**
   - Step-by-step instructions to test the changes
   - Edge cases to consider

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
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try to reproduce the bug
3. Test in different browsers/devices

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]

**Screenshots**
Add screenshots if applicable
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other context or screenshots
```

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tag created
- [ ] Deployment successful

## 📚 Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Tools

- [VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-marketplace)
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter

### Community

- [GitHub Discussions](https://github.com/OlekDesign/orokai/discussions)
- [Issues](https://github.com/OlekDesign/orokai/issues)

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Spam or off-topic content

## 📞 Getting Help

- **General Questions**: GitHub Discussions
- **Bug Reports**: GitHub Issues
- **Security Issues**: Email [security@example.com]
- **Team Chat**: [Your team communication channel]

---

Thank you for contributing to Orokai! 🚀
