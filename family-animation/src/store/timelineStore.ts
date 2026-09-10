// ============================================================
// timelineStore — Zustand store for timeline UI controls
// ============================================================

import { create } from 'zustand';

export interface TimelineStoreState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // Set by engine bootstrap
  _controls: {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    reset: () => void;
  } | null;

  _sync: (patch: Partial<Pick<TimelineStoreState, 'isPlaying' | 'currentTime' | 'duration'>>) => void;
}

export const useTimelineStore = create<TimelineStoreState>()((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  _controls: null,
  _sync: (patch) => set((state) => ({ ...state, ...patch })),
}));
