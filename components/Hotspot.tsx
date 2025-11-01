
import React from 'react';
import type { HotspotConfig, HotspotId } from '../types';

interface HotspotProps extends HotspotConfig {
  onClick: (id: HotspotId) => void;
}

const Hotspot: React.FC<HotspotProps> = ({ id, name, position, onClick, imageUrl }) => {
  const baseClasses = "absolute transition-all duration-200 cursor-pointer hotspot-container group";
  const conditionalClasses = !imageUrl ? "border-2 border-transparent hover:border-cyan-400 hover:bg-cyan-400/20" : "";

  return (
    <div
      title={name}
      style={{ ...position }}
      className={`${baseClasses} ${conditionalClasses}`}
      onClick={() => onClick(id)}
    >
       {imageUrl && (
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-300" 
          draggable="false"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,1))' }}
        />
      )}
    </div>
  );
};

export default Hotspot;
