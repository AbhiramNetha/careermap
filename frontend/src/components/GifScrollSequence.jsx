import React, { useEffect, useRef, useState } from 'react';
import './GifScrollSequence.css';

export default function GifScrollSequence() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [progress, setProgress] = useState(0);

    const frameCount = 51; 
    const currentFrame = (index) => `/levelup_frames/frame_${index.toString().padStart(4, '0')}.webp`;

    // Preload all frames
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

    // Animation + scroll logic — listens to the main-content-area scroll container
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Find the scroll container (#main-scroll-container) or fallback to window
        const scrollContainer = document.getElementById('main-scroll-container') || window;
        const isElementScroll = scrollContainer !== window;

        const getViewportHeight = () => {
            return isElementScroll ? scrollContainer.clientHeight : window.innerHeight;
        };

        const updateCanvasSize = () => {
            const stickyEl = containerRef.current?.querySelector('.sequence-sticky') || containerRef.current;
            const rect = stickyEl.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
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
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportH = getViewportHeight();
            
            const totalScroll = rect.height - viewportH;
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

        const scrollTarget = isElementScroll ? scrollContainer : window;
        
        window.addEventListener('resize', updateCanvasSize);
        scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

        // Initial trigger
        updateCanvasSize();
        handleScroll();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            scrollTarget.removeEventListener('scroll', handleScroll);
        };
    }, [images]);

    const mapVal = (start, end) => start + (end - start) * progress;

    return (
        <div className="sequence-container" ref={containerRef}>
            <div className="sequence-sticky">
                {/* Canvas */}
                <canvas ref={canvasRef} className="sequence-canvas" />
                
                {/* Overlay */}
                <div className="sequence-overlay"></div>

                <div className="parallax-text-overlay">
                    <div className="parallax-text-step" style={{ 
                        opacity: progress < 0.3 ? 1 : Math.max(0, 1 - (progress - 0.3)*5),
                        transform: `translateY(${mapVal(0, -30)}px)`
                    }}>
                        <h3>
                            {"Confused About Your Future?".split(" ").map((word, wordIdx, arr) => {
                                const charOffset = arr.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);
                                return (
                                    <React.Fragment key={wordIdx}>
                                        <span className="wave-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                                            {word.split("").map((char, charIdx) => {
                                                const globalIdx = charOffset + charIdx;
                                                return (
                                                    <span
                                                        key={charIdx}
                                                        className="wave-letter"
                                                        style={{ animationDelay: `${globalIdx * 0.05}s` }}
                                                    >
                                                        {char}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                        {wordIdx < arr.length - 1 && ' '}
                                    </React.Fragment>
                                );
                            })}
                        </h3>
                        <p>Stop guessing. Make data-driven career choices that match your degree, strengths, and goals.</p>
                    </div>
                    
                    <div className="parallax-text-step p-mid" style={{ 
                        opacity: progress > 0.4 && progress < 0.8 ? Math.sin((progress - 0.4)*2.5 * Math.PI) : 0 
                    }}>
                        <h3 className="neon-text">LEVEL UP</h3>
                        <p>Discover personalized roadmaps tailored to your degree, interests, and career ambitions.</p>
                    </div>

                    <div className="parallax-text-step p-final" style={{ 
                        opacity: progress > 0.8 ? mapVal(-1, 2) : 0, 
                        transform: `translateY(${mapVal(20, 0)}px)` 
                    }}>
                        <h3 className="neon-text">Your Journey Begins</h3>
                        <p>Take the quiz and unlock career paths built specifically for your field of study.</p>
                    </div>
                </div>

                {/* Bouncing chevron hint icon — fades out once user starts scrolling */}
                <div
                    className="scroll-hint"
                    style={{ opacity: progress > 0.05 ? 0 : 1 }}
                    aria-hidden="true"
                >
                    <div className="scroll-hint-chevrons">
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-hint-chevron chevron-1">
                            <path d="M6 3l6 6 6-6" />
                        </svg>
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-hint-chevron chevron-2">
                            <path d="M6 3l6 6 6-6" />
                        </svg>
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-hint-chevron chevron-3">
                            <path d="M6 3l6 6 6-6" />
                        </svg>
                    </div>
                    <span className="scroll-hint-label">Scroll</span>
                </div>
            </div>
        </div>
    );
}
