// UNIVERSAL TITLE SEQUENCE + AUDIO SYSTEM
// Add this before animate() call in each demo

// ===== AUDIO SYSTEM =====
class SoundEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  play(freq, duration, type = 'sine', volume = 0.3) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }
  sweep(startFreq, endFreq, duration, volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }
  chord(freqs, duration, volume = 0.15) {
    freqs.forEach(freq => this.play(freq, duration, 'sine', volume));
  }
}

const sound = new SoundEngine();

// ===== TITLE SEQUENCE SYSTEM =====
class TitleSequence {
  constructor(camera, scene, duration = 12) {
    this.camera = camera;
    this.scene = scene;
    this.duration = duration;
    this.isPlaying = false;
    this.originalCameraPos = camera.position.clone();
    this.originalCameraRot = camera.rotation.clone();
    this.textSprites = [];
    this.geometricShapes = [];
  }
  
  createTextSprite(text, color = '#36CFC9', size = 120) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    ctx.font = `900 ${size}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8;
    ctx.strokeText(text, 512, 128);
    ctx.fillStyle = color;
    ctx.fillText(text, 512, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 })
    );
    sprite.scale.set(10, 2.5, 1);
    this.scene.add(sprite);
    this.textSprites.push(sprite);
    return sprite;
  }
  
  addGeometricLine(start, end, color = 0x36CFC9) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: 3, transparent: true, opacity: 0 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.geometricShapes.push(line);
    return line;
  }
  
  lerp(a, b, t) { return a + (b - a) * t; }
  easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const playBtn = document.getElementById('play-intro');
    playBtn.classList.add('playing');
    playBtn.textContent = '⏸ Playing...';
    document.querySelector('.view-switcher').style.opacity = '0';
    document.querySelector('.controls-panel').style.opacity = '0';
    const controlsEnabled = controls.enabled;
    controls.enabled = false;
    
    // Call world-specific sequence method
    this.runSequence(() => {
      this.isPlaying = false;
      playBtn.classList.remove('playing');
      playBtn.textContent = '▶ Play Intro';
      document.querySelector('.view-switcher').style.opacity = '1';
      document.querySelector('.controls-panel').style.opacity = '1';
      controls.enabled = controlsEnabled;
      this.textSprites.forEach(s => this.scene.remove(s));
      this.geometricShapes.forEach(s => this.scene.remove(s));
      this.textSprites = [];
      this.geometricShapes = [];
      camera.position.copy(this.originalCameraPos);
      camera.rotation.copy(this.originalCameraRot);
    });
  }
  
  // OVERRIDE THIS METHOD FOR EACH WORLD
  runSequence(onComplete) {
    // World-specific implementation
    onComplete();
  }
}
