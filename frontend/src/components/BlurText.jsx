import React from 'react';
import { motion } from 'framer-motion';

export default function BlurText({
    text = '',
    delay = 200,
    className = '',
    animateBy = 'words', // 'words' or 'letters'
    direction = 'top', // 'top' or 'bottom'
}) {
    const defaultVariants = {
        hidden: { filter: 'blur(10px)', opacity: 0, y: direction === 'top' ? -20 : 20 },
        visible: { filter: 'blur(0px)', opacity: 1, y: 0 },
    };

    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    return (
        <p className={className}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                        delay: index * (delay / 1000),
                        duration: 0.8,
                        ease: [0.25, 1, 0.5, 1], // ease out expo
                    }}
                    variants={defaultVariants}
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {element === ' ' ? '\u00A0' : element}
                    {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </p>
    );
}
