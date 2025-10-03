/**
 * VICTOR TOOLKIT
 * Reusable components for transforming interfaces into "Media for Thinking the Unthinkable"
 * Based on Bret Victor's six principles
 */

// ===== PRINCIPLE 1: SURFACE THE INVISIBLE =====

class SyncVisualizer {
  /**
   * Visualizes data flow between synchronized objects
   * Usage: new SyncVisualizer(source, target, scene)
   */
  constructor(source, target, scene) {
    this.source = source;
    this.target = target;
    this.scene = scene;
    this.particles = [];
  }
  
  update(time) {
    // Spawn sync particles
    if (Math.random() < 0.1) {
      this.particles.push({
        pos: this.source.position.clone(),
        target: this.target.position.clone(),
        progress: 0,
        data: this.source.userData.syncData || {}
      });
    }
    
    // Update particles
    this.particles = this.particles.filter(p => {
      p.progress += 0.02;
      if (p.progress >= 1) return false;
      
      const currentPos = new THREE.Vector3().lerpVectors(p.pos, p.target, p.progress);
      this.renderParticle(currentPos, p.data);
      return true;
    });
  }
  
  renderParticle(pos, data) {
    // Draw glowing particle at position
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x36cfc9,
      transparent: true,
      opacity: 0.8
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(pos);
    this.scene.add(particle);
    
    // Auto-cleanup
    setTimeout(() => this.scene.remove(particle), 50);
  }
  
  getMetrics() {
    return {
      particlesInFlight: this.particles.length,
      avgLatency: this.calculateLatency(),
      syncHealth: this.particles.length < 10 ? 'good' : 'degraded'
    };
  }
  
  calculateLatency() {
    if (this.particles.length === 0) return 0;
    const avgProgress = this.particles.reduce((sum, p) => sum + p.progress, 0) / this.particles.length;
    return (1 - avgProgress) * 1000; // ms
  }
}

class HeatmapField {
  /**
   * Renders a 2D heatmap overlay for spatial fields (like tempo zones)
   * Usage: new HeatmapField(width, height, computeFunction)
   */
  constructor(width, height, computeFunction) {
    this.width = width;
    this.height = height;
    this.compute = computeFunction; // (x, z) => value between 0-1
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.createMesh();
  }
  
  createMesh() {
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0.01; // Slightly above ground
  }
  
  update(influencers) {
    const imageData = this.ctx.createImageData(this.width, this.height);
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const worldX = (x / this.width) * this.width - this.width / 2;
        const worldZ = (y / this.height) * this.height - this.height / 2;
        
        const value = this.compute(worldX, worldZ, influencers);
        const color = this.valueToColor(value);
        
        const idx = (y * this.width + x) * 4;
        imageData.data[idx] = color.r;
        imageData.data[idx + 1] = color.g;
        imageData.data[idx + 2] = color.b;
        imageData.data[idx + 3] = 200; // Alpha
      }
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.texture.needsUpdate = true;
  }
  
  valueToColor(value) {
    // Blue (0) -> Cyan (0.33) -> Yellow (0.66) -> Red (1)
    if (value < 0.33) {
      const t = value / 0.33;
      return { r: 0, g: Math.floor(t * 255), b: 255 };
    } else if (value < 0.66) {
      const t = (value - 0.33) / 0.33;
      return { r: Math.floor(t * 255), g: 255, b: Math.floor((1 - t) * 255) };
    } else {
      const t = (value - 0.66) / 0.34;
      return { r: 255, g: Math.floor((1 - t) * 255), b: 0 };
    }
  }
}

// ===== PRINCIPLE 2: OVERCOME COGNITIVE LIMITS =====

class MeasurementRuler {
  /**
   * Creates a measurement tool that shows divergence between expected and actual values
   * Usage: new MeasurementRuler(label, expectedFunc, actualFunc)
   */
  constructor(label, expectedFunc, actualFunc) {
    this.label = label;
    this.expectedFunc = expectedFunc;
    this.actualFunc = actualFunc;
    this.history = [];
    this.maxHistory = 100;
  }
  
