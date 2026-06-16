import { memo, useState, useCallback } from 'react';
import Beams from './Beams';

/**
 * BeamsBackground — Fixed, full-viewport background wrapper.
 *
 * • position: fixed  → stays behind everything, never scrolls
 * • z-index: -1      → always behind page content
 * • pointer-events: none → completely non-intrusive
 * • GPU-accelerated via will-change + transform
 * • Memoised so it mounts once and never re-renders
 *
 * Props (all optional):
 *   enabled      – toggle the background on/off (default: true)
 *   lightColor   – beam light colour        (default: '#07c06a')
 *   beamWidth    – width of each beam       (default: 2)
 *   beamHeight   – height of each beam      (default: 15)
 *   beamNumber   – number of beams          (default: 12)
 *   speed        – animation speed          (default: 2)
 *   noiseIntensity – noise grain intensity  (default: 1.75)
 *   scale        – noise scale              (default: 0.2)
 *   rotation     – rotation in degrees      (default: 0)
 */
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
        zIndex: -1,
        pointerEvents: 'none',
        willChange: 'transform',
        transform: 'translateZ(0)', // force own compositing layer
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
