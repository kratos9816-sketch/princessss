/**
 * THE CASTLE OF OUR FOREVER - MESSAGES & SECRETS DATA
 * Love notes, library tomes, hidden surprises, and the climactic Forever Letter.
 */

export const libraryBooks = [
  {
    id: 'book-reasons-1',
    title: 'The Grimoire of A Thousand Reasons',
    author: 'From Your Devoted Prince',
    category: 'Reasons Why I Love You',
    preview: 'Why every beat of my heart belongs to you...',
    color: '#80182a',
    position: [-6, 1.8, -4],
    rotation: [0, 0, 0],
    pages: [
      {
        pageNumber: 1,
        heading: 'Why I Love You — Volume I',
        content: `1. The way your eyes crinkle with pure joy when something genuinely makes you laugh.
2. The sound of your voice first thing in the morning, soft and sleepy.
3. How you remember the tiniest details about things I casually mentioned weeks ago.
4. Your kindness toward strangers, animals, and everyone around you.
5. The little happy dance you do when you eat your favorite food.
6. The way you hold onto my arm when we're walking together in the cold.`
      },
      {
        pageNumber: 2,
        heading: 'Why I Love You — Volume II',
        content: `7. How safe and completely at peace I feel whenever you are in my arms.
8. The brilliance of your mind and the passion you pour into everything you care about.
9. How you can turn my most stressful, exhausting day into pure sunshine with just one hug.
10. The secret glances we share across a crowded room that only you and I understand.
11. How beautiful you are without even trying—especially in oversized sweaters with messy hair.
12. Because you are not just my love; you are my best friend and my forever home.`
      }
    ]
  },
  {
    id: 'book-destiny',
    title: 'Chronicles of You & Me',
    author: 'Written in the Constellations',
    category: 'Our Love Story',
    preview: 'How two souls crossed infinite paths to find each other...',
    color: '#1a334d',
    position: [-6, 1.8, 0],
    rotation: [0, 0, 0],
    pages: [
      {
        pageNumber: 1,
        heading: 'The Cosmic Alignment',
        content: `If you told me years ago that one person could walk into my life and redefine every meaning of happiness, tenderness, and purpose, I might not have believed it.

Yet here we are. In a world of eight billion souls, out of all the centuries that came before and all the centuries to come, fate chose this exact lifetime for our paths to intertwine.

Every past heartbreak, every detour, and every quiet prayer led me directly to your door.`
      }
    ]
  },
  {
    id: 'book-secret-passage',
    title: 'The Enchanted Leatherbound Journal',
    author: 'Whispers of the Castle',
    category: 'Secret Parchment',
    preview: 'A strange mechanism seems concealed within this glowing spine...',
    color: '#63471c',
    position: [6, 1.8, -2],
    rotation: [0, Math.PI, 0],
    isSecretTrigger: true,
    pages: [
      {
        pageNumber: 1,
        heading: 'The Hidden Chamber of Promises',
        content: `You found the secret mechanism!

*Click... A soft vibration echoes through the bookshelves.*

"My dearest love, curiosity looks gorgeous on you. Just like you noticed this hidden book, know that I notice every little detail about you. I promise to keep discovering new things to adore about you for the rest of our days."`
      }
    ]
  },
  {
    id: 'book-poetry',
    title: 'Nocturnes of the Gothic Heart',
    author: 'Dedicated to My Princess',
    category: 'Romantic Verses',
    preview: 'Stanzas penned under the midnight moon...',
    color: '#381636',
    position: [6, 1.8, 3],
    rotation: [0, Math.PI, 0],
    pages: [
      {
        pageNumber: 1,
        heading: 'Eternal Dusk',
        content: `The stars may burn out in the hollows of time,
The mountains may crumble, the bells cease to chime,
Yet my vow remains carved in the obsidian stone:
Wherever you walk, you will never walk alone.

You are the song in the silent cathedral,
The warmth in the winter, the spark through the fall.
In every lifetime, in every design,
I would cross ten thousand worlds just to make you mine.`
      }
    ]
  }
];

