<!-- <a href="https://ariseui.com">
  <img src="public/assets/landing/readme-hero.png" alt="Arise UI" width="100%" />
</a> -->

<div align="center">

# ✨ Arise UI

### Beautiful animated UI components for Next.js, React & Tailwind CSS.

A growing **shadcn/ui registry** featuring premium-quality components designed for modern web applications.

<p>
  <a href="https://ariseui.vercel.app">
    <img src="https://img.shields.io/badge/Website-ariseui.vercel.app-fcd601?style=for-the-badge&labelColor=0a0a0a" />
  </a>
  <a href="https://github.com/amitgajare2/ariseui">
    <img src="https://img.shields.io/github/stars/amitgajare2/ariseui?style=for-the-badge&labelColor=0a0a0a" />
  </a>
  <a href="https://github.com/amitgajare2/ariseui/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/amitgajare2/ariseui?style=for-the-badge&labelColor=0a0a0a" />
  </a>
</p>

<p>

<img src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs" />
<img src="https://img.shields.io/badge/React-20232A?logo=react" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/shadcn/ui-Registry-black" />

</p>

### 🌐 Links

[Website](https://ariseui.vercel.app)
•
[Components](https://ariseui.vercel.app/components)
•
[Docs](https://ariseui.vercel.app/components/introduction)
•
[Twitter/X](https://x.com/AmitGajare4)

</div>


Arise UI is a shadcn registry built with Next.js, Tailwind CSS, and TypeScript. Each component is designed to feel premium, animate smoothly, and install into any app with a single command. You own the resulting code, so it is easy to restyle and adapt.

## Why this project exists

- Share beautiful UI components in a format that works with shadcn.
- Keep the code simple, copyable, and easy to customize.
- Build a public registry where each component can be installed directly.

## Quick install

Install a component from the registry with the shadcn CLI:

```bash
npx shadcn add amitgajare2/ariseui/bounce-sidebar
```

You can replace `bounce-sidebar` with any available component name from the registry.

## Run the project locally

If you are new to Git or Next.js, follow these steps in order:

```bash
git clone https://github.com/amitgajare2/ariseui.git
cd ariseui
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project structure

- `components/ui/` contains the registry-ready component source files.
- `registry.json` defines which components are installable through shadcn.
- `lib/components.ts` holds the showcase metadata, props, and usage examples for the site.
- `app/` contains the Next.js app, pages, and docs shell.
- `public/r/` is generated from the registry build and should stay in sync.

## Build and validate

Before opening a pull request, run:

```bash
npm run build
```

This command runs the registry build and the Next.js production build, then regenerates the public registry files.

## Contributing

Issues, ideas, and pull requests are welcome. If you want to add a component or improve the docs, start with [CONTRIBUTING.md](CONTRIBUTING.md).

<div align="center">
  <br />
  <img src="public/logos/AriseUI.svg" alt="" width="28" />
  <p><sub>Built by <a href="https://x.com/AmitGajare4">@AmitGajare4</a></sub></p>
</div>
