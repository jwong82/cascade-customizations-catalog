# Cascade Community Customizations

A community-driven repository of rules and workflows for Windsurf's Cascade AI assistant, designed to enhance and customize the AI's behavior for different use cases, frameworks, and development practices.

## Purpose

This repository serves as a centralized hub for the Windsurf community to share, discover, and contribute customizations that make Cascade more effective for specific development scenarios. Whether you're working with particular programming languages, frameworks, or following specific coding standards, you can find and contribute customizations that tailor Cascade's behavior to your needs.

## What are Customizations?

Customizations in Cascade come in two forms:

### Rules
Rules influence how Cascade behaves in specific contexts. There are four types of rule activation modes:

- **Always On**: Rules that apply to every interaction
- **Model Decision**: Rules that Cascade automatically applies when it detects certain conditions
- **Glob-based**: Rules that activate based on file patterns (e.g., `*.js`, `dir/*, dir/**/*`)
- **Manual**: Rules that users can reference when desired

### Workflows
Workflows are step-by-step procedures that guide Cascade through complex tasks like project setup, testing procedures, deployment processes, and more.

## Repository Structure

```
windsurf/
├── rules/
│   ├── language/          # Language-specific rules
│   ├── framework/         # Framework-specific rules
│   ├── testing/          # Testing-related rules
│   ├── security/         # Security-focused rules
│   └── style/            # Code style and formatting rules
└── workflows/
    ├── setup/            # Project setup workflows
    ├── testing/          # Testing workflows
    ├── deployment/       # Deployment workflows
    └── maintenance/      # Maintenance workflows

docs/
├── rules/                # Documentation for rules
├── workflows/            # Documentation for workflows
└── labels.md            # Standardized labels for categorization
```

## Getting Started

1. Browse the `windsurf/rules/` and `windsurf/workflows/` directories to find customizations
2. Check the corresponding `docs/` entries for detailed descriptions and usage examples
3. Copy the customization files to your own project's `.windsurf/` directory
4. Refer to the [Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/workflows) for more information

## Contributing

We welcome contributions from the community! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit new customizations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Community

- [Windsurf Documentation](https://docs.windsurf.com)
- [Windsurf Website](https://windsurf.com)

---

*Made with ❤️ by the Windsurf community*
