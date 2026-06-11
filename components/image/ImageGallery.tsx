'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { GeneratedImage } from '@/types/image';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
}

export function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>暂无历史图片</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <Card
          key={image.id}
          className="overflow-hidden transition-all hover:ring-2 hover:ring-primary"
          onClick={() => onImageClick(image)}
        >
          <button type="button" className="block w-full cursor-pointer text-left">
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.prompt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
            </div>
            <div className="p-2">
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {image.prompt}
              </p>
            </div>
          </button>
        </Card>
      ))}
    </div>
  );
}
