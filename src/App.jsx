import { useState } from "react"


export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <button key={move} onClick={() => jumpTo(move)} className="
                bg-blue-200 text-black
                m-1 px-3 py-1
                rounded-xl border-2 border-blue-300
                hover:scale-110 transition cursor-pointer
            ">
                {description}
            </button>
        )
    })

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            <h1 className="
                text-5xl font-extrabold text-blue-300
                mb-16 mt-12
            ">
                Tic Tac Toe
            </h1>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            <div className="text-white mt-4">
                <div className="grid grid-cols-2 gap-x-5">{moves}</div>
            </div>
        </div>
    )
}


function Board({xIsNext, squares, onPlay}) {
    function handleClick(index) {
        if (squares[index] || calculateWinner(squares)) return;
        const nextSquares = squares.slice();
        xIsNext ? nextSquares[index] = "X" : nextSquares[index] = "O";
        onPlay(nextSquares);
    }

    const result = calculateWinner(squares);
    let winningLine = [];
    const draw = checkDraw(squares);
    let status;

    if (result) {
        status = "Winner: " + result.winner;
        winningLine = result.line;
    } else if (draw){
        status = draw;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <div className="flex flex-col items-center">
            <div className="
                text-white font-bold
                mb-2
            ">
                {status}
            </div>
            <div className="grid grid-cols-3 border-2 border-white">
                {squares.map((value, index) => (
                    <Square key={index} value={value} onSquareClick={() => handleClick(index)} isWinning={winningLine.includes(index)}/>
                ))}
            </div>
        </div>
    )
}


function Square({value, onSquareClick, isWinning}) {
    return(
        <button onClick={onSquareClick} className={`
            w-20 h-20
            border-2 border-white 
            flex items-center justify-center
            text-4xl text-white font-bold
            ${isWinning ? "bg-green-700 hover:bg-green-700" : "hover:bg-gray-700"}
            cursor-pointer
        `}>
            {value}
        </button>
    )
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: [a, b, c],
            }
        }
    }
    return null;
}


function checkDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return null;
        }
    }
    return "Draw";
}
