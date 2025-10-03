awesome—here’s a single, copy-paste **MASTER PROMPT** that will generate **each surreal world** as a **mobile-first three.js site** with layered scenes, olog overlays, and the “one-surreal-break” rule. it’s written as a **super-prompt template** (fill the braces or swap in the preset blocks I provide for all 7 worlds at the end).

---

# MASTER PROMPT — “Surreal Worlds x three.js (mobile)”

**SYSTEM / ROLE**
You are a world-forge that outputs a production-ready, mobile-first three.js site. Build a single-page app that renders a layered 3D/2.5D world with an interactive UI. Follow Luhmann-style structure (Overall System → Context → Ecologies → Domains) to keep logic coherent.

**OUTPUT**

* one HTML file with inline module JS and CSS (or clearly separated files), no external UI frameworks.
* three.js r160+; ES modules.
* scene runs at 60fps on mid phones when idle; caps DPR to 1.5; graceful degrade to 30fps.
* responsive: safe-area insets, touch gestures, keyboard focus, high contrast mode.
* include an **Olog Overlay** (SVG layer) showing entities + morphisms; tapping a node focuses a 3D object.

**SCENE ARCHITECTURE (layers)**

1. `SkyLayer` – gradient dome / cubemap; far fog; one celestial element.
2. `TerrainLayer` – 2–3 broad planes (ground/water/cliff) with baked or lambert shading.
3. `ObjectLayer` – 5–9 hero objects (low-poly, flat colors) with light AO.
4. `SurrealBreak` – the **one** logic-breaking element (solid light, broken rhythm, mirrored moon, etc.).
5. `FXLayer` – subtle post FX (only bloom or vignette; no more than one).
6. `UILayer` – minimal HUD (H1/H2, legend, buttons); SVG olog map; aria-labels.
7. `AudioLayer` (optional) – < 30s ambient loop; volume 0 by default.

**PERFORMANCE**

* `renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))`
* antialias: false; toneMapping: ACESFilmic; outputEncoding: sRGB
* reuse Geometries/Materials; `InstancedMesh` for repeats.
* lazy-load textures; use data-URI or basis/ktx2 if any.
* frustum cull on; shadows off on mobile.
* pause render on tab hidden; toggle low-power mode on battery < 20%.

**INTERACTION / NAV**

* OrbitControls: limited polar angle; inertia small.
* Gestures: tap selects object; pinch = zoom; swipe = orbit.
* “Focus” mode: when a node or card is tapped, tween camera to target and show H2 + description.
* “Myth Switch”: button cycles between **Context / Ecologies / Domains** camera bookmarks.

**ACCESSIBILITY**

* keyboard (Tab, Enter, Esc) to traverse focusable UI.
* aria-live region for selections.
* high-contrast toggle switches to wireframe + monochrome UI.

**OLOG OVERLAY (svg)**

* Nodes = entities; Edges = morphisms; tapping an edge triggers a small animated 3D link (arrow/beam).
* Map sits in a corner; draggable; can pin nodes to camera.

**DATA CARD UI (lego units)**

* Small rounded cards; color-coded; each links to one 3D object or morphism.
* H1/H2: Inter/IBM Plex Sans; clamp fonts for mobile.

**CODE SCAFFOLD**
Create modules:

* `main.js` – init renderer, scene, camera, loop, resize, DPR cap.
* `layers/*.js` – each layer returns an Object3D + `update(dt)` hook.
* `ui/olog.js` – draws/updates SVG overlay; exposes `focusNode(id)`.
* `ui/cards.js` – builds HTML cards; binds to objects.
* `state.js` – shared store `{ mode, selection, lowPower }` with subscribe.

**MINIMUM ACCEPTANCE TESTS**

* load time < 2.5s on 4G; total JS < 200KB gz if possible.
* idle FPS ≥ 50 on mid Android; battery saver reduces to ≤ 30fps and disables FX.
* lighthouse a11y ≥ 90 (semantic landmarks, focus rings, contrasts).

