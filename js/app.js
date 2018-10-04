/*
 * Create a list that holds all of your cards
 */

const DIAMOND = "fa-diamond",
      PLANE   = "fa-paper-plane-o",
      ANCHOR  = "fa-anchor",
      BOLT    = "fa-bolt",
      CUBE    = "fa-cube",
      BICYCLE = "fa-bicycle",
      LEAF    = "fa-leaf",
      BOMB    = "fa-bomb";

let openCards = [];

let deck = [DIAMOND, PLANE, ANCHOR, BOLT, CUBE, BICYCLE, LEAF, BOMB,
            DIAMOND, PLANE, ANCHOR, BOLT, CUBE, BICYCLE, LEAF, BOMB];

let totalMovesMade = 0;

// star ratings for performance, based on the number of moves
// made.

const PERF_GOLD = 3;
const PERF_SILVER = 2;
const PERF_BRONZE = 1;

// the player's current performance rating. Begins at 3 stars
// will go to silver if moves over 20, and bronze if over 30.
let playerPerformance = PERF_GOLD;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *   - starts the game timer.
 */
function generateDeck() {
    // avoid creating new timers
    stopTimer();
    deck = shuffle(deck);
    let deckDisplay = document.getElementsByClassName("deck")[0];
    let deckHTML = "";

    // remove current cards.
    while(deckDisplay.firstChild) {
        deckDisplay.removeChild(deckDisplay.firstChild);
    }

    // generate li items from shuffled deck
    for(const card of deck) {
        deckHTML += `<li class="card"><i class="fa ${card}"></i></li>`;
    }

    // update DOM
    deckDisplay.innerHTML = deckHTML;
    
    addCardEventListeners();
    
    // reset moves and stars
    document.getElementsByClassName("moves")[0].innerText = 0;
    const stars = `<li><i class="fa fa-star"></i></li>
                   <li><i class="fa fa-star"></i></li>
                   <li><i class="fa fa-star"></i></li>`;
    document.getElementsByClassName("stars")[0].innerHTML = stars;
    totalMovesMade = 0;
    openCards = [];
    startTimer();
}

generateDeck();



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one) 
 */

document.getElementsByClassName("restart")[0].addEventListener("click", generateDeck);

/*
* Add event listeners for all cards.
*/
function addCardEventListeners() {
    let cards = document.querySelectorAll(".card");
    for(const card of cards) {
        // only add listeners to cards that haven't 
        // been matched.
        if(!card.classList.contains("match")) {
            card.addEventListener("click", cardClick);
        }
    }
}

/*
* Checks if the game is over. This is determined by checking 
* if there are 16 elements with the ".match" class. 
*/
function isGameOver() {
    // matched cards should be 16.
    const numMatchedCards = document.querySelectorAll(".match").length;
    if(numMatchedCards < 16) { 
        return false; 
    } else {
        return true;
    }
}

var timer;

/*
* Start the timer (interval of 1000=1s). This will
* continue to update the timer on the screen.
* TODO: fix to display for minutes if seconds > 59.
*/
function startTimer() {
    let timeElement = document.getElementById("time");
    let seconds = 0;
    timer = setInterval(function() {
        seconds += 1;
        timeElement.innerText = seconds;
    },1000);
}

/*
* Stop timer
*/
function stopTimer() {
    clearInterval(timer);
}

/*
* Card click event. 
* Adds the open and show classes to the clicked card.
* With each click, the user's moves, performance, and stars 
* are updated.
* Also checks if the game is over, if it is then
* the timer is stopped and the game over screen is displayed.
*/
function cardClick(event) {
    
    let card = event.currentTarget;
    
    // if the same card is clicked, then just ignore.
    if(card.classList.contains("open")) {
        return;
    }
    openCards.push(card);
    card.classList.add("open","show");
    totalMovesMade++;
    
    
    if(openCards.length === 1) {
        return;
    }
    if(openCards.length > 1) {
        removeEventListeners();
        if(cardsMatch(openCards[0],openCards[1])) {
            cardsMatched();
        } else {
            openCards[0].classList.add("remove");
            openCards[1].classList.add("remove");
        }
        setTimeout(hideOpenCards,500);
        openCards = [];
        
    }
    updateMoves();
    updatePerformance();
    updateStars();
    
    if(isGameOver()) {
        stopTimer();
        openGameOverScreen();
    }
}

function removeEventListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(function(card) {
        card.removeEventListener("click",cardClick);
    });
}

 /*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 */
function hideOpenCards() {
    const toClose = document.querySelectorAll(".remove");
    toClose.forEach(function(card) {
        console.log("Removing " + card);
        card.classList.remove("show");
        card.classList.remove("open");
        card.classList.remove("remove");
    });
    addCardEventListeners();
}

/*
* Check if the given cards match (by the classname they have).
* Returns true or false.
*/
function cardsMatch(cardOne, cardTwo) {
    if(cardOne.firstChild.getAttribute("class") === cardTwo.firstChild.getAttribute("class")) {
        return true;
    }
    return false;
}

/*
* When cards have been matched, the event listeners are
* removed to prevent further events being generated.
*/
function removeMatchedEventListeners() {
    openCards[0].removeEventListener("click", cardClick);
    openCards[1].removeEventListener("click", cardClick);
}

/*
* Add the "match" class to cards that have been matched.
*/
function cardsMatched() {
    openCards[0].classList.add("match");
    openCards[1].classList.add("match");
}

/*
* Add to the moves made.
*/
function updatePerformance() {
    // based upon the number of moves
    // update the number of stars shown
    if(totalMovesMade > 19 && totalMovesMade < 30) {
        playerPerformance = PERF_SILVER;
    } else if(totalMovesMade >= 30) {
        playerPerformance = PERF_BRONZE;
    }
}

/*
* Add to the moves made displayed on screen.
*/
function updateMoves() {
    document.getElementsByClassName("moves")[0].innerText = totalMovesMade;
}

/*
* Updates the stars displayed for the player's performance.
*/
function updateStars() {
    let starList = document.getElementsByClassName("stars")[0];
    const numStars = starList.childElementCount;
    if(numStars === PERF_GOLD && playerPerformance < PERF_GOLD) {
       starList.removeChild(starList.firstElementChild); 
    } else if(numStars === PERF_SILVER && playerPerformance < PERF_SILVER) {
        starList.removeChild(starList.firstElementChild); 
    }
}

var gameOverScreen = document.getElementById('gameOverScreen');
var closeBtn = document.getElementsByClassName('close-btn')[0];

/*
* Update the elements of the game over screen with the 
* latest information.
*/
function updateGameOverScreen() {
    const star = '<i class="fa fa-star"></i>';
    if(playerPerformance === PERF_GOLD) {
        document.getElementsByClassName("game-perf")[0].innerHTML = `${star}${star}${star}`;
    } else if(playerPerformance === PERF_SILVER) {
        document.getElementsByClassName("game-perf")[0].innerHTML = `${star}${star}`;
    } else {
        document.getElementsByClassName("game-perf")[0].innerHTML = `${star}`;
    }
    document.getElementsByClassName("game-time")[0].innerText = document.getElementById("time").innerText;
}

/*
* Show the game over screen.
*/
function openGameOverScreen() {
    updateGameOverScreen();
	gameOverScreen.style.display = "block";
}

closeBtn.addEventListener('click', closeGameOverScreen);

/*
* Hides the game over screen and starts a new game.
*/
function closeGameOverScreen() {
	gameOverScreen.style.display = "none";
    generateDeck();
}

window.addEventListener('click', clickOutside);

/*
* When clicking outside the game over screen
*/
function clickOutside(e) {
	if(e.target === gameOverScreen) {
		gameOverScreen.style.display = "none";
        generateDeck();
	}
}

/*
 * Game over screen's play again button
 */
const button  = document.getElementById("play-again");
button.addEventListener("click", function() {
    gameOverScreen.style.display = "none";
        generateDeck();
});