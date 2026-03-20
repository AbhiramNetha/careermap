import React, { useState, useEffect } from 'react';

const WebsitePreloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useEffect(() => {
    // This simulates the website loading time. 
    // It realistically counts up to 100% with slight randomized pauses.
    const loadingInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        // Increase progress by a random amount between 1 and 15
        const increment = Math.floor(Math.random() * 15) + 1;
        return Math.min(prevProgress + increment, 100);
      });
    }, 150);

    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    // Once it hits 100%, hold for half a second, then trigger the fade/slide out
    if (progress === 100) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      
      // Unmount the component from the DOM completely after the slide-out animation finishes (800ms)
      setTimeout(() => {
        setShouldUnmount(true);
      }, 1400);
    }
  }, [progress]);

  // Once fully loaded and animated out, remove from DOM so it doesn't block interactions
  if (shouldUnmount) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 0, 20, 0.65)', // Glassmorphism backdrop
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // Smooth slide-up effect when loading is done
        transform: isLoaded ? 'translateY(-100vh)' : 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
        color: '#ffffff',
        fontFamily: 'var(--font-heading), "Poppins", sans-serif'
      }}
    >
      <div style={{ textAlign: 'center', overflow: 'hidden' }}>
        {/* Brand Name & Logo */}
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
        
        {/* Loading Counter */}
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
        
        {/* Loading Bar underlying the counter */}
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
