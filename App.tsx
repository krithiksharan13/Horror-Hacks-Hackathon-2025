
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Item, HotspotId, PuzzleId } from './types';
import { ITEMS, HOTSPOTS, PuzzleState } from './constants';
import Hotspot from './components/Hotspot';
import Inventory from './components/Inventory';
import PresenceMeter from './components/PresenceMeter';
import MessageDisplay from './components/MessageDisplay';
import PuzzleModal from './components/puzzles/PuzzleModal';
import OrreryPuzzle from './components/puzzles/OrreryPuzzle';
import BookshelfPuzzle from './components/puzzles/BookshelfPuzzle';
import CauldronPuzzle from './components/puzzles/CauldronPuzzle';
import GraveyardDashPuzzle from './components/puzzles/GraveyardDashPuzzle';

type GameStatus = 'intro' | 'playing' | 'won' | 'lost';

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 text-center p-8">
    <h1 className="text-6xl font-cinzel text-red-300 mb-4 animate-[fadeIn_2s_ease-in]">Escape the Alchemist's Study</h1>
    <div className="max-w-3xl text-lg text-gray-300 space-y-4 mb-8 animate-[fadeIn_3s_ease-in]">
      <p>You've broken into the long-abandoned Blackwood Manor, seeking the hidden study of the alchemist, Master Valerius. The heavy oak door slams shut behind you. A cold, spectral voice echoes:</p>
      <p className="italic text-xl text-cyan-200">"A new specimen... You have one hour, until the moon is at its zenith. Solve my magnum opus and brew the Elixir of Release to quiet my soul, or I shall brew my own... using yours."</p>
    </div>
    <button onClick={onStart} className="px-8 py-4 bg-red-800 hover:bg-red-700 text-white font-cinzel text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-[fadeIn_4s_ease-in]">
      Begin
    </button>
  </div>
);

const EndScreen: React.FC<{ status: 'won' | 'lost', onRestart: () => void }> = ({ status, onRestart }) => (
  <div className={`absolute inset-0 bg-black flex flex-col justify-center items-center z-50 text-center p-8 ${status === 'lost' ? 'bg-opacity-100' : 'bg-opacity-80'}`}>
    {status === 'lost' && <img src="/game-over.jpg" alt="Game Over" className="absolute inset-0 w-full h-full object-cover animate-[jumpscare_0.5s_ease-out_forwards]" />}
    <div className="relative z-10">
      <h1 className="text-8xl font-cinzel mb-4">{status === 'won' ? 'You Have Escaped' : 'Your Soul is Mine'}</h1>
      <p className="text-2xl mb-8">
        {status === 'won'
          ? 'The Elixir of Release pacifies the spirit. The lock clicks open, and you are free.'
          : 'The presence consumes you. You are now part of the Great Work.'}
      </p>
      <button onClick={onRestart} className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-cinzel text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105">
        Play Again
      </button>
    </div>
  </div>
);


