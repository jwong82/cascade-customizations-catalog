---
labels: security, best-practices, always-on, authentication, authorization, encryption, input-validation, vulnerability-prevention, advanced
author: Cascade Community
modified: 2024-07-31
---

# Secure Coding Practices Rule

## Description

This always-on rule ensures that security considerations are integrated into every aspect of code development. It provides constant reminders about secure coding practices and helps prevent common security vulnerabilities.

## Usage

This rule is always active and will influence Cascade's behavior across all programming languages and frameworks. It prioritizes security in code suggestions and reminds developers of security best practices.

## Examples

### Environment Variables for Secrets
```javascript
// Bad - Hardcoded secrets
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "mypassword123";

// Good - Environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!API_KEY || !DB_PASSWORD) {
  throw new Error('Required environment variables are missing');
}
```

### Input Validation
```python
# Good - Proper input validation
import re
from typing import Optional

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def sanitize_input(user_input: str) -> str:
    # Remove potentially dangerous characters
    return re.sub(r'[<>"\']', '', user_input.strip())
```

### SQL Injection Prevention
```python
# Bad - String concatenation
query = f"SELECT * FROM users WHERE id = {user_id}"

# Good - Parameterized queries
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))
```

### Authentication & Authorization
```javascript
// Middleware for authentication
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Role-based authorization
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

### Secure Error Handling
```javascript
// Bad - Exposing sensitive information
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.stack });
});

// Good - Generic error messages
app.use((error, req, res, next) => {
  console.error(error); // Log for debugging
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: req.id 
  });
});
```
