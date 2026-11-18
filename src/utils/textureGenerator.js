import * as THREE from 'three';

/**
 * Creates high-detail procedural CanvasTextures for royal gothic architecture
 */

export function createBlackMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep dark obsidian background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle dark veins
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(198, 161, 91, 0.15)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 120;
      y += (Math.random() - 0.5) * 120;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Faint gold dust specks
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = 'rgba(223, 190, 122, 0.12)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createWoodPlankTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark walnut base
  ctx.fillStyle = '#22140c';
  ctx.fillRect(0, 0, 512, 512);

  // Plank lines
  const plankHeight = 64;
  for (let y = 0; y < 512; y += plankHeight) {
    ctx.strokeStyle = '#0f0805';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Wood grain lines
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = 'rgba(64, 40, 24, 0.35)';
      ctx.lineWidth = Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random() * plankHeight);
      ctx.bezierCurveTo(
        150, y + Math.random() * plankHeight,
        350, y + Math.random() * plankHeight,
        512, y + Math.random() * plankHeight
      );
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createGothicStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark weathered stone
  ctx.fillStyle = '#1c1b22';
  ctx.fillRect(0, 0, 512, 512);

  // Stone brick pattern
  const blockW = 128;
  const blockH = 64;
  ctx.strokeStyle = '#0b0a0e';
  ctx.lineWidth = 4;

  for (let row = 0; row < 512 / blockH; row++) {
    const y = row * blockH;
    const offsetX = (row % 2) * (blockW / 2);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = -blockW; x < 512 + blockW; x += blockW) {
      const actualX = x + offsetX;
      ctx.beginPath();
      ctx.moveTo(actualX, y);
      ctx.lineTo(actualX, y + blockH);
      ctx.stroke();

      // Stone texture noise inside block
      ctx.fillStyle = row % 2 === 0 ? 'rgba(38, 30, 40, 0.2)' : 'rgba(20, 18, 25, 0.2)';
      ctx.fillRect(actualX + 3, y + 3, blockW - 6, blockH - 6);
    }
  }

  // Weathering noise
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(198, 161, 91, 0.05)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createRedCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep velvet burgundy
  ctx.fillStyle = '#420b18';
  ctx.fillRect(0, 0, 512, 512);

  // Gold ornate border along the edges
  ctx.strokeStyle = '#c6a15b';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 492);

  ctx.strokeStyle = '#dfbe7a';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, 460, 460);

  // Velvet pile texture
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(102, 16, 38, 0.4)' : 'rgba(25, 4, 9, 0.4)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createStainedGlassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark gothic window frame
  ctx.fillStyle = '#060608';
  ctx.fillRect(0, 0, 512, 512);

  // Concentric rose window geometric petals
  const cx = 256;
  const cy = 256;
  const colors = ['#8c162f', '#c6a15b', '#1a334d', '#4a154b', '#b33939', '#dfbe7a'];

  for (let r = 210; r > 30; r -= 35) {
    const petals = 12;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      const x1 = cx + Math.cos(angle) * r;
      const y1 = cy + Math.sin(angle) * r;
      const x2 = cx + Math.cos(angle + (Math.PI * 2) / petals) * r;
      const y2 = cy + Math.sin(angle + (Math.PI * 2) / petals) * r;

      ctx.fillStyle = colors[(i + Math.floor(r / 35)) % colors.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fill();

      // Black lead frame line
      ctx.strokeStyle = '#050507';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  // Central rose heart
  ctx.fillStyle = '#c6a15b';
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0a0a0c';
  ctx.lineWidth = 5;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
