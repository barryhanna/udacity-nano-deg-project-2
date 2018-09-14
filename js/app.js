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
      

var deck = [DIAMOND, PLANE, ANCHOR, BOLT, CUBE, BICYCLE, LEAF, BOMB,
            DIAMOND, PLANE, ANCHOR, BOLT, CUBE, BICYCLE, LEAF, BOMB];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


function generateDeck() {
    deck = shuffle(deck);
    let deckDisplay = document.getElementsByClassName("deck")[0];
    let deckHTML = "";

    while(deckDisplay.firstChild) {
        deckDisplay.removeChild(deckDisplay.firstChild);
    }

    for(const card of deck) {
        deckHTML += `<li class="card"><i class="fa ${card}"></i></li>`;
    }

    deckDisplay.innerHTML = deckHTML;
    addCardEventListeners();
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
 *  - display the card's symbol (put this functionality in another function that you call from this one) */

document.getElementsByClassName("restart")[0].addEventListener("click", generateDeck);

function addCardEventListeners() {
    let cards = document.querySelectorAll(".card");
    for(const card of cards) {
        console.log("Click event: " + card);
        card.addEventListener("click", cardClick);
    }
}

function cardClick(event) {
    console.log("Click event: " + event.target);
    event.target.classList.add("open");
    event.target.classList.add("show");
}

 /*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
