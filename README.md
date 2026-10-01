# Jottee — Minimalist & Powerful Web Note-Taking MVP

Jottee is a browser-based note-taking application built for fast thought capture, rich formatting, and simple organization.

The MVP focuses on keeping the writing experience lightweight and accessible: no account is required, notes persist locally in the browser, and the application runs without a frontend build framework.

---

## 📌 Project Overview

### What Is Jottee?

Jottee is a single-page note-taking application that allows users to:

- Create and edit notes
- Format notes with lightweight Markdown
- Search notes instantly
- Organize notes with tags and color accents
- Pin and favorite important notes
- Switch between grid and list views
- Preview Markdown while writing
- Move notes to Trash and restore them
- Permanently delete notes when needed
- Export and import notes in multiple formats

The application is designed around a simple principle:

> **Capture thoughts quickly without adding unnecessary complexity.**

---

## 🎯 The Problem

Many note-taking tools introduce friction through accounts, cloud dependencies, complex interfaces, or heavyweight applications.

Jottee explores a simpler approach for users who want a lightweight place to capture and organize information directly in their browser.

### 1. Account Lock-In & Bloat

Jottee does not require an account for the MVP. Notes are stored locally in the browser, allowing the application to work without a backend or external database.

### 2. Accidental Data Loss

Jottee uses debounced auto-save to persist changes to `localStorage`, reducing the risk of losing work after unexpected tab closures or interruptions.

### 3. Difficult Note Organization

As notes accumulate, finding the right one can become difficult.

Jottee combines:

- Instant search across title, content, and tags
- Pinned notes
- Favorite notes
- Tags
- Color filters
- View filters
- Sorting

into a single workspace.

---

## 👥 Who It Is Designed For

### Developers & Programmers

For capturing code snippets, commands, technical ideas, and quick references.

### Students & Researchers

For organizing class notes, research findings, meeting notes, and study material.

### Creators & Writers

For capturing ideas, drafting content, and keeping lightweight checklists.

### Privacy-Conscious Users

For users who prefer keeping their notes inside their own browser rather than relying on a cloud account.

---

## ✨ Core MVP Features

### Note Management

- Create notes
- Edit notes
- Duplicate notes
- Soft-delete notes
- Restore notes
- Permanently delete notes

### Organization

- Tags
- Color accents
- Pinning
- Favorites
- Grid/list views
- Search
- Sorting
- Filtering

### Writing Experience

- Markdown formatting
- Split editor/preview
- Formatting toolbar
- Debounced auto-save
- Save-status feedback

### Backup & Portability

Notes can be exported and imported using:

- `.json`
- `.md`
- `.txt`

### Keyboard Shortcuts

The MVP includes shortcuts such as:

- `Ctrl + N` — create a new note
- `Ctrl + F` — focus search
- `Esc` — close active interfaces

---

## 🛠️ Technologies & Tools

### HTML5

Used for the semantic application structure, including the sidebar, navigation, search, note cards, editor drawer, toolbar, and modal dialogs.

### Vanilla CSS3

Used for the visual system, including:

- CSS variables
- Glassmorphism
- `backdrop-filter`
- Flexbox
- CSS Grid
- Responsive layouts
- Transitions
- Dark/light themes

### JavaScript (ES6+)

Used for:

- Application state
- Note operations
- Local persistence
- Search and filtering
- Markdown parsing
- Import/export
- UI interactions

### Typography & Icons

- `Outfit` — headings and brand
- `Plus Jakarta Sans` — UI and body text
- `Fira Code` — code blocks and shortcuts
- `Lucide Icons` — interface icons via CDN

---

## 📐 Design & Development Decisions

### 1. Vanilla Web Stack

The MVP intentionally avoids frameworks such as React, Vue, and Next.js and build tools such as Webpack and Vite.

The goal was to keep the project lightweight, easy to run, and free from unnecessary build complexity.

### 2. Slide-Over Editor

Instead of navigating away from the note collection, editing happens inside a slide-over drawer.

This keeps the user's workspace visible while they write or edit.

### 3. Soft-Delete Trash Model

Deleting a note moves it to Trash instead of immediately destroying it.

Users can then restore the note or permanently delete it.

### 4. Lightweight Markdown Parser

A custom parser was used instead of introducing a large Markdown dependency.

The current implementation supports formatting such as:

- Headers
- Bold
- Italics
- Strikethrough
- Code blocks
- Blockquotes
- Checklists
- Highlights

### 5. Debounced Auto-Save

Changes are persisted to `localStorage` using a 600ms debounce.

The interface communicates the save state through:

**Saving... → Saved**

This provides feedback without writing to storage on every keystroke.

### 6. Client-Side Persistence

The MVP keeps notes inside the browser using `localStorage`.

This removes the need for authentication, a backend database, or a remote persistence layer for the initial version.

---

## ⚙️ Architecture at a Glance

Jottee is intentionally divided into three primary layers:

```text
index.html
    ↓
Semantic UI structure
    ↓
styles.css
    ↓
Visual system & responsive layout
    ↓
app.js
    ↓
State, persistence & interactions