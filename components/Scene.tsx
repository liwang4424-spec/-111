import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Stars } from '@react-three/drei';
import { TreeParticles } from './TreeParticles';
import { PostEffects } from './PostEffects';
import { TreeState } from '../types';
import { COLORS, SCENE_CONFIG } from '../constants';
import * as THREE from 'three';

interface SceneProps {
  treeState: TreeState;
}

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation of the entire group for cinematic feel
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <color attach="background" args={[COLORS.BG_DARK]} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} color={COLORS.EMERALD_DARK} />
      <spotLight 
        position={[20, 50, 20]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1000} 
        color={COLORS.GOLD_METALLIC} 
        castShadow 
      />
      <pointLight position={[-10, 10, -10]} intensity={200} color="#0d9488" />
      <pointLight position={[10, -5, 10]} intensity={200} color={COLORS.GOLD_SHIMMER} />

      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Background Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            {/* Emerald Needles */}
            <TreeParticles 
              state={treeState}
              config={{
                count: SCENE_CONFIG.NEEDLE_COUNT,
                color: COLORS.EMERALD_LIGHT,
                size: 0.15,
                spreadRadius: SCENE_CONFIG.SCATTER_RADIUS,
                treeHeight: SCENE_CONFIG.TREE_HEIGHT,
                treeRadius: SCENE_CONFIG.TREE_BASE_RADIUS,
                type: 'NEEDLE'
              }} 
            />

            {/* Gold Ornaments */}
            <TreeParticles 
              state={treeState}
              config={{
                count: SCENE_CONFIG.ORNAMENT_COUNT,
                color: COLORS.GOLD_METALLIC,
                size: 0.35,
                spreadRadius: SCENE_CONFIG.SCATTER_RADIUS,
                treeHeight: SCENE_CONFIG.TREE_HEIGHT,
                treeRadius: SCENE_CONFIG.TREE_BASE_RADIUS + 0.5, // Slightly outside the needles
                type: 'ORNAMENT'
              }} 
            />
        </Float>
      </group>

      <PostEffects />
      
      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={60} 
        autoRotate={false} // We rotate the group instead for more control
        enableDamping
      />
    </>
  );
};
