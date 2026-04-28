export function getSpherePositions(count, radius) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    
    // Retornamos a una cáscara un poco más definida pero conservando leve volumen
    const radialBias = 1 - Math.pow(Math.random(), 4) * 0.15;
    
    const r = radius * radialBias;
    const s = Math.sin(phi);
    data[i * 3] = Math.cos(theta) * s * r;
    data[i * 3 + 1] = Math.cos(phi) * r;
    data[i * 3 + 2] = Math.sin(theta) * s * r;
  }
  return data;
}

export function getCubePositions(count, size) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    // Distribute particles evenly on the 6 faces of a cube
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() - 0.5) * size;
    const v = (Math.random() - 0.5) * size;
    const d = (size / 2) * (Math.random() > 0.5 ? 1 : 1); // Edge bias or flat

    // Adding slight volume to faces so it's not perfectly paper-thin
    const thickness = (Math.random() - 0.5) * 0.1;

    switch (face) {
      case 0: x = size / 2 + thickness; y = u; z = v; break; // Right
      case 1: x = -size / 2 + thickness; y = u; z = v; break; // Left
      case 2: x = u; y = size / 2 + thickness; z = v; break; // Top
      case 3: x = u; y = -size / 2 + thickness; z = v; break; // Bottom
      case 4: x = u; y = v; z = size / 2 + thickness; break; // Front
      case 5: x = u; y = v; z = -size / 2 + thickness; break; // Back
    }

    data[i * 3] = x;
    data[i * 3 + 1] = y;
    data[i * 3 + 2] = z;
  }
  return data;
}

export function getCodeBracketsPositions(count, scale) {
  const data = new Float32Array(count * 3);
  const halfCount = Math.floor(count / 2);
  
  for (let i = 0; i < count; i++) {
    const isLeft = i < halfCount;
    // < or > shape. It's essentially two lines meeting at an angle
    // Let's create a V shape and rotate it
    const t = Math.random(); // Position along the line
    const isTopBranch = Math.random() > 0.5;
    
    // Base shape: >
    let x = (1 - t) * 0.8; // x goes from 0.8 to 0
    let y = isTopBranch ? t : -t; // y goes up or down
    let z = (Math.random() - 0.5) * 0.2; // some depth noise
    
    // Add some noise to make it look like a constellation, not a perfect line
    x += (Math.random() - 0.5) * 0.15;
    y += (Math.random() - 0.5) * 0.15;

    // Scale
    x *= scale;
    y *= scale;
    z *= scale;

    // Position Left or Right bracket
    if (isLeft) {
      x = -x - (scale * 0.4); // Flip X for <
    } else {
      x = x + (scale * 0.4); // Keep >
    }

    data[i * 3] = x;
    data[i * 3 + 1] = y;
    data[i * 3 + 2] = z;
  }
  return data;
}
