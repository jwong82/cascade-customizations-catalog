---
labels: typescript, javascript, type-safety, best-practices, code-quality, static-typing, glob-based, intermediate
author: Cascade Community
modified: 2025-07-31
---

# TypeScript Best Practices Rule

## Description

This rule automatically applies TypeScript best practices when working with `.ts` and `.tsx` files. It enforces type safety, proper naming conventions, and modern TypeScript patterns to improve code quality and maintainability.

## Usage

This rule activates automatically when you're working with TypeScript files (`.ts` or `.tsx` extensions). Cascade will remind you to follow TypeScript best practices and suggest improvements to your code structure.

## Examples

### Type Annotations
```typescript
// Good - Explicit types
function calculateTotal(price: number, tax: number): number {
  return price + (price * tax);
}

// Better - With interface
interface Product {
  id: string;
  name: string;
  price: number;
}

function processProduct(product: Product): void {
  console.log(`Processing ${product.name}`);
}
```

### Generic Types
```typescript
// Reusable generic function
function createResponse<T>(data: T, success: boolean): ApiResponse<T> {
  return { data, success, timestamp: Date.now() };
}
```

### Error Handling
```typescript
// Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await userService.getById(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

<!-- METADATA
labels: typescript, javascript, type-safety, best-practices, code-quality, static-typing, glob-based, intermediate
author: Cascade Community
activation: glob-based
category: Languages
-->
