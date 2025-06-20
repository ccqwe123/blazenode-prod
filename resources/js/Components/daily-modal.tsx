import { X, Gift } from 'lucide-react';
import axios from 'axios';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onClaim: () => void;
}
export default function RewardModal({ show, onClose, onClaim }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-[350px] sm:w-[450px] rounded-xl bg-[#0F0F0F] p-6 text-center shadow-lg animate-scaleFadeIn">
        <button onClick={onClose} className="absolute right-3 top-3 text-white hover:text-gray-300">
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-4 text-xl font-bold text-white">Claim Your Daily Reward!</h2>
        <div className="flex justify-center mb-6">
          <Gift size={128} className="text-gray-400" />
        </div>
        <button
          onClick={onClaim}
          className="rounded-full bg-[#121F2D] px-6 py-2 text-white font-semibold transition hover:bg-[#1A2B3D]"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
}