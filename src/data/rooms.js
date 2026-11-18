/**
 * THE CASTLE OF OUR FOREVER - ROOMS CONFIGURATION
 * Defines all rooms, spawn points, ambient settings, and doorways.
 */

export const ROOMS = {
  EXTERIOR: 'exterior',
  GRAND_HALL: 'grand-hall',
  MEMORY_CHAMBER: 'memory-chamber',
  BALLROOM: 'ballroom',
  SECRET_LIBRARY: 'secret-library',
  ENCHANTED_GARDEN: 'enchanted-garden',
  FOREVER_CHAMBER: 'forever-chamber',
};

export const roomDefinitions = {
  [ROOMS.EXTERIOR]: {
    id: ROOMS.EXTERIOR,
    title: 'The Mountain Fortress',
    subtitle: 'Outer Gates',
    ambientColor: '#100c1e',
    ambientIntensity: 0.6,
    fogColor: '#0a0814',
    fogNear: 15,
    fogFar: 90,
    spawnPoint: [0, 1.7, 24],
    spawnRotation: [0, 0, 0],
    musicMood: 'exterior-wind',
  },
  [ROOMS.GRAND_HALL]: {
    id: ROOMS.GRAND_HALL,
    title: 'The Grand Hall',
    subtitle: 'The Heart of the Castle',
    description: 'The monumental Gothic entrance hall with black marble, grand staircase, and towering chandeliers.',
    ambientColor: '#30101b',
    ambientIntensity: 0.8,
    fogColor: '#12050b',
    fogNear: 12,
    fogFar: 45,
    spawnPoint: [0, 1.7, 10],
    spawnRotation: [0, Math.PI, 0],
    musicMood: 'romantic-cathedral',
    doors: [
      {
        id: 'door-memory',
        targetRoom: ROOMS.MEMORY_CHAMBER,
        position: [-11.5, 0, 2],
        rotation: [0, Math.PI / 2, 0],
        label: 'The Memory Chamber',
        signText: 'Memory Chamber',
        color: '#d6284e',
      },
      {
        id: 'door-ballroom',
        targetRoom: ROOMS.BALLROOM,
        position: [11.5, 0, 2],
        rotation: [0, -Math.PI / 2, 0],
        label: 'The Royal Ballroom',
        signText: 'Royal Ballroom',
        color: '#dfbe7a',
      },
      {
        id: 'door-library',
        targetRoom: ROOMS.SECRET_LIBRARY,
        position: [-11.5, 0, -8],
        rotation: [0, Math.PI / 2, 0],
        label: 'The Secret Library',
        signText: 'Secret Library',
        color: '#63471c',
      },
      {
        id: 'door-garden',
        targetRoom: ROOMS.ENCHANTED_GARDEN,
        position: [11.5, 0, -8],
        rotation: [0, -Math.PI / 2, 0],
        label: 'The Enchanted Garden',
        signText: 'Enchanted Garden',
        color: '#348f50',
      },
      {
        id: 'door-forever',
        targetRoom: ROOMS.FOREVER_CHAMBER,
        position: [0, 5.2, -15.5],
        rotation: [0, 0, 0],
        label: 'The Forever Chamber',
        signText: 'Tower Spire · The Forever Chamber',
        color: '#c6a15b',
      },
      {
        id: 'door-exit-exterior',
        targetRoom: ROOMS.EXTERIOR,
        position: [0, 0, 15.5],
        rotation: [0, Math.PI, 0],
        label: 'Castle Gates',
        signText: 'Return to Castle Gates',
        color: '#8c6d32',
      }
    ]
  },
  [ROOMS.MEMORY_CHAMBER]: {
    id: ROOMS.MEMORY_CHAMBER,
    title: 'The Memory Chamber',
    subtitle: 'Where Every Second is Cherished',
    description: 'A warm, romantic sanctuary filled with candlelit portrait frames, a roaring hearth, and our most cherished memories.',
    ambientColor: '#42161f',
    ambientIntensity: 0.9,
    fogColor: '#1a060e',
    fogNear: 10,
    fogFar: 35,
    spawnPoint: [8, 1.7, 0],
    spawnRotation: [0, -Math.PI / 2, 0],
    musicMood: 'gentle-piano',
    doors: [
      {
        id: 'door-back-grandhall',
        targetRoom: ROOMS.GRAND_HALL,
        position: [9.5, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        label: 'Return to Grand Hall',
        signText: 'Grand Hall',
        color: '#c6a15b',
      }
    ]
  },
  [ROOMS.BALLROOM]: {
    id: ROOMS.BALLROOM,
    title: 'The Royal Ballroom',
    subtitle: 'A Waltz for Eternity',
    description: 'Polished black marble dance floor, towering chandeliers, sweeping velvet curtains, and floating rose petals.',
    ambientColor: '#3d1628',
    ambientIntensity: 0.85,
    fogColor: '#15060f',
    fogNear: 14,
    fogFar: 45,
    spawnPoint: [-9, 1.7, 0],
    spawnRotation: [0, Math.PI / 2, 0],
    musicMood: 'ballroom-waltz',
    doors: [
      {
        id: 'door-back-grandhall-2',
        targetRoom: ROOMS.GRAND_HALL,
        position: [-10.5, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        label: 'Return to Grand Hall',
        signText: 'Grand Hall',
        color: '#c6a15b',
      }
    ]
  },
  [ROOMS.SECRET_LIBRARY]: {
    id: ROOMS.SECRET_LIBRARY,
    title: 'The Secret Library',
    subtitle: 'Tomes of Infinite Love',
    description: 'Towering dark walnut bookshelves, rolling brass ladders, dust motes drifting in shafts of warm light, and hidden love notes.',
    ambientColor: '#2b1b14',
    ambientIntensity: 0.8,
    fogColor: '#120b08',
    fogNear: 10,
    fogFar: 35,
    spawnPoint: [8, 1.7, 0],
    spawnRotation: [0, -Math.PI / 2, 0],
    musicMood: 'mysterious-strings',
    doors: [
      {
        id: 'door-back-grandhall-3',
        targetRoom: ROOMS.GRAND_HALL,
        position: [9.5, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        label: 'Return to Grand Hall',
        signText: 'Grand Hall',
        color: '#c6a15b',
      }
    ]
  },
  [ROOMS.ENCHANTED_GARDEN]: {
    id: ROOMS.ENCHANTED_GARDEN,
    title: 'The Enchanted Garden',
    subtitle: 'Under the Silver Moonlight',
    description: 'Gothic stone arches draped with crimson roses, gentle fireflies, a whispering fountain, and a moonlit romantic gazebo.',
    ambientColor: '#0d1822',
    ambientIntensity: 0.75,
    fogColor: '#081017',
    fogNear: 14,
    fogFar: 50,
    spawnPoint: [-11, 1.7, 0],
    spawnRotation: [0, Math.PI / 2, 0],
    musicMood: 'night-garden',
    doors: [
      {
        id: 'door-back-grandhall-4',
        targetRoom: ROOMS.GRAND_HALL,
        position: [-12.5, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        label: 'Return to Grand Hall',
        signText: 'Grand Hall',
        color: '#c6a15b',
      }
    ]
  },
  [ROOMS.FOREVER_CHAMBER]: {
    id: ROOMS.FOREVER_CHAMBER,
    title: 'The Forever Chamber',
    subtitle: 'The High Spire Observatory',
    description: 'The crowning sanctuary of the castle, open to the infinite cosmos, where our eternal vow is etched into the stars.',
    ambientColor: '#21153b',
    ambientIntensity: 0.9,
    fogColor: '#0f0a1c',
    fogNear: 16,
    fogFar: 60,
    spawnPoint: [0, 1.7, 10],
    spawnRotation: [0, Math.PI, 0],
    musicMood: 'celestial-climax',
    doors: [
      {
        id: 'door-back-grandhall-5',
        targetRoom: ROOMS.GRAND_HALL,
        position: [0, 0, 12.5],
        rotation: [0, 0, 0],
        label: 'Descend to Grand Hall',
        signText: 'Grand Hall Stairway',
        color: '#c6a15b',
      }
    ]
  }
};
