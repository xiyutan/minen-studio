'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ImagePromptInputProps {
  onGenerate: (prompt: string, size: string) => void;
  isGenerating: boolean;
}

export function ImagePromptInput({ onGenerate, isGenerating }: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x768');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), size);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">提示词</label>
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="描述你想生成的图片，例如：一座漂浮在云端的未来城市，日出时分，电影级写实风格"
          className="min-h-28"
          disabled={isGenerating}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">尺寸</label>
        <Select value={size} onValueChange={(value) => value && setSize(value)} disabled={isGenerating}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x768">1024 x 768</SelectItem>
            <SelectItem value="768x1024">768 x 1024</SelectItem>
            <SelectItem value="1024x1024">1024 x 1024</SelectItem>
            <SelectItem value="1280x720">1280 x 720</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!prompt.trim() || isGenerating} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        {isGenerating ? '生成中...' : '生成图片'}
      </Button>
    </form>
  );
}
