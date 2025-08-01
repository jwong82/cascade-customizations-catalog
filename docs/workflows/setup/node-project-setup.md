---
labels: nodejs, typescript, javascript, setup, project-setup, development-environment, testing, code-quality, eslint, prettier, beginner
author: Cascade Community
modified: 2024-07-31
---

# Node.js Project Setup Workflow

## Description

A comprehensive workflow for setting up a professional Node.js project with TypeScript, testing framework, code quality tools, and development environment. This workflow ensures consistency across team projects and includes all essential development tools.

## Usage

Use this workflow when:
- Starting a new Node.js project from scratch
- Setting up a TypeScript-based Node.js application
- Establishing development standards for a team
- Creating a backend API or service
- Setting up a full-stack application backend

## Examples

### Project Structure After Setup
```
my-node-project/
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
│   ├── index.test.ts
│   └── __mocks__/
├── dist/           # Compiled JavaScript (after build)
├── node_modules/
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── tsconfig.json
└── package.json
```

### Sample Configuration Files

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### .eslintrc.js
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
};
```

#### jest.config.js
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};
```

### Development Workflow
After setup, your typical development workflow will be:

```bash
# Development with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables Setup
```bash
# .env.example (commit this)
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here

# .env (don't commit this)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=super_secret_key_123
```
