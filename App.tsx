import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { TreeState } from './types';
import { INITIAL_CAMERA_POS } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState(prev => prev === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED);
  };

  return (
    <div className="w-full h-screen bg-slate-950 relative overflow-hidden">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: INITIAL_CAMERA_POS, fov: 45 }}
          gl={{ antialias: false, toneMappingExposure: 1.5 }} // High exposure for bloom
          dpr={[1, 2]} // Handle high DPI
        >
          <Scene treeState={treeState} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UIOverlay 
        currentState={treeState} 
        onToggleState={toggleState} 
      />
    </div>
  );
};

export default App;
