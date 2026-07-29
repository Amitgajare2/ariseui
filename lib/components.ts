import { createElement, type ReactNode } from "react";
import { MotionIcon } from "@/components/Description/icons";

export type Dependency = {
  name: string;
  icon?: ReactNode;
};

export type ComponentProp = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  options?: string[];
  control?: "swatch";
  optionColors?: Record<string, string>;
  description: string;
};

export type ComponentItem = {
  name: string;
  href: string;
  description?: string;
  introduction?: string;
  registry?: string;
  source?: string;
  dependencies?: Dependency[];
  interaction?: string;
  usage?: string;
  props?: ComponentProp[];
  credits?: string[];
};

export const REGISTRY_HOMEPAGE = "https://github.com/amitgajare2/ariseui";
export const REGISTRY_REPO = "amitgajare2/ariseui";

export const PANEL_INFO = {
  sourceHint:
    "Click the code icon in the top-right corner to view the source code.",
  keepInMind:
    "Most components here are recreations of great work from around the web. I don't claim to be the original creator - this is my attempt to reverse-engineer, replicate, and often add a few extra features. I've tried to credit everyone; if I missed someone, let me know.",
  contactEmail: "syntaxamit@proton.me",
  contactNote: "Found a bug or issue? Feel free to drop a DM.",
  license: [
    "Free to use and modify in both personal and commercial projects.",
    "Attribution to Arise UI is appreciated when using a component.",
    "Please don't resell the components as your own kit.",
  ],

} as const;

