import React, { useEffect, useRef, useState } from 'react';
import './GifScrollSequence.css';

export default function GifScrollSequence() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [progress, setProgress] = useState(0);

    const frameCount = 51; 
    const currentFrame = (index) => `/levelup_frames/frame_${index.toString().padStart(4, '0')}.webp`;

    
    useEffect(() => {
        const loadedImages = [];
        let loadedCount = 0;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    
                    setImages(loadedImages);
                }
            };
            loadedImages.push(img);
        }
    }, []);

    
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(currentFrameIndex); 
        };

        let currentFrameIndex = 0;

        const renderFrame = (index) => {
            if (!images[index] || !images[index].complete) return;
            
            
            const img = images[index];
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasRatio > imgRatio) {
                
                drawHeight = drawWidth / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const handleScroll = () => {
            const rect = containerRef.current.getBoundingClientRect();
            
            const totalScroll = rect.height - window.innerHeight;
            let currentScroll = -Math.min(0, rect.top); 
            let rawProgress = rect.top < 0 ? currentScroll / totalScroll : 0;
            
            let p = Math.max(0, Math.min(1, rawProgress));

            
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(p * frameCount)
            );
            
            setProgress(p);

            
            requestAnimationFrame(() => renderFrame(frameIndex));
            currentFrameIndex = frameIndex;
        };

        window.addEventListener('resize', updateCanvasSize);
        window.addEventListener('scroll', handleScroll, { passive: true });

        
        updateCanvasSize();
        handleScroll();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [images]);

    const mapVal = (start, end) => start + (end - start) * progress;

    return (
        <div className="sequence-container" ref={containerRef}>
            <div className="sequence-sticky">
                {}
                <canvas ref={canvasRef} className="sequence-canvas" />
                
                {}
                <div className="sequence-overlay"></div>

                <div className="parallax-text-overlay">
                    <div className="parallax-text-step" style={{ 
                        opacity: progress < 0.3 ? mapVal(0, 3) : Math.max(0, 1 - (progress - 0.3)*5),
                        transform: `translateY(${mapVal(0, -30)}px)`
                    }}>
                        <h3>Lost After B.Tech?</h3>
                        <p>Stop guessing. Make data-driven career choices that guarantee success.</p>
                    </div>
                    
                    <div className="parallax-text-step p-mid" style={{ 
                        opacity: progress > 0.4 && progress < 0.8 ? Math.sin((progress - 0.4)*2.5 * Math.PI) : 0 
                    }}>
                        <h3 className="neon-text">LEVEL UP</h3>
                        <p>Discover personalized roadmaps tailored to your engineering branch.</p>
                    </div>

                    <div className="parallax-text-step p-final" style={{ 
                        opacity: progress > 0.8 ? mapVal(-1, 2) : 0, 
                        transform: `translateY(${mapVal(20, 0)}px)` 
                    }}>
                        <h3 className="neon-text">Your Journey Begins</h3>
                        <p>Take the 7-question quiz and unlock your true potential.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
