# The Castle of Our Forever 🏰🌹

An interactive, playable 3D romantic fantasy video game website built with React, Three.js, React Three Fiber, Zustand, and Web Audio.

Built with a royal gothic romance aesthetic as a romantic gift for your princess.

---

## 🌹 Visual Identity & Aesthetic
- **Color Palette:** Deep Burgundy (`#260A14`), Midnight Black (`#09090C`), Antique Gold (`#C6A15B`), Warm Ivory (`#E8DCC8`), Dark Red Velvet (`#5A1127`)
- **Atmosphere:** Polished black marble, golden chandeliers, candlelight, stained glass windows, crackling hearths, floating rose petals, and stardust.
- **Typography:** Cinzel (regal headings), Cormorant Garamond (romantic prose), and Great Vibes (intimate handwritten script).

---

## 🏰 Castles & Connected Chambers

1. **The Castle Exterior & Mountain Gates**
   - Towering gothic gatehouse, conical turrets, flying bats, atmospheric ground mist, full moon, and lantern-lit stone pathway.
   - Cinematic entry sequence with animated rotating gates when clicking **ENTER THE CASTLE**.

2. **The Grand Hall (Navigation Hub)**
   - Double grand staircase, black marble floors, red velvet carpet runner, gothic pillars, chandeliers, and interactive physical doors leading to every chamber.
   - *Secret Easter Egg:* Inspect the painting on the right wall to find a hidden folded note behind the canvas.

3. **Room One: The Memory Chamber**
   - Warm hearth fireplace, antique velvet furniture, candles, and vintage gold portrait frames.
   - Interactive photographs opening the **Cinematic Memory Viewer** modal.
   - *Secret Easter Egg:* The Ever-Blooming Crimson Rose inside the glass cloche on the central table.

4. **Room Two: The Royal Ballroom**
   - Expansive marble dance floor with golden circular medallions, velvet curtains, cascading rose petals, and chandeliers.
   - Interactive central dance stage: step into the center to trigger a sweeping romantic waltz camera cinematic and the vow:
     > *"If I could choose one place to stay forever, it would be wherever you are."*

5. **Room Three: The Secret Library**
   - Massive 2-story bookshelves, antique rolling ladders, floating dust motes, roaring fireplace, and scholar's study desk.
   - Glowing tomes on lecterns: *"The Grimoire of A Thousand Reasons"*, *"Chronicles of You & Me"*, and romantic poetry.
   - *Secret Easter Egg:* The hidden velvet drawer in the scholar's desk.

6. **Room Four: The Enchanted Garden**
   - Outdoor gothic sanctuary under the moonlit sky, red rose bushes, stone pathways, ancient statues, and romantic gazebo.
   - Multi-tiered gothic stone fountain with splashing water droplets.
   - *Secret Easter Egg:* Listen to the whispering fountain stone engraving.

7. **Room Five: The Forever Chamber (The Emotional Climax)**
   - High spire observatory with arched panoramic glass windows overlooking the infinite starry cosmos and giant silver moon.
   - Floating golden stardust and sacred central marble altar.
   - Interactive climax: Opening **The Forever Letter** triggers a golden & crimson confetti explosion, emotional romantic vows, and response buttons:
     > *"To my princess, from your prince. Forever and always."*

---

## 🎮 Player Controls

| Key / Action | Function |
|---|---|
| **W / A / S / D** | Walk forward, left, backward, right |
| **Shift** | Sprint / Run |
| **Mouse** | First-person 360° camera look |
| **E** | Interact (open doors, inspect photos, read books, discover secrets) |
| **ESC** | Open Realm Menu (Map, Audio sliders, Secrets tracker) / Release pointer |

---

## 🎵 Procedural & Dynamic Audio Engine
- **Procedural Romantic Gothic Chords:** Reverberant cathedral harmonies played on warm strings and celesta/harp arpeggios.
- **Dynamic Environmental Soundscapes:**
  - Mountain wind at the Castle Exterior.
  - Crackling fireplace hearth in the Memory Chamber & Library.
  - Whispering fountain water in the Enchanted Garden.
  - Synchronized footsteps on stone and marble.
  - Heavy creaking wooden doors and secret discovery chimes.
- **Audio Controls:** Master, Romantic Melody (BGM), and SFX volume sliders, plus instant mute toggle.
- **Browser Autoplay Compliant:** Smoothly starts on the user's first click ("ENTER THE CASTLE").

---

## 📝 How to Customize Photos, Messages & Vows

All personal content is centralized in easy-to-edit configuration files:

1. **Photographs & Moments:**
   - Edit [`src/data/memories.js`](file:///d:/Personal/websites/princess/src/data/memories.js)
   - Change titles, dates, locations, quotes, stories, and image URLs to your own relationship memories.

2. **Reasons Why I Love You & Secret Notes:**
   - Edit [`src/data/messages.js`](file:///d:/Personal/websites/princess/src/data/messages.js)
   - Customize library book pages, reasons why you love her, hidden easter egg secrets, and the final vows in `foreverLetterData`.

---

## 🚀 Running the Experience

To run the development server locally:

```bash
npm run dev
```

Open your browser to `http://localhost:3000` (or the port displayed in your terminal).

To create an optimized production build:

```bash
npm run build
```
