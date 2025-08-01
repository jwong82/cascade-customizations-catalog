// Cascade Customizations Catalog - Main Application
class CascadeCatalog {
    constructor() {
        this.customizations = [];
        this.filteredCustomizations = [];
        this.activeFilters = {
            type: 'all',
            labels: new Set(),
            search: '',
            category: null
        };
        this.allLabels = new Set();
        this.currentView = 'grid';
        this.labelsByCategory = {};
        
        this.init();
    }

    async init() {
        await this.loadCustomizations();
        this.setupEventListeners();
        this.renderLabelFilters();
        this.updateStats();
        this.filterAndRender();
        
        // Hide loading state
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resultsContainer').classList.remove('hidden');
    }

    async loadCustomizations() {
        // Detect if we're running on GitHub Pages or locally
        // Temporarily force GitHub Pages mode for testing
        const isGitHubPages = window.location.hostname.includes('github.io') || window.location.search.includes('test-gh-pages');
        const basePath = isGitHubPages ? '/cascade-customizations' : '..';
        
        const customizationPaths = [
            // Rules
            `${basePath}/docs/rules/language/typescript.md`,
            `${basePath}/docs/rules/framework/react.md`,
            `${basePath}/docs/rules/security/secure-coding.md`,
            `${basePath}/docs/rules/style/code-review-checklist.md`,
            `${basePath}/docs/rules/general/coding-best-practices.md`,
            
            // Workflows
            `${basePath}/docs/workflows/setup/node-project-setup.md`,
            `${basePath}/docs/workflows/setup/dev-environment-setup.md`,
            `${basePath}/docs/workflows/maintenance/debugging-issues.md`
        ];

        let loadedCount = 0;
        
        for (const path of customizationPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const content = await response.text();
                    const customization = this.parseCustomization(path, content);
                    if (customization) {
                        this.customizations.push(customization);
                        customization.labels.forEach(label => this.allLabels.add(label));
                        loadedCount++;
                    }
                }
            } catch (error) {
                console.warn(`Failed to load ${path}:`, error);
            }
        }
        
        // Log if no customizations were loaded
        if (loadedCount === 0) {
            console.warn('No customizations were loaded. Please ensure the markdown files are available.');
        }
    }

    parseCustomization(path, content) {
        // Parse YAML frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!frontmatterMatch) return null;

        const [, frontmatter, body] = frontmatterMatch;
        const metadata = this.parseYAML(frontmatter);
        
        // Extract title from first H1
        const titleMatch = body.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : this.getFilenameFromPath(path);
        
        // Extract description
        const descriptionMatch = body.match(/## Description\n\n([\s\S]*?)(?=\n## |\n### |$)/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';
        
        // Determine type and category from path
        const pathParts = path.split('/');
        const type = pathParts[1]; // 'rules' or 'workflows'
        const category = pathParts[2];
        const filename = pathParts[3];
        
        // Get corresponding windsurf file path
        const windsurfPath = path.replace('../docs/', '../windsurf/');
        
        return {
            id: path.replace(/[^a-zA-Z0-9]/g, '_'),
            title,
            description,
            type,
            category,
            filename,
            path,
            windsurfPath,
            labels: metadata.labels ? metadata.labels.split(',').map(l => l.trim()) : [],
            author: metadata.author || 'Unknown',
            modified: metadata.modified || '',
            content: body
        };
    }

    parseYAML(yamlString) {
        const result = {};
        const lines = yamlString.split('\n');
        
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                result[key] = value;
            }
        }
        
        return result;
    }

    getFilenameFromPath(path) {
        return path.split('/').pop().replace('.md', '').replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.activeFilters.search = e.target.value.toLowerCase();
            this.updateActiveFiltersDisplay();
            this.filterAndRender();
        });

        // Type filters
        document.getElementById('filterAll').addEventListener('click', () => this.setTypeFilter('all'));
        document.getElementById('filterRules').addEventListener('click', () => this.setTypeFilter('rules'));
        document.getElementById('filterWorkflows').addEventListener('click', () => this.setTypeFilter('workflows'));

        // View toggles
        document.getElementById('gridView').addEventListener('click', () => this.setView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.setView('list'));

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('customizationModal').addEventListener('click', (e) => {
            if (e.target.id === 'customizationModal') this.closeModal();
        });

        // Modal actions
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCurrent());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyCurrent());
        
        // Clear all filters
        document.getElementById('clearAllFilters').addEventListener('click', () => this.clearAllFilters());
        
        // Category filters
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.setCategoryFilter(category);
            });
        });
        
        // Active filter removal (delegated event listener)
        document.getElementById('activeFilters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                const filterType = e.target.dataset.filterType;
                const filterValue = e.target.dataset.filterValue;
                this.removeFilter(filterType, filterValue);
            }
        });
    }

    setTypeFilter(type) {
        this.activeFilters.type = type;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`filter${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('active');
        
        this.updateActiveFiltersDisplay();
        this.filterAndRender();
    }

    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${view}View`).classList.add('active');
        
        this.renderCustomizations();
    }

    renderLabelFilters() {
        const container = document.getElementById('labelFilters');
        
        // Clear the container first
        container.innerHTML = '';
        
        // Define label categories from docs/labels.md
        const labelCategories = {
            'Languages': ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'dart'],
            'Frameworks & Libraries': ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'express', 'fastapi', 'django', 'flask', 'spring', 'dotnet', 'laravel', 'rails'],
            'Technologies & Tools': ['docker', 'kubernetes', 'git', 'github', 'gitlab', 'jenkins', 'circleci', 'github-actions', 'aws', 'azure', 'gcp', 'terraform', 'ansible', 'nginx', 'apache', 'redis', 'mongodb', 'postgresql', 'mysql', 'elasticsearch', 'rabbitmq', 'kafka', 'graphql', 'rest', 'grpc', 'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'cypress', 'playwright', 'storybook', 'figma', 'postman', 'swagger', 'prometheus', 'grafana', 'sentry', 'datadog'],
            'Development Areas': ['frontend', 'backend', 'fullstack', 'mobile', 'desktop', 'web', 'api', 'database', 'devops', 'cloud'],
            'Practices & Methodologies': ['testing', 'security', 'performance', 'accessibility', 'documentation', 'code-review', 'refactoring', 'debugging', 'monitoring', 'logging'],
            'Project Types': ['startup', 'enterprise', 'open-source', 'prototype', 'production', 'legacy'],
            'Workflow Types': ['setup', 'deployment', 'ci-cd', 'maintenance', 'migration', 'backup', 'monitoring'],
            'Rule Activation Types': ['always-on', 'model-decision', 'glob-based', 'manual'],
            'Difficulty Levels': ['beginner', 'intermediate', 'advanced', 'expert'],
            'Team Roles': ['developer', 'team-lead', 'architect', 'devops', 'qa', 'designer']
        };
        
        // Store labels by category for filtering
        this.labelsByCategory = {};
        
        // Get all labels from customizations
        const allLabelsSet = this.allLabels;
        
        // Collect all labels across categories
        const allLabels = [];
        Object.entries(labelCategories).forEach(([category, labels]) => {
            // Initialize the category in labelsByCategory
            this.labelsByCategory[category] = [];
            
            // Process all labels from the category
            labels.forEach(label => {
                // Check if the label exists in customizations
                const exists = allLabelsSet.has(label);
                
                // Add to category collection
                this.labelsByCategory[category].push(label);
                
                // Add to all labels collection
                allLabels.push({
                    name: label,
                    category: category,
                    exists: exists
                });
            });
        });
        
        // Sort all labels alphabetically
        allLabels.sort((a, b) => a.name.localeCompare(b.name));
        
        // Filter labels by category if a category filter is active
        let labelsToShow = allLabels;
        if (this.activeFilters.category) {
            labelsToShow = allLabels.filter(label => label.category === this.activeFilters.category);
        }
        
        // Create a single container for all labels
        const labelsContainer = document.createElement('div');
        labelsContainer.className = 'flex flex-wrap gap-1';
        
        // Add filtered labels
        labelsContainer.innerHTML = labelsToShow.map(label => {
            const colorClass = this.getLabelColorClass(label.name);
            const isActive = this.activeFilters.labels.has(label.name) ? 'active' : '';
            const opacity = label.exists ? '' : 'opacity-40';
            const tooltip = label.exists ? 
                `${label.category}` : 
                `${label.category} (No matching items yet)`;
            
            return `<button class="tag label-filter ${colorClass} ${isActive} ${opacity}" data-label="${label.name}" title="${tooltip}">${label.name}</button>`;
        }).join('');
        
        container.appendChild(labelsContainer);
        
        // Add a "Show All" button when filtering by category
        if (this.activeFilters.category) {
            const showAllBtn = document.createElement('button');
            showAllBtn.className = 'mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium';
            showAllBtn.innerHTML = '<i class="fas fa-times-circle mr-1"></i> Clear category filter';
            showAllBtn.addEventListener('click', () => this.clearCategoryFilter());
            container.appendChild(showAllBtn);
        }
        
        // Add any remaining labels that weren't categorized
        const categorizedLabels = Object.values(labelCategories).flat();
        const uncategorizedLabels = Array.from(allLabelsSet)
            .filter(label => !categorizedLabels.includes(label))
            .sort();
            
        if (uncategorizedLabels.length > 0) {
            const heading = document.createElement('h3');
            heading.className = 'text-sm font-medium text-gray-700 mt-6 mb-2';
            heading.textContent = 'Other Labels';
            container.appendChild(heading);
            
            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'flex flex-wrap gap-2 mb-4';
            
            labelsContainer.innerHTML = uncategorizedLabels.map(label => {
                const colorClass = this.getLabelColorClass(label);
                return `<button class="tag label-filter ${colorClass}" data-label="${label}">${label}</button>`;
            }).join('');
            
            container.appendChild(labelsContainer);
        }

        // Add click handlers
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('label-filter')) {
                const label = e.target.dataset.label;
                this.toggleLabelFilter(label);
            }
        });
    }

    getLabelColorClass(label) {
        // Find which category this label belongs to
        for (const [category, labels] of Object.entries(this.labelsByCategory)) {
            if (labels.includes(label)) {
                switch(category) {
                    case 'Languages':
                        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
                    case 'Frameworks & Libraries':
                        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
                    case 'Technologies & Tools':
                        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
                    case 'Development Areas':
                        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
                    case 'Practices & Methodologies':
                        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
                    case 'Project Types':
                        return 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200';
                    case 'Workflow Types':
                        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
                    case 'Rule Activation Types':
                        return 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200';
                    case 'Difficulty Levels':
                        return 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200';
                    case 'Team Roles':
                        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
                    default:
                        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
                }
            }
        }
        
        // Fallback for uncategorized labels
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    }

    toggleLabelFilter(label) {
        if (this.activeFilters.labels.has(label)) {
            this.activeFilters.labels.delete(label);
        } else {
            this.activeFilters.labels.add(label);
        }
        
        // Update button state
        const button = document.querySelector(`[data-label="${label}"]`);
        button.classList.toggle('active');
        
        this.updateActiveFiltersDisplay();
        this.filterAndRender();
    }
    
    clearAllFilters() {
        // Clear label filters
        this.activeFilters.labels.clear();
        
        // Reset all filter buttons
        document.querySelectorAll('.label-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset search
        document.getElementById('searchInput').value = '';
        this.activeFilters.search = '';
        
        // Reset type filter to 'all'
        this.setTypeFilter('all');
        
        // Clear category filter
        this.clearCategoryFilter();
        
        this.updateActiveFiltersDisplay();
        this.filterAndRender();
    }
    
    setCategoryFilter(category) {
        // Set the active category filter
        this.activeFilters.category = category;
        
        // Update visual state of category buttons
        document.querySelectorAll('.category-filter').forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Re-render the label filters to show only labels from this category
        this.renderLabelFilters();
        
        // Update the active filters display
        this.updateActiveFiltersDisplay();
    }
    
    clearCategoryFilter() {
        // Clear the category filter
        this.activeFilters.category = null;
        
        // Reset all category filter buttons
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Re-render the label filters to show all labels
        this.renderLabelFilters();
        
        // Update the active filters display
        this.updateActiveFiltersDisplay();
    }
    
    removeFilter(filterType, filterValue) {
        switch(filterType) {
            case 'type':
                // Reset type filter to 'all'
                this.setTypeFilter('all');
                break;
                
            case 'category':
                // Clear category filter
                this.clearCategoryFilter();
                break;
                
            case 'search':
                // Clear search input
                document.getElementById('searchInput').value = '';
                this.activeFilters.search = '';
                this.updateActiveFiltersDisplay();
                this.filterAndRender();
                break;
                
            case 'label':
                // Remove the label from active filters
                this.activeFilters.labels.delete(filterValue);
                
                // Update button state
                document.querySelectorAll(`[data-label="${filterValue}"]`).forEach(btn => {
                    btn.classList.remove('active');
                });
                
                this.updateActiveFiltersDisplay();
                this.filterAndRender();
                break;
        }
    }
    
    updateActiveFiltersDisplay() {
        const activeFiltersSection = document.getElementById('activeFiltersSection');
        const activeFiltersContainer = document.getElementById('activeFilters');
        
        const hasActiveFilters = this.activeFilters.labels.size > 0 || 
                                this.activeFilters.search || 
                                this.activeFilters.type !== 'all' ||
                                this.activeFilters.category !== null;
        
        if (hasActiveFilters) {
            activeFiltersSection.classList.remove('hidden');
            
            const filterTags = [];
            
            // Add type filter if not 'all'
            if (this.activeFilters.type !== 'all') {
                filterTags.push(`<span class="tag bg-indigo-100 text-indigo-800 border-indigo-200 cursor-pointer filter-tag" data-filter-type="type" data-filter-value="${this.activeFilters.type}">Type: ${this.activeFilters.type}</span>`);
            }
            
            // Add category filter if present
            if (this.activeFilters.category) {
                // Get the color class based on the category
                let colorClass = '';
                switch(this.activeFilters.category) {
                    case 'Languages':
                        colorClass = 'bg-green-100 text-green-800 border-green-200';
                        break;
                    case 'Frameworks & Libraries':
                        colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
                        break;
                    case 'Technologies & Tools':
                        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        break;
                    case 'Development Areas':
                        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
                        break;
                    case 'Practices & Methodologies':
                        colorClass = 'bg-red-100 text-red-800 border-red-200';
                        break;
                    case 'Project Types':
                        colorClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                        break;
                    case 'Workflow Types':
                        colorClass = 'bg-orange-100 text-orange-800 border-orange-200';
                        break;
                    case 'Rule Activation Types':
                        colorClass = 'bg-teal-100 text-teal-800 border-teal-200';
                        break;
                    case 'Difficulty Levels':
                        colorClass = 'bg-pink-100 text-pink-800 border-pink-200';
                        break;
                    case 'Team Roles':
                        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
                        break;
                    default:
                        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
                }
                filterTags.push(`<span class="tag ${colorClass} cursor-pointer filter-tag" data-filter-type="category" data-filter-value="${this.activeFilters.category}">Category: ${this.activeFilters.category}</span>`);
            }
            
            // Add search filter if present
            if (this.activeFilters.search) {
                filterTags.push(`<span class="tag bg-gray-100 text-gray-800 border-gray-200 cursor-pointer filter-tag" data-filter-type="search" data-filter-value="${this.activeFilters.search}">Search: "${this.activeFilters.search}"</span>`);
            }
            
            // Add label filters
            Array.from(this.activeFilters.labels).forEach(label => {
                const colorClass = this.getLabelColorClass(label);
                filterTags.push(`<span class="tag ${colorClass} cursor-pointer filter-tag" data-filter-type="label" data-filter-value="${label}">${label}</span>`);
            });
            
            activeFiltersContainer.innerHTML = filterTags.join('');
        } else {
            activeFiltersSection.classList.add('hidden');
        }
    }

    filterAndRender() {
        this.filteredCustomizations = this.customizations.filter(customization => {
            // Type filter
            if (this.activeFilters.type !== 'all' && customization.type !== this.activeFilters.type) {
                return false;
            }
            
            // Label filter
            if (this.activeFilters.labels.size > 0) {
                const hasMatchingLabel = Array.from(this.activeFilters.labels)
                    .some(label => customization.labels.includes(label));
                if (!hasMatchingLabel) return false;
            }
            
            // Search filter
            if (this.activeFilters.search) {
                const searchTerm = this.activeFilters.search;
                const searchableText = [
                    customization.title,
                    customization.description,
                    customization.category,
                    ...customization.labels
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) return false;
            }
            
            return true;
        });
        
        this.renderCustomizations();
    }

    renderCustomizations() {
        const container = document.getElementById('customizationsGrid');
        const resultCount = document.getElementById('resultCount');
        const noResults = document.getElementById('noResults');
        
        resultCount.textContent = this.filteredCustomizations.length;
        
        if (this.filteredCustomizations.length === 0) {
            container.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        
        noResults.classList.add('hidden');
        
        if (this.currentView === 'grid') {
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            container.innerHTML = this.filteredCustomizations.map(customization => 
                this.renderCustomizationCard(customization)
            ).join('');
        } else {
            container.className = 'space-y-4';
            container.innerHTML = this.filteredCustomizations.map(customization => 
                this.renderCustomizationListItem(customization)
            ).join('');
        }
        
        // Add click handlers
        container.addEventListener('click', (e) => {
            const card = e.target.closest('[data-customization-id]');
            if (card) {
                const id = card.dataset.customizationId;
                const customization = this.customizations.find(c => c.id === id);
                if (customization) this.openModal(customization);
            }
        });
    }

    renderCustomizationCard(customization) {
        const typeColor = customization.type === 'rules' ? 'blue' : 'purple';
        const typeIcon = customization.type === 'rules' ? 'fas fa-cogs' : 'fas fa-list-ol';
        
        return `
            <div class="bg-white rounded-lg shadow-md card-hover cursor-pointer" data-customization-id="${customization.id}">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${typeColor}-100 text-${typeColor}-800">
                            <i class="${typeIcon} mr-1"></i>
                            ${customization.type.charAt(0).toUpperCase() + customization.type.slice(1, -1)}
                        </span>
                        <span class="text-sm text-gray-500">${customization.category}</span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${customization.title}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${customization.description}</p>
                    
                    <div class="mb-3">
                        <div class="flex flex-wrap gap-1.5">
                            ${customization.labels.slice(0, 3).map(label => 
                                `<span class="tag ${this.getLabelColorClass(label)}">${label}</span>`
                            ).join('')}
                            ${customization.labels.length > 3 ? `<span class="tag bg-gray-200 text-gray-600 border-gray-300">+${customization.labels.length - 3} more</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>by ${customization.author}</span>
                        <span>${customization.modified}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCustomizationListItem(customization) {
        const typeColor = customization.type === 'rules' ? 'blue' : 'purple';
        const typeIcon = customization.type === 'rules' ? 'fas fa-cogs' : 'fas fa-list-ol';
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" data-customization-id="${customization.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${typeColor}-100 text-${typeColor}-800 mr-3">
                                <i class="${typeIcon} mr-1"></i>
                                ${customization.type.charAt(0).toUpperCase() + customization.type.slice(1, -1)}
                            </span>
                            <span class="text-sm text-gray-500">${customization.category}</span>
                        </div>
                        
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">${customization.title}</h3>
                        <p class="text-gray-600 mb-3">${customization.description}</p>
                        
                        <div class="mb-3">
                            <div class="flex flex-wrap gap-1.5">
                                ${customization.labels.map(label => 
                                    `<span class="tag ${this.getLabelColorClass(label)}">${label}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="flex items-center text-sm text-gray-500">
                            <span>by ${customization.author}</span>
                            <span class="mx-2">•</span>
                            <span>${customization.modified}</span>
                        </div>
                    </div>
                    
                    <div class="ml-4">
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const rules = this.customizations.filter(c => c.type === 'rules').length;
        const workflows = this.customizations.filter(c => c.type === 'workflows').length;
        
        document.getElementById('totalRules').textContent = rules;
        document.getElementById('totalWorkflows').textContent = workflows;
        document.getElementById('totalCustomizations').textContent = this.customizations.length;
    }

    openModal(customization) {
        this.currentCustomization = customization;
        
        document.getElementById('modalTitle').textContent = customization.title;
        document.getElementById('modalContent').innerHTML = marked.parse(customization.content);
        
        // Set type badge
        const typeSpan = document.getElementById('modalType');
        const typeColor = customization.type === 'rules' ? 'blue' : 'purple';
        typeSpan.className = `px-3 py-1 rounded-full text-sm font-medium bg-${typeColor}-100 text-${typeColor}-800`;
        typeSpan.textContent = customization.type.charAt(0).toUpperCase() + customization.type.slice(1, -1);
        
        // Set labels
        const modalLabels = document.getElementById('modalLabels');
        modalLabels.innerHTML = customization.labels.map(label => 
            `<span class="tag ${this.getLabelColorClass(label)}">${label}</span>`
        ).join('');
        modalLabels.className = 'flex flex-wrap gap-1.5 max-w-md';
        
        // Show modal
        document.getElementById('customizationModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Highlight code blocks
        Prism.highlightAll();
    }

    closeModal() {
        document.getElementById('customizationModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    async downloadCurrent() {
        if (!this.currentCustomization) return;
        
        try {
            const response = await fetch(this.currentCustomization.windsurfPath);
            const content = await response.text();
            
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.currentCustomization.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    }

    async copyCurrent() {
        if (!this.currentCustomization) return;
        
        try {
            const response = await fetch(this.currentCustomization.windsurfPath);
            const content = await response.text();
            
            await navigator.clipboard.writeText(content);
            
            // Show feedback
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
            btn.classList.add('bg-green-600');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-green-600');
            }, 2000);
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Copy failed. Please try again.');
        }
    }
}

// Add CSS for filter buttons and modal content styling
const style = document.createElement('style');
style.textContent = `
    .filter-btn {
        background-color: #f3f4f6;
        color: #6b7280;
    }
    .filter-btn.active {
        background-color: #3b82f6;
        color: white;
    }
    .view-btn {
        background-color: #f3f4f6;
        color: #6b7280;
    }
    .view-btn.active {
        background-color: #374151;
        color: white;
    }
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    /* Modal content typography styles */
    #modalContent h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: #111827;
    }
    #modalContent h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: #1f2937;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 0.5rem;
    }
    #modalContent h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1.25rem;
        margin-bottom: 1rem;
        color: #374151;
    }
    #modalContent h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: #4b5563;
    }
    #modalContent p {
        margin-bottom: 1rem;
        line-height: 1.6;
        color: #4b5563;
    }
    #modalContent ul, #modalContent ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
    }
    #modalContent li {
        margin-bottom: 0.5rem;
    }
    #modalContent code {
        background-color: #f3f4f6;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.9em;
    }
    #modalContent pre {
        margin-bottom: 1rem;
        background-color: #1f2937;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CascadeCatalog();
});
