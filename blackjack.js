let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let hidden = null

const suits = ['C', 'D', 'H', 'S'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');

const playerScoreSpan = document.getElementById('player-score');
const dealerScoreSpan = document.getElementById('dealer-score');

startButton.addEventListener('click', startGame);
hitButton.addEventListener('click', playerHit);
standButton.addEventListener('click', playerStand);

function createDeck() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push(value + '-' + suit);
        });
    });
    shuffleDeck();
}

function shuffleDeck() {
    deck = deck.sort(() => Math.random() - 0.5);
}

function startGame() {
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;

    hitButton.disabled = false;
    standButton.disabled = false;

    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    resultDiv.innerHTML = '';

    playerScoreSpan.textContent = playerScore;

    createDeck();

    
    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    displayCards();

    if (dealerScore == 21) {
        resultDiv.innerHTML = 'Dealer wins!';
        disableButtons()
    }
}

function displayCards() {
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    playerHand.forEach(card => {
        const cardImage = document.createElement('img');
        cardImage.src = `cards/${card}.png`;
        playerCardsDiv.appendChild(cardImage);
    });

    dealerHand.forEach((card, index) => {
        const cardImage = document.createElement('img');
        if (index === 0 && dealerHand.length > 1) {
            
            hidden = card;
            cardImage.src = `cards/back.png`;
        } else {
            cardImage.src = `cards/${card}.png`;
        }
        dealerCardsDiv.appendChild(cardImage);
    });

    calculateScores();
}

function calculateScores() {
    playerScore = calculateHandScore(playerHand);
    dealerScore = calculateHandScore(dealerHand);

    playerScoreSpan.textContent = playerScore;
    dealerScoreSpan.textContent = dealerScore;

    if (playerScore > 21) {
        resultDiv.innerHTML = 'You busted! Dealer wins!';
        disableButtons();
    } else if (dealerScore > 21) {
        resultDiv.innerHTML = 'Dealer busted! You win!';
        disableButtons();
    }
}

function calculateHandScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach(card => {
        const value = card.split('-')[0];
        if (value === 'A') {
            score += 11;
            aceCount++;
        } else if (['K', 'Q', 'J'].includes(value)) {
            score += 10;
        } else {
            score += parseInt(value);
        }
    });

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

function playerHit() {
    playerHand.push(deck.pop());
    displayCards();
}

function playerStand() {
    dealerPlay();
}

function dealerPlay() {
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        displayCards();
    }

    if (dealerScore > 21) {
        resultDiv.innerHTML = 'Dealer busted! You win!';
    } else if (dealerScore > playerScore) {
        resultDiv.innerHTML = 'Dealer wins!';
    } else if (dealerScore < playerScore) {
        resultDiv.innerHTML = 'You win!';
    } else {
        resultDiv.innerHTML = 'It\'s a tie!';
    }

    disableButtons();
}

function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
    dealerScoreSpan.textContent = dealerScore;
}
