---
labels: react, javascript, typescript, frontend, hooks, functional-components, performance, jsx, model-decision, intermediate
author: Cascade Community
modified: 2024-07-31
---

# React Best Practices Rule

## Description

This rule automatically detects when you're working with React code and applies modern React best practices. It promotes the use of functional components, proper hook usage, and performance optimization techniques.

## Usage

This rule activates when Cascade detects React-related code patterns, imports, or JSX syntax. It will guide you toward modern React patterns and help avoid common pitfalls.

## Examples

### Functional Components with Hooks
```tsx
// Good - Functional component with hooks
import React, { useState, useEffect, useCallback } from 'react';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]); // Proper dependency array

  const handleUpdate = useCallback((updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
};
```

### Custom Hooks
```tsx
// Extract stateful logic into custom hooks
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
```

### Performance Optimization
```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});
```