**SCENE SPEC (fill this)**

```
WORLD_NAME: {name}
STYLE: Billout-like surreal minimalism; flat bold colors; precise perspective; one break.
PALETTE: {primary}, {secondary}, {accent}, {canvas}, {shadow}
SURPRISE_BREAK: {describe the one surreal rule here}
OLOG:
  ENTITIES: [ ...names ]
  MORPHISMS: [ {from,to,label} ... ]
DOMAINS:
  - Energy: {short}
  - Structure: {short}
  - Mind: {short}
  - Culture: {short}
INTERACTIONS:
  Tap: {what happens}
  Long-press: {what happens}
  MythSwitch: [Context, Ecologies, Domains] camera bookmarks: {brief}
COPY:
  H1: {headline}
  H2: {subhead}
  Cards: [ {title, body, linkTargetId}, ... ]
AUDIO: {none|url}
```

**BUILD THE SITE**
Generate clean, commented code implementing the layers above **for the given SCENE SPEC**. Ensure mobile-first styles, safe-areas, and a single tasteful motion effect.

---

## PRESET SCENE SPECS (the 7 worlds)

### 1) MirrorOS — *The Reflection Engine*

```
WORLD_NAME: MirrorOS
PALETTE: #0D1B2A, #F9F9F9, #36CFC9, #FFB400, #0B1020
SURPRISE_BREAK: a second moon rendered *inside* the car cabin glass; interior sky mirrors exterior.
OLOG:
  ENTITIES: [Car, OuterMoon, InnerMoon, MirrorFS, ShadowTwin]
  MORPHISMS:
    - {from:"Car", to:"InnerMoon", label:"contains echo of"}
    - {from:"OuterMoon", to:"InnerMoon", label:"reflects as"}
    - {from:"MirrorFS", to:"ShadowTwin", label:"renders"}
DOMAINS:
  - Energy: dual channels in/out
  - Structure: paired partitions
  - Mind: self-reference
  - Culture: symmetry lore
INTERACTIONS:
  Tap: toggle mirror overlay; camera focus to Car.
  Long-press: freeze outside, move inside.
  MythSwitch: city shoreline / car interior / olog
COPY:
  H1: "As Above, So Below."
  H2: "Every node has a twin."
  Cards:
    - {title:"Echo Node", body:"Local ↔ Global", linkTargetId:"InnerMoon"}
    - {title:"MirrorFS", body:"Paired partitions", linkTargetId:"MirrorFS"}
AUDIO: none
```

### 2) TempoOS — *The Rhythm Mediator*

```
WORLD_NAME: TempoOS
PALETTE: #10141A, #F9F9F9, #FF6B35, #36CFC9, #0A0D12
SURPRISE_BREAK: highway traffic replaced by a procession of instanced turtles that slow time within their radius.
OLOG:
  ENTITIES: [Highway, Turtles, TempoTag, RhythmHooks]
  MORPHISMS:
    - {from:"TempoTag", to:"Highway", label:"modulates"}
    - {from:"Turtles", to:"RhythmHooks", label:"emit"}
DOMAINS:
  - Energy: tempo clocks
  - Structure: layered tick rates
  - Mind: contemplative delay
  - Culture: patient pace
INTERACTIONS:
  Tap: select turtle; UI shows tempo tag.
  Long-press: create a temporary “dwell zone”.
  MythSwitch: overpass / roadside / olog
COPY:
  H1: "Speed Has Layers."
  H2: "Fast paths, deliberate pauses."
  Cards:
    - {title:"Tempo Tag", body:"instant | dwell | bloom", linkTargetId:"TempoTag"}
AUDIO: soft metronome (muted)
```

### 3) ScaleOS — *The Recursive Zoomer*

