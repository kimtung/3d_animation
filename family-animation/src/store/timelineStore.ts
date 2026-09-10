// ============================================================
// timelineStore — Zustand store for timeline UI controls & stories
// ============================================================

import { create } from "zustand";

export interface TimelineStoreState {
  currentStoryId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // Set by engine bootstrap
  _controls: {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    reset: () => void;
    loadStory: (storyId: string) => void;
  } | null;

  _sync: (patch: Partial<Pick<TimelineStoreState, "isPlaying" | "currentTime" | "duration">>) => void;
}

export const useTimelineStore = create<TimelineStoreState>()((set) => ({
  currentStoryId: "dad_tv_secret",
  isPlaying: false,
  currentTime: 0,
  duration: 36,
  _controls: null,
  _sync: (patch) => set((state) => ({ ...state, ...patch })),
}));
