// משתנים כלליים
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let boardLocked = false;

let numberOfPairs = 6;
let flipDelay = 2000;

// הגדרת דרגת קושי
function setDifficulty(level) {
    switch(level) {
        case "children":
            numberOfPairs = 6; flipDelay = 2000; break;
        case "medium":
            numberOfPairs = 12; flipDelay = 1500; break;
        case "expert":
            numberOfPairs = 16; flipDelay = 1000; break;
    }
    startNewGame();
}

// הכנה וערבוב קלפים
function setupCards() {
    cards = [];
    for (let i = 1; i <= numberOfPairs; i++) {
        cards.push(i, i);
    }
    shuffleCards();
}

// ערבוב אקראי
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// התחלת משחק חדש
function startNewGame() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    boardLocked = false;
    setupCards();
    renderBoard();
    updateInfo();
}

// הצגת הלוח
function renderBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    const columns = Math.min(8, Math.ceil(Math.sqrt(cards.length))); // גודל לוח מותאם
    board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

    cards.forEach((card, index) => {
        const div = document.createElement("div");
        div.className = "card";
        div.dataset.index = index;
        div.textContent = "";
        div.addEventListener("click", () => flipCard(index, div));
        board.appendChild(div);
    });
}

// עדכון מידע
function updateInfo() {
    document.getElementById("info").textContent =
        `ניסיונות: ${attempts} | זוגות נמצאו: ${matchedPairs}/${numberOfPairs}`;
}

// הפיכת קלף ובדיקת התאמה
function flipCard(index, divElement) {
    if (boardLocked || flippedCards.includes(index) || divElement.classList.contains("matched")) return;

    divElement.classList.add("flipped");
    divElement.textContent = cards[index];
    flippedCards.push({index, divElement});

    if (flippedCards.length === 2) {
        boardLocked = true;
        attempts++;

        const [first, second] = flippedCards;
        if (cards[first.index] === cards[second.index]) {
            first.divElement.classList.add("matched");
            second.divElement.classList.add("matched");
            matchedPairs++;
            flippedCards = [];
            boardLocked = false;
            updateInfo();

            if (matchedPairs === numberOfPairs) {
                setTimeout(() => {
                    alert("המשחק נגמר! מתחילים משחק חדש עבור השחקן הבא.");
                    startNewGame();
                }, 500);
            }
        } else {
            setTimeout(() => {
                first.divElement.classList.remove("flipped");
                first.divElement.textContent = "";
                second.divElement.classList.remove("flipped");
                second.divElement.textContent = "";
                flippedCards = [];
                boardLocked = false;
                updateInfo();
            }, flipDelay);
        }
    }
    updateInfo();
}

// אתחול ראשוני
setDifficulty("children");
