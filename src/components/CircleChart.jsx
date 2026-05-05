import React from 'react';

const CircleChart = ({ safe, dangerous, total }) => {
  const safePercentage = total > 0 ? (safe / total) * 100 : 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="rgba(239, 68, 68, 0.2)"
          strokeWidth="15"
        />
        {/* Progress Circle (Safe) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth="15"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))'
          }}
          strokeLinecap="round"
        />
      </svg>
      {/* Center Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{Math.round(safePercentage)}%</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Safe</div>
      </div>
    </div>
  );
};

export default CircleChart;
