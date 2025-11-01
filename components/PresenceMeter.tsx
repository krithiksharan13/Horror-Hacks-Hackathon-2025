
import React from 'react';

interface PresenceMeterProps {
  presence: number;
}

const PresenceMeter: React.FC<PresenceMeterProps> = ({ presence }) => {
  const getLevelEffects = () => {
    if (presence > 75) return "SHAKING";
    if (presence > 50) return "Rattling";
    if (presence > 25) return "Whispers";
    return "Calm";
  };

  const width = `${presence}%`;

  return (
    <div className="absolute top-4 right-4 w-64 h-16 bg-black bg-opacity-50 border-2 border-red-900 rounded-lg p-2 z-20">
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-red-900 bg-opacity-30 rounded-sm overflow-hidden">
          <div
            style={{ width }}
            className="h-full bg-red-500 transition-all duration-500 ease-in-out"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-white font-cinzel text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            Presence: {getLevelEffects()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PresenceMeter;