```
WORLD_NAME: ScaleOS
PALETTE: #0C1A13, #E9FFFA, #36CFC9, #FFB400, #08130F
SURPRISE_BREAK: beach trucks shrink as you approach yet keep their physical weight (sound/contacts stay macro).
OLOG:
  ENTITIES: [Cliff, Beach, Sea, Trucks, FractalFS]
  MORPHISMS:
    - {from:"FractalFS", to:"Trucks", label:"retains identity across scale"}
DOMAINS:
  - Energy: recursion loops
  - Structure: fractal dirs
  - Mind: scale literacy
  - Culture: big-in-small myths
INTERACTIONS:
  Tap: focus a truck; HUD shows its “dimension index”.
  Pinch: switches ontology (micro→macro).
  MythSwitch: cliff top / shoreline / olog
COPY:
  H1: "Infinite Zoom. Same Truth."
  H2: "Micro ↔ Macro recursion."
  Cards:
    - {title:"Pinch-to-Ontology", body:"zoom swaps schema", linkTargetId:"FractalFS"}
AUDIO: none
```

### 4) MorphOS — *The Shape-Shifter*

```
WORLD_NAME: MorphOS
PALETTE: #0E0B1A, #F9F9F9, #B46CFF, #36CFC9, #120F1D
SURPRISE_BREAK: a bird mesh morph-targets into a human silhouette and back on a loop; selection scrubs the morph timeline.
OLOG:
  ENTITIES: [Bird, Human, MorphPath, TypeAlchemy]
  MORPHISMS:
    - {from:"Bird", to:"Human", label:"morphs via"}
    - {from:"TypeAlchemy", to:"MorphPath", label:"registers"}
DOMAINS:
  - Energy: transformation
  - Structure: invariants
  - Mind: analogy engine
  - Culture: shapeshift rites
INTERACTIONS:
  Tap: scrub morph 0–1.
  Long-press: save a keyframe state.
  MythSwitch: rooftop / sky path / olog
COPY:
  H1: "Form Follows Mutation."
  H2: "Files as transformations."
  Cards:
    - {title:"Morph Path", body:"click = transform", linkTargetId:"MorphPath"}
AUDIO: airy pad (muted)
```

### 5) AnomalyOS — *The Rhythm Breaker*

```
WORLD_NAME: AnomalyOS
PALETTE: #1A0E0E, #FFF9F2, #FF6B35, #00E0A4, #120909
SURPRISE_BREAK: one bowling ball sits embedded in the ceiling; tapping spawns a single, allowed “rupture” anywhere.
OLOG:
  ENTITIES: [Lanes, Pins, Ceiling, RuptureNode, AnomalyHooks]
  MORPHISMS:
    - {from:"RuptureNode", to:"Lanes", label:"interrupts"}
    - {from:"AnomalyHooks", to:"RuptureNode", label:"emits"}
DOMAINS:
  - Energy: perturbation
  - Structure: repeat & break
  - Mind: novelty attention
  - Culture: trickster lore
INTERACTIONS:
  Tap: place one rupture per view.
  Long-press: undo rupture.
  MythSwitch: approach / lane-end / olog
COPY:
  H1: "Break the Rhythm—On Purpose."
  H2: "Sacred glitches, designed."
  Cards:
    - {title:"Rupture Node", body:"the designed exception", linkTargetId:"RuptureNode"}
AUDIO: distant alley reverb (muted)
```

### 6) LightOS — *The Tangible Intangible*

```
WORLD_NAME: LightOS
PALETTE: #001424, #E6F7FF, #36CFC9, #FF6B35, #00101B
SURPRISE_BREAK: lighthouse beam is a solid walkable mesh (“LightPath”); entering it reveals metadata rooms.
OLOG:
  ENTITIES: [Lighthouse, Sea, LightPath, MetaRooms, MetaMaps]
  MORPHISMS:
    - {from:"LightPath", to:"MetaRooms", label:"opens"}
    - {from:"MetaMaps", to:"LightPath", label:"projects as"}
DOMAINS:
  - Energy: illumination
  - Structure: path topology
  - Mind: clarity
  - Culture: guidance myths
INTERACTIONS:
  Tap: teleport into beam.
  Swipe: cycle rooms (permissions, provenance, tags).
  MythSwitch: pier / beam interior / olog
COPY:
  H1: "Walk the Metadata."
  H2: "Make the invisible navigable."
  Cards:
    - {title:"Meta Rooms", body:"tags as spaces", linkTargetId:"MetaRooms"}
AUDIO: soft shoreline (muted)
```

