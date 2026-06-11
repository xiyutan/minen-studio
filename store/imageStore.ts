import { create } from 'zustand';
import { GeneratedImage } from '@/types/image';

interface ImageState {
  gallery: GeneratedImage[];
  isGenerating: boolean;
  currentImage: GeneratedImage | null;

  addToGallery: (image: GeneratedImage) => void;
  deleteImage: (id: string) => void;
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

  deleteImage: (id: string) => {
    set((state) => {
      const gallery = state.gallery.filter((image) => image.id !== id);
      const currentImage =
        state.currentImage?.id === id ? gallery[0] ?? null : state.currentImage;

      return { gallery, currentImage };
    });
    get().saveGallery();
  },

  setIsGenerating: (isGenerating: boolean) => {
    set({ isGenerating });
  },

  setCurrentImage: (image: GeneratedImage | null) => {
    set({ currentImage: image });
  },

  clearGallery: () => {
    set({ gallery: [], currentImage: null });
    get().saveGallery();
  },

  loadGallery: () => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('image_gallery');
    if (!saved) return;

    try {
      const gallery = JSON.parse(saved) as GeneratedImage[];
      set({ gallery });
    } catch (error) {
      console.error('加载图片历史失败:', error);
      localStorage.removeItem('image_gallery');
    }
  },

  saveGallery: () => {
    if (typeof window === 'undefined') return;

    const { gallery } = get();
    localStorage.setItem('image_gallery', JSON.stringify(gallery));
  },
}));
