import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';

export default function ScrollReveal({
    children,
    delay = 0,
    duration = 0.8,
    yOffset = 30,
    className = '',
    style = {},
}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Use the app's custom scroll container as root so IntersectionObserver
        // fires against the right viewport. Falls back to null (window) if not found.
        const scrollRoot = document.getElementById('main-scroll-container') || null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    // Reset so the animation re-plays every time the element re-enters
                    setIsVisible(false);
                }
            },
            {
                root: scrollRoot,
                rootMargin: '-60px',
                threshold: 0.1,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Motion.div
            ref={ref}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
            transition={{
                delay: isVisible ? delay : 0,
                duration: duration,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
            style={style}
        >
            {children}
        </Motion.div>
    );
}
