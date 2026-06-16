import React, { useState, useEffect } from 'react';

const WebsitePreloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useEffect(() => {
    
    
    const loadingInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        
        const increment = Math.floor(Math.random() * 15) + 1;
        return Math.min(prevProgress + increment, 100);
      });
    }, 150);

    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    
    if (progress === 100) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      
      
      setTimeout(() => {
        setShouldUnmount(true);
      }, 1400);
    }
  }, [progress]);

  
  if (shouldUnmount) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 0, 20, 0.65)', 
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        
        transform: isLoaded ? 'translateY(-100vh)' : 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
        color: '#ffffff',
        fontFamily: 'var(--font-heading), "Poppins", sans-serif'
      }}
    >
      <div style={{ textAlign: 'center', overflow: 'hidden' }}>
        {}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <img 
            src="/logo.png" 
            alt="way2fresher logo" 
            style={{ 
              width: '60px', 
              height: '60px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))'
            }} 
          />
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: '800', 
            margin: 0, 
            letterSpacing: '-1px' 
          }}>
            way2<span style={{ color: '#10b981' }}>fresher</span>
          </h1>
        </div>
        
        {}
        <div style={{
           fontSize: '1.25rem',
           marginTop: '20px',
           fontWeight: '600',
           color: '#94a3b8',
           fontVariantNumeric: 'tabular-nums',
           letterSpacing: '2px'
        }}>
          {progress}%
        </div>
        
        {}
        <div style={{
          width: '200px',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          margin: '20px auto 0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
            <div style={{
                height: '100%',
                width: `${progress}%`,
                background: '#10b981',
                transition: 'width 0.2s ease'
            }} />
        </div>
      </div>
    </div>
  );
};

export default WebsitePreloader;
