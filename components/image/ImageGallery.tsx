'use client';

import Image from 'next/image';
import { Eraser, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GeneratedImage } from '@/types/image';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function ImageGallery({ images, onImageClick, onDelete, onClear }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>暂无历史图片</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">共 {images.length} 张图片</p>
        <Button variant="outline" size="sm" onClick={onClear}>
          <Eraser className="mr-2 h-4 w-4" />
          清空画廊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="group relative overflow-hidden transition-all hover:ring-2 hover:ring-primary"
          >
            <button
              type="button"
              className="block w-full cursor-pointer text-left"
              onClick={() => onImageClick(image)}
            >
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
              <div className="p-2 pr-9">
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {image.prompt}
                </p>
              </div>
            </button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => onDelete(image.id)}
              aria-label={`删除图片 ${image.prompt}`}
              className="absolute bottom-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
