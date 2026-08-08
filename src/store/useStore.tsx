import { create } from 'zustand';

interface AppState {
  // Which part is selected in the 3D viewer
  selectedPartName: string | null;
  setSelectedPart: (name: string | null) => void;

  // AI chat
  partInfoLoading: boolean;
  partInfoAnswer: string | null;
  partInfoError: string | null;
  fetchPartInfo: (partName: string, question?: string) => Promise<void>;

  // Library / assembly selection
  availableAssemblies: string[];
  selectedAssembly: string | null;
  assembliesLoading: boolean;
  fetchAssemblies: () => Promise<void>;
  setSelectedAssembly: (name: string | null) => void;
  resetViewerState: () => void;

}

// Strips _1, _2, _3 suffixes so "yoke_1" → "yoke"
function normalizePartName(name: string): string {
  return name.replace(/_\d+$/, '').toLowerCase();
}

export const useStore = create<AppState>((set) => ({
  selectedPartName: null,
  setSelectedPart: (name) => set({ selectedPartName: name }),

  partInfoLoading: false,
  partInfoAnswer: null,
  partInfoError: null,

  availableAssemblies: [],
  selectedAssembly: null,
  assembliesLoading: false,
  

  fetchAssemblies: async () => {
    set({ assembliesLoading: true });
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      set({ availableAssemblies: data.assemblies || [], assembliesLoading: false });
    } catch {
      set({ assembliesLoading: false });
    }
  },

  setSelectedAssembly: (name) => set({ selectedAssembly: name }),
  resetViewerState: () =>
    set({
      selectedAssembly: null,
      selectedPartName: null,
      partInfoLoading: false,
      partInfoAnswer: null,
      partInfoError: null,
    }),



  fetchPartInfo: async (partName, question) => {
    const normalized = normalizePartName(partName);
    set({ partInfoLoading: true, partInfoAnswer: null, partInfoError: null });
    try {
      const res = await fetch('/api/part-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: normalized, question }),
      });
      if (!res.ok || !res.body) {
        throw new Error('Failed to reach backend');
      }
      // Read stream chunk by chunk
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';

      set({ partInfoLoading: false }); // stop spinner, start showing text

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        set({ partInfoAnswer: answer }); // update answer as chunks arrive
      }
    } catch (err) {
      set({
        partInfoLoading: false,
        partInfoError: err instanceof Error ? err.message : 'Failed to reach backend',
      });
    }
  },
}));
