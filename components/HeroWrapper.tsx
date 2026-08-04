"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 10 : false,
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        rafRef.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex w-full justify-center overflow-hidden"
      style={{
        borderRadius: scrolled ? "0px" : "45px 45px 0px 0px",
        transition: "border-radius 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "border-radius",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        contain: "paint",
        cornerShape: "squircle",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
