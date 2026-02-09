import { create } from 'zustand';

interface SaveImage {
  imageUrl: string;
  title: string;
}

interface SaveState {
  isOpen: boolean;
  imageData: SaveImage | null;
  openSaveModal: (data: SaveImage) => void;
  closeSaveModal: () => void;
}

export const useSaveStore = create<SaveState>((set) => ({
  isOpen: false,
  imageData: null,
  openSaveModal: (data) => set({ isOpen: true, imageData: data }),
  closeSaveModal: () => set({ isOpen: false, imageData: null }),
}));