// Pure-SVG bar chart – no external chart library needed
export default function AdminTrafficChart({ dailyData = [] }) {
    if (!dailyData || dailyData.length === 0) {
        return (
            <div className="admin-chart-empty">
                <span>📈</span>
                <p>No traffic data yet. Data will appear here once visitors start accessing the site.</p>
            </div>
        );
    }

    const W = 700, H = 220, PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    const maxVisitors = Math.max(...dailyData.map(d => d.visitors || 0), 1);
    const maxClicks = Math.max(...dailyData.map(d => d.courseClicks || 0), 1);
    const overallMax = Math.max(maxVisitors, maxClicks, 1);

    const n = dailyData.length;
    const barGroupW = chartW / n;
    const barW = Math.max(Math.min(barGroupW * 0.35, 16), 4);

    // Y gridlines
    const gridLines = 5;
    const yStep = overallMax / gridLines;

    return (
        <div className="admin-chart-wrapper">
            <div className="admin-chart-legend">
                <span className="legend-dot legend-visitor" /> Visitors
                <span className="legend-dot legend-click" /> Course Clicks
            </div>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                className="admin-svg-chart"
            >
                {/* Grid lines */}
                {Array.from({ length: gridLines + 1 }).map((_, i) => {
                    const y = PADDING.top + chartH - (i / gridLines) * chartH;
                    const val = Math.round(i * yStep);
                    return (
                        <g key={i}>
                            <line
                                x1={PADDING.left} y1={y}
                                x2={PADDING.left + chartW} y2={y}
                                stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={PADDING.left - 6} y={y + 4}
                                textAnchor="end" fontSize="10"
                                fill="rgba(255,255,255,0.4)"
                            >
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {dailyData.map((d, i) => {
                    const cx = PADDING.left + i * barGroupW + barGroupW / 2;
                    const vH = ((d.visitors || 0) / overallMax) * chartH;
                    const cH = ((d.courseClicks || 0) / overallMax) * chartH;
                    const dateLabel = d.date ? d.date.slice(5) : ''; // MM-DD

                    return (
                        <g key={i}>
                            {/* Visitor bar */}
                            <rect
                                x={cx - barW - 2}
                                y={PADDING.top + chartH - vH}
                                width={barW}
                                height={Math.max(vH, 1)}
                                fill="url(#gradV)"
                                rx="3"
                            >
                                <title>{d.date}: {d.visitors} visitors</title>
                            </rect>

                            {/* Click bar */}
                            <rect
                                x={cx + 2}
                                y={PADDING.top + chartH - cH}
                                width={barW}
                                height={Math.max(cH, 1)}
                                fill="url(#gradC)"
                                rx="3"
                            >
                                <title>{d.date}: {d.courseClicks} clicks</title>
                            </rect>

                            {/* X label – show only every N labels to avoid crowding */}
                            {(n <= 14 || i % Math.ceil(n / 14) === 0) && (
                                <text
                                    x={cx}
                                    y={PADDING.top + chartH + 16}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="rgba(255,255,255,0.4)"
                                >
                                    {dateLabel}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Gradient defs */}
                <defs>
                    <linearGradient id="gradV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(99,102,241,0.9)" />
                        <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
                    </linearGradient>
                    <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.9)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0.3)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
