# HOUMA Entry Sequence Documentation

## Overview
A cinematic, luxury brand entry experience featuring a 3D animated chest that users must "unlock" to enter the HOUMA site. This creates an exclusive, secret society feeling that sets the brand apart from competitors.

## Features

### 🎬 Core Experience
- **3D Animated Chest**: WebGL-powered chest with metallic materials and golden ornaments
- **Interactive Unlock**: Click/tap to trigger the unlock sequence
- **Particle Effects**: Multi-layered particle burst (3000+ particles) with gold dust, sand, and sparkles
- **Camera Animation**: Dramatic fly-through effect that zooms into and through the chest
- **Mystical Elements**: Floating sacred geometry and cultural symbols
- **Exclusive Messaging**: Timed text overlays reinforcing the luxury/exclusivity theme
- **Sound Support**: Ready for audio integration (currently commented out)

### 🎨 Visual Effects
- Custom GLSL shaders for dynamic glow effects
- Shimmer and energy wave patterns
- Fog and atmospheric lighting
- Golden accent colors matching the HOUMA brand
- Noise texture overlays for film-like quality
- Corner ornaments with SVG patterns

### 🚀 Performance Features
- **Automatic Fallback**: Detects WebGL support and provides elegant 2D fallback
- **Session Management**: Shows only once per session (configurable)
- **Optimized Rendering**: Uses GPU-accelerated animations
- **Progressive Loading**: Suspense boundaries for smooth loading

## File Structure

```
src/components/Entry/
├── Entry.tsx               # Main entry component with session logic
├── ChestGLB.tsx           # GLB model loader with animations
├── GLBChestScene.tsx      # Advanced GLB scene (alternative)
├── EnhancedChestScene.tsx # Procedural 3D scene with ornate chest
├── ChestScene.tsx         # Basic 3D scene
├── SimpleChestScene.tsx   # Lightweight fallback scene
├── index.ts              # Component export
└── README.md             # This file

public/Resources/GLB_Models/
└── logo_basic_pbr.glb              # 3D chest model file
```

## Customization Guide

### 1. Controlling When Entry Shows

**Current Behavior**: Shows once per browser session on homepage only

```typescript
// In src/pages/_app.tsx

// To show every time (development):
if (isHomepage) {
  setShowEntry(true)
}

// To show once per day:
if (isHomepage && !Cookies.get('houma-entry-seen')) {
  setShowEntry(true)
  Cookies.set('houma-entry-seen', 'true', { expires: 1 })
}

// To disable completely:
setEntryComplete(true)
```

### 2. Modifying the Chest Appearance

In `EnhancedChestScene.tsx`:

```typescript
// Change chest colors
<meshStandardMaterial
  color="#0D0907"  // Dark wood color
  metalness={0.6}   // How metallic (0-1)
  roughness={0.4}   // Surface roughness (0-1)
/>

// Adjust gold accents
<meshStandardMaterial
  color="#D4AF37"   // HOUMA gold
  emissive="#D4AF37"
  emissiveIntensity={0.15}  // Glow strength
/>
```

### 3. Customizing Messages

In `Entry.tsx`:

```typescript
const messages = [
  "Welcome to HOUMA.",
  "Not everyone is allowed inside.",
  "This is more than fashion.",
  "This is heritage. This is power.",
  "Welcome to the inner circle."
]
```

### 4. Adjusting Animation Timing

```typescript
// In EnhancedChestScene.tsx
const timeline = gsap.timeline({
  onComplete: () => {
    setTimeout(onUnlockComplete, 500) // Delay before transition
  }
})

// Lid opening duration
timeline.to(lidRef.current.rotation, {
  x: -Math.PI / 2.2,
  duration: 2.5,  // Seconds for lid to open
  ease: "power3.out"
})

// Camera zoom duration
timeline.to(camera.position, {
  z: -10,
  duration: 2,  // Seconds for final zoom
  ease: "power4.in"
})
```

### 5. Adding Sound Effects

Uncomment and add your audio files:

```typescript
// In EnhancedChestScene.tsx
useEffect(() => {
  if (isUnlocked && typeof window !== 'undefined') {
    const audio = new Audio('/sounds/chest-unlock.mp3')
    audio.volume = 0.5
    audio.play()
  }
}, [isUnlocked])
```

Place audio files in `public/sounds/` directory.

### 6. Particle System Configuration

```typescript
// In EnhancedChestScene.tsx
const particleCount = 3000  // Main burst particles
const dustCount = 1000      // Floating dust
const sparkleCount = 500    // Sparkles

// Adjust particle colors
if (colorType < 0.4) {
  colors[i3] = 0.831      // R
  colors[i3 + 1] = 0.686  // G
  colors[i3 + 2] = 0.216  // B
}
```

### 7. Switching Between Chest Versions

```typescript
// In Entry.tsx, toggle between:
import EnhancedChestScene from './EnhancedChestScene'  // Ornate version
// or
import ChestScene from './ChestScene'  // Simpler version
```

## Performance Optimization

### For Lower-End Devices
1. Reduce particle counts
2. Disable shader effects
3. Use simpler chest model
4. Remove floating elements

```typescript
// Detect performance
const isLowEnd = navigator.hardwareConcurrency <= 4

// Use appropriate scene
{isLowEnd ? <ChestScene /> : <EnhancedChestScene />}
```

### Mobile Optimization
- Touch events are already supported
- Consider reducing particle count on mobile
- Test on various devices for performance

## Troubleshooting

### Entry Not Showing
1. Check sessionStorage: `sessionStorage.getItem('houma-entry-shown')`
2. Verify you're on homepage: `window.location.pathname === '/'`
3. Clear browser storage and cookies

### Performance Issues
1. Reduce particle count
2. Disable shadows: Remove `castShadow` from lights
3. Use fallback mode for problematic devices
4. Lower texture resolutions

### WebGL Errors
- The component automatically falls back to 2D animation
- Check browser console for specific WebGL errors
- Ensure browser supports WebGL 2.0

## Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers with WebGL support ✅

## Future Enhancements
- [ ] Add haptic feedback on mobile unlock
- [ ] Implement multiple chest designs for A/B testing
- [ ] Add achievement/badge system for returning visitors
- [ ] Create seasonal chest themes
- [ ] Add multiplayer "simultaneous unlock" feature
- [ ] Implement AR version for mobile

## Credits
Built with:
- Three.js / React Three Fiber
- GSAP for animations
- Tailwind CSS for styling
- Framer Motion for UI animations

---

© 2025 HOUMA - Luxury Streetwear
