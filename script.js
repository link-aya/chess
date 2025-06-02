// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Initialize the chessboard
    const game = new Chess(); // Create new Chess.js game instance
    const moveHistory = document.getElementById('move-history'); // Get move history container
    let moveCount = 1; // Initialize the move count
    let userColor = 'w'; // Initialize the user's color as white

    // 🔧 PATCH TACTILE MOBILE
    const simulateMouseEvent = (event, simulatedType) => {
        if (event.touches.length > 1) return;

        const touch = event.changedTouches[0];
        const simulatedEvent = new MouseEvent(simulatedType, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY,
        });

        touch.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    };

    const enableTouchSupport = () => {
        const boardElement = document.getElementById('board');
        boardElement.addEventListener('touchstart', e => simulateMouseEvent(e, 'mousedown'), true);
        boardElement.addEventListener('touchmove', e => simulateMouseEvent(e, 'mousemove'), true);
        boardElement.addEventListener('touchend', e => simulateMouseEvent(e, 'mouseup'), true);
    };

    enableTouchSupport(); // Active la compatibilité tactile

    // Function to make a random move for the computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()) {
            alert("Échec et mat!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    // Function to record and display a move in the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.search(userColor) === 0;
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        if (move.flags.includes('c')) {
            moveSound.play();
        } else {
            moveSound.play();
        }

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        moveCount++;
    };

    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 300,
        snapBackSpeed: 200,
        snapSpeed: 150,
        appearSpeed: 200,
    };

    board = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        userColor = userColor === 'w' ? 'b' : 'w';
    });

    document.querySelector('.change-theme').addEventListener('click', () => {
        document.documentElement.style.setProperty('--white-square', '#ffe4e1');
        document.documentElement.style.setProperty('--black-square', '#6b5b95');
    });
});
