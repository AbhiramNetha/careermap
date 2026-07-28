import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip — shows a styled tooltip above the child on hover.
 * Usage: <Tooltip text="High Risk means volatile income">
 *          <span>⚡ High Risk</span>
 *        </Tooltip>
 */
export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 150);
  };
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: position === 'top' ? 'calc(100% + 8px)' : 'auto',
            top: position === 'bottom' ? 'calc(100% + 8px)' : 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e2e8f0',
            fontSize: '0.72rem',
            fontWeight: 500,
            padding: '6px 10px',
            borderRadius: '8px',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
            animation: 'tooltip-fade-in 0.15s ease forwards',
            maxWidth: '220px',
            whiteSpace: 'normal',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {text}
          {/* Caret arrow */}
          <span
            style={{
              position: 'absolute',
              bottom: position === 'top' ? '-5px' : 'auto',
              top: position === 'bottom' ? '-5px' : 'auto',
              left: '50%',
              transform: `translateX(-50%) rotate(${position === 'top' ? '45deg' : '225deg'})`,
              width: '8px',
              height: '8px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderTop: 'none',
              borderLeft: 'none',
            }}
          />
        </span>
      )}
    </span>
  );
}
