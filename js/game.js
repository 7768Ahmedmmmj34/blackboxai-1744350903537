// Game configuration
const TOTAL_PAIRS = 8;
const ICONS = [
    'fa-heart',
    'fa-star',
    'fa-moon',
    'fa-sun',
    'fa-cloud',
    'fa-tree',
    'fa-bell',
    'fa-gift'
];

// Game state
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isProcessing = false;

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const winModal = document.getElementById('winModal');
const finalTimeDisplay = document.getElementById('finalTime');
const finalMovesDisplay = document.getElementById('finalMoves');
const restartBtn = document.getElementById('restartBtn');

// Initialize game
function initializeGame() {
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    isProcessing = false;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';
    
    // Clear existing timer
    if (timer) clearInterval(timer);
    
    // Start new timer
    timer = setInterval(updateTimer, 1000);
    
    // Create and shuffle cards
    const cards = [...ICONS, ...ICONS];
    shuffleArray(cards);
    
    // Clear and create game board
    gameBoard.innerHTML = '';
    cards.forEach((icon, index) => {
        const card = createCard(icon, index);
        gameBoard.appendChild(card);
    });
}

// Create a card element
function createCard(icon, index) {
    const card = document.createElement('div');
    card.className = 'card relative w-full pb-[100%] cursor-pointer';
    card.dataset.icon = icon;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-front absolute bg-white rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas ${icon} text-3xl text-purple-600"></i>
        </div>
        <div class="card-back absolute bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-lg">
            <div class="absolute inset-2 bg-yellow-300 rounded-lg flex items-center justify-center">
                <i class="fas fa-question text-2xl text-yellow-600"></i>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}

// Handle card click
async function handleCardClick(card) {
    if (
        isProcessing || 
        flippedCards.length >= 2 || 
        card.classList.contains('flipped') ||
        card.classList.contains('matched')
    ) {
        return;
    }
    
    // Flip card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // If two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        isProcessing = true;
        
        const [card1, card2] = flippedCards;
        
        // Check for match
        if (card1.dataset.icon === card2.dataset.icon) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            // Check for win
            if (matchedPairs === TOTAL_PAIRS) {
                handleWin();
            }
        } else {
            // Wait and flip back
            await new Promise(resolve => setTimeout(resolve, 1000));
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        
        flippedCards = [];
        isProcessing = false;
    }
}

// Handle win condition
function handleWin() {
    clearInterval(timer);
    finalTimeDisplay.textContent = timerDisplay.textContent;
    finalMovesDisplay.textContent = moves;
    winModal.classList.remove('hidden');
    winModal.classList.add('flex');
}

// Update timer
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event Listeners
restartBtn.addEventListener('click', initializeGame);
winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
        winModal.classList.add('hidden');
        winModal.classList.remove('flex');
        initializeGame();
    }
});

// Start game on load
document.addEventListener('DOMContentLoaded', initializeGame);
