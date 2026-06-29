import Link from "next/link";
import { FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    href: "https://github.com/Amitgajare2/ariseui",
    label: "GitHub",
    icon: <FaGithub size={17} />,
  },
  {
    href: "https://x.com/AmitGajare4",
    label: "Twitter / X",
    icon: <FaXTwitter size={17} />,
  },
  {
    href: "https://www.instagram.com/amitgajare_/",
    label: "Instagram",
    icon: <FaInstagram size={17} />,
  },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold uppercase tracking-tight text-slate-900">
          <img className="w-10 h-10" src="https://dl.dropbox.com/scl/fi/6pm9tuh9zf62wjzlufl78/favicon.png?rlkey=wiuif2rmb8ftr4h5syc18ttqg&st=vuepce4k&dl=0"  />
        </Link>
        <nav className="flex items-center gap-2">
          {/* Social icons */}
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-orange-600"
            >
              {s.icon}
            </a>
          ))}

          <div className="mx-2 h-5 w-px bg-black/10" />

          <Link
            href="/docs/getting-started/introduction"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-600"
          >
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
