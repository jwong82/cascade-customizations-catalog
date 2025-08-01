// Cascade Customizations Catalog - Main Application
class CascadeCatalog {
    constructor() {
        this.customizations = [];
        this.filteredCustomizations = [];
        this.activeFilters = {
            type: 'all',
            labels: new Set(),
            search: ''
        };
        this.allLabels = new Set();
        this.currentView = 'grid';
        
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
        // Try to load from GitHub API first, then fall back to direct file access
        const customizationPaths = [
            // Rules
            '../docs/rules/language/typescript.md',
            '../docs/rules/framework/react.md',
            '../docs/rules/security/secure-coding.md',
            '../docs/rules/style/code-review-checklist.md',
            '../docs/rules/general/coding-best-practices.md',
            
            // Workflows
            '../docs/workflows/setup/node-project-setup.md',
            '../docs/workflows/setup/dev-environment-setup.md',
            '../docs/workflows/maintenance/debugging-issues.md'
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
        
        // If no files were loaded, use sample data
        if (loadedCount === 0 && typeof SAMPLE_CUSTOMIZATIONS !== 'undefined') {
            console.log('Using sample data as fallback');
            this.customizations = SAMPLE_CUSTOMIZATIONS;
            this.customizations.forEach(customization => {
                customization.labels.forEach(label => this.allLabels.add(label));
            });
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
        const sortedLabels = Array.from(this.allLabels).sort();
        
        container.innerHTML = sortedLabels.map(label => {
            const colorClass = this.getLabelColorClass(label);
            return `<button class="tag label-filter ${colorClass}" data-label="${label}">${label}</button>`;
        }).join('');

        // Add click handlers
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('label-filter')) {
                const label = e.target.dataset.label;
                this.toggleLabelFilter(label);
            }
        });
    }

    getLabelColorClass(label) {
        // Categorize labels by type for color coding
        const languageLabels = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'dart'];
        const frameworkLabels = ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'express', 'fastapi', 'django', 'flask', 'spring', 'dotnet', 'laravel', 'rails'];
        const toolLabels = ['docker', 'kubernetes', 'git', 'github', 'gitlab', 'jenkins', 'webpack', 'vite', 'eslint', 'prettier', 'jest', 'cypress'];
        const practiceLabels = ['security', 'testing', 'performance', 'accessibility', 'best-practices', 'code-quality', 'debugging'];
        
        if (languageLabels.includes(label)) {
            return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
        } else if (frameworkLabels.includes(label)) {
            return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
        } else if (toolLabels.includes(label)) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
        } else if (practiceLabels.includes(label)) {
            return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        } else {
            return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        }
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
        
        this.updateActiveFiltersDisplay();
        this.filterAndRender();
    }
    
    updateActiveFiltersDisplay() {
        const activeFiltersSection = document.getElementById('activeFiltersSection');
        const activeFiltersContainer = document.getElementById('activeFilters');
        
        const hasActiveFilters = this.activeFilters.labels.size > 0 || 
                                this.activeFilters.search || 
                                this.activeFilters.type !== 'all';
        
        if (hasActiveFilters) {
            activeFiltersSection.classList.remove('hidden');
            
            const filterTags = [];
            
            // Add type filter if not 'all'
            if (this.activeFilters.type !== 'all') {
                filterTags.push(`<span class="tag text-xs bg-indigo-100 text-indigo-800 border-indigo-200">Type: ${this.activeFilters.type}</span>`);
            }
            
            // Add search filter if present
            if (this.activeFilters.search) {
                filterTags.push(`<span class="tag text-xs bg-gray-100 text-gray-800 border-gray-200">Search: "${this.activeFilters.search}"</span>`);
            }
            
            // Add label filters
            Array.from(this.activeFilters.labels).forEach(label => {
                const colorClass = this.getLabelColorClass(label);
                filterTags.push(`<span class="tag text-xs ${colorClass}">${label}</span>`);
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
                                `<span class="tag text-xs ${this.getLabelColorClass(label)}">${label}</span>`
                            ).join('')}
                            ${customization.labels.length > 3 ? `<span class="tag text-xs bg-gray-200 text-gray-600 border-gray-300">+${customization.labels.length - 3} more</span>` : ''}
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
                                    `<span class="tag text-xs ${this.getLabelColorClass(label)}">${label}</span>`
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
            `<span class="tag text-xs ${this.getLabelColorClass(label)}">${label}</span>`
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

// Add CSS for filter buttons
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
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CascadeCatalog();
});
