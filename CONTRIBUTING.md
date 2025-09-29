# Contributing to AI Solutions Website

Thank you for your interest in contributing to the AI Solutions website project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git version control
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-solutions.git
   cd ai-solutions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- **TypeScript** - Use TypeScript for all new code
- **ESLint** - Follow the existing ESLint configuration
- **Prettier** - Use consistent code formatting
- **Naming Conventions** - Use camelCase for variables, PascalCase for components

### Component Structure
```typescript
// Component template
import React from 'react'

interface ComponentProps {
  // Define props with TypeScript
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Basic UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: `#3b82f6` (Blue)
- **Secondary**: `#64748b` (Gray)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Yellow)
- **Error**: `#ef4444` (Red)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: `font-semibold` to `font-bold`
- **Body**: `font-normal`

### Spacing
- Use Tailwind CSS spacing scale (4, 8, 12, 16, 20, 24, etc.)
- Consistent margin and padding throughout

## 🔧 Technical Standards

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Follow the single responsibility principle

### State Management
- Use React hooks for local state
- Use Context API for global state
- Avoid prop drilling when possible

### Database Integration
- Use Supabase client for all database operations
- Implement proper error handling for async operations
- Use TypeScript interfaces for database models
- Follow RLS (Row Level Security) policies

### Performance
- Lazy load components when appropriate
- Optimize images and assets
- Use proper caching strategies
- Monitor bundle size

## 🧪 Testing

### Testing Strategy
- Write unit tests for utility functions
- Test React components with React Testing Library
- Implement integration tests for critical user flows
- Test responsive design on multiple devices

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(admin): add confirmation modals for delete operations
fix(contact): resolve RLS policy preventing contact deletion
docs(readme): update deployment instructions
style(components): improve responsive design for mobile
```

## 🔄 Pull Request Process

### Before Submitting
1. **Test your changes** - Ensure all tests pass
2. **Run linting** - Fix any ESLint warnings/errors
3. **Check responsiveness** - Test on different screen sizes
4. **Update documentation** - Update README if needed
5. **Add/update tests** - Include tests for new features

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new features
- [ ] Tested on multiple devices/browsers

## Screenshots (if applicable)
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors/warnings
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 95]
- Device: [e.g., Desktop, iPhone 12]

## Screenshots
Add screenshots if applicable
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Any alternative approaches considered?

## Additional Context
Any other relevant information
```

## 📞 Getting Help

### Communication Channels
- **Email**: snehasama7@gmail.com
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions

### Code Review Process
1. All changes require code review
2. At least one approval required for merging
3. Automated checks must pass
4. Maintain high code quality standards

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors section

Thank you for contributing to AI Solutions! 🎉

---

**Happy Coding!** 💻✨
