### General Assumption
- **Running Environment**: Always assume the application is already running with `npm run dev`

### Error Handling & Resilience
- **Try-Catch Blocks**: Wrap async operations and API calls with proper error handling
- **Error Boundaries**: Use React Error Boundaries for component-level error catching
- **Fallback UI**: Provide loading states, error states, and empty states for all data-dependent components
- **Graceful Degradation**: App should remain functional even when non-critical features fail
- **User Feedback**: Show meaningful error messages and success notifications

### Performance Optimization
- **Code Splitting**: Use dynamic imports and Next.js automatic code splitting
- **Image Optimization**: Use Next.js `<Image>` component with proper sizing and lazy loading
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` for expensive operations
- **Bundle Analysis**: Regularly check bundle size and optimize imports
- **Lazy Loading**: Implement lazy loading for heavy components and routes

### Type Safety & Documentation
- **Strict TypeScript**: Enable strict mode, no `any` types except for legitimate cases
- **Interface Definition**: Define clear interfaces for all props, API responses, and data structures
- **JSDoc Comments**: Document complex functions and component APIs
- **Prop Validation**: Use TypeScript interfaces instead of PropTypes for better compile-time checking

### Code Quality & Consistency
- **ESLint & Prettier**: Enforce consistent code style and catch potential issues
- **Git Hooks**: Use pre-commit hooks to run linting and formatting
- **Naming Conventions**: Use PascalCase for components, camelCase for functions/variables, UPPER_CASE for constants
- **File Organization**: Group related files, use index.ts for clean imports
- **Import Organization**: Sort imports (external → internal → relative), remove unused imports

### Security Best Practices
- **Input Sanitization**: Sanitize user inputs and API responses
- **XSS Prevention**: Use proper escaping for dynamic content
- **Token Management**: Secure storage and handling of JWT tokens
- **Environment Variables**: Keep sensitive data in env files, never commit secrets
- **HTTPS**: Ensure all API calls use HTTPS in production

### Testing Strategy
- **Unit Tests**: Test individual components and utility functions
- **Integration Tests**: Test component interactions and API integrations
- **E2E Tests**: Test critical user flows (auth, checkout, etc.)
- **Test Coverage**: Maintain reasonable test coverage for business-critical code
- **Mock Data**: Use consistent mock data for development and testing

### Accessibility (a11y)
- **Semantic HTML**: Use proper HTML5 semantic elements
- **ARIA Labels**: Add ARIA attributes for screen readers
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Color Contrast**: Maintain WCAG AA color contrast ratios
- **Focus Management**: Proper focus states and logical tab order

