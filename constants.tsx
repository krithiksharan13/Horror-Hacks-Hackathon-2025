
import React from 'react';
import type { Item, HotspotConfig, PuzzleId, PuzzleStatus } from './types';

const MortarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M21 7a2.5 2.5 0 0 0-2.5-2.5h-2.91l-2.7-4.32a1 1 0 0 0-1.62-.16L10.09 4.5H4.5A2.5 2.5 0 0 0 2 7v2.38l5.88 9.41A2 2 0 0 0 9.62 20h4.76a2 2 0 0 0 1.74-1.21L22 9.38V7h-1zm-9 11c-1.68 0-3-1.32-3-3s1.32-3 3-3 3 1.32 3 3-1.32 3-3 3z"/></svg>;
const CrystalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2L1 13h22L12 2zm-2.04 12L12 5.5l2.04 8.5H9.96zM3.5 20.5a1.5 1.5 0 0 1-1.5-1.5v-4h22v4a1.5 1.5 0 0 1-1.5 1.5h-19z"/></svg>;
const ElixirIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M16 4.07a8.5 8.5 0 0 0-8 0V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.07zM15 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8.5 22a5.5 5.5 0 0 1 4.2-5.11 3.5 3.5 0 0 1 2.6 0A5.5 5.5 0 0 1 8.5 22z"/></svg>;
const TearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2a9.9 9.9 0 0 0-2.83 19.33A9.9 9.9 0 0 0 21.33 9.17 10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>;
const RootIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M17.66 17.66L12 23.31l-5.66-5.65a8 8 0 1 1 11.32 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>;
const BrimstoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;


export const ITEMS: Record<string, Item> = {
  mortar: { id: 'mortar', name: 'Grinding Mortar', icon: <MortarIcon /> },
  crystal: { id: 'crystal', name: 'Ignition Crystal', icon: <CrystalIcon /> },
  elixir_release: { id: 'elixir_release', name: 'Elixir of Release', icon: <ElixirIcon /> },
  ghost_tears: { id: 'ghost_tears', name: 'Tears of a Ghost', icon: <TearIcon /> },
  mandrake_root: { id: 'mandrake_root', name: 'Root of Mandrake', icon: <RootIcon /> },
  brimstone: { id: 'brimstone', name: 'Powdered Brimstone', icon: <BrimstoneIcon /> },
};

export const HOTSPOTS: Record<string, HotspotConfig> = {
  door: {
    id: 'door', name: 'Door',
    position: { top: '15%', left: '0%', width: '10%', height: '80%' },
    description: "It's sealed by some unseen force. I need to brew the 'Elixir of Release'.",
    useItem: 'elixir_release',
    successMessage: "The door unlocks!",
  },
  orrery: {
    id: 'orrery', name: 'Celestial Orrery',
    position: { top: '55%', left: '25%', width: '12%', height: '12%' },
    description: "A beautiful, intricate model of the solar system. Some planets seem to be movable.",
    puzzleId: 'orrery',
    solvedMessage: "The orrery has revealed all its secrets.",
    imageUrl: '/c.png'
  },
  bookshelf: {
    id: 'bookshelf', name: 'Bookshelf',
    position: { top: '10%', left: '80%', width: '25%', height: '50%' },
    description: "A towering bookshelf filled with arcane literature. A set of scales sits on one shelf, curiously empty.",
    puzzleId: 'bookshelf',
    solvedMessage: "The hidden compartment is empty now."
  },
  cauldron: {
    id: 'cauldron', name: 'Cauldron',
    position: { top: '50%', left: '48%', width: '15%', height: '25%' },
    description: "A large cauldron, bubbling with a clear liquid. It's ready for ingredients.",
    puzzleId: 'cauldron',
  },
  desk: {
    id: 'desk', name: 'Journal',
    position: { top: '66%', left: '80%', width: '15%', height: '10%' },
    description: "The alchemist's main journal. A note reads: 'My knowledge is balanced by Lead, Silver, and Gold.' Another page details a recipe for an 'Elixir of Sight', requiring Tears of a Ghost, Root of Mandrake, and Powdered Brimstone, to be prepared and ignited once again after 250 years of solitude."
  },
  window: {
    id: 'window', name: 'Window',
    position: { top: '10%', left: '48%', width: '15%', height: '35%' },
    description: "The moon hangs high in the sky, a stark reminder that time is running out. The glass is unbreakable."
  },
  ghost_tears_jar: {
    id: 'ghost_tears_jar', name: "Jar of 'Ghost Tears'",
    position: { top: '55%', left: '14%', width: '10%', height: '15%' },
    description: "The jar is empty, but it hums with spectral energy. A faint graveyard scene swirls within the glass.",
    puzzleId: 'graveyard_dash',
    solvedMessage: "The jar is now full of a shimmering, ethereal liquid. You have collected the Tears of a Ghost.",
    imageUrl: '/tears.png',
  },
  mandrake_pot: {
    id: 'mandrake_pot', name: "Potted Mandrake",
    position: { top: '70%', left: '35%', width: '15%', height: '20%' },
    description: "A strange plant with a root that looks disturbingly human-like.",
    itemId: 'mandrake_root',
    imageUrl: '/mandrake.png',
  },
  brimstone_pile: {
    id: 'brimstone_pile', name: "Pile of Brimstone",
    position: { top: '60%', left: '75%', width: '8%', height: '8%' },
    description: "A small pile of yellow, sulfuric powder.",
    itemId: 'brimstone',
    imageUrl: '/stone.png',
  },
};

export type PuzzleState = Record<PuzzleId, PuzzleStatus>;
// Remove any hotspot with puzzleId: 'jigsaw'