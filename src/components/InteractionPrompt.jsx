import React from 'react';
import { useGameStore } from '../store/gameStore';

export default function InteractionPrompt() {
  const prompt = useGameStore((s) => s.interactionPrompt);
  const activeModal = useGameStore((s) => s.activeModal);
  const isTransitioning = useGameStore((s) => s.isTransitioning);

  if (!prompt || activeModal || isTransitioning) return null;

  return (
    <div
      className="interaction-prompt hud-interactive"
      onClick={() => {
        if (prompt.action) prompt.action();
      }}
      title="Click or press [E]"
    >
      <span className="interaction-key">E</span>
      <span>{prompt.text}</span>
    </div>
  );
}
