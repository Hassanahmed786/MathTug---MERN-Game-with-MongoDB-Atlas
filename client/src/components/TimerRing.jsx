import React, { useEffect, useRef } from 'react';

const RADIUS = 40;
const STROKE = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerRing({ timeLeft, totalTime = 15, isUrgent }) {
  const circleRef = useRef(null);

  // Color interpolation: green → yellow → red
  const ratio = totalTime > 0 ? timeLeft / totalTime : 0;
  let strokeColor;
  if (ratio > 0.5) {
    // green → yellow
    const t = (ratio - 0.5) * 2; // 1→0 as ratio goes 1→0.5
    const r = Math.round(255 * (1 - t));
    const g = 200;
    strokeColor = `rgb(${r}, ${g}, 50)`;
  } else {
    // yellow → red
    const t = ratio * 2; // 1→0 as ratio goes 0.5→0
    const g = Math.round(200 * t);
    strokeColor = `rgb(255, ${g}, 50)`;
  }

  const dashOffset = CIRCUMFERENCE * (1 - ratio);

  return (
    <div className="timer-ring-container">
      <svg
        viewBox="0 0 100 100"
        className="timer-svg"
        style={{
          animation: isUrgent ? 'pulse 0.6s ease-in-out infinite' : 'none',
          filter: isUrgent ? `drop-shadow(0 0 8px ${strokeColor})` : 'none',
        }}
      >
        {/* Track */}
        <circle
          cx="50" cy="50" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="50" cy="50" r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease',
          }}
        />
        {/* Glow track for urgent */}
        {isUrgent && (
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE + 4}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            opacity={0.25}
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        )}
      </svg>

      {/* Number overlay */}
      <div className="timer-number" style={{
        color: isUrgent ? '#ff4444' : 'var(--text-primary)',
        textShadow: isUrgent ? '0 0 15px rgba(255,68,68,0.8)' : 'none',
        animation: isUrgent ? 'pulse 0.6s ease-in-out infinite' : 'none',
      }}>
        {timeLeft}
      </div>
    </div>
  );
}
