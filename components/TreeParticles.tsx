import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleConfig, TreeState } from '../types';
import { SCENE_CONFIG } from '../constants';

interface TreeParticlesProps {
  config: ParticleConfig;
  state: TreeState;
}

const tempObject = new THREE.Object3D();
const tempPos = new THREE.Vector3();

export const TreeParticles: React.FC<TreeParticlesProps> = ({ config, state }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // -- Math Generation --
  const { scatterPositions, treePositions, randomRotations } = useMemo(() => {
    const scatter = new Float32Array(config.count * 3);
    const tree = new Float32Array(config.count * 3);
    const rotations = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // 1. Scatter Positions (Spherical Random)
      const r = Math.cbrt(Math.random()) * config.spreadRadius;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      scatter[i3] = r * Math.sin(phi) * Math.cos(theta);
      scatter[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      scatter[i3 + 2] = r * Math.cos(phi);

      // 2. Tree Positions (Spiral Cone)
      // Normalized height (0 bottom, 1 top)
      const h = Math.random(); 
      // Radius at this height (Cone shape)
      const currentRadius = config.treeRadius * (1 - h);
      // Golden angle spiral for distribution
      const angle = i * 2.39996; // Golden Angle in radians approx
      
      tree[i3] = Math.cos(angle) * currentRadius;
      tree[i3 + 1] = (h * config.treeHeight) - (config.treeHeight / 2); // Center vertically
      tree[i3 + 2] = Math.sin(angle) * currentRadius;

      // 3. Random Rotations
      rotations[i3] = Math.random() * Math.PI;
      rotations[i3 + 1] = Math.random() * Math.PI;
      rotations[i3 + 2] = Math.random() * Math.PI;
    }

    return { scatterPositions: scatter, treePositions: tree, randomRotations: rotations };
  }, [config]);

  // Current animation progress (0 = Scattered, 1 = Tree)
  const progress = useRef(0);
  
  // -- Animation Loop --
  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    // 1. Interpolate Progress based on State
    const target = state === TreeState.TREE_SHAPE ? 1 : 0;
    // Smooth lerp
    progress.current = THREE.MathUtils.lerp(progress.current, target, delta * SCENE_CONFIG.ANIMATION_SPEED);

    const isOrnaments = config.type === 'ORNAMENT';
    const time = _state.clock.elapsedTime;

    // 2. Update Instances
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Retrieve start and end positions
      const sx = scatterPositions[i3];
      const sy = scatterPositions[i3 + 1];
      const sz = scatterPositions[i3 + 2];

      const tx = treePositions[i3];
      const ty = treePositions[i3 + 1];
      const tz = treePositions[i3 + 2];

      // Lerp Position
      const x = THREE.MathUtils.lerp(sx, tx, progress.current);
      const y = THREE.MathUtils.lerp(sy, ty, progress.current);
      const z = THREE.MathUtils.lerp(sz, tz, progress.current);
      
      tempPos.set(x, y, z);

      // Add "Floating" noise when scattered
      if (progress.current < 0.9) {
        const floatFactor = 1 - progress.current;
        tempPos.y += Math.sin(time + i) * 0.5 * floatFactor;
        tempPos.x += Math.cos(time * 0.5 + i) * 0.2 * floatFactor;
      }

      // Add subtle orbit when formed as tree
      if (progress.current > 0.5) {
         // Optional: slight rotation of the whole tree logic could go here, 
         // but we'll stick to static tree for stability and rotate camera instead.
      }

      tempObject.position.copy(tempPos);

      // Rotation logic
      const rx = randomRotations[i3];
      const ry = randomRotations[i3 + 1];
      const rz = randomRotations[i3 + 2];

      if (isOrnaments) {
        // Ornaments spin slowly
        tempObject.rotation.set(rx + time * 0.2, ry + time * 0.2, rz);
        // Scale pulse
        const scale = 1 + Math.sin(time * 2 + i) * 0.1;
        tempObject.scale.setScalar(scale);
      } else {
        // Needles point generally upwards or outwards
        tempObject.rotation.set(rx * 0.1, ry + time * 0.1, rz * 0.1);
        tempObject.scale.setScalar(1);
      }
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // -- Material Configuration --
  const material = useMemo(() => {
    if (config.type === 'ORNAMENT') {
      return new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.1,
        metalness: 1.0,
        emissive: new THREE.Color(config.color),
        emissiveIntensity: 0.8,
        toneMapped: false // helps with bloom
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.4,
        metalness: 0.6,
        flatShading: true,
      });
    }
  }, [config]);

  // -- Geometry Configuration --
  const geometry = useMemo(() => {
    if (config.type === 'ORNAMENT') {
        return new THREE.SphereGeometry(config.size, 16, 16);
    }
    // Pyramid/Tetrahedron shape for abstract needles look
    return new THREE.ConeGeometry(config.size, config.size * 2, 4);
  }, [config]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, config.count]}
      castShadow
      receiveShadow
    />
  );
};
