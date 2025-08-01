---
trigger: always_on
---

# Universal Coding Best Practices

Always follow these fundamental coding principles across all programming languages:

## Code Quality & Readability
- Write self-documenting code with clear, descriptive variable and function names
- Use consistent indentation and formatting (prefer language-standard formatters)
- Keep functions small and focused on a single responsibility
- Avoid deep nesting (max 3-4 levels) - refactor complex logic into separate functions
- Add meaningful comments for complex business logic, not obvious code
- Remove commented-out code and TODO comments before committing

## Error Handling & Robustness
- Always handle errors explicitly - never ignore exceptions or error return values
- Use specific error types/messages rather than generic ones
- Validate inputs at function boundaries
- Fail fast - detect and report errors as early as possible
- Log errors with sufficient context for debugging

## Security & Safety
- Never hardcode secrets, API keys, or sensitive data
- Validate and sanitize all user inputs
- Use parameterized queries for database operations
- Follow principle of least privilege for permissions and access
- Keep dependencies updated and audit for vulnerabilities

## Performance & Efficiency
- Avoid premature optimization, but be mindful of obvious inefficiencies
- Use appropriate data structures for the task
- Consider memory usage and avoid memory leaks
- Profile before optimizing performance-critical code
- Cache expensive operations when appropriate

## Testing & Maintainability
- Write tests for new functionality and bug fixes
- Ensure code is testable (avoid tight coupling, use dependency injection)
- Follow consistent naming conventions within the project
- Keep configuration separate from code
- Document public APIs and complex algorithms

## Version Control & Collaboration
- Write clear, descriptive commit messages
- Make atomic commits (one logical change per commit)
- Review your own code before requesting reviews from others
- Follow the project's branching strategy and contribution guidelines
