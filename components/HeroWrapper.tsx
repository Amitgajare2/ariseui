"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex w-full justify-start overflow-hidden transition-[border-radius] duration-500 ease-in-out"
      style={{
        borderRadius: scrolled ? "0px" : "45px 45px 0px 0px",
        cornerShape: "squircle",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
