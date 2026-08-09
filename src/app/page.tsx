"use client";

import { useState, useRef } from "react";
import Viewer from "@/components/Viewer";
import InfoPanel from "@/components/InfoPanel";
import LibraryScreen from "@/components/LibraryScreen";
import { useStore } from "@/store/useStore";

export default function Home() {
  const selectedAssembly = useStore((s) => s.selectedAssembly);

  // Desktop: panel width (% of viewport width), clamped 20–45%
  const [panelWidth, setPanelWidth] = useState(35);

  // Mobile: panel height (% of viewport height), clamped 25–85%
  const [panelHeight, setPanelHeight] = useState(45);

  const dragging = useRef(false);

  if (!selectedAssembly) {
    return <LibraryScreen />;
  }

  // ── Desktop: left-edge drag handler ──────────────────────────────
  function handleDesktopPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDesktopPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const vw = window.innerWidth;
    const newWidth = ((vw - e.clientX) / vw) * 100;
    setPanelWidth(Math.min(45, Math.max(20, newWidth)));
  }

  function handleDesktopPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  // ── Mobile: bottom-edge drag handler ─────────────────────────────
  function handleMobilePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleMobilePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const vh = window.innerHeight;
    const newHeight = ((vh - e.clientY) / vh) * 100;
    setPanelHeight(Math.min(85, Math.max(25, newHeight)));
  }

  function handleMobilePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    // <main className="w-screen h-screen overflow-hidden bg-gray-100 flex flex-col-reverse lg:flex-row">
    <main className="w-screen h-dvh overflow-hidden bg-gray-100 flex flex-col-reverse lg:flex-row">

      {/* ── 3D Viewer ─────────────────────────────────────────────── */}
      <section className="flex-1 min-h-0 min-w-0 relative">
        {/* Back to Library */}
        <button
          onClick={() => useStore.getState().setSelectedAssembly(null)}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 
            rounded-lg border border-gray-200 bg-white px-3 py-2 
            text-sm font-medium text-gray-700 shadow-md 
            hover:bg-gray-50 hover:text-blue-600 transition-colors"
        >
          ← Library
        </button>
        <Viewer />
      </section>

      {/* ── AI Panel ──────────────────────────────────────────────── */}
      <aside
        className="
          bg-white border-gray-200 flex flex-col shrink-0
          /* mobile: fixed height at bottom, full width */
          border-t w-full
          /* desktop: fixed width on right, full height */
          lg:border-t-0 lg:border-l lg:w-auto lg:h-full
        "
        style={{
          // mobile: controlled height
          height: `${panelHeight}dvh`,
          // desktop: override with width, reset height
        }}
      >
        {/* Mobile drag handle (top of panel, drag up to expand) */}
        <div
          className="lg:hidden flex justify-center items-center h-8 shrink-0 
            cursor-row-resize touch-none select-none"
          onPointerDown={handleMobilePointerDown}
          onPointerMove={handleMobilePointerMove}
          onPointerUp={handleMobilePointerUp}
          onPointerCancel={handleMobilePointerUp}
        >
          <div className="w-14 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Desktop drag handle (left edge of panel) */}
        <div
          className="hidden lg:flex absolute items-center justify-center 
            w-1.5 top-0 bottom-0 cursor-col-resize touch-none select-none
            hover:bg-blue-200 transition-colors z-10"
          style={{ left: 0 }}
          onPointerDown={handleDesktopPointerDown}
          onPointerMove={handleDesktopPointerMove}
          onPointerUp={handleDesktopPointerUp}
          onPointerCancel={handleDesktopPointerUp}
        />

        {/* Header */}
        <header className="px-4 py-3 border-b border-gray-200 shrink-0">
          <h1 className="text-sm font-bold text-gray-800">AI Studio</h1>
          <p className="text-xs text-gray-500">
            Click a part to get engineering insights
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <InfoPanel />
        </div>
      </aside>

      {/* Inline style for desktop panel width (can't do dynamic % in Tailwind) */}
      <style>{`
        @media (min-width: 1024px) {
          aside {
            width: ${panelWidth}vw !important;
            height: 100dvh !important;
            position: relative;
          }
        }
      `}</style>

    </main>
  );
}