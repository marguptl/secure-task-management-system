# Contributing to Secure Task Management System

Thank you for your interest in contributing to the Secure Task Management System! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/secure-task-management-system.git
   cd secure-task-management-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx nx serve dashboard
   ```

## 📝 Development Guidelines

### Code Style
- Follow the existing code style and formatting
- Use TypeScript for all new code
- Follow Angular style guide conventions
- Use meaningful variable and function names
- Add JSDoc comments for public methods

### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting a PR
- Run tests with: `npx nx test dashboard`

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat: add new task completion feature
fix: resolve role switching issue
docs: update README with new features
style: format code according to style guide
refactor: restructure task list component
test: add tests for task reducer
chore: update dependencies
```

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them with descriptive messages

3. **Test your changes**:
   ```bash
   npx nx test dashboard
   npx nx lint dashboard
   npx nx build dashboard
   ```

4. **Push your branch** and create a Pull Request

5. **Describe your changes** in the PR description:
   - What was changed
   - Why it was changed
   - How to test the changes
   - Any breaking changes

## 🐛 Reporting Issues

When reporting issues, please include:
- **Description**: Clear description of the problem
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 🤝 Code of Conduct

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and open to feedback
- Focus on what is best for the community

## 📞 Getting Help

- Check existing issues and PRs
- Join our discussions
- Create an issue for questions

Thank you for contributing! 🎉 