### 7) ArchiveOS — *The Capsule Preserver*

```
WORLD_NAME: ArchiveOS
PALETTE: #121212, #FAFAFA, #FFB400, #36CFC9, #0B0B0B
SURPRISE_BREAK: each book is a “capsule” that opens to a tiny scene diorama with its own mini-break.
OLOG:
  ENTITIES: [Capsule, CuratorNote, Provenance, MuseumMode]
  MORPHISMS:
    - {from:"Provenance", to:"Capsule", label:"signs"}
    - {from:"MuseumMode", to:"Capsule", label:"focuses"}
DOMAINS:
  - Energy: memory
  - Structure: containers
  - Mind: meaning preservation
  - Culture: canon
INTERACTIONS:
  Tap: open capsule scene.
  Long-press: pin curator note.
  MythSwitch: shelf / open diorama / olog
COPY:
  H1: "Capsule the Culture."
  H2: "Every file a scene."
  Cards:
    - {title:"Provenance Chain", body:"verify lineage", linkTargetId:"Provenance"}
AUDIO: room tone (muted)
```

---

## Tiny three.js skeleton (the generator should emit this pattern)

```html
<!-- index.html (skeleton) -->
<canvas id="c"></canvas>
<svg id="olog" aria-label="Olog overlay"></svg>
<div id="ui" class="cards"></div>
<script type="module">
  import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
  import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:false, alpha:true });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(6,4,10);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.05; controls.maxPolarAngle = Math.PI*0.49;

  // ---- Layers (replace with generated modules)
  const layers = [];
  function add(layer){ scene.add(layer.group); layers.push(layer); }

  // Example Terrain plane
  add({ group: (()=>{ const g=new THREE.Group();
      const m=new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.MeshLambertMaterial({color:'#F9F9F9'}));
      m.rotation.x = -Math.PI/2; g.add(m); return g; })(),
        update: (dt)=>{} });

  // Light
  scene.add(new THREE.HemisphereLight(0xffffff,0x111122,0.9));

  // ---- Loop
  let tPrev = performance.now();
  function loop(now){
    const dt = Math.min(0.05,(now - tPrev)/1000); tPrev = now;
    layers.forEach(l=>l.update && l.update(dt));
    controls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Resize
  addEventListener('resize', ()=>{ camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight,false); });

  // Page Visibility → low power
  document.addEventListener('visibilitychange', ()=>{ controls.enableDamping = document.visibilityState === 'visible'; });
</script>
<style>
  :root{ --fg:#F9F9F9; --bg:#0D1B2A; }
  html,body{ margin:0; height:100%; background:var(--bg); color:var(--fg); font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto; }
  #c{ position:fixed; inset:0; touch-action:none; }
  #olog{ position:fixed; right:12px; bottom:12px; width:min(44vw,340px); height:min(44vw,240px); pointer-events:auto; }
  .cards{ position:fixed; left:12px; bottom:12px; display:grid; gap:12px; grid-template-columns:repeat(2,minmax(0,1fr)); max-width:90vw; }
  .cards button{ background:#36CFC9; color:#001424; border:none; border-radius:12px; padding:12px 14px; font-weight:700; box-shadow:0 6px 20px rgba(0,0,0,.08); }
  .cards button:focus-visible{ outline:2px solid #FFB400; outline-offset:3px; }
  @media (min-width:900px){ .cards{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
</style>
```

---

### how to use this

1. Copy the **MASTER PROMPT** into your generator.
2. For each world, paste the matching **PRESET SCENE SPEC** at the end of the prompt.
3. Your generator should emit the full site (HTML/JS/CSS) following the architecture and constraints.

if you want, i can immediately output a fully-wired **MirrorOS** site (single file) using this template.