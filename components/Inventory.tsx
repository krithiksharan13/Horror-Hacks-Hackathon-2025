
import React from 'react';
import type { Item } from '../types';

interface InventoryProps {
  items: Item[];
  selectedItem: Item | null;
  onSelectItem: (item: Item | null) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, selectedItem, onSelectItem }) => {
  const handleItemClick = (item: Item) => {
    if (selectedItem?.id === item.id) {
      onSelectItem(null); // Deselect
    } else {
      onSelectItem(item);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-20">
      <div className="flex space-x-4">
        {items.map((item) => (
          <div
            key={item.id}
            title={item.name}
            onClick={() => handleItemClick(item)}
            className={`w-20 h-20 p-2 bg-gray-900 bg-opacity-50 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedItem?.id === item.id 
                ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50' 
                : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className={`w-full h-full text-gray-300 ${selectedItem?.id === item.id ? 'text-cyan-300' : ''}`}>
              {item.icon}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400">Inventory is empty.</p>}
      </div>
    </div>
  );
};

export default Inventory;
