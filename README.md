# Cascade Customizations Catalog

A community-driven repository of sample rules and workflows for Windsurf Cascade. Cascade Customizations (Rules and Workflows) guide the AI's behavior to make the tool more effective for varying use cases, frameworks, and development practices.

## Purpose

This repository serves as a centralized hub for the Windsurf community to share, discover, and contribute reference customizations that enhance Cascade. 

This catalog is intended to serve as:
1. A central location for the Windsurf community to aggregate sample rules and workflows
2. A reference repository structure that Enterprises can use to catalog and distribute proprietary and internal Cascade Customizations

## What are Customizations?

Customizations in Cascade drive Cascade's behavior and fall under the categories of Rules or Workflows:

### Rules
Rules influence how Cascade responds to user prompts. Because not all rules should apply to every user prompt, there are four types of rule activation modes:

- **Always On**: Rules that apply to every user message
- **Model Decision**: Rules that Cascade chooses to apply based on the rule's description
- **Glob-based**: Rules that Cascade applies based on file patterns (such as `*.js`, `dir/*, dir/**/*.js`)
- **Manual**: Rules that users tell Cascade to apply as desired

These rules apply guidelines for the AI to follow during response generation.

### Workflows
Workflows are explicitly defined step-by-step procedures that help Cascade work through sequential tasks. Workflows are available via the /\<workflow-name> shortcut in the Text Box.

Workflows can be used for one time tasks like project setup or repeated tasks like testing procedures, deployment processes, debugging methodology, and more.

## Repository Structure

```
windsurf/
├── rules/
├── ├── <top-level-aggregation>/<sub-aggregation>/<rule-name>.md
│   ├── framework/         # Framework-specific rules
│   ├── general/         # General rules
│   ├── language/          # Language-specific rules
│   ├── security/         # Security-focused rules
│   ├── style/            # Code style and formatting rules
│   └── testing/          # Testing-related rules
└── workflows/
├── ├── <top-level-aggregation>/<sub-aggregation>/<workflow-name>.md
    ├── setup/            # Project setup workflows
    ├── testing/          # Testing workflows
    ├── deployment/       # Deployment workflows
    └── maintenance/      # Maintenance workflows

docs/
├── rules/                # Documentation for all rules
├── workflows/            # Documentation for all workflows
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

## Resources

- [Windsurf Website](https://windsurf.com)
- [Windsurf Documentation](https://docs.windsurf.com)
- [Windsurf Rules](https://docs.windsurf.com/windsurf/cascade/memories#rules)
- [Windsurf Workflows](https://docs.windsurf.com/windsurf/cascade/workflows)

---

*Made with ❤️ by the Windsurf community*
