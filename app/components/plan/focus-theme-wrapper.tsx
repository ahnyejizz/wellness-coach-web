"use client";

import type { ReactNode } from "react";

import { useWellnessStore } from "@/app/stores/wellness-store";

type FocusThemeWrapperProps = {
  children: ReactNode;
};

export default function FocusThemeWrapper({ children }: FocusThemeWrapperProps) {
  const activeFocus = useWellnessStore((state) => state.activeFocus);

  return (
    <div className="home-focus-theme-wrapper relative min-h-screen overflow-hidden" data-focus-theme={activeFocus}>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
