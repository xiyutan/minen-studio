export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  size: string;
  createdAt: number;
}

export interface ImageGenerationParams {
  prompt: string;
  size?: string;
  image?: string[];
}

export interface ImageState {
  gallery: GeneratedImage[];
  isGenerating: boolean;
  currentImage: GeneratedImage | null;
}
