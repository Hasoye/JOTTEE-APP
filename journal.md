# Jottee — Project Journal

---

## 📅 Session Log: Initial MVP Development

### 1. What I Worked On

#### Planning & Architecture

- Defined the initial requirements for a standalone, single-page Vanilla HTML/CSS/JS note-taking application.
- Created an implementation plan covering UI components, state management, storage strategy, markdown previewing, and export capabilities.

#### Frontend Architecture (`index.html`)

- Built the semantic page structure with:
  - Responsive sidebar
  - Header with search and view toggles
  - Note grid
  - Slide-over note editor drawer
  - Formatting toolbar
  - Confirmation modal

#### Styling & Design System (`styles.css`)

- Implemented a glassmorphic design system using:
  - CSS variables
  - Backdrop blur effects
  - Translucent glass cards
  - Dark-mode default styling
  - Light-mode toggle
- Defined:
  - Card grid and list layouts
  - Tag badges
  - Pin/favorite indicators
  - Custom scrollbars
  - Animated toast notifications

#### Core Logic & Operations (`app.js`)

- Developed note state management and `localStorage` persistence.
- Built note CRUD operations:
  - Create
  - Edit
  - Soft-delete to Trash
  - Restore
  - Permanent Delete
  - Duplicate
- Implemented debounced auto-save with visual status feedback:
  - "Saving..."
  - "Saved"
- Built a custom markdown parser and split preview pane.
- Added:
  - Tag management
  - Color filters
  - Instant search
  - Export/import functionality for `.json`, `.md`, and `.txt`
  - Global keyboard shortcuts such as `Ctrl+N`, `Ctrl+F`, and `Esc`

#### Development & Version Control

- Launched the local HTTP development server on port `8080`.
- Configured `.gitignore`.
- Created the initial Git commit.

---

### 2. What I Chose & Why

#### Zero-Dependency Core Stack

I chose pure HTML5, CSS3, and ES6 JavaScript instead of introducing React, Next.js, Vite, or another framework.

The goal was to keep the MVP lightweight, immediately runnable, and free from a build pipeline.

#### Dark Glassmorphism as the Default Theme

I chose a dark glassmorphic visual direction with indigo and purple gradients, translucent surfaces, and frosted-glass effects to give the interface a modern visual identity while keeping the writing experience focused.

#### Slide-Over Drawer Editor

I chose a slide-over editor instead of navigating to a separate editing page.

This allows users to edit a note while maintaining context of their note collection.

#### Soft-Delete Trash Model

I chose to move deleted notes into Trash instead of immediately removing them.

This gives users an opportunity to restore notes and reduces the risk of accidental data loss.

#### Client-Side Privacy

I chose browser `localStorage` for note persistence so the MVP can keep user notes locally without requiring an account or external database.

A storage quota usage indicator was also included to make local storage usage visible.

#### Lightweight Markdown Parsing

I chose a lightweight custom markdown parser rather than adding a large external markdown dependency.

The parser supports the formatting needed by the MVP, including:

- Headers
- Bold
- Italics
- Strikethrough
- Code blocks
- Blockquotes
- Checklists
- Highlights

#### Debounced Auto-Save

I chose debounced saving so changes are persisted automatically without writing to storage on every single keystroke.

The interface also provides visual feedback through the "Saving..." and "Saved" states.

---

### 3. What I Parked

The following areas were kept outside the initial MVP scope or left for future iteration:

- Further feature expansion beyond the current note-taking workflow.
- Additional functionality that would require expanding the current architecture.
- Further visual and interaction refinements that can be addressed as the product evolves.

These are intentionally parked rather than treated as unfinished core requirements for the MVP.

---

### 4. Challenges & Solutions

#### Challenge 1: Windows PowerShell Script Execution Restriction

**Issue:**
Running `npx serve` directly in Windows PowerShell failed because of the default `PSSecurityException` execution policy.

**Solution:**
The development server was launched using:

`powershell -ExecutionPolicy Bypass -Command "npx -y serve -p 8080"`

This allowed the local development server to run without changing the global system execution policy.

---

#### Challenge 2: Headless Browser Driver Download Resolution

**Issue:**
Automated browser verification encountered DNS lookup errors while attempting to download Playwright driver binaries from remote CDNs.

**Solution:**
The application was served locally through the HTTP development server on port `8080`, allowing functionality and code execution to be verified locally despite the remote driver download issue.

---

#### Challenge 3: Selection Preservation in Markdown Formatting

**Issue:**
Applying markdown formatting such as bold or headings inside a `<textarea>` could cause the user's text selection or cursor position to be lost.

**Solution:**
`applyFormatting()` uses the textarea's `selectionStart` and `selectionEnd` values to identify the selected text, apply the formatting, and then restore the appropriate cursor and selection bounds.

---

#### Challenge 4: Combining Multiple Filtering Conditions

**Issue:**
Jottee supports multiple ways of filtering and organizing notes, including search, view filters, tags, colors, and sorting.

Combining these conditions without making the interface feel inconsistent required a centralized filtering approach.

**Solution:**
A centralized `getFilteredNotes()` function was used to evaluate the filtering conditions sequentially, apply sorting, and then update the rendered note collection.

---

## 📌 Current Project Status

Jottee's initial MVP is implemented as a lightweight browser-based note-taking application with local persistence, markdown editing, search, filtering, organization, import/export, and responsive UI behaviour.

The project remains open to further iteration. Future changes will be recorded here as new journal entries, with the focus on documenting what was worked on, what decisions were made, and what was intentionally parked.