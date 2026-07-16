import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FloatingDotsBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    // Theme-dependent colors (emerald and blue accents)
    const colorsDark = [
      'rgba(16, 185, 129, 0.45)', // emerald
      'rgba(52, 211, 153, 0.35)', // emerald light
      'rgba(59, 130, 246, 0.4)',  // blue
      'rgba(147, 197, 253, 0.3)'  // light blue
    ];

    const colorsLight = [
      'rgba(16, 185, 129, 0.25)', // soft emerald
      'rgba(5, 150, 105, 0.2)',   // darker emerald
      'rgba(59, 130, 246, 0.22)', // soft blue
      'rgba(29, 78, 216, 0.15)'  // darker blue
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      // Density-based particle count: approx 1 particle per 5,000 square pixels, capped between 80 and 200 particles
      const area = canvas.width * canvas.height;
      const particleCount = Math.max(50, Math.min(Math.floor(area / 5000), 100));

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.8 + 0.8, // sizes range from 0.8px to 3.6px
          speedY: Math.random() * 0.5 + 0.15, // steady upward flow
          speedX: Math.random() * 0.2 - 0.1,  // minor horizontal drift
          opacity: Math.random() * 0.5 + 0.2, // base opacity
          pulseSpeed: Math.random() * 0.015 + 0.005,
          pulseVal: Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * 4),
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentColors = isDark ? colorsDark : colorsLight;

      particles.forEach((p) => {
        // Move particle upwards
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.pulseVal) * 0.08; // smooth wave drift

        // Animate opacity breathing/flicker
        p.pulseVal += p.pulseSpeed;
        const animatedOpacity = p.opacity * (0.7 + Math.sin(p.pulseVal) * 0.3);

        // Reset particle if it flows off the top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        // Warp around side boundaries
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Setup shadow/glow for dark mode to give a premium feel
        if (isDark && p.radius > 1.5) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = currentColors[p.colorIdx].replace(/[\d.]+\)$/g, '0.8)');
        } else {
          ctx.shadowBlur = 0;
        }

        // Compute current fill style with animated opacity
        const baseColor = currentColors[p.colorIdx];
        const fillColor = baseColor.replace(/[\d.]+\)$/g, `${animatedOpacity.toFixed(3)})`);

        ctx.fillStyle = fillColor;
        ctx.fill();
      });

      // Reset shadow blur to prevent issues with other rendering
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default FloatingDotsBackground;
