// Sample data for development and testing
// This file provides fallback data when the actual markdown files aren't available

const SAMPLE_CUSTOMIZATIONS = [
    {
        id: 'typescript_best_practices',
        title: 'TypeScript Best Practices Rule',
        description: 'This rule automatically applies TypeScript best practices when working with .ts and .tsx files. It enforces type safety, proper naming conventions, and modern TypeScript patterns to improve code quality and maintainability.',
        type: 'rules',
        category: 'language',
        filename: 'typescript.md',
        path: '../docs/rules/language/typescript.md',
        windsurfPath: '../windsurf/rules/language/typescript.md',
        labels: ['typescript', 'javascript', 'type-safety', 'best-practices', 'code-quality', 'static-typing', 'glob-based', 'intermediate'],
        author: 'Cascade Community',
        modified: '2024-08-01',
        content: `# TypeScript Best Practices Rule

## Description

This rule automatically applies TypeScript best practices when working with .ts and .tsx files. It enforces type safety, proper naming conventions, and modern TypeScript patterns to improve code quality and maintainability.

## Usage

This rule activates automatically when you're working with TypeScript files (.ts or .tsx extensions). Cascade will remind you to follow TypeScript best practices and suggest improvements to your code structure.

## Examples

### Type Annotations
\`\`\`typescript
// Good - Explicit types
function calculateTotal(price: number, tax: number): number {
  return price + (price * tax);
}
\`\`\`

### Generic Types
\`\`\`typescript
// Reusable generic function
function createResponse<T>(data: T, success: boolean): ApiResponse<T> {
  return { data, success, timestamp: Date.now() };
}
\`\`\``
    },
    {
        id: 'react_best_practices',
        title: 'React Best Practices Rule',
        description: 'This rule automatically detects when you\'re working with React code and applies modern React best practices. It promotes the use of functional components, proper hook usage, and performance optimization techniques.',
        type: 'rules',
        category: 'framework',
        filename: 'react.md',
        path: '../docs/rules/framework/react.md',
        windsurfPath: '../windsurf/rules/framework/react.md',
        labels: ['react', 'javascript', 'typescript', 'frontend', 'hooks', 'functional-components', 'performance', 'jsx', 'model-decision', 'intermediate'],
        author: 'Cascade Community',
        modified: '2024-08-01',
        content: `# React Best Practices Rule

## Description

This rule automatically detects when you're working with React code and applies modern React best practices. It promotes the use of functional components, proper hook usage, and performance optimization techniques.

## Usage

This rule activates when Cascade detects React-related code patterns, imports, or JSX syntax. It will guide you toward modern React patterns and help avoid common pitfalls.

## Examples

### Functional Components with Hooks
\`\`\`tsx
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]); // Proper dependency array

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
};
\`\`\``
    },
    {
        id: 'node_project_setup',
        title: 'Node.js Project Setup Workflow',
        description: 'A comprehensive workflow for setting up a professional Node.js project with TypeScript, testing framework, code quality tools, and development environment. This workflow ensures consistency across team projects and includes all essential development tools.',
        type: 'workflows',
        category: 'setup',
        filename: 'node-project-setup.md',
        path: '../docs/workflows/setup/node-project-setup.md',
        windsurfPath: '../windsurf/workflows/setup/node-project-setup.md',
        labels: ['nodejs', 'typescript', 'javascript', 'setup', 'project-setup', 'development-environment', 'testing', 'code-quality', 'eslint', 'prettier', 'beginner'],
        author: 'Cascade Community',
        modified: '2024-08-01',
        content: `# Node.js Project Setup Workflow

## Description

A comprehensive workflow for setting up a professional Node.js project with TypeScript, testing framework, code quality tools, and development environment.

## Usage

Use this workflow when starting a new Node.js project from scratch, setting up a TypeScript-based Node.js application, or establishing development standards for a team.

## Steps

1. Initialize the project
\`\`\`bash
npm init -y
\`\`\`

2. Install TypeScript and development dependencies
\`\`\`bash
npm install -D typescript @types/node ts-node nodemon
npm install -D jest @types/jest ts-jest
\`\`\``
    },
    {
        id: 'debugging_issues',
        title: 'Debugging Issues Workflow',
        description: 'A systematic, phase-based approach to debugging software issues that guides developers from initial problem identification through resolution and prevention. This workflow emphasizes structured thinking, comprehensive information gathering, and methodical testing.',
        type: 'workflows',
        category: 'maintenance',
        filename: 'debugging-issues.md',
        path: '../docs/workflows/maintenance/debugging-issues.md',
        windsurfPath: '../windsurf/workflows/maintenance/debugging-issues.md',
        labels: ['debugging', 'troubleshooting', 'problem-solving', 'maintenance', 'logging', 'profiling', 'systematic-approach', 'intermediate'],
        author: 'Cascade Community',
        modified: '2024-08-01',
        content: `# Debugging Issues Workflow

## Description

A systematic, phase-based approach to debugging software issues that guides developers from initial problem identification through resolution and prevention.

## Usage

Use this workflow when investigating production issues or bugs, troubleshooting performance problems, or diagnosing system failures.

## Phase 1: Problem Definition

1. **Reproduce the issue consistently**
2. **Gather initial information**
3. **Check obvious causes first**

## Phase 2: Information Gathering

4. **Collect relevant logs**
5. **Check system resources**
6. **Review monitoring dashboards**`
    }
];

// Function to use sample data as fallback
function useSampleData() {
    return SAMPLE_CUSTOMIZATIONS;
}
