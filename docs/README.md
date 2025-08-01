# Documentation Directory

This directory contains comprehensive documentation for all customizations in the Cascade Customizations Catalog.

## Structure

All customizations in the [windsurf directory](../windsurf/) should have a corresponding metadata/documentation file in this [docs directory](./):

- **[rules/](./rules/)** - Documentation for all rule customizations
- **[workflows/](./workflows/)** - Documentation for all workflow customizations  
- **[labels.md](./labels.md)** - Standardized labels for categorizing customizations

## Documentation Requirements

Each documentation file must include:

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

## Organization

Documentation follows the same organizational structure as the customizations:

### Rules Documentation
- `rules/language/` - Language-specific rules
- `rules/framework/` - Framework-specific rules
- `rules/general/` - General-purpose rules
- `rules/security/` - Security-focused rules
- `rules/style/` - Code style and formatting rules
- `rules/testing/` - Testing-related rules

### Workflows Documentation
- `workflows/setup/` - Project setup workflows
- `workflows/testing/` - Testing workflows
- `workflows/deployment/` - Deployment workflows
- `workflows/maintenance/` - Maintenance workflows

## Contributing Documentation

When contributing a new customization, you must also provide corresponding documentation. See the [Contributing Guide](../CONTRIBUTING.md) for detailed requirements.