export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('intro');
  const [presence, setPresence] = useState(0);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [puzzleStates, setPuzzleStates] = useState<PuzzleState>({ orrery: 'unsolved', bookshelf: 'unsolved', cauldron: 'unsolved', graveyard_dash: 'unsolved' });
  const [activePuzzle, setActivePuzzle] = useState<PuzzleId | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const audioRefs = {
    bgm: useRef<HTMLAudioElement>(null),
    whispers: useRef<HTMLAudioElement>(null),
  };

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3900);
  }, []);

  const resetGame = useCallback(() => {
    setGameStatus('playing');
    setPresence(0);
    setInventory([]);
    setSelectedItem(null);
    setPuzzleStates({ orrery: 'unsolved', bookshelf: 'unsolved', cauldron: 'unsolved', graveyard_dash: 'unsolved' });
    setActivePuzzle(null);
    
    Object.values(audioRefs).forEach(ref => {
        if(ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
        }
    });
    
    setTimeout(() => {
       showMessage("The door slams shut. I'm trapped.");
       if (audioRefs.bgm.current) {
            audioRefs.bgm.current.volume = 0.3;
            audioRefs.bgm.current.play().catch(e => {});
       }
    }, 100);

  }, [audioRefs, showMessage]);

  const handleStart = () => {
    resetGame();
  };
  
  const increasePresence = useCallback((amount: number) => {
    setPresence(p => Math.min(p + amount, 100));
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const timer = setInterval(() => {
      increasePresence(100 / (60 * 5)); // 5 minutes timer
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus, increasePresence]);

  useEffect(() => {
    if (presence >= 100 && gameStatus === 'playing') {
      setGameStatus('lost');
    }
  }, [presence, gameStatus]);
  
  useEffect(() => {
    if (audioRefs.whispers.current) {
        if (presence > 25 && gameStatus === 'playing') {
            audioRefs.whispers.current.play().catch(e => {});
            audioRefs.whispers.current.volume = Math.min((presence - 25) / 75, 1);
        } else {
            audioRefs.whispers.current.pause();
        }
    }
  }, [presence, gameStatus, audioRefs.whispers]);

  const addItemToInventory = useCallback((itemId: string) => {
    setInventory(prev => {
      if (prev.find(i => i.id === itemId)) return prev;
      const item = ITEMS[itemId];
      if (item) {
        showMessage(`Picked up: ${item.name}`);
        return [...prev, item];
      }
      return prev;
    });
  }, [showMessage]);
  
  const handlePuzzleFail = useCallback(() => {
      increasePresence(10);
  }, [increasePresence]);

  const handleHotspotClick = (id: HotspotId) => {
    if (gameStatus !== 'playing') return;

    const hotspot = HOTSPOTS[id];
    
    if (selectedItem) {
        if (id === 'door' && selectedItem.id === 'elixir_release') {
             showMessage("The Elixir of Release pacifies the spirit. The lock clicks open, and you are free.");
             setGameStatus('won');
        } else if (hotspot.useItem === selectedItem.id) {
            if (id === 'cauldron' && puzzleStates.cauldron === 'unsolved') {
                setActivePuzzle('cauldron');
            } else {
                 showMessage(hotspot.successMessage || "It worked!");
            }
        } else {
            showMessage("That doesn't work here.");
            increasePresence(5);
        }
        setSelectedItem(null);
        return;
    }

    if (hotspot.puzzleId) {
        if (puzzleStates[hotspot.puzzleId] === 'unsolved') {
            setActivePuzzle(hotspot.puzzleId);
        } else {
            showMessage(hotspot.solvedMessage || "There's nothing more to do here.");
        }
    } else if (hotspot.itemId) {
        addItemToInventory(hotspot.itemId);
    } else {
        showMessage(hotspot.description);
    }
  };
  
  const handlePuzzleSolve = useCallback((id: PuzzleId) => {
      setPuzzleStates(prev => ({ ...prev, [id]: 'solved' }));
      setActivePuzzle(null);
      showMessage("A mechanism clicks! Something has been revealed.");
      if (id === 'orrery') {
          addItemToInventory('mortar');
      } else if (id === 'bookshelf') {
          addItemToInventory('crystal');
      } else if (id === 'graveyard_dash') {
          addItemToInventory('ghost_tears');
      }
  }, [addItemToInventory, showMessage]);

  const handleCauldronSolve = useCallback((success: boolean) => {
      if (success) {
          addItemToInventory('elixir_release');
          setPuzzleStates(prev => ({...prev, cauldron: 'solved_success'}));
          showMessage("You've brewed the Elixir of Release!");
      } else {
          setPuzzleStates(prev => ({...prev, cauldron: 'solved_failure'}));
          showMessage("The potion turns to sludge. A terrifying presence fills the room!");
          setPresence(100);
      }
      setActivePuzzle(null);
  }, [addItemToInventory, showMessage]);
  
  const onOrrerySolve = useCallback(() => handlePuzzleSolve('orrery'), [handlePuzzleSolve]);
  const onBookshelfSolve = useCallback(() => handlePuzzleSolve('bookshelf'), [handlePuzzleSolve]);
  const onGraveyardDashSolve = useCallback(() => handlePuzzleSolve('graveyard_dash'), [handlePuzzleSolve]);

  if (gameStatus === 'intro') {
    return <IntroScreen onStart={handleStart} />;
  }

  if (gameStatus === 'won' || gameStatus === 'lost') {
    return <EndScreen status={gameStatus} onRestart={resetGame} />;
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden select-none">
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes jumpscare {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1.15); opacity: 0.8; }
          }
          .hotspot-container:hover {
              box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.4);
              animation: pulse-glow 2s infinite ease-in-out;
          }
          @keyframes pulse-glow {
              0% { box-shadow: 0 0 5px 2px rgba(0, 255, 255, 0.2); }
              50% { box-shadow: 0 0 20px 8px rgba(0, 255, 255, 0.5); }
              100% { box-shadow: 0 0 5px 2px rgba(0, 255, 255, 0.2); }
          }
           @keyframes fade-in-out {
              0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
              15% { opacity: 1; transform: translateY(0px) translateX(-50%); }
              85% { opacity: 1; transform: translateY(0px) translateX(-50%); }
              100% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          }
        `}</style>
      <img src="/2.png" alt="Alchemist's Study" className="absolute inset-0 w-full h-full object-cover" />
      
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${presence > 75 ? 'opacity-40' : 'opacity-0'}`} />
      {presence > 85 && <div className="absolute inset-0 bg-red-900 opacity-20 animate-pulse" />}


      <PresenceMeter presence={presence} />

      {Object.entries(HOTSPOTS).map(([id, spot]) => (
        <Hotspot key={id} {...spot} id={id as HotspotId} onClick={handleHotspotClick} />
      ))}
      
      <Inventory 
        items={inventory} 
        selectedItem={selectedItem} 
        onSelectItem={setSelectedItem} 
      />

      <MessageDisplay message={message} />

      {activePuzzle && (
        <PuzzleModal title={HOTSPOTS[activePuzzle as HotspotId]?.name || "Puzzle"} onClose={() => setActivePuzzle(null)}>
            {activePuzzle === 'orrery' && <OrreryPuzzle onSolve={onOrrerySolve} onFail={handlePuzzleFail} />}
            {activePuzzle === 'bookshelf' && <BookshelfPuzzle onSolve={onBookshelfSolve} onFail={handlePuzzleFail} />}
            {activePuzzle === 'cauldron' && <CauldronPuzzle onSolve={handleCauldronSolve} inventory={inventory} />}
            {activePuzzle === 'graveyard_dash' && <GraveyardDashPuzzle onSolve={onGraveyardDashSolve} onFail={handlePuzzleFail} />}
        </PuzzleModal>
      )}
      
      <audio ref={audioRefs.bgm} src="https://cdn.pixabay.com/audio/2022/11/18/audio_821815b225.mp3" loop />
      <audio ref={audioRefs.whispers} src="https://cdn.pixabay.com/audio/2023/10/02/audio_14502d68e4.mp3" loop />

    </main>
  );
}