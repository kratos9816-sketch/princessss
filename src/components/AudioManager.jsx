import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';

export default function AudioManager() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const isMuted = useGameStore((s) => s.isMuted);
  const masterVolume = useGameStore((s) => s.masterVolume);
  const bgmVolume = useGameStore((s) => s.bgmVolume);
  const sfxVolume = useGameStore((s) => s.sfxVolume);
  const audioInitialized = useGameStore((s) => s.audioInitialized);

  // Sync volume with soundManager
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    soundManager.setMasterVolume(masterVolume);
  }, [masterVolume]);

  useEffect(() => {
    soundManager.setBgmVolume(bgmVolume);
  }, [bgmVolume]);

  useEffect(() => {
    soundManager.setSfxVolume(sfxVolume);
  }, [sfxVolume]);

  // Sync ambient environmental sound when room changes
  useEffect(() => {
    if (audioInitialized) {
      soundManager.setRoomAmbience(currentRoom);
    }
  }, [currentRoom, audioInitialized]);

  return null;
}