export const secretsData = {
  'grand-hall-painting': {
    id: 'grand-hall-painting',
    title: 'The Hidden Note Behind the Royal Crest',
    room: 'Grand Hall',
    icon: 'portrait',
    promptText: 'Inspect Mysterious Painting',
    message: `You gently tilt the vintage portrait frame and find a folded parchment taped to the canvas:

"My Princess,
Before you explore any further into these halls, remember this: every single brick of this castle was placed with you in mind. Take your time, breathe in the candlelight, and know how deeply you are adored."`
  },
  'memory-glowing-rose': {
    id: 'memory-glowing-rose',
    title: 'The Ever-Blooming Crimson Rose',
    room: 'The Memory Chamber',
    icon: 'flower',
    promptText: 'Touch the Glowing Rose',
    message: `A soft, warm light radiates from the petals as you touch the glass cloche:

"They say roses eventually wither, but not this one. Just like my love for you, this flower is sustained by pure magic—unfading, vibrant, and timeless through all the seasons of our life."`
  },
  'library-hidden-compartment': {
    id: 'library-hidden-compartment',
    title: 'The Scholar’s Hidden Drawer',
    room: 'The Secret Library',
    icon: 'book-open',
    promptText: 'Examine Antique Desk Drawer',
    message: `You slide open a velvet-lined secret compartment underneath the desk:

"A prince’s deepest secret: From the very first month we met, I was already praying that you would be the one I get to grow old with. Thank you for making my dream a reality every single day."`
  },
  'garden-fountain-whisper': {
    id: 'garden-fountain-whisper',
    title: 'The Fountain of Eternal Devotion',
    room: 'The Enchanted Garden',
    icon: 'droplets',
    promptText: 'Listen to the Whispering Fountain',
    message: `The sparkling water sparkles under the moonlight, and an engraving in the stone reveals:

"Like water carving stone, my love for you runs deeper with every breath. You are the stillness in my storms and the sparkle in my darkest nights."`
  },
  'forever-balcony-view': {
    id: 'forever-balcony-view',
    title: 'The Spire of Constellations',
    room: 'The Forever Chamber',
    icon: 'sparkles',
    promptText: 'Gaze into the Infinite Sky',
    message: `Looking out from the highest pinnacle of the kingdom, the entire world stretches below under a blanket of stars:

"Every kingdom in history has fallen, but the kingdom we are building together—built on trust, laughter, patience, and unconditional love—will stand forever."`
  }
};

export const foreverLetterData = {
  royalHeading: 'To My Beloved Princess',
  subheading: 'A Solemn Vow from the Deepest Corners of My Heart',
  openingQuote: '"Out of all the kingdoms in this universe, there is only one place I will always call home. And that place is beside you."',
  bodyParagraphs: [
    `My dearest love,`,
    `I built this castle for you—every candlelit archway, every stained-glass corridor, every rose petal floating in the ballroom—to give you a glimpse of how sacred, majestic, and extraordinary your presence is in my life.`,
    `When I look at you, I don't just see the person I love today; I see every tomorrow I ever want to live. I see lazy mornings filled with quiet smiles, adventurous road trips, comforting hugs during difficult times, and a lifetime of shared laughter.`,
    `You have taught me what genuine partnership feels like. You have seen me at my strongest and at my most vulnerable, and you have loved me with an open heart through it all. In return, I give you everything I am: my loyalty, my dedication, my utmost respect, and my whole soul.`,
    `No matter where life takes us, through every storm and every triumph, my hand will always be the one reaching out to hold yours.`
  ],
  closing: 'Forever and always, your prince.',
  signature: 'To my princess, from your prince. Forever and always.',
  proposalNote: 'You are my once-in-a-lifetime. Will you stay in our castle forever?'
};
