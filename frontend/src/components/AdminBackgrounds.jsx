import { useLocation } from 'react-router-dom';
import Hyperspeed from './Hyperspeed/Hyperspeed';

export const AdminStaticBackground = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'var(--admin-bg)' // Base background to ground the glow effects
    }}
  >
    <div className="admin-bg-grid" />
    <div className="admin-bg-glow admin-bg-glow-1" />
    <div className="admin-bg-glow admin-bg-glow-2" />
  </div>
);

const AdminBackgrounds = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin' || location.pathname === '/admin/';
  const isAdminDashboard = location.pathname.startsWith('/admin') && !isAdminLogin;

  if (isAdminLogin) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <Hyperspeed
            effectOptions={{
                onSpeedUp: () => { },
                onSlowDown: () => { },
                distortion: 'turbulentDistortion',
                length: 400,
                roadWidth: 10,
                islandWidth: 2,
                lanesPerRoad: 3,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 50,
                lightPairsPerRoadWay: 50,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.05, 400 * 0.15],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.2, 0.2],
                carFloorSeparation: [0.05, 1],
                colors: {
                    roadColor: 0x080808,
                    islandColor: 0x0a0a0a,
                    background: 0x000000,
                    shoulderLines: 0x131318,
                    brokenLines: 0x131318,
                    leftCars: [0xff102a, 0xdf4050, 0xe9ecef],
                    rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
                    sticks: 0xdadafa,
                }
            }}
        />
      </div>
    );
  }

  if (isAdminDashboard) {
    return <AdminStaticBackground />;
  }

  return null;
};

export default AdminBackgrounds;
