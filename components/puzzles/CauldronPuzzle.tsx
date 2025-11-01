import React, { useState } from 'react';
import type { Item, ItemId } from '../../types';
import { ITEMS } from '../../constants';

interface CauldronPuzzleProps {
  onSolve: (success: boolean) => void;
  inventory: Item[];
}

const REQUIRED_ITEMS: ItemId[] = ['ghost_tears', 'mandrake_root', 'brimstone'];
const REQUIRED_TOOLS: ItemId[] = ['mortar', 'crystal'];

const CauldronPuzzle: React.FC<CauldronPuzzleProps> = ({ onSolve, inventory }) => {
  const [addedIngredients, setAddedIngredients] = useState<ItemId[]>([]);

  const playerHasRequiredTools = REQUIRED_TOOLS.every(toolId => inventory.some(item => item.id === toolId));
  const availableIngredients = inventory.filter(item => REQUIRED_ITEMS.includes(item.id));

  const addIngredient = (id: ItemId) => {
    if (addedIngredients.length < 3 && !addedIngredients.includes(id)) {
      setAddedIngredients(prev => [...prev, id]);
    }
  };
  
  const brew = () => {
    if (!playerHasRequiredTools) {
      alert("You are missing the required tools to prepare and ignite the ingredients.");
      onSolve(false);
      return;
    }

    const isCorrectOrder = 
      addedIngredients.length === 3 &&
      addedIngredients[0] === 'ghost_tears' &&
      addedIngredients[1] === 'mandrake_root' &&
      addedIngredients[2] === 'brimstone';
      
    onSolve(isCorrectOrder);
  };
  
  return (
    <div className="text-center">
      <p className="mb-4 text-gray-300">The recipe calls for three ingredients in a specific order, prepared with a mortar and ignited with a crystal.</p>
      <div className="flex gap-4 mb-4">
        <div className="w-1/2 bg-gray-900 p-4 rounded-lg">
          <h3 className="font-cinzel text-xl mb-2">Available Ingredients</h3>
          <div className="space-y-2">
            {availableIngredients.map(item => (
              <button 
                key={item.id} 
                onClick={() => addIngredient(item.id)}
                disabled={addedIngredients.includes(item.id)}
                className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:bg-gray-800 disabled:text-gray-500"
              >
                {item.name}
              </button>
            ))}
            {availableIngredients.length === 0 && <p className="text-gray-500">None yet...</p>}
          </div>
        </div>
        <div className="w-1/2 bg-gray-900 p-4 rounded-lg">
          <h3 className="font-cinzel text-xl mb-2">Cauldron</h3>
          <div className="min-h-[120px] border-2 border-dashed border-gray-600 rounded p-2 space-y-1">
            {addedIngredients.map((id, index) => {
              // FIX: Cannot find name 'ITEMS'. Added import for ITEMS from '../../constants'.
              const item = inventory.find(i => i.id === id) || ITEMS[id];
              return <p key={index} className="text-left">{index + 1}. {item?.name}</p>
            })}
             {addedIngredients.length === 0 && <p className="text-gray-500 pt-8">Add ingredients</p>}
          </div>
        </div>
      </div>
      <button 
        onClick={brew} 
        disabled={addedIngredients.length < 3}
        className="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-cinzel rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Brew Potion
      </button>
    </div>
  );
};

export default CauldronPuzzle;
