---
labels: best-practices, code-quality, always-on, universal, standards, beginner, intermediate, advanced
author: Cascade Community
modified: 2025-08-01
---
# Universal Coding Best Practices Rule

## Description

This always-on rule establishes fundamental coding principles that apply across all programming languages and projects. It automatically guides development practices to ensure consistent code quality, security, and maintainability regardless of the technology stack being used.

## Usage

This rule is **always active** and applies to every coding session. You don't need to manually activate it - Cascade will automatically follow these best practices when:
- Writing new code in any programming language
- Refactoring existing code
- Reviewing code suggestions
- Providing coding recommendations

## Key Principles Covered

### 🎯 Code Quality & Readability
- Self-documenting code with clear naming
- Consistent formatting and indentation
- Single responsibility functions
- Minimal nesting complexity
- Meaningful comments for business logic

### 🛡️ Error Handling & Robustness
- Explicit error handling (no ignored exceptions)
- Specific error messages and types
- Input validation at boundaries
- Fail-fast error detection
- Contextual error logging

### 🔒 Security & Safety
- No hardcoded secrets or sensitive data
- Input validation and sanitization
- Parameterized database queries
- Principle of least privilege
- Regular dependency updates

### ⚡ Performance & Efficiency
- Mindful of obvious inefficiencies
- Appropriate data structure selection
- Memory usage consideration
- Profile-driven optimization
- Strategic caching

### 🧪 Testing & Maintainability
- Test coverage for new functionality
- Testable code design patterns
- Consistent naming conventions
- Configuration separation
- API documentation

### 🤝 Version Control & Collaboration
- Clear, descriptive commit messages
- Atomic commits (one logical change)
- Self-review before team review
- Following project contribution guidelines

## Examples

### Before: Poor Practices
```python
def process(data):
    # TODO: add validation later
    result = []
    for i in data:
        if i != None:
            if i > 0:
                if i < 100:
                    result.append(i * 2)
    return result
```

### After: Best Practices Applied
```python
def double_valid_numbers(numbers: List[Optional[int]]) -> List[int]:
    """
    Doubles all valid numbers in the range [1, 99].
    
    Args:
        numbers: List of integers or None values to process
        
    Returns:
        List of doubled valid numbers
        
    Raises:
        ValueError: If input is not a list
    """
    if not isinstance(numbers, list):
        raise ValueError("Input must be a list")
    
    doubled_numbers = []
    for number in numbers:
        if number is not None and 1 <= number < 100:
            doubled_numbers.append(number * 2)
    
    return doubled_numbers
```

## Benefits

- **Consistency**: Uniform code quality across all projects and languages
- **Maintainability**: Easier to read, debug, and modify code over time
- **Security**: Reduced vulnerability surface through secure coding practices
- **Collaboration**: Smoother team development with shared standards
- **Quality**: Fewer bugs and better performance through proven practices

## Language Agnostic Application

These principles apply whether you're working with:
- **Web Development**: JavaScript, TypeScript, Python, PHP, Ruby
- **Systems Programming**: C, C++, Rust, Go
- **Mobile Development**: Swift, Kotlin, Dart
- **Data Science**: Python, R, SQL, Julia
- **Enterprise**: Java, C#, Scala
- **And any other programming language**

## Related Rules

- `secure-coding.md` - Detailed security-focused practices
- `code-review-checklist.md` - Manual checklist for code reviews
- Language-specific rules for additional syntax and framework guidance

---

*This rule ensures that all code follows industry best practices, creating a foundation for high-quality, maintainable software development.*
