"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppWindow,
  Folder,
  Mail,
  MessageCircle,
  Settings,
} from "lucide-react";
import OtpInput from "@/components/ui/otp-input";
import GithubActivityCard from "@/components/ui/github-calendar";
import {
  MagneticDock,
  MagneticDockItem,
} from "@/components/ui/magnetic-dock";

const DEMOS = [
  {
    name: "OTP Input",
    href: "/components/otpinput",
    preview: <OtpPreview />,
  },
  {
    name: "GitHub Activity",
    href: "/components/githubcalendar",
    preview: <GithubActivityPreview />,
  },
  {
    name: "Magnetic Dock",
    href: "/components/magneticdock",
    preview: <MagneticDockPreview />,
  },
] as const;

export default function HomeDemos() {
  const router = useRouter();

  return (
    <div className="mt-50 w-full sm:mt-50">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {DEMOS.map(({ name, href, preview }) => (
          <div
            key={name}
            role="link"
            tabIndex={0}
            onClick={() => router.push(href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(href);
              }
            }}
            className="group relative flex min-h-52 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/35 text-left backdrop-blur-sm transition-colors duration-150 ease-out hover:border-white/20 hover:bg-black/45 sm:min-h-56"
          >
            <div className="flex flex-1 items-center justify-center p-5 sm:p-6">
              {preview}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/45 transition-colors duration-150 ease-out group-hover:text-white/70">
                {name}
              </span>
              <ArrowIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OtpPreview() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  return (
    <OtpInput
      length={4}
      status={status}
      size="sm"
      onChange={() => setStatus("idle")}
      onComplete={(code) => setStatus(code === "1234" ? "success" : "error")}
    />
  );
}

function GithubActivityPreview() {
  return (
    <GithubActivityCard
      username="amitgajare2"
      colorScheme="pink"
      months={6}
      defaultReposOpen
    />
  );
}

function MagneticDockPreview() {
  const apps = [
    { label: "Apps", icon: AppWindow, active: true },
    { label: "Files", icon: Folder },
    { label: "Mail", icon: Mail },
    { label: "Messages", icon: MessageCircle },
    { label: "Settings", icon: Settings },
  ];

  return (
    <MagneticDock baseSize={40} magnification={62} distance={120} gap={7}>
      {apps.map(({ label, icon: Icon, active }) => (
        <MagneticDockItem key={label} label={label} active={active}>
          <Icon strokeWidth={1.7} className="size-4" />
        </MagneticDockItem>
      ))}
    </MagneticDock>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5 text-[#fcd601] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
