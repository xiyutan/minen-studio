'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateImage } from '@/lib/api/image';
import { useImageStore } from '@/store/imageStore';
import { ImageGallery } from './ImageGallery';
import { ImagePreview } from './ImagePreview';
import { ImagePromptInput } from './ImagePromptInput';

export function ImageGenerator() {
  const {
    gallery,
    isGenerating,
    currentImage,
    addToGallery,
    deleteImage,
    clearGallery,
    setIsGenerating,
    setCurrentImage,
    loadGallery,
  } = useImageStore();

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleGenerate = async (prompt: string, size: string) => {
    setIsGenerating(true);

    try {
      const url = await generateImage({ prompt, size });

      const newImage = {
        id: `img_${Date.now()}`,
        prompt,
        url,
        size,
        createdAt: Date.now(),
      };

      addToGallery(newImage);
      setCurrentImage(newImage);
      toast.success('图片生成成功');
    } catch (error: unknown) {
      console.error('图片生成失败:', error);
      toast.error(`图片生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (imageId: string) => {
    deleteImage(imageId);
    toast.success('图片已删除');
  };

  const handleClear = () => {
    clearGallery();
    toast.success('图片历史已清空');
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">生成图片</TabsTrigger>
            <TabsTrigger value="gallery">历史画廊</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ImagePromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
              <ImagePreview
                image={currentImage}
                isGenerating={isGenerating}
                onDelete={handleDelete}
              />
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <ImageGallery
              images={gallery}
              onImageClick={setCurrentImage}
              onDelete={handleDelete}
              onClear={handleClear}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
