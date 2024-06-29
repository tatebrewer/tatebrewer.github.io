let deck = [];
let playerHand = [];
let dealerHand = [];

const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
const values = [
    "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"
];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.value === "Ace") {
        return 11;
    } else if (["Jack", "Queen", "King"].includes(card.value)) {
        return 10;
    } else {
        return parseInt(card.value);
    }
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === "Ace").length;

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

function updateHands() {
    document.getElementById("player-hand").innerText = `Player: ${handToString(playerHand)} (${calculateHandValue(playerHand)})`;
    document.getElementById("dealer-hand").innerText = `Dealer: ${handToString(dealerHand)} (${calculateHandValue(dealerHand)})`;
}

function handToString(hand) {
    return hand.map(card => `${card.value} of ${card.suit}`).join(", ");
}

function hit() {
    playerHand.push(deck.pop());
    updateHands();
    checkGameOver();
}

function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateHands();
    checkGameOver(true);
}

function resetGame() {
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateHands();
    document.getElementById("game-status").innerText = "";
}

function checkGameOver(isStand = false) {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
        document.getElementById("game-status").innerText = "Player busts! Dealer wins!";
    } else if (dealerValue > 21) {
        document.getElementById("game-status").innerText = "Dealer busts! Player wins!";
    } else if (isStand) {
        if (playerValue > dealerValue) {
            document.getElementById("game-status").innerText = "Player wins!";
        } else if (playerValue < dealerValue) {
            document.getElementById("game-status").innerText = "Dealer wins!";
        } else {
            document.getElementById("game-status").innerText = "It's a tie!";
        }
    }
}

document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
document.getElementById("reset").addEventListener("click", resetGame);

resetGame();
