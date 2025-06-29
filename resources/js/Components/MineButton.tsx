import React from 'react';
// import './MineButton.css';

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
          disabled={disabled}
          onClick={onClick}
          className={`w-full ${variant == 'default' ? 'bg-gray-400 border-gray-400' : (variant == 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500')} border-[1.5px] relative top-[2px] rounded-[8px] text-primary inline-block text-center group disabled:opacity-50 disabled:cursor-not-allowed  group`}>
          <span className={`relative text-center bg-black w-auto success text-white ${variant == 'default' ? 'border-gray-700' : (variant == 'success' ? 'border-green-700' : 'border-red-700')} rounded-[8px] text-[15px] font-bold border-[1.5px] px-5 py-2 -translate-y-1 hover:-translate-y-1.5 active:-translate-y-0.5 mx-[-1.5px] group-disabled:hover:!-translate-y-1 block active:transition-all active:duration-100 select-none`}>{text}</span>
      </button>
      // <button
      //   type="button"
      //   className={`gray-button smallest ${className} ${variant} ${disabled ? 'disabled' : ''}`}
      //   onClick={onClick}
      //   disabled={disabled}
      // >
      //   <span className="shadow-3d"></span>
      //   <div className="gray-button-text-wrapper min-w-[70px]">
      //     <span className="gray-button-text text-xs">{text}</span>
      //   </div>
      // </button>
    );
};
export default MineButton;
