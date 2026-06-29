import type { Metadata } from "next";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Installation — Arise UI",
};

function CodeSnippet({ code }: { code: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-black/10 bg-black/2 p-4 text-sm text-black font-mono">
      <code>{code}</code>
    </pre>
  );
}

export default function InstallationPage() {
  return (
    <article className={syne.className}>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-orange-400">
        Getting Started
      </span>
      <h1 className="mb-4 text-4xl font-bold text-black">Installation</h1>
      <p className="mb-8 text-sm text-slate-600">
        Arise UI requires only Tailwind CSS. Pick whichever setup fits your project.
      </p>

      <h2 className="mb-2 text-xl font-semibold text-black">
        Option A — CDN (quickest)
      </h2>
      <p className="mb-2 text-slate-400 text-sm">
        Drop this into your HTML <code className="text-orange-300">&lt;head&gt;</code> and Tailwind is ready instantly:
      </p>
      <CodeSnippet code={`<script src="https://cdn.tailwindcss.com"></script>`} />

      <h2 className="mb-2 text-xl font-semibold text-black">
        Option B — Tailwind CLI
      </h2>
      <p className="mb-2 text-slate-400 text-sm">
        For production builds, install Tailwind via npm:
      </p>
      <CodeSnippet code="npm install tailwindcss @tailwindcss/cli" />
      <p className="mb-2 text-slate-400 text-sm">
        Create your CSS entry file <code className="text-orange-300">input.css</code>:
      </p>
      <CodeSnippet code={`@import "tailwindcss";`} />
      <p className="mb-2 text-slate-400 text-sm">
        Then run the CLI to watch and build:
      </p>
      <CodeSnippet code="npx @tailwindcss/cli -i ./input.css -o ./output.css --watch" />
      <p className="mb-4 text-slate-400 text-sm">
        Link the compiled <code className="text-orange-300">output.css</code> in your HTML:
      </p>
      <CodeSnippet code={`<link rel="stylesheet" href="output.css">`} />

      <h2 className="mb-2 text-xl font-semibold text-black">
        Copy a component
      </h2>
      <p className="mb-4 text-slate-400 text-sm">
        Browse the sidebar, pick a component, copy the HTML and paste it into
        your project. That's it — you own it now.
      </p>

      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm text-orange-300">
        ✓ No package to install for components. Just copy and use.
      </div>
    </article>
  );
}
