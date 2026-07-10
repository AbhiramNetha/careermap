import { memo } from 'react';
import Beams from './Beams';


const BeamsBackground = memo(function BeamsBackground({
  enabled = true,
  lightColor = '#07c06a',
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) {
  if (!enabled) return null;

  return (
    <div
      id="beams-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Beams
        lightColor={lightColor}
        beamWidth={beamWidth}
        beamHeight={beamHeight}
        beamNumber={beamNumber}
        speed={speed}
        noiseIntensity={noiseIntensity}
        scale={scale}
        rotation={rotation}
      />
    </div>
  );
});

export default BeamsBackground;
