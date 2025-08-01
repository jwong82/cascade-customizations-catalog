# Contributing to Cascade Customizations Catalog

Thank you for your interest in contributing to the Cascade Customizations Catalog repository! This guide will help you understand how to contribute effectively.

## How to Contribute

### 1. Types of Contributions

We welcome two types of customizations:

- **Rules**: Influence Cascade's behavior in specific contexts
- **Workflows**: Step-by-step procedures for complex tasks

### 2. Contribution Requirements

For each customization you contribute, you must provide:

1. **The customization file** in the appropriate `.windsurf/` directory
2. **Documentation file** in the corresponding `docs/` directory
3. **Proper categorization** using our standardized labels

### 3. File Structure

#### Rules
- Place rule files in: `windsurf/rules/<category>/<rule-name>.md`
- Place documentation in: `docs/rules/<category>/<rule-name>.md`

#### Workflows  
- Place workflow files in: `windsurf/workflows/<category>/<workflow-name>.md`
- Place documentation in: `docs/workflows/<category>/<workflow-name>.md`

### 4. Categories

You may use these suggested top-level categories for organization:

**Rules:**
- `language/` - Language-specific rules (typescript.md, python.md, etc.)
- `framework/` - Framework-specific rules (react.md, vue.md, etc.)
- `general/` - General-purpose rules
- `security/` - Security-focused rules
- `style/` - Code style and formatting rules
- `testing/` - Testing-related rules

**Workflows:**
- `setup/` - Project setup workflows
- `testing/` - Testing workflows
- `deployment/` - Deployment workflows
- `maintenance/` - Maintenance workflows

### 5. Documentation Requirements

Each documentation file must include the required YAML frontmatter followed by structured content:

```yaml
---
labels: [comma, separated, labels]
author: [Your name/username]
modified: [YYYY-MM-DD]
---
```

Followed by:
- **H1 Title**: The name of the customization
- **Description**: What the customization does
- **Usage**: How and when to use it
- **Examples**: Practical code examples

#### Required Sections

```markdown
# [Customization Name]

## Description

[Detailed description of what this customization does]

## Usage

[How and when to use this customization]

## Examples

[Practical examples of the customization in action]
```

#### Labels

Use standardized labels from [`docs/labels.md`](docs/labels.md) for consistent categorization. Labels help users discover your customizations through search and filtering.

#### Documentation Structure

Documentation follows the same organizational structure as the customizations in the `windsurf/` directory. Each customization in the `windsurf/` directory must have a corresponding documentation file in the `docs/` directory with the same relative path and filename.

For example:
- `windsurf/rules/language/typescript.md` → `docs/rules/language/typescript.md`
- `windsurf/workflows/setup/node-project.md` → `docs/workflows/setup/node-project.md`

### 6. Quality Guidelines

- **Clear and concise**: Write customizations that are easy to understand
- **Well-documented**: Provide comprehensive documentation with examples
- **Tested**: Ensure your customizations work as expected
- **Specific**: Target specific use cases rather than being overly generic
- **Follow conventions**: Use consistent naming and formatting

### 7. Submission Process

1. Fork the repository
2. Create a new branch for your contribution
3. Add both the customization file and its documentation
4. Ensure proper labeling and categorization
5. Test your customization
6. Submit a pull request

### 8. Pull Request Requirements

Your PR must include:
- [ ] Customization file in correct `windsurf/` location
- [ ] Documentation file in corresponding `docs/` location
- [ ] Proper YAML frontmatter in documentation
- [ ] Clear description of the customization's purpose
- [ ] Usage examples
- [ ] Appropriate labels from `docs/labels.md`

### 9. Review Process

All contributions will be reviewed for:
- Functionality and correctness
- Documentation quality
- Proper categorization
- Adherence to community guidelines

### 10. Code of Conduct

- Be respectful and constructive in all interactions
- Focus on helping the community
- Provide helpful feedback during reviews
- Follow the established conventions

## Getting Help

If you need help with your contribution:
- Check existing examples in the repository
- Review the [Windsurf documentation](https://docs.windsurf.com)
- Open an issue for questions

## Recognition

Contributors will be recognized in the repository and their contributions will help the entire Windsurf community build better software with Cascade.

Thank you for contributing! 🚀
