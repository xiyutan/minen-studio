'use client';

import { useState } from 'react';
import { Gauge, Video, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VideoGenerationParams } from '@/types/video';

type VideoPreset = 'fast' | 'standard';

const videoPresets: Record<
  VideoPreset,
  {
    label: string;
    description: string;
    numFrames: string;
    frameRate: string;
    width: number;
    height: number;
  }
> = {
  fast: {
    label: '快速',
    description: '81 帧 / 1152 x 768',
    numFrames: '81',
    frameRate: '24',
    width: 1152,
    height: 768,
  },
  standard: {
    label: '标准',
    description: '121 帧 / 1152 x 768',
    numFrames: '121',
    frameRate: '24',
    width: 1152,
    height: 768,
  },
};

interface VideoPromptInputProps {
  onGenerate: (prompt: string, params: Omit<VideoGenerationParams, 'prompt'>) => void;
  isGenerating: boolean;
  creatingElapsedMs?: number;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} 秒`;
  }

  return `${minutes} 分 ${seconds} 秒`;
}

export function VideoPromptInput({
  onGenerate,
  isGenerating,
  creatingElapsedMs = 0,
}: VideoPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [preset, setPreset] = useState<VideoPreset>('fast');
  const [numFrames, setNumFrames] = useState(videoPresets.fast.numFrames);
  const [frameRate, setFrameRate] = useState('24');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      const selectedPreset = videoPresets[preset];
      onGenerate(prompt.trim(), {
        num_frames: parseInt(numFrames, 10),
        frame_rate: parseInt(frameRate, 10),
        width: selectedPreset.width,
        height: selectedPreset.height,
      });
    }
  };

  const handlePresetChange = (nextPreset: VideoPreset) => {
    setPreset(nextPreset);
    setNumFrames(videoPresets[nextPreset].numFrames);
    setFrameRate(videoPresets[nextPreset].frameRate);
  };

  const getDuration = () => {
    const frames = parseInt(numFrames, 10);
    const fps = parseInt(frameRate, 10);
    return (frames / fps).toFixed(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">提示词</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想生成的视频，例如：一只猫在海滩上行走，日落时分，温暖的金色光线，写实风格"
          className="min-h-28"
          disabled={isGenerating}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">模式</label>
        <div className="grid grid-cols-2 rounded-lg border p-1">
          {(Object.keys(videoPresets) as VideoPreset[]).map((key) => {
            const item = videoPresets[key];
            const isActive = preset === key;
            const Icon = key === 'fast' ? Zap : Gauge;

            return (
              <Button
                key={key}
                type="button"
                variant={isActive ? 'default' : 'ghost'}
                className="h-auto justify-start gap-2 px-3 py-2"
                disabled={isGenerating}
                aria-pressed={isActive}
                onClick={() => handlePresetChange(key)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block truncate text-xs opacity-75">{item.description}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium">帧数</label>
          <Select value={numFrames} onValueChange={(value) => value && setNumFrames(value)} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="81">81 帧</SelectItem>
              <SelectItem value="121">121 帧</SelectItem>
              <SelectItem value="161">161 帧</SelectItem>
              <SelectItem value="241">241 帧</SelectItem>
              <SelectItem value="441">441 帧</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">帧率</label>
          <Select value={frameRate} onValueChange={(value) => value && setFrameRate(value)} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 FPS</SelectItem>
              <SelectItem value="24">24 FPS</SelectItem>
              <SelectItem value="30">30 FPS</SelectItem>
              <SelectItem value="60">60 FPS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        预计时长: 约 {getDuration()} 秒 / {videoPresets[preset].width} x {videoPresets[preset].height}
      </div>

      {isGenerating && (
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          正在提交视频任务，已等待 {formatElapsed(creatingElapsedMs)}
        </div>
      )}

      <Button type="submit" disabled={!prompt.trim() || isGenerating} className="w-full">
        <Video className="mr-2 h-4 w-4" />
        {isGenerating ? '正在提交视频任务...' : '生成视频'}
      </Button>
    </form>
  );
}
