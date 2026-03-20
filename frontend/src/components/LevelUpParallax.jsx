import React, { useEffect, useRef, useState } from 'react';
import './LevelUpParallax.css';

export default function LevelUpParallax() {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            // We want progress 0 -> 1 based on how far we scrolled past the top
            const totalScroll = rect.height - window.innerHeight;
            let currentScroll = -rect.top;
            
            let p = currentScroll / totalScroll;
            p = Math.max(0, Math.min(1, p));
            
            // ease-out cubic
            const t = 1 - Math.pow(1 - p, 3);
            setProgress(t);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mapVal = (start, end) => start + (end - start) * progress;

    // Crossfade Logic
    // Using progress 0 to 0.5 for img1
    // progress 0.5 to 1.0 for img2
    const img1Opacity = progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) * 5); // Fades out completely by 0.6
    const img2Opacity = progress > 0.4 ? Math.min(1, (progress - 0.4) * 5) : 0; // Fades in from 0.4 to 0.6

    return (
        <div className="img-parallax-container" ref={containerRef}>
            <div className="img-parallax-sticky">
                
                {/* 
                  Make sure to add your downloaded images to the public folder.
                  Replace 'image1.jpg' and 'image2.jpg' below with their actual filenames once saved!
                */}
                <div 
                    className="parallax-img img-1"
                    style={{ 
                        opacity: img1Opacity,
                        transform: `scale(${mapVal(1, 1.3)}) translateZ(0)`,
                        filter: `blur(${progress > 0.3 ? (progress - 0.3) * 10 : 0}px)`
                    }}
                />

                <div 
                    className="parallax-img img-2"
                    style={{ 
                        opacity: img2Opacity,
                        transform: `scale(${mapVal(0.9, 1.1)}) translateZ(0)`,
                    }}
                />

                {/* Overlay with dynamic text */}
                <div className="parallax-text-overlay">
                    <div className="parallax-text-step" style={{ 
                        opacity: progress < 0.3 ? mapVal(0, 3) : Math.max(0, 1 - (progress - 0.3)*5),
                        transform: `translateY(${mapVal(0, -30)}px)`
                    }}>
                        <h3>Your Coding Journey</h3>
                        <p>Analyze data, write the code, and master the stack.</p>
                    </div>
                    
                    <div className="parallax-text-step p-mid" style={{ 
                        opacity: progress > 0.4 && progress < 0.8 ? Math.sin((progress - 0.4)*2.5 * Math.PI) : 0 
                    }}>
                        <h3 className="neon-text">LEVEL UP</h3>
                        <p>Unlock new opportunities with every project.</p>
                    </div>

                    <div className="parallax-text-step p-final" style={{ 
                        opacity: progress > 0.8 ? mapVal(-1, 2) : 0, 
                        transform: `translateY(${mapVal(20, 0)}px)` 
                    }}>
                        <h3 className="neon-text">Ready to Begin?</h3>
                        <p>Your ultimate tech career awaits.</p>
                    </div>
                </div>

                {/* Progress bar at the bottom edges */}
                <div className="scroll-indicator">
                    <div className="scroll-progress-bar">
                        <div className="scroll-fill" style={{ width: `${progress * 100}%` }}></div>
                    </div>
                    <p>Keep scrolling...</p>
                </div>
            </div>
        </div>
    );
}
