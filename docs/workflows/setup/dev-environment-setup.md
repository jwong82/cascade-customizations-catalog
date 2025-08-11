---
labels: development-environment, setup, onboarding, tools, configuration, git, nodejs, vscode, beginner
author: Cascade Community
modified: 2025-08-01
---

# Dev Environment Setup Workflow

## Description

A comprehensive workflow for setting up a complete development environment from scratch. This workflow is designed for new team members joining a project or developers setting up a fresh development machine. It covers all essential tools, configurations, and team-specific requirements needed for productive development.

## Usage

Use this workflow when:
- Onboarding new team members
- Setting up a fresh development machine
- Standardizing development environments across a team
- Recovering from system crashes or reinstalls
- Establishing consistent tooling for a new project

This workflow is particularly valuable for:
- **Team leads** setting up standardized environments
- **New developers** joining existing projects
- **DevOps teams** creating reproducible development setups
- **Remote teams** ensuring consistent tooling

## Examples

### Quick Environment Verification
After running the workflow, you can quickly verify your setup:

```bash
# Check all essential tools
node --version && npm --version
git --version
code --version
docker --version

# Test project setup
cd ~/workspace/main-project
npm install && npm test && npm run dev
```

### Customizing for Different Tech Stacks

#### Frontend-focused Setup
```bash
# Additional frontend tools
npm install -g @angular/cli create-react-app
brew install --cask figma
```

#### Backend-focused Setup
```bash
# Additional backend tools
brew install postgresql redis docker
npm install -g pm2 nodemon
```

#### Full-stack Setup
```bash
# Database management
brew install --cask dbeaver-community
# API testing
brew install --cask postman insomnia
```

### Team-specific Customizations

#### Startup Environment
```bash
# Lightweight, fast setup
nvm install node
npm install -g create-react-app vercel
```

#### Enterprise Environment
```bash
# Security and compliance tools
brew install --cask 1password
# VPN and enterprise tools setup
# SSO configuration
```

### Environment Variables Template
```bash
# .env.template for team projects
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379
API_BASE_URL=http://localhost:3000/api
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### VS Code Settings for Team Consistency
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Git Configuration Best Practices
```bash
# Team-wide Git hooks setup
git config --global core.hooksPath .githooks
chmod +x .githooks/pre-commit

# Consistent line endings
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows
```

### Troubleshooting Common Setup Issues

#### Node.js Version Conflicts
```bash
# Clean npm cache
npm cache clean --force
# Reinstall Node.js via nvm
nvm uninstall node
nvm install --lts
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
# Or use nvm to avoid sudo
```

#### Database Connection Issues
```bash
# Reset PostgreSQL
brew services restart postgresql
# Check if port is available
lsof -i :5432
```

This workflow ensures that every team member has a consistent, fully-functional development environment that matches the project's requirements and team standards.

<!-- METADATA
labels: development-environment, setup, onboarding, tools, configuration, git, nodejs, vscode, beginner
author: Cascade Community
activation: manual
category: Workflows
-->
