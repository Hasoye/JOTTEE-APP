# Jottee — Minimalist & Powerful Web Note Taking MVP

Jottee is a sleek, browser-based note-taking application engineered for fast thought capture, rich formatting, and effortless organization. Built with a dark glassmorphic UI, real-time local persistence, and zero external build overhead, Jottee provides an instant, distraction-free writing environment.

---

## 📌 Project Overview

### What the Project Is
Jottee is a single-page web application (MVP) that allows users to create, format, organize, search, pin, favorite, and back up notes directly within their web browser. It features a responsive layout with grid/list toggles, tag and color accent filtering, a slide-over markdown editor with live preview, and a soft-delete trash bin.

### Who It Is Designed For
- **Developers & Programmers**: Quick storage for code snippets, commands, and tech stack ideas.
- **Students & Researchers**: Organizing class notes, meeting summaries, and research findings with color tags.
- **Creators & Writers**: Capturing sudden ideas, drafting posts, and tracking checklists without needing cloud logins.
- **Privacy-Conscious Users**: Anyone wanting a private note app where 100% of data remains stored locally in their browser.

### The Problem It Solves
1. **Account Lock-in & Bloat**: Most modern note apps require user registration, internet connectivity, and heavy electron bundles. Jottee works instantly offline in any web browser.
2. **Accidental Data Loss**: Unexpected tab closures or crashes often result in lost notes. Jottee automatically debounces and saves every keystroke to `localStorage`.
3. **Cluttered Organization**: Finding specific notes across multiple categories is hard. Jottee combines instant search across title/content/tags, multi-criteria color filters, pinned notes, and tag badges.

---

## 🛠️ Technologies & Tools Used

- **HTML5**: Semantic markup structuring the sidebar, navigation, search bar, card containers, editor drawer, toolbar, and modal dialogs.
- **Vanilla CSS3**: Glassmorphism aesthetic using CSS variables, blurs (`backdrop-filter`), flexbox, grid, smooth transitions, and dark/light mode themes.
- **JavaScript (ES6+)**: Functional and event-driven application logic, state management, custom markdown parser, local storage service, and export/import handlers.
- **Typography & Icons**:
  - `Outfit` (Headings & Brand)
  - `Plus Jakarta Sans` (UI & Body Text)
  - `Fira Code` (Code blocks & shortcuts)
  - `Lucide Icons` (SVG UI Icons via CDN)

---

## 📐 Important Design & Development Decisions

1. **Vanilla Web Stack**: Avoided heavy frameworks (React/Vue/Next.js) or build tools (Webpack/Vite) to eliminate installation steps and deliver sub-millisecond load times.
2. **Slide-Over Drawer Editor**: Instead of navigating away from the notes grid or opening full-page editors, Jottee uses a slide-over drawer overlay (`.editor-drawer`). This keeps the user contextually aware of their notes workspace.
3. **Soft-Delete Trash Model**: Deleting a note moves it to a "Trash" view rather than destroying it immediately. Users can restore notes or clear the trash permanently when ready.
4. **Lightweight Markdown Parser**: Integrated a custom regex-based parser into the split preview pane to support headers (`#`, `##`), bold (`**`), italics (`*`), strikethrough (`~~`), code blocks (` ``` `), blockquotes (`>`), checklists (`- [ ]`), and highlights (`==`) without heavy external markdown libraries.
5. **Debounced Auto-Save & Visual Feedback**: Typing automatically updates `localStorage` with a 600ms debounce while displaying a visual status indicator ("Saving..." -> "Saved").

---

## ⚠️ Challenges Encountered & Solutions

### 1. PowerShell Script Execution Policy Blocking Node/Npx
- **Challenge**: Executing `npx serve` directly in Windows PowerShell failed with a `PSSecurityException` due to default script execution policies.
- **Solution**: Executed dev server commands using `powershell -ExecutionPolicy Bypass -Command "npx -y serve -p 8080"` to safely bypass local execution policy restrictions.

### 2. Fast Multi-Criteria Filtering & Sorting
- **Challenge**: Combining search text queries, active view filters (All, Pinned, Favorites, Trash), tag selections, color filters, and sort options simultaneously without causing layout stutters.
- **Solution**: Created a centralized pipeline function `getFilteredNotes()` in `app.js` that evaluates all constraints sequentially and applies sorting rules before triggering DOM updates.

### 3. Native Markdown Formatting Injection
- **Challenge**: Applying rich text formatting (bold, headers, lists) to standard `<textarea>` elements without losing cursor selection.
- **Solution**: Developed `applyFormatting(format)` using `selectionStart` and `selectionEnd` APIs to wrap or prefix selected text dynamically and re-position cursor bounds seamlessly.