export const components: ComponentItem[] = [
  {
    name: "Bounce sidebar",
    href: "/components/bouncesidebar",
    registry: "bounce-sidebar",
    description:
      "A vertical navigation list with a bouncy, spring-animated active indicator.",
    introduction:
      "Bounce sidebar is a vertical nav component powered by a single spring animation. A colored dot tracks the active item, physically overshooting and settling each time you switch. Works in both controlled and uncontrolled mode, and the dot color is fully customizable.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/bounce-sidebar.tsx`,
    dependencies: [{ name: "motion", icon: createElement(MotionIcon, { className: "h-4 w-4" }) }],
    interaction: "Click any item to spring the bouncing marker over to it.",
    props: [
      {
        name: "items",
        type: "string[]",
        required: true,
        description: "Labels rendered as the vertical list of nav items.",
      },
      {
        name: "value",
        type: "number",
        description:
          "Active item index for controlled usage. When set, the component won't manage its own state.",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "0",
        description:
          "Initial active index for uncontrolled usage. Ignored when value is provided.",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        description: "Called with the new index whenever an item is selected.",
      },
      {
        name: "dotColor",
        type: "string",
        default: '"#fcd601"',
        description:
          "Any CSS color for the bouncing active marker (hex, rgb, hsl, var).",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes merged onto the root <ul> element.",
      },
    ],
    usage: `import { BounceSidebar } from "@/components/ui/bounce-sidebar"
  
  const items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]
  
  export function Demo() {
    return <BounceSidebar items={items} dotColor="#fcd601" />
  }`,
  },
  {
    name: "Proximity Sidebar",
    href: "/components/proximitysidebar",
    registry: "proximity-sidebar",
    description:
      "An interactive sidebar with proximity hover effects that appears while scrolling and responds to scroll intensity.",
    introduction:
      "Proximity Sidebar is a minimap-style table of contents that stays out of your way until you need it. Dashes expand as your pointer approaches them, the active section label appears while you scroll, and clicking any dash smooth-scrolls you there. Inspired by devouringdetails.com.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/proximity-sidebar.tsx`,
    dependencies: [{ name: "motion", icon: createElement(MotionIcon, { className: "h-4 w-4" }) }],
    interaction:
      "Scroll through content to track the current section, then move the pointer near dashes to expand them and click to smooth-scroll to a section.",
    props: [
      {
        name: "sections",
        type: "Array<{ id: string; label: string; kind?: \"title\" | \"subtitle\" | \"section\" | \"body\"; level?: 1 | 2 | 3 | 4 | 5 | 6 }>",
        required: true,
        description:
          "Ordered section map used for rendering dashes and scroll targeting. Each id must match an element id present in the page.",
      },
      {
        name: "side",
        type: '"left" | "right"',
        default: '"left"',
        options: ["left", "right"],
        description:
          "Pins the minimap to the chosen side and flips dash transform origin accordingly.",
      },
      {
        name: "activeOffset",
        type: "number",
        default: "0.4",
        description:
          "Viewport anchor ratio used to detect the active section while scrolling (0 = top, 1 = bottom).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional classes for the outer nav wrapper.",
      },
    ],
    usage: `import ProximitySidebar, { type ProximitySection } from "@/components/ui/proximity-sidebar"

const sections = [
  { id: "intro", label: "Introduction", level: 1 },
  { id: "setup", label: "Setup", level: 2 },
  { id: "api", label: "API", kind: "section" },
  { id: "faq", label: "FAQ", kind: "body" },
] satisfies ProximitySection[]

export function Demo() {
  return (
    <aside className="sticky top-20 h-[70vh]">
      <ProximitySidebar
        sections={sections}
        side="left"
        activeOffset={0.4}
      />
    </aside>
  )
}`,
    credits: [
      "Inspired by devouringdetails.com",
    ],
  },
  {
    name: "Scroll Progress",
    href: "/components/scrollprogressindicator",
    registry: "scroll-progress",
    description:
      "A scroll progress pill that tracks reading position and expands into a squircle menu of sections you can jump to.",
    introduction:
      "Scroll Progress is a fixed pill that fills a ring as the reader scrolls and crossfades the active section label. Clicking it morphs it into a section menu so the user can jump anywhere. It works against the window or a custom scroll container, and the offset threshold is configurable.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/scroll-progress.tsx`,
    dependencies: [
      { name: "motion", icon: createElement(MotionIcon, { className: "h-4 w-4" }) },
    ],
    interaction:
      "Scroll to fill the ring and watch the active section label crossfade in. Click the pill to morph it into a squircle menu, then tap any section to smooth-scroll there. Click outside or press Escape to close.",
    props: [
      {
        name: "sections",
        type: "Array<{ id: string; label: string }>",
        default: "[]",
        description:
          "Ordered sections shown as the reader moves and listed in the menu. Each id must match an element id present in the scrolled content.",
      },
      {
        name: "containerRef",
        type: "React.RefObject<HTMLElement | null>",
        description:
          "Scroll container to track and scroll within. Defaults to the window when omitted.",
      },
      {
        name: "offset",
        type: "number",
        default: "120",
        description:
          "Distance in pixels below the scroller's top edge that a section must cross to be marked active.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Extra classes merged onto the fixed root wrapper — use it to reposition the pill.",
      },
    ],
    usage: `"use client"

import { useRef } from "react"
import ScrollProgress from "@/components/ui/scroll-progress"

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "usage", label: "Usage" },
  { id: "faq", label: "FAQ" },
]

export function Demo() {
  const scrollRef = useRef<HTMLElement>(null)

  return (
    <main ref={scrollRef} className="relative h-full overflow-auto">
      <ScrollProgress containerRef={scrollRef} sections={sections} />

      <section id="intro">{/* ... */}</section>
      <section id="usage">{/* ... */}</section>
      <section id="faq">{/* ... */}</section>
    </main>
  )
}

// Tracks the window with no container ref:
// <ScrollProgress sections={sections} />`,
  },
  {
    name: "Code Block",
    href: "/components/codeblock",
    registry: "code-block",
    description:
      "A clean code block that builds its entire theme from a single accent color. Pass code and a hex, it does the rest.",
    introduction:
      "Code Block generates a complete syntax theme from a single accent hex. Keywords pick up the accent, strings use a lighter tint, comments are de-saturated, and the background scales to match. It follows the page's dark/light mode by default and supports pinning. Copy, line numbers, and line highlighting are all built in.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/code-block.tsx`,
    dependencies: [
      { name: "motion", icon: createElement(MotionIcon, { className: "h-4 w-4" }) },
      { name: "prism-react-renderer" },
    ],
    interaction:
      "Pick an accent swatch to re-shade the whole block from that color. Hit the copy button to see it spring into a check.",
    props: [
      {
        name: "code",
        type: "string",
        required: true,
        description: "The source code to render.",
      },
      {
        name: "language",
        type: "string",
        default: '"tsx"',
        description:
          'Prism language id, e.g. "tsx", "css", "json", "bash". Also shown as the tag in the header.',
      },
      {
        name: "accent",
        type: "string",
        default: '"#F75001"',
        options: ["#F75001", "#1A73F2", "#FF3B30", "#34C759"],
        control: "swatch",
        optionColors: {
          "#F75001": "#F75001",
          "#1A73F2": "#1A73F2",
          "#FF3B30": "#FF3B30",
          "#34C759": "#34C759",
        },
        description:
          "Any hex color. The whole theme is shades of it: the darkest shade is the background, tokens are tints of the accent, and the lightest text is always white.",
      },
      {
        name: "mode",
        type: '"auto" | "dark" | "light"',
        default: '"auto"',
        description:
          "Color scheme. Auto follows the page theme (html dark/light class, data-theme, or OS preference). Pass dark or light to pin a palette: dark puts light tints of the accent on a dark surface, light flips the ramp.",
      },
      {
        name: "filename",
        type: "string",
        description:
          "Filename or path shown on the left of the header. Falls back to the language id when omitted.",
      },
      {
        name: "showFrame",
        type: "boolean",
        default: "true",
        description:
          "Toggles the outer layout — background, border, rounded corners, and header. Turn off to render nothing but the highlighted code.",
      },
      {
        name: "showHeader",
        type: "boolean",
        default: "true",
        description:
          "Toggles the header bar. When hidden, the copy button floats over the top-right corner instead. Ignored when showFrame is off.",
      },
      {
        name: "showLineNumbers",
        type: "boolean",
        default: "true",
        description: "Toggles the line-number gutter.",
      },
      {
        name: "showCopyButton",
        type: "boolean",
        default: "true",
        description: "Toggles the copy-to-clipboard button.",
      },
      {
        name: "highlightLines",
        type: "number[]",
        description:
          "Optional 1-based line numbers to highlight with a soft accent wash. Off when omitted.",
      },
      {
        name: "className",
        type: "string",
        description:
          'Extra classes merged onto the root element (data-slot="code-block") — use it for width and max-height.',
      },
    ],
    usage: `import CodeBlock from "@/components/ui/code-block"

export function Demo() {
  return (
    <CodeBlock
      code={\`const greet = (name: string) => \\\`Hello, \\\${name}!\\\`\`}
      language="ts"
      accent="#F75001"
      filename="greet.ts"
    />
  )
}`,
  },
  {
    name: "OTP Input",
    href: "/components/otpinput",
    registry: "otp-input",
    description:
      "A one-time-code input whose characters roll into place behind a caret that slides from slot to slot.",
    introduction:
      "OTP Input renders a row of animated slots with a sliding caret that moves as you type. Each character rolls into its slot using a spring. Paste, autofill from SMS, and keyboard navigation all work out of the box. Set the status prop to trigger a success ring sequence or an error shake.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/otp-input.tsx`,
    dependencies: [
      { name: "motion", icon: createElement(MotionIcon, { className: "h-4 w-4" }) },
    ],
    interaction:
      "Type to fill each slot and move to the next one. Backspace clears a slot in place, then steps back on the next press. Arrow keys move between slots, and a caret slides along with you. Pasting a code, or letting the phone autofill one from a text message, drops it straight in. Set the status to turn the slots green, or shake them red on a wrong code.",
    props: [
      {
        name: "length",
        type: "number",
        default: "6",
        description:
          "How many boxes to render, so a 4 digit code is length={4}. Any count works.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
        description:
          "Overall scale of the boxes. Maps to 40px (sm), 48px (md), and 56px (lg), and carries the text, caret, and gaps with it.",
      },
      {
        name: "value",
        type: "string",
        description:
          "The current code. Pass it to control the input yourself; leave it out to let the component track its own state.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
        description: "Starting code when the input is uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Fires on every edit with the full code so far.",
      },
      {
        name: "onComplete",
        type: "(value: string) => void",
        description: "Fires once the last slot is filled.",
      },
      {
        name: "type",
        type: '"numbers" | "letters" | "both"',
        default: '"numbers"',
        options: ["numbers", "letters", "both"],
        description:
          "Which characters a slot accepts. Anything else is ignored, including on paste.",
      },
      {
        name: "status",
        type: '"idle" | "success" | "error"',
        default: '"idle"',
        options: ["idle", "success", "error"],
        description:
          "Drives the feedback state. Success traces a green ring around each box in turn, error rings them red and shakes the row once.",
      },
      {
        name: "mask",
        type: "boolean",
        default: "false",
        description: "Hides the characters, like a password field.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Blocks input and dims every slot.",
      },
      {
        name: "autoFocus",
        type: "boolean",
        default: "false",
        description: "Focuses the first slot on mount.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the row that wraps the slots.",
      },
      {
        name: "slotClassName",
        type: "string",
        description: "Extra classes for each slot, for sizing and colors.",
      },
    ],
    usage: `import { useState } from "react"
import OtpInput, { type OtpStatus } from "@/components/ui/otp-input"

export function Demo() {
  const [status, setStatus] = useState<OtpStatus>("idle")

  return (
    <OtpInput
      length={6}
      size="md"
      status={status}
      onChange={() => setStatus("idle")}
      onComplete={(code) => setStatus(checkCode(code) ? "success" : "error")}
    />
  )
}`,
  },
  {
    name: "Text Scramble",
    href: "/components/textscramble",
    registry: "text-scramble",
    description:
      "A text element that scrambles its content before revealing the final text.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/text-scramble.tsx`,
    dependencies: [{ name: "motion" }, { name: "vaul" }],
    interaction: "Click the trigger to open the drawer and step between views.",
    usage: `import TextScramble from "@/components/ui/text-scramble"

  export function Demo() {
    return <TextScramble
            trigger="in-view"
            duration={1100}
            speed={28}
            revealDirection="center"
          >
            Built to stand out.
          </TextScramble>
  }`,
  },
  {
    name: "Magnetic Dock",
    href: "/components/magneticdock",
    registry: "magnetic-dock",
    description:
      "A dock that responds to cursor movement with a magnetic effect.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/magnetic-dock.tsx`,
    dependencies: [{ name: "motion" }, { name: "vaul" }],
    interaction: "Click the trigger to open the drawer and step between views.",
    usage: `import MagneticDock from "@/components/ui/magnetic-dock"

  export function Demo() {
    return <MagneticDock
        baseSize={52}
        magnification={82}
        distance={155}
        gap={9}
      >
        {apps.map(({ label, icon: Icon, active }) => (
          <MagneticDockItem key={label} label={label} active={active}>
            <Icon strokeWidth={1.7} />
          </MagneticDockItem>
        ))}

        <div aria-hidden="true" className="mx-0.5 h-10 w-px bg-white/15" />

        <MagneticDockItem label="Trash">
          <Trash2 strokeWidth={1.7} />
        </MagneticDockItem>
      </MagneticDock>
  }`,
  },
  {
    name: "Flickering Grid",
    href: "/components/flickeringgrid",
    registry: "flickering-grid",
    description:
      "A grid that flickers with a subtle animation.",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/flickering-grid.tsx`,
    dependencies: [{ name: "motion" }, { name: "vaul" }],
    interaction: "Click the trigger to open the drawer and step between views.",
    usage: `import FlickeringGrid from "@/components/ui/flickering-grid"

  export function Demo() {
    return <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="var(--foreground)"
        maxOpacity={0.35}
        flickerChance={0.8}
        fps={30}
      />
  }`,
  },
  {
  name: "YouTube Embed",
  href: "/components/youtubeembed",
  registry: "youtube-embed",
  description:
    "A responsive YouTube embed with autoplay, looping, customizable controls, and an optional masked presentation.",
  introduction:
    "YouTube Embed wraps the YouTube iframe player in a responsive container with a configurable aspect ratio. It supports autoplay, looping, muting, branding controls, and an optional radial mask for a more cinematic presentation. Built to drop into landing pages, hero sections, and product showcases with minimal setup.",
  source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/youtube-embed.tsx`,
  dependencies: [],
  interaction:
    "The video begins automatically when autoplay is enabled. Since the embed is intended for decorative or showcase content, pointer interaction is disabled by default.",
  props: [
    {
      name: "videoId",
      type: "string",
      required: true,
      description:
        "The YouTube video ID to embed. For example, 'DUV0KxkaIQU'.",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "true",
      description:
        "Starts playback automatically when the component mounts.",
    },
    {
      name: "mute",
      type: "boolean",
      default: "true",
      description:
        "Mutes the video. Autoplay generally requires this to be enabled.",
    },
    {
      name: "controls",
      type: "boolean",
      default: "false",
      description:
        "Shows or hides the YouTube player controls.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "true",
      description:
        "Repeats the video continuously after it finishes.",
    },
    {
      name: "modestBranding",
      type: "boolean",
      default: "true",
      description:
        "Reduces YouTube branding within the player when supported.",
    },
    {
      name: "rel",
      type: "boolean",
      default: "false",
      description:
        "Shows related videos after playback ends when enabled.",
    },
    {
      name: "aspectRatio",
      type: "string",
      default: '"16 / 9"',
      description:
        "CSS aspect-ratio applied to the container. Accepts any valid aspect ratio value.",
    },
    {
      name: "mask",
      type: "boolean",
      default: "true",
      description:
        "Applies the built-in radial mask effect to the embedded video.",
    },
    {
      name: "className",
      type: "string",
      description:
        "Additional classes merged onto the outer container.",
    },
    {
      name: "iframeClassName",
      type: "string",
      description:
        "Additional classes merged onto the iframe element.",
    },
  ],
  usage: `import YoutubeEmbed from "@/components/ui/youtube-embed"

export function Demo() {
  return (
    <YoutubeEmbed
      videoId="DUV0KxkaIQU"
      autoPlay
      mute
      loop
    />
  )
}`,
},
 
];

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PM_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

export const PACKAGE_MANAGERS = Object.keys(PM_EXECUTORS) as PackageManager[];

export function installCommand(
  item: ComponentItem,
  pm: PackageManager = "npm",
): string | null {
  if (!item.registry) return null;
  return `${PM_EXECUTORS[pm]} shadcn add ${REGISTRY_REPO}/${item.registry}`;
}

export function activeComponent(pathname: string): ComponentItem | undefined {
  return components.find((c) => c.href === pathname);
}

export function swatchProp(item?: ComponentItem): ComponentProp | undefined {
  return item?.props?.find((p) => p.control === "swatch" && p.optionColors);
}

export function cleanDefault(prop?: ComponentProp): string | undefined {
  return prop?.default?.replace(/^["']|["']$/g, "");
}
