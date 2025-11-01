
import React from 'react';

interface PuzzleModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-40" onClick={onClose}>
      <div 
        className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl p-6 w-full max-w-3xl text-white relative animate-[fadeIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-cinzel text-red-300">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PuzzleModal;
