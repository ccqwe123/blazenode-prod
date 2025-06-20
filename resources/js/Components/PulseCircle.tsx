import React from 'react';
import classNames from 'classnames';

interface PulseCircleProps {
  variant?: 'success' | 'danger';
  size?: number;
}

const PulseCircle: React.FC<PulseCircleProps> = ({ variant = 'success', size = 10 }) => {
    const baseColor = {
      success: 'bg-green-500',
      danger: 'bg-red-500',
    };

    const pulseColor = {
      success: 'bg-green-400',
      danger: 'bg-red-400',
    };

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Pulse Ring */}
        <span
          className={`absolute inline-flex rounded-full opacity-75 animate-ping ${pulseColor[variant]}`}
          style={{
            width: size * 2.5,
            height: size * 2.5,
          }}
        ></span>

        {/* Center Dot */}
        <span
          className={`inline-flex rounded-full ${baseColor[variant]}`}
          style={{ width: size, height: size }}
        ></span>
      </div>
    );
  };

export default PulseCircle;
