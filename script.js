let deck = [];
let playerHand = [];
let dealerHand = [];
let playerBalance = 100;

const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
const values = [
    "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"
];

// Function to create and shuffle the deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

// Function to get the value of a card
function getCardValue(card) {
    if (card.value === "Ace") {
        return 11;
    } else if (["Jack", "Queen", "King"].includes(card.value)) {
        return 10;
    } else {
        return parseInt(card.value);
    }
}

// Function to calculate the total value of a hand
function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === "Ace").length;

    // Adjust for Aces if the value exceeds 21
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

// Function to update the displayed hands
function updateHands() {
    document.getElementById("player-hand").innerText = `Player: ${handToString(playerHand)} (${calculateHandValue(playerHand)})`;
    document.getElementById("dealer-hand").innerText = `Dealer: ${handToString(dealerHand)} (${calculateHandValue(dealerHand)})`;
    document.getElementById("balance").innerText = `Balance: $${playerBalance}`;
}

// Function to convert a hand to a string
function handToString(hand) {
    return hand.map(card => `${card.value} of ${card.suit}`).join(", ");
}

// Function for the player to draw a card
function hit() {
    playerHand.push(deck.pop());
    updateHands();
    checkGameOver();
}

// Function for the dealer to draw cards until they reach at least 17
function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateHands();
    checkGameOver(true);
}

// Function to reset the game
function resetGame() {
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateHands();
    document.getElementById("game-status").innerText = "";
}

// Function to check if the game is over and determine the winner
function checkGameOver(isStand = false) {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    // Check if the player busts
    if (playerValue > 21) {
        document.getElementById("game-status").innerText = "Player busts! Dealer wins!";
        playerBalance -= 10; // Player loses $10
    } else if (dealerValue > 21) { // Check if the dealer busts
        document.getElementById("game-status").innerText = "Dealer busts! Player wins!";
        playerBalance += 10; // Player wins $10
    } else if (isStand) { // Check the result when the player stands
        if (playerValue > dealerValue) {
            document.getElementById("game-status").innerText = "Player wins!";
            playerBalance += 10; // Player wins $10
        } else if (playerValue < dealerValue) {
            document.getElementById("game-status").innerText = "Dealer wins!";
            playerBalance -= 10; // Player loses $10
        } else {
            document.getElementById("game-status").innerText = "It's a tie!";
        }
    }

    updateHands();
}

// Event listeners for the buttons
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
document.getElementById("reset").addEventListener("click", function() {
    resetGame();
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
});

// Initialize the game
resetGame();
