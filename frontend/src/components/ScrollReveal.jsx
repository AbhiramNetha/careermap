import React from 'react';
import { motion as Motion } from 'framer-motion';

export default function ScrollReveal({ 
    children, 
    delay = 0, 
    duration = 0.8, 
    yOffset = 30, 
    className = '', 
    style = {} 
}) {
    return (
        <Motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{
                delay: delay,
                duration: duration,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a premium, snappy deceleration feel
            }}
            className={className}
            style={style}
        >
            {children}
        </Motion.div>
    );
}
