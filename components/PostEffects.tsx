import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

export const PostEffects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        intensity={1.5} 
        luminanceThreshold={0.8} 
        luminanceSmoothing={0.02} 
        kernelSize={KernelSize.LARGE}
        mipmapBlur 
      />
      <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
    </EffectComposer>
  );
};
