"use client";

import Viewer from "@/components/Viewer";
import InfoPanel from "@/components/InfoPanel";
import LibraryScreen from "@/components/LibraryScreen";
import { useStore } from "@/store/useStore";

export default function Home() {
  const selectedAssembly = useStore((state) => state.selectedAssembly);

  // Show the library until an assembly is selected
  if (!selectedAssembly) {
    return <LibraryScreen />;
  }

  return (
    <main className="w-screen h-screen flex overflow-hidden bg-gray-100">
      {/* 3D Viewer */}
      <section className="flex-1 relative">
        <Viewer />
      </section>

      {/* AI Assistant Panel */}
      <aside className="w-[480px] min-w-[480px] bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-gray-200">
          <h1 className="text-sm font-bold text-gray-800">
            AI Studio
          </h1>
          <p className="text-xs text-gray-500">
            Click a part to get engineering insights
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <InfoPanel />
        </div>
      </aside>
    </main>
  );
}