# Jottee — Project Journal

---

## 📅 Session Log: Initial MVP Development

### 1. What Was Worked On
- **Planning & Architecture Alignment**:
  - Defined initial requirements for a standalone, single-page Vanilla HTML/CSS/JS note-taking app.
  - Drafted an implementation plan covering UI components, state management, storage strategy, markdown previewing, and export capabilities.
- **Frontend Architecture (`index.html`)**:
  - Built semantic page structure with a responsive sidebar, header with search & view toggles, grid container for note cards, slide-over note editor drawer, formatting toolbar, and confirmation modal.
- **Styling & Design System (`styles.css`)**:
  - Implemented glassmorphic design tokens (CSS variables, backdrop blur effects, translucent glass cards, dark mode default theme, and clean light mode toggle).
  - Defined card grid & list layouts, tag badges, pin/favorite indicators, custom scrollbars, and animated toast popups.
- **Core Logic & Operations (`app.js`)**:
  - Developed note state management and `localStorage` persistence service.
  - Built note CRUD operations (Create, Edit, Soft-delete to Trash, Restore, Permanent Delete, Duplicate).
  - Implemented debounced auto-save with status indicator ("Saving..." / "Saved").
  - Built custom markdown parser and split preview pane renderer.
  - Added tag management, color filters, instant search, and export/import functionality (`.json`, `.md`, `.txt`).
  - Added global keyboard shortcuts (`Ctrl+N`, `Ctrl+F`, `Esc`).
- **Dev Server & Version Control**:
  - Launched HTTP dev server on port `8080`.
  - Configured `.gitignore` and created initial Git commit.

---

### 2. Important Decisions Made
- **Zero-Dependency Core Stack**: Selected pure HTML5, CSS3, and ES6 JavaScript instead of React/Next.js/Vite to ensure instant loading, zero build pipeline overhead, and easy hosting.
- **Dark Glassmorphism Default Theme**: Adopted vibrant indigo/purple gradients with frosted glass elements for a state-of-the-art UI experience.
- **Slide-Over Drawer Editor**: Selected an overlay drawer for editing notes instead of full-page navigation, allowing users to quickly edit notes while maintaining context of their collection.
- **Soft-Delete Architecture**: Notes are moved to a `Trash` state rather than deleted instantly, avoiding accidental user data loss.
- **Client-Side Privacy**: All user notes remain 100% inside `window.localStorage` with a live storage quota usage bar.

---

### 3. Challenges Encountered & How They Were Solved

#### Challenge 1: Windows PowerShell Script Execution Restriction
- **Issue**: Running `npx serve` directly failed in Windows PowerShell due to default `PSSecurityException` execution policy settings.
- **Solution**: Executed dev server commands using `powershell -ExecutionPolicy Bypass -Command "npx -y serve -p 8080"`, allowing local execution without altering global system policies.

#### Challenge 2: Headless Browser Driver Download Resolution
- **Issue**: Automated browser subagent verification encountered DNS lookup errors when trying to download Playwright driver binaries from remote CDNs.
- **Solution**: Evaluated app functionality by serving files locally via HTTP dev server at `http://localhost:8080` and verifying code execution contracts.

#### Challenge 3: Selection Preservation in Markdown Formatting Toolbar
- **Issue**: Inserting markdown formatting characters (e.g. `**bold**`, `# heading`) into a `<textarea>` caused text cursor loss or selection displacement.
- **Solution**: Programmed `applyFormatting()` to calculate selection offsets via `selectionStart` / `selectionEnd`, wrap selected substrings, and re-focus/re-highlight target bounds seamlessly.
