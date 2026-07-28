<!-- <a href="https://ariseui.com">
  <img src="public/assets/landing/readme-hero.png" alt="Arise UI" width="100%" />
</a> -->

<div align="center">

# Arise UI

**A shadcn registry of polished, animated UI components for modern Next.js apps.**

<img src="https://img.shields.io/badge/Next.js-0a0a0a?logo=nextdotjs&logoColor=fcd601" alt="Next.js" />
<img src="https://img.shields.io/badge/Tailwind_CSS-0a0a0a?logo=tailwindcss&logoColor=fcd601" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/TypeScript-0a0a0a?logo=typescript&logoColor=fcd601" alt="TypeScript" />
<img src="https://img.shields.io/badge/shadcn-registry-fcd601?labelColor=0a0a0a" alt="shadcn registry" />

[**ariseui.com**](https://ariseui.com) &nbsp;&middot;&nbsp; [Components](https://ariseui.com/components) &nbsp;&middot;&nbsp; [Follow on X](https://x.com/AmitGajare4)

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