  measure(context) {
    const expected = this.expectedFunc(context);
    const actual = this.actualFunc(context);
    const divergence = Math.abs(expected - actual);
    const percentDiff = expected !== 0 ? (divergence / expected) * 100 : 0;
    
    this.history.push({ expected, actual, divergence, percentDiff, timestamp: Date.now() });
    if (this.history.length > this.maxHistory) this.history.shift();
    
    return { expected, actual, divergence, percentDiff };
  }
  
  render(container) {
    const measurement = this.history[this.history.length - 1];
    if (!measurement) return;
    
    const html = `
      <div class="measurement-ruler">
        <div class="ruler-label">${this.label}</div>
        <div class="ruler-values">
          <span class="expected">Expected: ${measurement.expected.toFixed(2)}</span>
          <span class="actual">Actual: ${measurement.actual.toFixed(2)}</span>
          <span class="divergence ${measurement.percentDiff > 10 ? 'warning' : ''}">
            Δ ${measurement.percentDiff.toFixed(1)}%
          </span>
        </div>
        <div class="ruler-bar">
          <div class="expected-mark" style="left: 50%"></div>
          <div class="actual-mark" style="left: ${50 + (measurement.actual - measurement.expected) * 5}%"></div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  getStats() {
    if (this.history.length === 0) return null;
    
    const divergences = this.history.map(h => h.divergence);
    return {
      avgDivergence: divergences.reduce((a, b) => a + b) / divergences.length,
      maxDivergence: Math.max(...divergences),
      currentDivergence: divergences[divergences.length - 1]
    };
  }
}

// ===== PRINCIPLE 3: MULTIPLE MODES OF THOUGHT =====

class MultiViewManager {
  /**
   * Manages synchronized views (visual, symbolic, graphical)
   * Usage: new MultiViewManager({ visual: scene3D, symbolic: codeEditor, graphical: chart })
   */
  constructor(views) {
    this.views = views; // { visual: obj, symbolic: obj, graphical: obj }
    this.activeView = 'visual';
    this.syncEnabled = true;
  }
  
  update(state) {
    if (!this.syncEnabled) return;
    
    Object.keys(this.views).forEach(viewName => {
      const view = this.views[viewName];
      if (view && view.update) {
        view.update(state);
      }
    });
  }
  
  highlightInAllViews(objectId) {
    Object.values(this.views).forEach(view => {
      if (view.highlight) view.highlight(objectId);
    });
  }
  
  switchView(viewName) {
    if (!this.views[viewName]) return;
    
    Object.keys(this.views).forEach(name => {
      const view = this.views[name];
      if (view.container) {
        view.container.style.display = name === viewName ? 'block' : 'none';
      }
    });
    
    this.activeView = viewName;
  }
  
  createViewSwitcher(container) {
    const switcher = document.createElement('div');
    switcher.className = 'view-switcher';
    
    Object.keys(this.views).forEach(viewName => {
      const btn = document.createElement('button');
      btn.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
      btn.className = viewName === this.activeView ? 'active' : '';
      btn.onclick = () => {
        this.switchView(viewName);
        container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      switcher.appendChild(btn);
    });
    
    return switcher;
  }
}

class SymbolicView {
  /**
   * Real-time code/formula display that updates with live values
   */
  constructor(container, template) {
    this.container = container;
    this.template = template; // String with {{variable}} placeholders
    this.variables = {};
  }
  
  update(state) {
    this.variables = state;
    this.render();
  }
  
  render() {
    let code = this.template;
    Object.keys(this.variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      code = code.replace(regex, this.variables[key]);
    });
    
    this.container.innerHTML = `<pre><code>${this.highlightSyntax(code)}</code></pre>`;
  }
  
  highlightSyntax(code) {
    // Simple syntax highlighting
    return code
      .replace(/(\d+\.?\d*)/g, '<span class="number">$1</span>')
      .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, '<span class="variable">$1</span> =')
      .replace(/(function|const|let|var|if|else|return)/g, '<span class="keyword">$1</span>');
  }
}

// ===== PRINCIPLE 4: RAPID WHAT-IF EXPLORATION =====

class ParameterScrubber {
  /**
   * Creates an interactive slider with immediate feedback
   * Usage: new ParameterScrubber('brightness', 0, 1, 0.5, (val) => updateScene(val))
   */
  constructor(label, min, max, initialValue, onChange) {
    this.label = label;
    this.min = min;
    this.max = max;
    this.value = initialValue;
    this.onChange = onChange;
    this.history = [];
  }
  
  createDOM() {
    const container = document.createElement('div');
    container.className = 'parameter-scrubber';
    
    container.innerHTML = `
      <label>${this.label}</label>
      <div class="scrubber-controls">
        <input type="range" min="${this.min}" max="${this.max}" step="${(this.max - this.min) / 100}" value="${this.value}">
        <input type="number" min="${this.min}" max="${this.max}" step="${(this.max - this.min) / 100}" value="${this.value}">
      </div>
      <div class="scrubber-history"></div>
    `;
    
    const slider = container.querySelector('input[type="range"]');
    const number = container.querySelector('input[type="number"]');
    
    const handleChange = (e) => {
      this.value = parseFloat(e.target.value);
      slider.value = this.value;
      number.value = this.value;
      this.onChange(this.value);
      this.recordHistory(this.value);
    };
    
    slider.addEventListener('input', handleChange);
    number.addEventListener('input', handleChange);
    
    return container;
  }
  
  recordHistory(value) {
    this.history.push({ value, timestamp: Date.now() });
    if (this.history.length > 50) this.history.shift();
  }
  
  replay(speed = 1) {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= this.history.length) {
        clearInterval(interval);
        return;
      }
      
      const record = this.history[index];
      this.value = record.value;
      this.onChange(this.value);
      index++;
    }, 100 / speed);
  }
}

class TimelineScrubber {
  /**
   * Timeline control with play/pause/rewind for temporal exploration
   */
  constructor(duration, onSeek) {
    this.duration = duration;
    this.currentTime = 0;
    this.playing = false;
    this.onSeek = onSeek;
    this.speed = 1;
    this.recordings = [];
  }
  
  createDOM() {
    const container = document.createElement('div');
    container.className = 'timeline-scrubber';
    
    container.innerHTML = `
      <div class="timeline-controls">
        <button class="play-pause">▶️</button>
        <button class="rewind">⏮️</button>
        <button class="record">⏺️</button>
        <select class="speed">
          <option value="0.5">0.5x</option>
          <option value="1" selected>1x</option>
          <option value="2">2x</option>
          <option value="5">5x</option>
        </select>
      </div>
      <input type="range" class="timeline-slider" min="0" max="${this.duration}" value="0">
      <div class="timeline-display">
        <span class="current-time">0.0</span> / <span class="total-time">${this.duration.toFixed(1)}</span>s
      </div>
    `;
    
    this.setupControls(container);
    return container;
  }
  
  setupControls(container) {
    const playBtn = container.querySelector('.play-pause');
    const rewindBtn = container.querySelector('.rewind');
    const recordBtn = container.querySelector('.record');
    const speedSelect = container.querySelector('.speed');
    const slider = container.querySelector('.timeline-slider');
    
    playBtn.onclick = () => this.togglePlay();
    rewindBtn.onclick = () => this.seek(0);
    recordBtn.onclick = () => this.startRecording();
    speedSelect.onchange = (e) => { this.speed = parseFloat(e.target.value); };
    slider.oninput = (e) => this.seek(parseFloat(e.target.value));
  }
  
  update(deltaTime) {
    if (!this.playing) return;
    
    this.currentTime += deltaTime * this.speed;
    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.playing = false;
    }
    
    this.onSeek(this.currentTime);
  }
  
  togglePlay() {
    this.playing = !this.playing;
  }
  
  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    this.onSeek(this.currentTime);
  }
  
  startRecording() {
    this.recordings.push({ startTime: this.currentTime, data: [] });
  }
}

// ===== PRINCIPLE 5: LINK PERSPECTIVES =====

class PerspectiveLinker {
  /**
   * Links multiple objects/views so interactions cascade
   * Usage: linker.link(obj1, obj2, 'highlight')
   */
  constructor() {
    this.links = new Map(); // objectId -> [linkedIds]
    this.highlightedObjects = new Set();
  }
  
  link(obj1, obj2, action = 'highlight') {
    const id1 = obj1.uuid || obj1.id;
    const id2 = obj2.uuid || obj2.id;
    
    if (!this.links.has(id1)) this.links.set(id1, []);
    if (!this.links.has(id2)) this.links.set(id2, []);
    
    this.links.get(id1).push({ id: id2, action, object: obj2 });
    this.links.get(id2).push({ id: id1, action, object: obj1 });
  }
  
  interact(object, action = 'highlight') {
    const id = object.uuid || object.id;
    const linked = this.links.get(id) || [];
    
    linked.forEach(link => {
      if (link.action === action) {
        this.applyAction(link.object, action);
      }
    });
  }
  
  applyAction(object, action) {
    switch (action) {
      case 'highlight':
        this.highlightObject(object);
        break;
      case 'show':
        object.visible = true;
        break;
      case 'pulse':
        this.pulseObject(object);
        break;
    }
  }
  
  highlightObject(object) {
    if (object.material) {
      object.material.emissiveIntensity = 1.0;
      this.highlightedObjects.add(object);
      
      setTimeout(() => {
        object.material.emissiveIntensity = 0.5;
        this.highlightedObjects.delete(object);
      }, 500);
    }
  }
  
  pulseObject(object) {
    const originalScale = object.scale.clone();
    object.scale.multiplyScalar(1.2);
    
    setTimeout(() => {
      object.scale.copy(originalScale);
    }, 300);
  }
}

// ===== PRINCIPLE 6: ABSTRACT & GENERALIZE =====

class TemplateExporter {
  /**
   * Exports current configuration as reusable template
   * Usage: exporter.export(config, 'mirror')
   */
  constructor(formatName) {
    this.formatName = formatName;
    this.version = '1.0.0';
  }
  
  export(config) {
    const template = {
      format: this.formatName,
      version: this.version,
      timestamp: Date.now(),
      config: this.serializeConfig(config),
      metadata: {
        author: 'user',
        description: config.description || '',
        tags: config.tags || []
      }
    };
    
    return JSON.stringify(template, null, 2);
  }
  
  serializeConfig(config) {
    // Deep clone and serialize, handling special types
    return JSON.parse(JSON.stringify(config, (key, value) => {
      // Handle functions
      if (typeof value === 'function') {
        return value.toString();
      }
      // Handle Vector3, Color, etc.
      if (value && value.isVector3) {
        return { type: 'Vector3', x: value.x, y: value.y, z: value.z };
      }
      if (value && value.isColor) {
        return { type: 'Color', hex: value.getHexString() };
      }
      return value;
    }));
  }
  
  import(templateString) {
    const template = JSON.parse(templateString);
    
    if (template.format !== this.formatName) {
      throw new Error(`Format mismatch: expected ${this.formatName}, got ${template.format}`);
    }
    
    return this.deserializeConfig(template.config);
  }
  
  deserializeConfig(config) {
    // Reconstruct special types
    return JSON.parse(JSON.stringify(config), (key, value) => {
      if (value && value.type === 'Vector3') {
        return new THREE.Vector3(value.x, value.y, value.z);
      }
      if (value && value.type === 'Color') {
        return new THREE.Color(`#${value.hex}`);
      }
      return value;
    });
  }
  
  downloadAsFile(config, filename) {
    const data = this.export(config);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${this.formatName}`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// ===== EXPORT =====

const VictorToolkit = {
  SyncVisualizer,
  HeatmapField,
  MeasurementRuler,
  MultiViewManager,
  SymbolicView,
  ParameterScrubber,
  TimelineScrubber,
  PerspectiveLinker,
  TemplateExporter
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VictorToolkit;
}
