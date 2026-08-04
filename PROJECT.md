# Arise UI: Project Guide for AI Agents

This file gives you a complete, self-contained understanding of the Arise UI project. Read this before touching any code. It covers what the project is, how it is structured, how components are added, and the conventions you must follow.

---

## 1. What This Project Is

**Arise UI** is a **shadcn/ui component registry** plus a **showcase website** built with Next.js, React, Tailwind CSS, and TypeScript.

- It distributes premium, animated UI components that users install into their own projects via the shadcn CLI.
- Components install as **source code** into the user's repo, not as a package dependency. Users own and can restyle the code.
- The website itself is a live demo/docs shell where users browse, preview, and copy each component.

**Install command format** (used throughout the site):

```bash
npx shadcn add amitgajare2/ariseui/<component-name>
```

---

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme inline`) |
| Animation | `motion` (the Framer Motion successor) |
| Registry build | shadcn CLI v4 (`shadcn build`) |
| Language | TypeScript |
| Drawers | `vaul` |
| Code highlighting | `prism-react-renderer` |
| Squircle corners | `@squircle-js/react` |
| Icons | `lucide-react` |
| Analytics | `@vercel/analytics`, `@databuddy/sdk` |
| Theme | `next-themes` (dark/light) |

---

## 3. Directory Structure

```
e:/ariseui
├── components/ui/          # The 12 installable registry components (source of truth for shipped code)
├── registry.json           # Registry definition: which components are installable, their deps and files
├── lib/
│   ├── components.ts       # Showcase metadata: descriptions, props, usage, interactions, credits (single source of truth for docs)
│   ├── seo.ts              # Metadata helpers for component pages
│   ├── site.ts             # SITE_URL constant
│   ├── github.ts           # Fetches GitHub star count for the landing page
│   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   └── use-media-query.ts  # useIsMobile hook
├── app/
│   ├── layout.tsx          # Root layout: fonts, ThemeProvider, analytics
│   ├── page.tsx            # Landing page (hero + 3 live demos)
│   ├── globals.css         # Tailwind v4 theme tokens, dark/light variables, utilities
│   ├── components/         # The docs/showcase area
│   │   ├── layout.tsx      # Wraps children in SidebarShell
│   │   ├── page.tsx        # Redirects /components to the first component
│   │   ├── not-found.tsx   # "Component not available yet" fallback
│   │   ├── introduction/   # Static intro docs page
│   │   ├── installing/     # Static install docs page
│   │   └── <slug>/         # One folder per component: page.tsx + demo.tsx (live preview)
│   ├── api/source/route.ts # Serves raw component source for the code drawer (?name=<registry>)
│   ├── llms.txt/route.ts   # LLM-friendly component index
│   ├── robots.ts           # SEO
│   └── sitemap.ts          # SEO
├── components/
│   ├── Sidebar/            # Docs navigation shell (DesktopShell, MobileShell, Sidebar, SidebarContent)
│   ├── Description/        # Right-side docs panel (props, install, usage, source code drawer)
│   ├── preview/            # PreviewControls context + ColorSwatches for per-page prop controls
│   ├── ui/                 # The registry components (same as components/ui)
│   └── ...                 # Landing page components (GooeyNavbar, HeroCta, HomeDemos, Footer, etc.)
└── public/r/               # Generated registry output (keep in sync via npm run registry:build)
```

---

## 4. The 12 Registry Components

All live in `components/ui/` and are defined in `registry.json`.

| Component | File | What it does |
| --- | --- | --- |
| Bounce Sidebar | `bounce-sidebar.tsx` | Vertical nav with a spring-animated active indicator |
| Family Drawer | `family-drawer.tsx` | Right-side drawer with a family tree structure |
| Proximity Sidebar | `proximity-sidebar.tsx` | Dash-style scroll minimap that expands on pointer proximity |
| Scroll Progress | `scroll-progress.tsx` | Reading progress pill that morphs into a section menu |
| Code Block | `code-block.tsx` | Syntax highlighter themed from a single accent color |
| OTP Input | `otp-input.tsx` | Animated one-time-code input with sliding caret |
| Magnetic Dock | `magnetic-dock.tsx` | Cursor-magnetic dock |
| Flickering Grid | `flickering-grid.tsx` | Subtle animated grid background |
| YouTube Embed | `youtube-embed.tsx` | Configurable YouTube iframe embed |
| GitHub Calendar | `github-calendar.tsx` | GitHub contributions heatmap |
| Light Board | `lightboard.tsx` | Dot-matrix LED board with draw/sketch overlay |
| Animated Beam | `animated-beam.tsx` | Animated SVG beam connecting two elements |

---

## 5. How the Docs/Showcase Works

- **`lib/components.ts`** is the single source of truth for all docs. Each `ComponentItem` has:
  - `name`, `href`, `registry` (slug), `description`, `introduction`
  - `dependencies` (with icons), `interaction`, `props` (table), `usage` (code example), `credits`
  - Helpers: `installCommand()`, `activeComponent()`, `swatchProp()`, `cleanDefault()`
- **`app/components/<slug>/page.tsx`** renders a live demo. Most have a `demo.tsx` (client component) that imports the UI component and shows it interactively.
- **`components/Description/DescriptionPanel.tsx`** is the right-side panel. It looks up the active component via `activeComponent(pathname)` and renders `DescriptionContent` (dependencies, interaction, props table, install command, usage, source hint, credits, contact, license).
- **`components/Description/CodeDrawer.tsx`** fetches raw source from `/api/source?name=<registry>` and displays it in a draggable drawer.
- **`components/preview/PreviewControls.tsx`** provides a per-page context (`usePreviewControl`) so demo pages can have interactive prop controls (e.g. color swatches) scoped to the current route.
- **`components/Sidebar/`** renders the navigation. `SidebarContent` lists "Getting Started" pages plus all components from `lib/components.ts`.

---

## 6. Adding a New Component (Workflow)

To add a new component to the registry and showcase:

1. **Create the component** at `components/ui/<name>.tsx`. Follow shadcn hygiene (see Conventions below).
2. **Register it** in `registry.json` with `name`, `type: "registry:ui"`, `title`, `description`, `dependencies`, `registryDependencies` (usually `amitgajare2/ariseui/utils`), and `files` pointing to the component path.
3. **Add metadata** to `lib/components.ts` in the `components` array: `name`, `href`, `registry`, `description`, `introduction`, `source`, `dependencies`, `interaction`, `props`, `usage`, `credits`.
4. **Create the demo page** at `app/components/<slug>/page.tsx` (exports metadata via `componentPageMetadata(href)` and renders a `demo.tsx`).
5. **Create the live preview** at `app/components/<slug>/demo.tsx` (a `"use client"` component importing the UI component).
6. **Sync the registry**: run `npm run registry:build` so `public/r/*.json` stays in sync.
7. **Validate**: run `npx tsc --noEmit` and `npx eslint` on the touched files.

---

## 7. Key Conventions (from CONVENTIONS.md)

- **No em dashes** anywhere: descriptions, prop tables, interaction text, code comments. Use a comma, colon, or semicolon instead.
- **Short sentences**, user-focused, no filler.
- **Every number in the docs must match the code.** Check the constants before writing one.
- **Component entries in `lib/components.ts`**: each section has one job, never repeat a fact.
  - `description`: one sentence saying what the component is. Never how it works.
  - `interaction`: what the user can do and see, in a few short sentences. No implementation details, no prop explanations.
  - `props`: one or two short sentences each. What it controls, plus the default behavior if it matters. Prop details live here and nowhere else.
  - `usage`: a minimal runnable example. Comments only where something is non-obvious.
- **Component code**:
  - Comments are short lowercase one-liners, only where the code is non-obvious. No JSDoc narration.
  - Shipped components follow shadcn hygiene: `cn()` merged with a `className` prop, remaining props spread onto the root, `data-slot` on the root element.
  - Interactive components honor `prefers-reduced-motion`.
- **Workflow**:
  - After changing anything in `components/ui/*` or `registry.json`, run `npm run registry:build` so `public/r/*.json` stays in sync. The registry description must match the one in `lib/components.ts`.
  - Verify with `npx tsc --noEmit` and `npx eslint` on the touched files before calling work done.
  - Do not start dev servers or install packages unprompted; the user tests in their own browser.

---

## 8. Build & Validation Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server at localhost:3000 |
| `npm run build` | Run `shadcn build` (registry) then `next build` |
| `npm run registry:build` | Regenerate `public/r/*.json` from `registry.json` |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project |

---

## 9. Known Gotchas / Inconsistencies

These are existing issues in the codebase. Be aware of them; do not assume they are intentional.

- **`family-drawer`** is registered in `registry.json` and `lib/components.ts` but has **no `demo.tsx`**. Its page (`app/components/familydrawer/page.tsx`) renders the component directly.
- **Magnetic Dock and Flickering Grid** have placeholder `interaction` text in `lib/components.ts` ("Click the trigger to open the drawer and step between views.") that does not match their actual behavior. They also list `vaul` as a dependency in `lib/components.ts` but not in `registry.json`.
- **`animated-beam`** lists `framer-motion` as a dependency in `registry.json`, but the project uses `motion`. The `lib/components.ts` entry correctly lists `motion`.
- **`HomeDemos`** links to `/components/githubcalendar`, but the actual route is `/components/github-calendar`. This link is currently broken.
- **`registry.json`** has inconsistent formatting (mixed indentation) and some entries are missing `introduction`/`props` metadata in `lib/components.ts` (e.g. Magnetic Dock, Flickering Grid).

---

## 10. Quick Reference: Key Files

| File | Why it matters |
| --- | --- |
| `registry.json` | Defines installable components for the shadcn CLI |
| `lib/components.ts` | Single source of truth for all showcase docs and metadata |
| `components/ui/*.tsx` | The actual shipped component source |
| `app/components/<slug>/demo.tsx` | Live interactive preview for each component |
| `components/Description/DescriptionPanel.tsx` | Right-side docs panel |
| `components/Sidebar/SidebarContent.tsx` | Navigation listing all components |
| `app/api/source/route.ts` | Serves raw source for the code drawer |
| `app/llms.txt/route.ts` | LLM-friendly index of all components |
| `CONVENTIONS.md` | The rules for writing components and docs (follow exactly) |
