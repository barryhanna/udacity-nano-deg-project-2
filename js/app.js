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

var openCards = [];

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
    
    // reset 3 moves and stars
    document.getElementsByClassName("moves")[0].innerText = 3;
    const stars = `<li><i class="fa fa-star"></i></li>
                   <li><i class="fa fa-star"></i></li>
                   <li><i class="fa fa-star"></i></li>`;
    document.getElementsByClassName("stars")[0].innerHTML = stars;
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
        card.addEventListener("click", cardClick);
    }
}

function cardClick(event) {
    event.target.classList.add("open");
    event.target.classList.add("show");
    checkMatch(event.target);
}

 /*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 */

function hideOpenCards(card) {
    for(card of openCards) {
        card.classList.remove("show");
        card.classList.remove("open");
    }
}

function checkMatch(card) {
    // if there are no cards on the open list,
    // return false after adding the open card to the list.
    const cardTemplate = `${card.firstChild.getAttribute("class")} added to open card list.`;
    if(openCards.length < 1) {
        addToOpenCardList(card);
        console.log(cardTemplate);
    } else {
        // if the same card is clicked then just ignore.
        if(openCards[0] === card) {
            return;
        }
        addToOpenCardList(card);
        console.log(cardTemplate);
        if(openCards[0].firstChild.getAttribute("class") ===                        openCards[1].firstChild.getAttribute("class")) {
            console.log("Match");
            cardsMatched();
            removeMatchedEventListeners();
            clearOpenCardList();
            return true;
        } else {
            console.log("No match");
            hideOpenCards(card);
            clearOpenCardList();
            removeMoveStar();
            return false;
        }
    }
}

function removeMatchedEventListeners() {
    openCards[0].removeEventListener("click", cardClick);
    openCards[1].removeEventListener("click", cardClick);
}

function clearOpenCardList() {
    while(openCards.pop()) { }
}

function addToOpenCardList(card) {
    openCards.push(card);
}

function cardsMatched() {
    openCards[0].classList.add("match");
    openCards[1].classList.add("match");
}

function removeMoveStar() {
    const starList = document.getElementsByClassName("stars")[0];
    // don't remove if there are no more moves.
    if(starList.childElementCount < 1) { return; }
    starList.removeChild(starList.firstElementChild);
    
    let moves = document.getElementsByClassName("moves")[0].innerText.toString();
    moves -= 1;
    document.getElementsByClassName("moves")[0].innerText = moves;
}

 
/* *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
