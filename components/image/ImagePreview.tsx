'use client';

import Image from 'next/image';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GeneratedImage } from '@/types/image';

interface ImagePreviewProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
  onDelete?: (id: string) => void;
}

export function ImagePreview({ image, isGenerating, onDelete }: ImagePreviewProps) {
  const handleDownload = async () => {
    if (!image) return;

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `agnes-image-${image.id}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  if (isGenerating) {
    return (
      <Card className="flex aspect-[4/3] items-center justify-center bg-muted">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">生成中...</p>
        </div>
      </Card>
    );
  }

  if (!image) {
    return (
      <Card className="flex aspect-[4/3] items-center justify-center bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">生成的图片会显示在这里</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3]">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </Card>
      <div className="flex items-start justify-between gap-4">
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{image.prompt}</p>
        <div className="flex shrink-0 gap-2">
          {onDelete && (
            <Button onClick={() => onDelete(image.id)} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          )}
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
        </div>
      </div>
    </div>
  );
}
