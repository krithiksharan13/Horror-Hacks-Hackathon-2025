// FIX: Add missing import for React to resolve error when using React.ReactNode type.
import React from 'react';

export type ItemId = 'mortar' | 'crystal' | 'elixir_release' | 'ghost_tears' | 'mandrake_root' | 'brimstone';

export interface Item {
  id: ItemId;
  name: string;
  icon: React.ReactNode;
}

export type PuzzleId = 'orrery' | 'bookshelf' | 'cauldron' | 'graveyard_dash';
export type PuzzleStatus = 'unsolved' | 'solved' | 'solved_success' | 'solved_failure';

export type HotspotId = 'door' | 'orrery' | 'bookshelf' | 'cauldron' | 'desk' | 'window' | 'ghost_tears_jar' | 'mandrake_pot' | 'brimstone_pile';

export interface HotspotConfig {
  id: HotspotId;
  name: string;
  position: { top: string; left: string; width: string; height: string };
  description: string;
  puzzleId?: PuzzleId;
  itemId?: ItemId;
  solvedMessage?: string;
  useItem?: ItemId;
  successMessage?: string;
  imageUrl?: string;
}