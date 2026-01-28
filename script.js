const cardsArray = [
    { name: 'rocket', icon: '🚀' },
    { name: 'alien', icon: '👽' },
    { name: 'planet', icon: '🪐' },
    { name: 'comet', icon: '☄️' },
    { name: 'telescope', icon: '🔭' },
    { name: 'satellite', icon: '🛰️' },
    { name: 'star', icon: '🌟' },
    { name: 'astronaut', icon: '👨‍🚀' },
];

const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');
const modal = document.getElementById('game-over-modal');
const finalMovesElement = document.getElementById('final-moves');
const finalTimeElement = document.getElementById('final-time');
const playAgainBtn = document.getElementById('play-again-btn');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let time = 0;
let timerInterval;
let matchesFound = 0;
const totalPairs = cardsArray.length;

// Duplicate array to create pairs
let gameDeck = [...cardsArray, ...cardsArray];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(gameDeck);
    
    gameDeck.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = item.name;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = item.icon;

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        
        card.appendChild(frontFace);
        card.appendChild(backFace);
        
        gameBoard.appendChild(card);
        card.addEventListener('click', flipCard);
        cards.push(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        
        if (moves === 0 && time === 0) {
            startTimer();
        }
        return;
    }

    // Second click
    secondCard = this;
    incrementMoves();
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // It's a match!
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Add a glow effect or specific style for matched cards if desired
    // For now we rely on them staying face up
    
    matchesFound++;
    resetBoard();
    
    if (matchesFound === totalPairs) {
        endGame();
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function incrementMoves() {
    moves++;
    movesElement.innerText = moves;
}

function startTimer() {
    clearInterval(timerInterval);
    time = 0;
    timeElement.innerText = '00:00';
    
    timerInterval = setInterval(() => {
        time++;
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        timeElement.innerText = `${minutes}:${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function endGame() {
    stopTimer();
    finalMovesElement.innerText = moves;
    finalTimeElement.innerText = timeElement.innerText;
    
    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 500);
}

function restartGame() {
    modal.classList.add('hidden');
    cards = [];
    moves = 0;
    matchesFound = 0;
    movesElement.innerText = '0';
    timeElement.innerText = '00:00';
    stopTimer();
    
    // Reset internal state
    resetBoard();
    
    createBoard();
}

// Event Listeners
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

// Initialize
createBoard();
