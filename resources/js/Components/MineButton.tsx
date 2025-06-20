import React from 'react';
import './MineButton.css';

type Variant = 'default' | 'success' | 'danger';

interface GrayButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    variant?: Variant;
    disabled?: boolean;
  }

const MineButton: React.FC<GrayButtonProps> = ({
    text,
    onClick,
    className = '',
    variant = 'default',
    disabled = false,
  }) => {
    return (
      <button
        type="button"
        className={`gray-button smallest ${className} ${variant} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="shadow-3d"></span>
        <div className="gray-button-text-wrapper min-w-[70px]">
          <span className="gray-button-text text-xs">{text}</span>
        </div>
      </button>
    );
};
export default MineButton;
