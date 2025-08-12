import { MetadataExtractor } from './MetadataExtractor.js?v=final';
import { DateUtils } from '../utils/DateUtils.js?v=final';

/**
 * Handles data loading and processing with environment-aware path resolution
 */
export class DataLoader {
    constructor() {
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.basePath = this.getBasePath();
        this.fileExtension = this.isGitHubPages ? '.html' : '.md';
    }
    
    getBasePath() {
        if (this.isGitHubPages) {
            // GitHub Pages: Jekyll converts .md to .html, use absolute paths
            const pathParts = window.location.pathname.split('/').filter(part => part);
            const repoName = pathParts[0] || 'cascade-customizations-catalog';
            return `/${repoName}`;
        } else {
            // Local development: serve raw .md files with relative paths
            return '..';
        }
    }
    
    async loadCustomizations() {
        const customizations = [];
        
        try {
            // Load rules
            const rulesData = await this.loadCustomizationsFromDirectory('rules');
            customizations.push(...rulesData);
            
            // Load workflows
            const workflowsData = await this.loadCustomizationsFromDirectory('workflows');
            customizations.push(...workflowsData);
            
            console.log(`Loaded ${customizations.length} customizations total`);
            return customizations;
        } catch (error) {
            console.error('Failed to load customizations:', error);
            return [];
        }
    }
    
    async loadCustomizationsFromDirectory(type) {
        const customizations = [];
        
        // Define actual directory structure
        const directories = type === 'rules' 
            ? ['framework', 'language', 'security', 'style']
            : ['maintenance', 'setup'];
            
        for (const dir of directories) {
            try {
                const items = await this.loadFromSubdirectory(type, dir);
                customizations.push(...items);
            } catch (error) {
                console.warn(`Failed to load from ${type}/${dir}:`, error);
            }
        }
        
        return customizations;
    }
    
    async loadFromSubdirectory(type, subdir) {
        const items = [];
        
        // Since there are no index files, we'll use a predefined list of known files
        const knownFiles = this.getKnownFiles(type, subdir);
        
        for (const fileInfo of knownFiles) {
            try {
                const item = await this.loadSingleCustomization(fileInfo, type, subdir);
                if (item) items.push(item);
            } catch (error) {
                console.warn(`Failed to load ${fileInfo.filename}:`, error);
            }
        }
        
        return items;
    }
    
    getKnownFiles(type, subdir) {
        // Define the actual files that exist in the repository
        const fileMap = {
            'rules': {
                'framework': [
                    { title: 'React Best Practices', filename: 'react.md' }
                ],
                'language': [
                    { title: 'Java Development Guidelines', filename: 'java.md' },
                    { title: 'TypeScript Best Practices', filename: 'typescript.md' }
                ],
                'security': [
                    { title: 'Secure Coding Practices', filename: 'secure-coding.md' }
                ],
                'style': [
                    { title: 'Code Review Checklist', filename: 'code-review-checklist.md' },
                    { title: 'Coding Best Practices', filename: 'coding-best-practices.md' }
                ]
            },
            'workflows': {
                'maintenance': [
                    { title: 'Debugging Issues Workflow', filename: 'debugging-issues.md' }
                ],
                'setup': [
                    { title: 'Development Environment Setup', filename: 'dev-environment-setup.md' },
                    { title: 'Node.js Project Setup', filename: 'node-project-setup.md' }
                ]
            }
        };
        
        return fileMap[type]?.[subdir] || [];
    }
    
    async loadSingleCustomization(link, type, subdir) {
        const filePath = `${this.basePath}/docs/${type}/${subdir}/${link.filename}`;
        const windsurfPath = filePath.replace(this.fileExtension, '.md');
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) return null;
            
            const content = await response.text();
            
            // Extract metadata
            let metadata = {};
            if (this.isGitHubPages) {
                metadata = MetadataExtractor.extractMetadataFromHTML(content);
            } else {
                metadata = MetadataExtractor.extractMetadataFromYAML(content);
            }
            
            // Fallback label extraction if no metadata labels found
            if (!metadata.labels || metadata.labels.length === 0) {
                metadata.labels = MetadataExtractor.extractLabelsFromContent(content);
            }
            
            // Extract description from content
            const description = this.extractDescription(content);
            
            return {
                id: `${type}-${subdir}-${link.filename.replace('.md', '')}`,
                title: link.title,
                description: description,
                type: type,
                category: this.formatCategory(metadata.category || subdir),
                labels: metadata.labels || [],
                author: metadata.author || 'Unknown',
                activation: metadata.activation || 'manual',
                filename: link.filename,
                path: filePath,
                windsurfPath: windsurfPath,
                modified: DateUtils.formatDate(metadata.modified || new Date().toISOString())
            };
        } catch (error) {
            console.warn(`Failed to process ${link.filename}:`, error);
            return null;
        }
    }
    
    extractDescription(content) {
        // Remove YAML frontmatter
        const withoutYaml = content.replace(/^---[\s\S]*?---\n/, '');
        
        // Remove HTML comments
        const withoutComments = withoutYaml.replace(/<!--[\s\S]*?-->/g, '');
        
        // Find first paragraph
        const lines = withoutComments.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
                return trimmed.substring(0, 200) + (trimmed.length > 200 ? '...' : '');
            }
        }
        
        return 'No description available';
    }
    
    formatCategory(key) {
        const map = {
            // Rules categories
            'language': 'Languages',
            'languages': 'Languages',
            'framework': 'Frameworks & Libraries',
            'frameworks & libraries': 'Frameworks & Libraries',
            'security': 'Security',
            'style': 'Style',
            // Workflow categories (not shown in sidebar but used for display)
            'maintenance': 'Maintenance',
            'setup': 'Setup'
        };
        const normalized = String(key || '').toLowerCase();
        if (map[normalized]) return map[normalized];
        // Fallback: Title Case
        return normalized.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
}
