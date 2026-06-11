import { create } from 'zustand';
import { GeneratedImage } from '@/types/image';

interface ImageState {
  gallery: GeneratedImage[];
  isGenerating: boolean;
  currentImage: GeneratedImage | null;

  addToGallery: (image: GeneratedImage) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentImage: (image: GeneratedImage | null) => void;
  clearGallery: () => void;
  loadGallery: () => void;
  saveGallery: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
  gallery: [],
  isGenerating: false,
  currentImage: null,

  addToGallery: (image: GeneratedImage) => {
    set((state) => ({
      gallery: [image, ...state.gallery],
      currentImage: image,
    }));
    get().saveGallery();
  },

  setIsGenerating: (isGenerating: boolean) => {
    set({ isGenerating });
  },

  setCurrentImage: (image: GeneratedImage | null) => {
    set({ currentImage: image });
  },

  clearGallery: () => {
    set({ gallery: [] });
    get().saveGallery();
  },

  loadGallery: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('image_gallery');
      if (saved) {
        const gallery = JSON.parse(saved);
        set({ gallery });
      }
    }
  },

  saveGallery: () => {
    if (typeof window !== 'undefined') {
      const { gallery } = get();
      localStorage.setItem('image_gallery', JSON.stringify(gallery));
    }
  },
}));
