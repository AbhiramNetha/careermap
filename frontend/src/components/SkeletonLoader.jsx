import React from 'react';

/**
 * SkeletonLine — a single shimmering placeholder line.
 */
export function SkeletonLine({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`skeleton-line ${className}`}
      style={{ width, height, borderRadius: '6px' }}
    />
  );
}

/**
 * SkeletonCard — a card-shaped shimmer block.
 */
export function SkeletonCard({ children, className = '', style = {} }) {
  return (
    <div className={`skeleton-card ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * RoadmapSkeleton — matches the RoadmapPage layout.
 */
export function RoadmapSkeleton() {
  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Hero */}
        <div className="skeleton-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <SkeletonLine width="40%" height="0.85rem" />
          <SkeletonLine width="70%" height="2.2rem" style={{ marginTop: '1rem' }} />
          <SkeletonLine width="50%" height="1rem" style={{ marginTop: '0.75rem' }} />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SkeletonLine width="130px" height="2.4rem" style={{ borderRadius: '10px' }} />
            <SkeletonLine width="160px" height="2.4rem" style={{ borderRadius: '10px' }} />
          </div>
        </div>

        {/* Progress card */}
        <div className="skeleton-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <SkeletonLine width="35%" height="1rem" />
            <SkeletonLine width="15%" height="1rem" />
          </div>
          <SkeletonLine width="100%" height="8px" style={{ borderRadius: '99px' }} />
        </div>

        {/* Phase chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card" style={{ padding: '1rem' }}>
              <SkeletonLine width="60%" height="0.8rem" />
              <SkeletonLine width="100%" height="4px" style={{ marginTop: '0.5rem', borderRadius: '99px' }} />
            </div>
          ))}
        </div>

        {/* Timeline steps */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem' }}>
            <div className="skeleton-dot" />
            <div style={{ flex: 1 }}>
              <div className="skeleton-card" style={{ padding: '1.25rem' }}>
                <SkeletonLine width="40%" height="1.1rem" />
                <SkeletonLine width="100%" height="4px" style={{ marginTop: '0.75rem', borderRadius: '99px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[1, 2].map(j => (
                    <div key={j} className="skeleton-card" style={{ padding: '1rem' }}>
                      <SkeletonLine width="70%" height="0.9rem" />
                      <SkeletonLine width="90%" height="0.75rem" style={{ marginTop: '0.6rem' }} />
                      <SkeletonLine width="75%" height="0.75rem" style={{ marginTop: '0.4rem' }} />
                      <SkeletonLine width="80%" height="0.75rem" style={{ marginTop: '0.4rem' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
