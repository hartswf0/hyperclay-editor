# 🎬 Surreal OS Title Sequence System

## Overview

A Saul Bass-inspired cinematic title sequence system for each Surreal OS world. Uses Three.js camera choreography, sprite-based typography, and geometric animation to create 10-12 second introductions that reveal each world's surreal break.

## ✅ Implemented: ScaleOS

**"SIZE DECEIVES / MASS PERSISTS"**

### Camera Choreography (12 seconds, 4 acts)

**ACT 1: Extreme Close-up (0-3s)**
- Camera: Close on featured truck, FOV narrows from 60° to 30°
- Text: "SIZE" fades in above truck, scales up
- Effect: Creates intimacy and focus

**ACT 2: Pull Back Reveal (3-6s)**
- Camera: Pulls back and rises to aerial view, FOV widens to 60°
- Text: "SIZE" moves left, "DECEIVES" fades in right
- Effect: Reveals the deception of visual scale

**ACT 3: Dolly Zoom (6-9s)**
- Camera: Hitchcock-style dolly zoom (move back + FOV widens 60°→80°)
- Text: Old text fades out, "MASS" appears at bottom
- Geometric: Two horizontal lines frame composition
- Effect: Vertigo effect emphasizes surreal break

**ACT 4: Final Composition (9-12s)**
- Camera: Settles at default view
- Text: "PERSISTS" slides up from bottom
- Effect: Final statement, fade to black

### Typography
- Font: Impact (Saul Bass style)
- Colors: Orange (#FF6B35), Cyan (#36CFC9), Yellow (#FFB400)
- Rendering: Canvas-based sprites with black outlines
- Size: Dynamically scaled 10-12 units in 3D space

### Geometric Elements
- Two horizontal lines (top/bottom framing)
- Fade in during Act 3
- Yellow (#FFB400) to match world accent color

## 🏗️ System Architecture

### TitleSequence Class

```javascript
class TitleSequence {
  constructor(camera, scene, duration = 12)
  
  // Methods:
  createTextSprite(text, color, size) // Canvas-rendered text → sprite
  addGeometricLine(start, end, color) // Saul Bass geometric shapes
  lerp(a, b, t) // Linear interpolation
  easeInOutCubic(t) // Smooth easing function
  play() // Main playback trigger
  runScaleOSSequence(onComplete) // World-specific choreography
}
```

### UI Integration
- **Play Button:** Top-right, yellow (#FFB400), glowing shadow
- **State Management:** Hides UI during playback, disables orbit controls
- **Cleanup:** Removes sprites/lines, restores camera position

### Performance
- Sprite-based text (no font loading)
- RequestAnimationFrame timing
- Automatic garbage collection after playback

## 🎨 Saul Bass Principles Applied

✅ **Geometric Minimalism** - Text sprites + two horizontal lines  
✅ **Limited Palette** - 3 colors max (orange, cyan, yellow)  
✅ **Bold Typography** - Impact font, thick outlines  
✅ **Linear Motion** - Straight camera paths, simple text slides  
✅ **Symbolic Metaphor** - "SIZE DECEIVES" literally shrinks/grows with camera  
✅ **Rhythmic Pacing** - 4 distinct acts, 3-second intervals  

## 📋 Remaining Worlds

### 2. MirrorOS - "WHAT IF REFLECTION WAS SYNCHRONIZATION?"
- Camera: Spiral around moons
- Elements: Sync particle Lissajous curves
- Color: Cyan particles on dark blue

### 3. TempoOS - "TIME BENDS WHERE TURTLES TREAD"
- Camera: Bird's eye descend → turtle tracking
- Elements: Glowing trail paths forming clock
- Color: Yellow/purple time field

### 4. MorphOS - "BETWEEN FORMS LIES POSSIBILITY"
- Camera: Circle morphing entity → crane up
- Elements: Geometric shapes (wings/arms/legs) separate
- Color: Purple spotlight silhouette

### 5. AnomalyOS - "CHAOS WAITS IN THE CEILING"
- Camera: Ground look up → zoom ball → rupture pullback
- Elements: Expanding rings, scattered text fragments
- Color: Orange ball, cyan rings

### 6. LightOS - "LIGHT BECOMES ARCHITECTURE"
- Camera: Inside beam rotating → spiral lighthouse
- Elements: Metadata rooms revealed by sweep
- Color: Cyan beam rays

### 7. ArchiveOS - "EVERY BOOK CONTAINS A WORLD"
- Camera: Macro book → library pullback → diorama orbit
- Elements: Pulsing books, expanding capsule
- Color: Golden/amber glow

## 🚀 Next Steps

1. **Extend to all worlds** - Copy TitleSequence class to each demo
2. **World-specific sequences** - Write `runWorldNameSequence()` methods
3. **Audio integration** - Add minimalist sound design (optional)
4. **Recording** - Integrate CCapture.js for video export
5. **Compilation** - Create master intro reel combining all 7

## 🎥 Usage

```javascript
// In each demo HTML file:
const titleSequence = new TitleSequence(camera, scene, 12);
document.getElementById('play-intro').onclick = () => {
  titleSequence.play();
};
```

## 💡 Design Notes

- **Duration:** 12 seconds balances cinematic impact with attention span
- **Text:** Keep to 4-6 words max for clarity
- **Camera:** Always return to default view for seamless transition
- **Easing:** Cubic easing feels "mechanical" like Saul Bass motion graphics
- **Color:** Use world's existing palette for consistency

---

**Status:** ScaleOS complete ✅ | 6 worlds remaining 🎬
