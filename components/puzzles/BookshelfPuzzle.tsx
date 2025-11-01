
import React, { useState } from 'react';

interface BookshelfPuzzleProps {
  onSolve: () => void;
  onFail: () => void;
}

const BOOKS = [
  { name: 'Lead', weight: 10 },
  { name: 'Tin', weight: 4 },
  { name: 'Iron', weight: 6 },
  { name: 'Silver', weight: 7 },
  { name: 'Copper', weight: 5 },
  { name: 'Gold', weight: 13 },
];
const SOLUTION_WEIGHT = 30; // Lead (10) + Silver (7) + Gold (13)

const BookshelfPuzzle: React.FC<BookshelfPuzzleProps> = ({ onSolve, onFail }) => {
  const [placedBooks, setPlacedBooks] = useState<typeof BOOKS>([]);

  const toggleBook = (book: typeof BOOKS[0]) => {
    setPlacedBooks(prev => 
      prev.find(b => b.name === book.name) 
      ? prev.filter(b => b.name !== book.name) 
      : [...prev, book]
    );
  };

  const currentWeight = placedBooks.reduce((acc, book) => acc + book.weight, 0);

  const checkSolution = () => {
    const sortedNames = placedBooks.map(b => b.name).sort();
    if (
      sortedNames.length === 3 &&
      sortedNames[0] === 'Gold' &&
      sortedNames[1] === 'Lead' &&
      sortedNames[2] === 'Silver' &&
      currentWeight === SOLUTION_WEIGHT
    ) {
      onSolve();
    } else {
      onFail();
      alert("The scales groan but nothing happens. The balance is wrong.");
    }
  };

  return (
    <div className="text-center">
      <p className="mb-4 text-gray-300">A note on the desk reads: "My knowledge is balanced by Lead, Silver, and Gold." Place the correct books on the scales.</p>
      <div className="flex justify-between items-start mb-4">
        <div className="w-1/3">
          <h3 className="font-cinzel text-xl mb-2">Books</h3>
          <div className="space-y-2">
            {BOOKS.map(book => (
              <button 
                key={book.name}
                onClick={() => toggleBook(book)}
                disabled={placedBooks.find(b => b.name === book.name) !== undefined}
                className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:bg-gray-800 disabled:text-gray-500"
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-1/2 p-4 bg-gray-900 rounded-lg">
          <h3 className="font-cinzel text-xl mb-2">On the Scales</h3>
          <div className="min-h-[100px] border-2 border-dashed border-gray-600 rounded p-2">
             {placedBooks.length > 0 ? placedBooks.map(b => <div key={b.name}>{b.name}</div>) : <p className="text-gray-500">Empty</p>}
          </div>
          <p className="mt-2 text-lg">Current Weight: <span className={currentWeight === SOLUTION_WEIGHT ? 'text-green-400' : 'text-red-400'}>{currentWeight}</span> / {SOLUTION_WEIGHT}</p>
        </div>
      </div>
      <button onClick={checkSolution} className="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-cinzel rounded-lg">
        Check Balance
      </button>
    </div>
  );
};

export default BookshelfPuzzle;
