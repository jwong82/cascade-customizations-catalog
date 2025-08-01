---
labels: code-review, quality-assurance, manual, checklist, best-practices, team-collaboration, documentation, intermediate
author: Cascade Community
modified: 2024-07-31
---

# Code Review Checklist Rule

## Description

This manual reference rule provides a comprehensive checklist for conducting thorough code reviews. It can be referenced on-demand when preparing for or conducting code reviews to ensure all important aspects are covered.

## Usage

This is a manual rule that you can reference by asking Cascade to apply the code review checklist. Use it when:
- Preparing to submit a pull request
- Reviewing someone else's code
- Conducting team code review sessions
- Training new team members on code review practices

## Examples

### Using the Checklist for PR Preparation
Before submitting your pull request, go through each section:

```markdown
## Self-Review Checklist
- [ ] Code compiles without warnings
- [ ] All tests pass
- [ ] New functionality has corresponding tests
- [ ] Code follows team style guidelines
- [ ] No sensitive information is exposed
- [ ] Performance impact has been considered
- [ ] Documentation is updated
```

### Code Review Comments Examples
```markdown
// Functionality concern
"This function doesn't handle the case where `user` is null. 
Consider adding a null check or using optional chaining."

// Code quality suggestion
"This logic is repeated in three places. Consider extracting 
it into a utility function for better maintainability."

// Performance observation
"This query runs in a loop and could cause N+1 problems. 
Consider batching the queries or using a join."

// Security concern
"User input should be validated before being used in the 
database query to prevent SQL injection."
```

### Review Process Workflow
1. **Initial Scan**: Read through the entire PR to understand the scope
2. **Detailed Review**: Go through each file systematically
3. **Testing**: Check that tests cover the new functionality
4. **Documentation**: Verify that documentation is updated
5. **Security**: Look for potential security issues
6. **Performance**: Consider the performance impact
7. **Feedback**: Provide constructive, specific feedback
