import { create } from 'zustand';
import { ROOMS, roomDefinitions } from '../data/rooms';

export const useGameStore = create((set, get) => ({
  // Core state
  currentRoom: ROOMS.EXTERIOR,
  targetRoom: null,
  gameState: 'title', // 'title' | 'playing' | 'cinematic' | 'paused'
  gateOpen: false,
  isTransitioning: false,
  transitionMessage: '',

  // Modals
  activeModal: null, // null | 'memory' | 'book' | 'secret' | 'forever' | 'pause' | 'map'
  selectedMemory: null,
  selectedBook: null,
  selectedSecret: null,

  // Player controls
  isPointerLocked: false,
  interactionPrompt: null, // { text: string, action: () => void }
  isTouchDevice: false,
  touchMoveVector: { x: 0, y: 0 },
  touchLookDelta: { x: 0, y: 0 },

  // Discoveries & Progress
  visitedRooms: [ROOMS.EXTERIOR],
  discoveredSecrets: [],

  // Cinematics
  ballroomCinematicTriggered: false,
  ballroomDanceActive: false,
  foreverCinematicTriggered: false,
  foreverLetterRevealed: false,

  // Audio settings
  isMuted: false,
  masterVolume: 0.75,
  bgmVolume: 0.8,
  sfxVolume: 0.85,
  audioInitialized: false,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  openGate: () => set({ gateOpen: true }),

  enterCastle: () => {
    const { startTransition } = get();
    set({ gateOpen: true });
    // Allow gate open animation to play, then transition to Grand Hall
    setTimeout(() => {
      startTransition(ROOMS.GRAND_HALL, 'Entering The Grand Hall...');
    }, 1800);
  },

  startTransition: (newRoomId, message = '') => {
    if (get().isTransitioning) return;
    set({
      isTransitioning: true,
      transitionMessage: message || `Entering ${roomDefinitions[newRoomId]?.title || 'Chamber'}...`,
      targetRoom: newRoomId,
      interactionPrompt: null,
      activeModal: null,
    });

    setTimeout(() => {
      const visited = get().visitedRooms;
      set({
        currentRoom: newRoomId,
        targetRoom: null,
        visitedRooms: visited.includes(newRoomId) ? visited : [...visited, newRoomId],
      });

      setTimeout(() => {
        set({ isTransitioning: false, transitionMessage: '' });
      }, 700);
    }, 800);
  },

  setPointerLocked: (locked) => set({ isPointerLocked: locked }),
  setIsTouchDevice: (val) => set({ isTouchDevice: val }),
  setTouchMoveVector: (vec) => set({ touchMoveVector: vec }),
  setTouchLookDelta: (delta) => set({ touchLookDelta: delta }),

  setInteractionPrompt: (prompt) => set({ interactionPrompt: prompt }),
  clearInteractionPrompt: () => set({ interactionPrompt: null }),

  // Modal actions
  openMemoryModal: (memory) => {
    document.exitPointerLock?.();
    set({
      activeModal: 'memory',
      selectedMemory: memory,
      isPointerLocked: false,
    });
  },

  openBookModal: (book) => {
    document.exitPointerLock?.();
    set({
      activeModal: 'book',
      selectedBook: book,
      isPointerLocked: false,
    });
  },

  openSecretModal: (secret) => {
    document.exitPointerLock?.();
    const discovered = get().discoveredSecrets;
    const newSecrets = discovered.includes(secret.id) ? discovered : [...discovered, secret.id];
    set({
      activeModal: 'secret',
      selectedSecret: secret,
      discoveredSecrets: newSecrets,
      isPointerLocked: false,
    });
  },

  openForeverLetter: () => {
    document.exitPointerLock?.();
    set({
      activeModal: 'forever',
      foreverLetterRevealed: true,
      isPointerLocked: false,
    });
  },

  closeModal: () => {
    set({
      activeModal: null,
      selectedMemory: null,
      selectedBook: null,
      selectedSecret: null,
    });
  },

  togglePauseMenu: () => {
    const current = get().activeModal;
    if (current === 'pause') {
      set({ activeModal: null });
    } else {
      document.exitPointerLock?.();
      set({ activeModal: 'pause', isPointerLocked: false });
    }
  },

  // Ballroom special event
  triggerBallroomDance: () => {
    set({
      ballroomDanceActive: true,
      ballroomCinematicTriggered: true,
    });
    setTimeout(() => {
      set({ ballroomDanceActive: false });
    }, 12000);
  },

  // Audio actions
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setMasterVolume: (vol) => set({ masterVolume: vol }),
  setBgmVolume: (vol) => set({ bgmVolume: vol }),
  setSfxVolume: (vol) => set({ sfxVolume: vol }),
  initAudio: () => set({ audioInitialized: true }),
}));
