
import React, { useState } from 'react';

interface OrreryPuzzleProps {
  onSolve: () => void;
  onFail: () => void;
}

const SOLUTION = [2, 5, 0]; // Example solution for 3 planets

const OrreryPuzzle: React.FC<OrreryPuzzleProps> = ({ onSolve, onFail }) => {
  const [positions, setPositions] = useState([0, 0, 0]);

  const rotatePlanet = (index: number) => {
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = (newPositions[index] + 1) % 8;
      return newPositions;
    });
  };

  const checkSolution = () => {
    if (JSON.stringify(positions) === JSON.stringify(SOLUTION)) {
      onSolve();
    } else {
      onFail();
      alert("Nothing happens. That can't be right.");
    }
  };

  return (
    <div className="text-center">
      <p className="mb-4 text-gray-300">The planets have aligned again in a specific configuration as on the night Valerius disappeared after...</p>
      <div className="flex justify-around items-center h-48 bg-gray-900 rounded-lg p-4 mb-4">
        {positions.map((pos, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-yellow-300 flex justify-center items-center" style={{ transform: `rotate(${(pos * 45)}deg)`}}>
              <div className={`w-6 h-6 rounded-full bg-blue-400 transform -translate-y-8`}/>
            </div>
            <button onClick={() => rotatePlanet(index)} className="mt-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Rotate</button>
            <span className="mt-1 text-sm">{pos}</span>
          </div>
        ))}
      </div>
      <button onClick={checkSolution} className="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-cinzel rounded-lg">
        Check Alignment
      </button>
    </div>
  );
};

export default OrreryPuzzle;
