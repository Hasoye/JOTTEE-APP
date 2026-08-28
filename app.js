/**
 * JOTTEE — Modern Note Taking Application MVP
 * Clean ES6 Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Initial State & Default Sample Data
    // ----------------------------------------------------------------------
    const STORAGE_KEY = 'jottee_notes_db';
    const THEME_KEY = 'jottee_theme_pref';

    const SAMPLE_NOTES = [
        {
            id: 'sample-1',
            title: '⚡ Welcome to Jottee!',
            content: 'Jottee is your sleek, high-speed space for ideas, code snippets, and daily tasks.\n\n### Key Features:\n- 🚀 **Fast & Local**: All your data stays safely in your browser storage.\n- 🎨 **Colors & Tags**: Categorize with custom tags and vibrant color accents.\n- 📌 **Pin & Favorite**: Keep your high-priority notes at the top.\n- 📝 **Markdown Preview**: Click the eye icon in the editor toolbar to toggle live markdown preview.\n- ⌨️ **Shortcuts**: Press `Ctrl+N` for a new note, `Ctrl+F` to search, or `Esc` to exit.',
            tags: ['getting-started', 'tips'],
            color: 'purple',
            isPinned: true,
            isFavorite: true,
            inTrash: false,
            createdAt: Date.now() - 3600000 * 24,
            updatedAt: Date.now() - 3600000 * 2
        },
        {
            id: 'sample-2',
            title: '💡 Product Launch Checklist',
            content: 'Final tasks before releasing the MVP to initial user group:\n\n- [x] Finalize UI layout & glassmorphic styling\n- [x] Verify LocalStorage auto-save mechanism\n- [ ] Write user feedback survey form\n- [ ] Conduct mobile browser responsiveness audit\n\n> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
            tags: ['work', 'tasks'],
            color: 'emerald',
            isPinned: true,
            isFavorite: false,
            inTrash: false,
            createdAt: Date.now() - 3600000 * 48,
            updatedAt: Date.now() - 3600000 * 5
        },
        {
            id: 'sample-3',
            title: '💻 Dark Mode CSS snippet',
            content: 'Useful CSS variables template for dark mode glassmorphism components:\n\n```css\n:root {\n  --bg-glass: rgba(17, 24, 39, 0.75);\n  --blur-glass: blur(16px);\n  --border-glow: rgba(99, 102, 241, 0.3);\n}\n```',
            tags: ['code', 'snippets'],
            color: 'blue',
            isPinned: false,
            isFavorite: true,
            inTrash: false,
            createdAt: Date.now() - 3600000 * 72,
            updatedAt: Date.now() - 3600000 * 12
        }
    ];

    let state = {
        notes: [],
        activeView: 'all', // 'all', 'pinned', 'favorites', 'trash'
        selectedTag: null,
        selectedColor: 'all',
        searchQuery: '',
        sortOrder: 'updated-desc', // 'updated-desc', 'created-desc', 'created-asc', 'title-asc'
        viewMode: 'grid', // 'grid' or 'list'
        activeNoteId: null,
        theme: localStorage.getItem(THEME_KEY) || 'dark',
        autoSaveTimeout: null,
        pendingConfirmAction: null
    };

    // ----------------------------------------------------------------------
    // 2. DOM Elements
    // ----------------------------------------------------------------------
    const DOM = {
        app: document.getElementById('app'),
        sidebar: document.getElementById('sidebar'),
        openSidebarBtn: document.getElementById('openSidebarBtn'),
        closeSidebarBtn: document.getElementById('closeSidebarBtn'),
        sidebarNewNoteBtn: document.getElementById('sidebarNewNoteBtn'),
        headerNewNoteBtn: document.getElementById('headerNewNoteBtn'),
        emptyStateActionBtn: document.getElementById('emptyStateActionBtn'),
        
        navItems: document.querySelectorAll('.sidebar-nav .nav-item'),
        sidebarTagsList: document.getElementById('sidebarTagsList'),
        addTagQuickBtn: document.getElementById('addTagQuickBtn'),
        colorFilters: document.getElementById('colorFilters'),
        
        countAll: document.getElementById('countAll'),
        countPinned: document.getElementById('countPinned'),
        countFavorites: document.getElementById('countFavorites'),
        countTrash: document.getElementById('countTrash'),
        
        storageFill: document.getElementById('storageFill'),
        storageText: document.getElementById('storageText'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),
        exportDataBtn: document.getElementById('exportDataBtn'),
        importDataBtn: document.getElementById('importDataBtn'),
        importFileInput: document.getElementById('importFileInput'),
        
        currentViewTitle: document.getElementById('currentViewTitle'),
        currentViewSubtitle: document.getElementById('currentViewSubtitle'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        sortSelect: document.getElementById('sortSelect'),
        viewModeGrid: document.getElementById('viewModeGrid'),
        viewModeList: document.getElementById('viewModeList'),
        emptyTrashBtn: document.getElementById('emptyTrashBtn'),
        
        activeFilterBanner: document.getElementById('activeFilterBanner'),
        activeFilterText: document.getElementById('activeFilterText'),
        clearFilterBtn: document.getElementById('clearFilterBtn'),
        
        notesContainer: document.getElementById('notesContainer'),
        emptyState: document.getElementById('emptyState'),
        emptyStateTitle: document.getElementById('emptyStateTitle'),
        emptyStateDesc: document.getElementById('emptyStateDesc'),
        
        // Editor Elements
        editorOverlay: document.getElementById('editorOverlay'),
        editorDrawer: document.getElementById('editorDrawer'),
        closeEditorBtn: document.getElementById('closeEditorBtn'),
        editorCloseSaveBtn: document.getElementById('editorCloseSaveBtn'),
        saveStatus: document.getElementById('saveStatus'),
        saveStatusText: document.getElementById('saveStatusText'),
        editorColorPicker: document.getElementById('editorColorPicker'),
        togglePinBtn: document.getElementById('togglePinBtn'),
        toggleFavBtn: document.getElementById('toggleFavBtn'),
        editorMenuBtn: document.getElementById('editorMenuBtn'),
        editorDropdown: document.getElementById('editorDropdown'),
        
        exportMarkdownBtn: document.getElementById('exportMarkdownBtn'),
        exportTextBtn: document.getElementById('exportTextBtn'),
        duplicateNoteBtn: document.getElementById('duplicateNoteBtn'),
        deleteNoteBtn: document.getElementById('deleteNoteBtn'),
        
        toolbarBtns: document.querySelectorAll('.toolbar-btn[data-format]'),
        togglePreviewBtn: document.getElementById('togglePreviewBtn'),
        
        editorTagsList: document.getElementById('editorTagsList'),
        tagInput: document.getElementById('tagInput'),
        
        editorBody: document.getElementById('editorBody'),
        noteTitleInput: document.getElementById('noteTitleInput'),
        noteContentInput: document.getElementById('noteContentInput'),
        previewPane: document.getElementById('previewPane'),
        previewTitle: document.getElementById('previewTitle'),
        previewContent: document.getElementById('previewContent'),
        
        wordCount: document.getElementById('wordCount'),
        charCount: document.getElementById('charCount'),
        lastEditedTime: document.getElementById('lastEditedTime'),
        
        // Modal & Toast
        confirmModal: document.getElementById('confirmModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalMessage: document.getElementById('modalMessage'),
        modalCancelBtn: document.getElementById('modalCancelBtn'),
        modalConfirmBtn: document.getElementById('modalConfirmBtn'),
        toastContainer: document.getElementById('toastContainer')
    };

    // ----------------------------------------------------------------------
    // 3. Storage & Initialization
    // ----------------------------------------------------------------------
    function init() {
        // Load Theme
        applyTheme(state.theme);

        // Load Notes
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                state.notes = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse notes from storage:', e);
                state.notes = [...SAMPLE_NOTES];
            }
        } else {
            state.notes = [...SAMPLE_NOTES];
            saveToStorage();
        }

        bindEvents();
        render();
        updateStorageMeter();
        refreshLucideIcons();
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes));
            updateStorageMeter();
        } catch (e) {
            showToast('Storage limit reached or access denied!', 'error');
        }
    }

    function updateStorageMeter() {
        const json = JSON.stringify(state.notes);
        const bytes = new Blob([json]).size;
        const maxBytes = 5 * 1024 * 1024; // ~5MB localStorage typical quota
        const percent = Math.min(100, Math.round((bytes / maxBytes) * 100));
        
        DOM.storageFill.style.width = `${Math.max(4, percent)}%`;
        DOM.storageText.textContent = `Used ~${(bytes / 1024).toFixed(1)} KB of 5MB`;
    }

    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        if (theme === 'dark') {
            DOM.themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            DOM.themeIcon.setAttribute('data-lucide', 'sun');
        }
        refreshLucideIcons();
    }

    function refreshLucideIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // ----------------------------------------------------------------------
    // 4. Data Operations (CRUD)
    // ----------------------------------------------------------------------
    function createNewNote(title = '', content = '') {
        const newNote = {
            id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title: title || '',
            content: content || '',
            tags: state.selectedTag ? [state.selectedTag] : [],
            color: 'purple',
            isPinned: false,
            isFavorite: state.activeView === 'favorites',
            inTrash: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        state.notes.unshift(newNote);
        saveToStorage();
        render();
        openEditor(newNote.id);
        DOM.noteTitleInput.focus();
        showToast('New note created', 'success');
    }

    function getActiveNote() {
        return state.notes.find(n => n.id === state.activeNoteId) || null;
    }

    function updateActiveNote(changes) {
        const note = getActiveNote();
        if (!note) return;

        Object.assign(note, changes, { updatedAt: Date.now() });
        saveToStorage();
        triggerAutoSaveStatus();
        renderNotesList();
        updateNavCounts();
    }

    function deleteNote(id, permanent = false) {
        const note = state.notes.find(n => n.id === id);
        if (!note) return;

        if (permanent || note.inTrash) {
            state.notes = state.notes.filter(n => n.id !== id);
            showToast('Note permanently deleted', 'info');
        } else {
            note.inTrash = true;
            note.updatedAt = Date.now();
            showToast('Note moved to Trash', 'warning');
        }

        saveToStorage();
        if (state.activeNoteId === id) {
            closeEditor();
        }
        render();
    }

    function restoreNote(id) {
        const note = state.notes.find(n => n.id === id);
        if (!note) return;

        note.inTrash = false;
        note.updatedAt = Date.now();
        saveToStorage();
        render();
        showToast('Note restored from Trash', 'success');
    }

    function emptyTrash() {
        const trashCount = state.notes.filter(n => n.inTrash).length;
        if (trashCount === 0) return;

        showConfirmModal(
            'Empty Trash?',
            `Are you sure you want to permanently delete ${trashCount} item(s)? This action cannot be undone.`,
            () => {
                state.notes = state.notes.filter(n => !n.inTrash);
                saveToStorage();
                render();
                showToast('Trash emptied', 'info');
            }
        );
    }

    function duplicateNote(id) {
        const original = state.notes.find(n => n.id === id);
        if (!original) return;

        const copy = {
            ...JSON.parse(JSON.stringify(original)),
            id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title: `${original.title} (Copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        state.notes.unshift(copy);
        saveToStorage();
        render();
        openEditor(copy.id);
        showToast('Note duplicated', 'success');
    }

    // ----------------------------------------------------------------------
    // 5. Filtering & Sorting Logic
    // ----------------------------------------------------------------------
    function getFilteredNotes() {
        return state.notes.filter(note => {
            // View Filter
            if (state.activeView === 'trash') {
                if (!note.inTrash) return false;
            } else {
                if (note.inTrash) return false;
                if (state.activeView === 'pinned' && !note.isPinned) return false;
                if (state.activeView === 'favorites' && !note.isFavorite) return false;
            }

            // Tag Filter
            if (state.selectedTag) {
                if (!note.tags.includes(state.selectedTag)) return false;
            }

            // Color Filter
            if (state.selectedColor !== 'all') {
                if (note.color !== state.selectedColor) return false;
            }

            // Search Query Filter
            if (state.searchQuery.trim() !== '') {
                const query = state.searchQuery.toLowerCase();
                const titleMatch = note.title.toLowerCase().includes(query);
                const contentMatch = note.content.toLowerCase().includes(query);
                const tagMatch = note.tags.some(t => t.toLowerCase().includes(query));
                if (!titleMatch && !contentMatch && !tagMatch) return false;
            }

            return true;
        }).sort((a, b) => {
            // Pinned items stay on top except in Trash or specific sorts
            if (state.activeView !== 'trash' && a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }

            switch (state.sortOrder) {
                case 'updated-desc':
                    return b.updatedAt - a.updatedAt;
                case 'created-desc':
                    return b.createdAt - a.createdAt;
                case 'created-asc':
                    return a.createdAt - b.createdAt;
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                default:
                    return b.updatedAt - a.updatedAt;
            }
        });
    }

    function getAllTags() {
        const tagsMap = {};
        state.notes.forEach(note => {
            if (!note.inTrash && note.tags) {
                note.tags.forEach(tag => {
                    tagsMap[tag] = (tagsMap[tag] || 0) + 1;
                });
            }
        });
        return tagsMap;
    }

    // ----------------------------------------------------------------------
    // 6. UI Rendering Functions
    // ----------------------------------------------------------------------
    function render() {
        renderNav();
        renderTagsList();
        renderNotesList();
        renderFilterBanner();
        updateNavCounts();
    }

    function renderNav() {
        DOM.navItems.forEach(item => {
            const view = item.getAttribute('data-view');
            if (view === state.activeView) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // View Titles & Actions
        const titles = {
            all: 'All Notes',
            pinned: 'Pinned Notes',
            favorites: 'Favorite Notes',
            trash: 'Trash'
        };

        DOM.currentViewTitle.textContent = titles[state.activeView] || 'Notes';
        
        if (state.activeView === 'trash') {
            DOM.emptyTrashBtn.style.display = 'inline-flex';
        } else {
            DOM.emptyTrashBtn.style.display = 'none';
        }
    }

    function updateNavCounts() {
        const counts = {
            all: state.notes.filter(n => !n.inTrash).length,
            pinned: state.notes.filter(n => !n.inTrash && n.isPinned).length,
            favorites: state.notes.filter(n => !n.inTrash && n.isFavorite).length,
            trash: state.notes.filter(n => n.inTrash).length
        };

        DOM.countAll.textContent = counts.all;
        DOM.countPinned.textContent = counts.pinned;
        DOM.countFavorites.textContent = counts.favorites;
        DOM.countTrash.textContent = counts.trash;
    }

    function renderTagsList() {
        const tagsMap = getAllTags();
        DOM.sidebarTagsList.innerHTML = '';

        const tags = Object.keys(tagsMap).sort();

        if (tags.length === 0) {
            DOM.sidebarTagsList.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); padding:4px 12px;">No tags added</span>`;
            return;
        }

        tags.forEach(tag => {
            const isSelected = state.selectedTag === tag;
            const item = document.createElement('div');
            item.className = `tag-item ${isSelected ? 'active' : ''}`;
            item.innerHTML = `
                <div class="tag-name">
                    <span class="tag-badge-icon"></span>
                    <span>#${escapeHtml(tag)}</span>
                </div>
                <span class="nav-count">${tagsMap[tag]}</span>
            `;
            item.addEventListener('click', () => {
                if (state.selectedTag === tag) {
                    state.selectedTag = null;
                } else {
                    state.selectedTag = tag;
                }
                render();
            });
            DOM.sidebarTagsList.appendChild(item);
        });
    }

    function renderFilterBanner() {
        const filters = [];
        if (state.selectedTag) filters.push(`Tag: #${state.selectedTag}`);
        if (state.selectedColor !== 'all') filters.push(`Color: ${state.selectedColor}`);
        if (state.searchQuery) filters.push(`Search: "${state.searchQuery}"`);

        if (filters.length > 0) {
            DOM.activeFilterBanner.style.display = 'block';
            DOM.activeFilterText.textContent = `Filtered by: ${filters.join(' • ')}`;
        } else {
            DOM.activeFilterBanner.style.display = 'none';
        }
    }

    function renderNotesList() {
        const filtered = getFilteredNotes();
        DOM.notesContainer.innerHTML = '';

        DOM.currentViewSubtitle.textContent = `${filtered.length} ${filtered.length === 1 ? 'note' : 'notes'} found`;

        if (filtered.length === 0) {
            DOM.notesContainer.style.display = 'none';
            DOM.emptyState.style.display = 'flex';

            if (state.activeView === 'trash') {
                DOM.emptyStateTitle.textContent = 'Trash is empty';
                DOM.emptyStateDesc.textContent = 'Notes moved to trash will appear here.';
                DOM.emptyStateActionBtn.style.display = 'none';
            } else if (state.searchQuery || state.selectedTag || state.selectedColor !== 'all') {
                DOM.emptyStateTitle.textContent = 'No matching notes';
                DOM.emptyStateDesc.textContent = 'Try clearing your search or filter settings.';
                DOM.emptyStateActionBtn.style.display = 'none';
            } else {
                DOM.emptyStateTitle.textContent = 'No notes yet';
                DOM.emptyStateDesc.textContent = 'Click "New Note" to capture your thoughts, ideas, or code snippets.';
                DOM.emptyStateActionBtn.style.display = 'inline-flex';
            }
            return;
        }

        DOM.notesContainer.style.display = 'grid';
        DOM.emptyState.style.display = 'none';

        filtered.forEach(note => {
            const card = createNoteCard(note);
            DOM.notesContainer.appendChild(card);
        });

        refreshLucideIcons();
    }

    function createNoteCard(note) {
        const card = document.createElement('div');
        card.className = `note-card ${note.isPinned ? 'pinned' : ''}`;
        card.style.setProperty('--card-color', getColorHex(note.color));

        const formattedDate = formatDate(note.updatedAt);
        const snippet = escapeHtml(note.content || 'No additional text').replace(/\n/g, ' ');

        let tagsHtml = '';
        if (note.tags && note.tags.length > 0) {
            tagsHtml = note.tags.slice(0, 3).map(t => `<span class="note-card-tag">#${escapeHtml(t)}</span>`).join('');
            if (note.tags.length > 3) {
                tagsHtml += `<span class="note-card-tag">+${note.tags.length - 3}</span>`;
            }
        }

        card.innerHTML = `
            <div class="note-card-header">
                <h3 class="note-card-title">${escapeHtml(note.title || 'Untitled Note')}</h3>
                <div class="note-card-badges">
                    ${note.isPinned ? '<i data-lucide="pin" class="badge-pin" style="width:14px;height:14px;"></i>' : ''}
                    ${note.isFavorite ? '<i data-lucide="star" class="badge-fav" style="width:14px;height:14px;"></i>' : ''}
                </div>
            </div>
            <p class="note-card-snippet">${snippet}</p>
            <div class="note-card-footer">
                <div class="note-card-tags">${tagsHtml}</div>
                <span class="note-card-date">${formattedDate}</span>
                <div class="note-card-actions" onclick="event.stopPropagation();">
                    ${note.inTrash ? `
                        <button class="icon-btn-xs" title="Restore" onclick="window.restoreNoteHandler('${note.id}')">
                            <i data-lucide="rotate-ccw"></i>
                        </button>
                        <button class="icon-btn-xs" title="Delete Permanently" onclick="window.deleteNoteHandler('${note.id}', true)">
                            <i data-lucide="trash"></i>
                        </button>
                    ` : `
                        <button class="icon-btn-xs" title="${note.isPinned ? 'Unpin' : 'Pin'}" onclick="window.togglePinHandler('${note.id}')">
                            <i data-lucide="pin"></i>
                        </button>
                        <button class="icon-btn-xs" title="${note.isFavorite ? 'Unfavorite' : 'Favorite'}" onclick="window.toggleFavHandler('${note.id}')">
                            <i data-lucide="star"></i>
                        </button>
                    `}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            openEditor(note.id);
        });

        return card;
    }

    // Expose handlers globally for card inline button clicks
    window.togglePinHandler = (id) => {
        const note = state.notes.find(n => n.id === id);
        if (note) {
            note.isPinned = !note.isPinned;
            saveToStorage();
            render();
            showToast(note.isPinned ? 'Note pinned' : 'Note unpinned', 'info');
        }
    };

    window.toggleFavHandler = (id) => {
        const note = state.notes.find(n => n.id === id);
        if (note) {
            note.isFavorite = !note.isFavorite;
            saveToStorage();
            render();
            showToast(note.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
        }
    };

    window.restoreNoteHandler = (id) => restoreNote(id);
    window.deleteNoteHandler = (id, perm) => deleteNote(id, perm);

    // ----------------------------------------------------------------------
    // 7. Editor & Markdown Logic
    // ----------------------------------------------------------------------
    function openEditor(noteId) {
        state.activeNoteId = noteId;
        const note = getActiveNote();
        if (!note) return;

        DOM.noteTitleInput.value = note.title || '';
        DOM.noteContentInput.value = note.content || '';
        
        // Color Picker State
        document.querySelectorAll('.color-picker-btn').forEach(btn => {
            if (btn.dataset.color === note.color) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        updateEditorPinFavButtons(note);
        renderEditorTagChips(note);
        updateEditorStats();
        renderPreview();

        DOM.saveStatus.className = 'save-status saved';
        DOM.saveStatusText.textContent = 'Saved';

        DOM.editorOverlay.classList.add('open');
        refreshLucideIcons();
    }

    function closeEditor() {
        DOM.editorOverlay.classList.remove('open');
        DOM.editorDropdown.classList.remove('open');
        state.activeNoteId = null;
        render();
    }

    function updateEditorPinFavButtons(note) {
        if (note.isPinned) {
            DOM.togglePinBtn.classList.add('active');
        } else {
            DOM.togglePinBtn.classList.remove('active');
        }

        if (note.isFavorite) {
            DOM.toggleFavBtn.classList.add('active');
        } else {
            DOM.toggleFavBtn.classList.remove('active');
        }
    }

    function renderEditorTagChips(note) {
        DOM.editorTagsList.innerHTML = '';
        if (!note.tags) note.tags = [];

        note.tags.forEach(tag => {
            const chip = document.createElement('span');
            chip.className = 'editor-tag-chip';
            chip.innerHTML = `
                #${escapeHtml(tag)}
                <button title="Remove tag">&times;</button>
            `;
            chip.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                note.tags = note.tags.filter(t => t !== tag);
                updateActiveNote({ tags: note.tags });
                renderEditorTagChips(note);
                renderTagsList();
            });
            DOM.editorTagsList.appendChild(chip);
        });
    }

    function updateEditorStats() {
        const text = DOM.noteContentInput.value || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        DOM.wordCount.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
        DOM.charCount.textContent = `${chars} ${chars === 1 ? 'character' : 'characters'}`;

        const note = getActiveNote();
        if (note) {
            DOM.lastEditedTime.textContent = `Edited ${formatDate(note.updatedAt)}`;
        }
    }

    function triggerAutoSaveStatus() {
        DOM.saveStatus.className = 'save-status saving';
        DOM.saveStatusText.textContent = 'Saving...';

        clearTimeout(state.autoSaveTimeout);
        state.autoSaveTimeout = setTimeout(() => {
            DOM.saveStatus.className = 'save-status saved';
            DOM.saveStatusText.textContent = 'Saved';
        }, 600);
    }

    function applyFormatting(format) {
        const textarea = DOM.noteContentInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        let prefix = '', suffix = '', replacement = '';

        switch (format) {
            case 'bold':
                prefix = '**'; suffix = '**';
                break;
            case 'italic':
                prefix = '*'; suffix = '*';
                break;
            case 'underline':
                prefix = '<u>'; suffix = '</u>';
                break;
            case 'strikethrough':
                prefix = '~~'; suffix = '~~';
                break;
            case 'h1':
                prefix = '# ';
                break;
            case 'h2':
                prefix = '## ';
                break;
            case 'quote':
                prefix = '> ';
                break;
            case 'code':
                prefix = '```\n'; suffix = '\n```';
                break;
            case 'ul':
                prefix = '- ';
                break;
            case 'ol':
                prefix = '1. ';
                break;
            case 'checklist':
                prefix = '- [ ] ';
                break;
            case 'highlight':
                prefix = '=='; suffix = '==';
                break;
        }

        if (selectedText.length > 0) {
            replacement = prefix + selectedText + suffix;
        } else {
            replacement = prefix + (format === 'h1' || format === 'h2' || format === 'quote' || format === 'ul' || format === 'ol' || format === 'checklist' ? 'Heading' : 'text') + suffix;
        }

        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);

        // Trigger input event
        textarea.dispatchEvent(new Event('input'));
    }

    function renderPreview() {
        const title = DOM.noteTitleInput.value || 'Untitled Note';
        const content = DOM.noteContentInput.value || '';

        DOM.previewTitle.textContent = title;
        DOM.previewContent.innerHTML = parseMarkdownToHtml(content);
    }

    function parseMarkdownToHtml(markdown) {
        if (!markdown) return '<em>No content to preview</em>';

        let html = escapeHtml(markdown);

        // Headings
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Blockquotes
        html = html.replace(/^\> (.*$)/gim, 'blockquote>$1</blockquote>');

        // Checklists
        html = html.replace(/^- \[x\] (.*$)/gim, '<div class="check-item checked">☑ $1</div>');
        html = html.replace(/^- \[ \] (.*$)/gim, '<div class="check-item">☐ $1</div>');

        // Bullet & Numbered lists
        html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^(\d+)\. (.*$)/gim, '<ol><li>$2</li></ol>');

        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // Bold & Italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
        html = html.replace(/==(.*?)==/g, '<mark style="background:rgba(245,158,11,0.3); color:inherit; padding:0 4px; border-radius:3px;">$1</mark>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    // ----------------------------------------------------------------------
    // 8. Import / Export Utilities
    // ----------------------------------------------------------------------
    function exportNoteAsText(note, format = 'txt') {
        let content = `${note.title || 'Untitled Note'}\n`;
        content += `=======================\n`;
        content += `Date: ${new Date(note.updatedAt).toLocaleString()}\n`;
        content += `Tags: ${note.tags.join(', ')}\n\n`;
        content += `${note.content}\n`;

        const filename = `${(note.title || 'note').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
        downloadFile(content, filename, 'text/plain');
        showToast(`Exported as .${format}`, 'success');
    }

    function exportAllDataJSON() {
        const dataStr = JSON.stringify(state.notes, null, 2);
        const filename = `jottee_backup_${new Date().toISOString().slice(0, 10)}.json`;
        downloadFile(dataStr, filename, 'application/json');
        showToast('Backup JSON exported successfully', 'success');
    }

    function importDataJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    state.notes = imported;
                    saveToStorage();
                    render();
                    showToast(`Successfully imported ${imported.length} notes!`, 'success');
                } else {
                    showToast('Invalid JSON structure', 'error');
                }
            } catch (err) {
                showToast('Failed to parse JSON file', 'error');
            }
        };
        reader.readAsText(file);
    }

    function downloadFile(content, filename, contentType) {
        const a = document.createElement('a');
        const blob = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // ----------------------------------------------------------------------
    // 9. Event Listeners Binding
    // ----------------------------------------------------------------------
    function bindEvents() {
        // Mobile Sidebar Toggle
        DOM.openSidebarBtn.addEventListener('click', () => DOM.sidebar.classList.add('open'));
        DOM.closeSidebarBtn.addEventListener('click', () => DOM.sidebar.classList.remove('open'));

        // New Note Buttons
        DOM.sidebarNewNoteBtn.addEventListener('click', () => createNewNote());
        DOM.headerNewNoteBtn.addEventListener('click', () => createNewNote());
        DOM.emptyStateActionBtn.addEventListener('click', () => createNewNote());

        // Nav Views
        DOM.navItems.forEach(item => {
            item.addEventListener('click', () => {
                state.activeView = item.getAttribute('data-view');
                state.selectedTag = null;
                render();
                if (window.innerWidth < 900) DOM.sidebar.classList.remove('open');
            });
        });

        // Quick Add Tag
        DOM.addTagQuickBtn.addEventListener('click', () => {
            const tagName = prompt('Enter new tag name:');
            if (tagName && tagName.trim()) {
                const clean = tagName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
                if (clean) {
                    state.selectedTag = clean;
                    render();
                }
            }
        });

        // Color Filter Dots
        DOM.colorFilters.addEventListener('click', (e) => {
            const dot = e.target.closest('.color-filter-dot');
            if (dot) {
                document.querySelectorAll('.color-filter-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                state.selectedColor = dot.dataset.color;
                render();
            }
        });

        // Theme Toggle
        DOM.themeToggleBtn.addEventListener('click', () => {
            const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            showToast(`Switched to ${nextTheme} mode`, 'info');
        });

        // Export / Import
        DOM.exportDataBtn.addEventListener('click', exportAllDataJSON);
        DOM.importDataBtn.addEventListener('click', () => DOM.importFileInput.click());
        DOM.importFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importDataJSON(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Search Input
        DOM.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            if (state.searchQuery) {
                DOM.clearSearchBtn.style.display = 'inline-flex';
            } else {
                DOM.clearSearchBtn.style.display = 'none';
            }
            renderNotesList();
            renderFilterBanner();
        });

        DOM.clearSearchBtn.addEventListener('click', () => {
            DOM.searchInput.value = '';
            state.searchQuery = '';
            DOM.clearSearchBtn.style.display = 'none';
            renderNotesList();
            renderFilterBanner();
        });

        // Clear Banner Filter
        DOM.clearFilterBtn.addEventListener('click', () => {
            state.selectedTag = null;
            state.selectedColor = 'all';
            state.searchQuery = '';
            DOM.searchInput.value = '';
            DOM.clearSearchBtn.style.display = 'none';
            render();
        });

        // Sort Select
        DOM.sortSelect.addEventListener('change', (e) => {
            state.sortOrder = e.target.value;
            renderNotesList();
        });

        // View Mode Grid/List
        DOM.viewModeGrid.addEventListener('click', () => {
            state.viewMode = 'grid';
            DOM.viewModeGrid.classList.add('active');
            DOM.viewModeList.classList.remove('active');
            DOM.notesContainer.className = 'notes-container grid-view';
        });

        DOM.viewModeList.addEventListener('click', () => {
            state.viewMode = 'list';
            DOM.viewModeList.classList.add('active');
            DOM.viewModeGrid.classList.remove('active');
            DOM.notesContainer.className = 'notes-container list-view';
        });

        DOM.emptyTrashBtn.addEventListener('click', emptyTrash);

        // Editor Controls
        DOM.closeEditorBtn.addEventListener('click', closeEditor);
        DOM.editorCloseSaveBtn.addEventListener('click', closeEditor);

        DOM.noteTitleInput.addEventListener('input', (e) => {
            updateActiveNote({ title: e.target.value });
            updateEditorStats();
            renderPreview();
        });

        DOM.noteContentInput.addEventListener('input', (e) => {
            updateActiveNote({ content: e.target.value });
            updateEditorStats();
            renderPreview();
        });

        // Color Picker in Editor
        DOM.editorColorPicker.addEventListener('click', (e) => {
            const btn = e.target.closest('.color-picker-btn');
            if (btn) {
                const color = btn.dataset.color;
                document.querySelectorAll('.color-picker-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateActiveNote({ color });
            }
        });

        // Pin & Fav in Editor
        DOM.togglePinBtn.addEventListener('click', () => {
            const note = getActiveNote();
            if (note) {
                note.isPinned = !note.isPinned;
                updateActiveNote({ isPinned: note.isPinned });
                updateEditorPinFavButtons(note);
                showToast(note.isPinned ? 'Note pinned' : 'Note unpinned', 'info');
            }
        });

        DOM.toggleFavBtn.addEventListener('click', () => {
            const note = getActiveNote();
            if (note) {
                note.isFavorite = !note.isFavorite;
                updateActiveNote({ isFavorite: note.isFavorite });
                updateEditorPinFavButtons(note);
                showToast(note.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
            }
        });

        // Dropdown Menu in Editor
        DOM.editorMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.editorDropdown.parentElement.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            DOM.editorDropdown.parentElement.classList.remove('open');
        });

        DOM.exportMarkdownBtn.addEventListener('click', () => {
            const note = getActiveNote();
            if (note) exportNoteAsText(note, 'md');
        });

        DOM.exportTextBtn.addEventListener('click', () => {
            const note = getActiveNote();
            if (note) exportNoteAsText(note, 'txt');
        });

        DOM.duplicateNoteBtn.addEventListener('click', () => {
            if (state.activeNoteId) duplicateNote(state.activeNoteId);
        });

        DOM.deleteNoteBtn.addEventListener('click', () => {
            if (state.activeNoteId) deleteNote(state.activeNoteId);
        });

        // Formatting Toolbar Buttons
        DOM.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                applyFormatting(format);
            });
        });

        // Markdown Preview Toggle
        DOM.togglePreviewBtn.addEventListener('click', () => {
            const isVisible = DOM.previewPane.style.display !== 'none';
            if (isVisible) {
                DOM.previewPane.style.display = 'none';
                DOM.togglePreviewBtn.classList.remove('active');
            } else {
                renderPreview();
                DOM.previewPane.style.display = 'flex';
                DOM.togglePreviewBtn.classList.add('active');
            }
        });

        // Add Tag Input in Editor
        DOM.tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && DOM.tagInput.value.trim() !== '') {
                e.preventDefault();
                const note = getActiveNote();
                if (!note) return;

                const tag = DOM.tagInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
                if (tag && !note.tags.includes(tag)) {
                    note.tags.push(tag);
                    updateActiveNote({ tags: note.tags });
                    renderEditorTagChips(note);
                    renderTagsList();
                    DOM.tagInput.value = '';
                }
            }
        });

        // Global Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+N: New Note
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                createNewNote();
            }

            // Ctrl+F: Search Focus
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                DOM.searchInput.focus();
            }

            // Esc: Close Modal / Editor
            if (e.key === 'Escape') {
                if (DOM.confirmModal.classList.contains('open')) {
                    closeConfirmModal();
                } else if (DOM.editorOverlay.classList.contains('open')) {
                    closeEditor();
                }
            }
        });

        // Modal Controls
        DOM.modalCancelBtn.addEventListener('click', closeConfirmModal);
        DOM.modalConfirmBtn.addEventListener('click', () => {
            if (typeof state.pendingConfirmAction === 'function') {
                state.pendingConfirmAction();
            }
            closeConfirmModal();
        });
    }

    // ----------------------------------------------------------------------
    // 10. Helper Functions & Notifications
    // ----------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast`;

        const iconMap = {
            success: 'check-circle-2',
            info: 'info',
            warning: 'alert-circle',
            error: 'alert-triangle'
        };

        toast.innerHTML = `
            <i data-lucide="${iconMap[type] || 'info'}" class="toast-icon ${type}"></i>
            <span>${escapeHtml(message)}</span>
        `;

        DOM.toastContainer.appendChild(toast);
        refreshLucideIcons();

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showConfirmModal(title, message, onConfirm) {
        DOM.modalTitle.textContent = title;
        DOM.modalMessage.textContent = message;
        state.pendingConfirmAction = onConfirm;
        DOM.confirmModal.classList.add('open');
    }

    function closeConfirmModal() {
        DOM.confirmModal.classList.remove('open');
        state.pendingConfirmAction = null;
    }

    function getColorHex(colorName) {
        const map = {
            purple: '#a855f7',
            blue: '#3b82f6',
            emerald: '#10b981',
            amber: '#f59e0b',
            rose: '#f43f5e'
        };
        return map[colorName] || '#6366f1';
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Launch App
    init();
});
