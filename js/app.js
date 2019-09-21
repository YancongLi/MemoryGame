/*
 * Create a list that holds all of your cards
 */
let listOfCards = [];
listOfCards = Array.from(document.querySelectorAll("li.card"));
let currentListOfCards = document.querySelectorAll("li.card");
let listOfOpenedCards = [];
let listOfMatchedCards = [];
let moveCounter = 0;
let totalSeconds = 0;
let firstClick = true;
let stars = document.querySelector(".stars");
let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", toggleModal);
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let timerInterval;

addEventListenerToRestart();
startGame();

function startGame() {
  //reset variables:
  listOfCards = Array.from(document.querySelectorAll("li.card"));
  currentListOfCards = document.querySelectorAll("li.card");
  listOfOpenedCards = [];
  listOfMatchedCards = [];
  moveCounter = 0;
  totalSeconds = 0;
  firstClick = true;
  minutesLabel.innerHTML = "00";
  secondsLabel.innerHTML = "00";
  let scoreDetail = document.getElementById("scoreDetails");
  if (scoreDetail) {
    document.querySelector(".modal-content").removeChild(scoreDetail);
  }
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  add3Stars();
  displayMoveCounterOnPage(moveCounter);
  hideAllCards();
  randomizeCards();
  addEventListenerToCards();
}

function add3Stars() {
  if (stars.childNodes.length != 3) {
    stars.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      let oneStar = document.createElement("li");
      oneStar.innerHTML = '<i class="fa fa-star"></i>';
      stars.appendChild(oneStar);
    }
  }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function randomizeCards() {
  let deck = document.querySelector(".deck");
  deck.innerHTML = "";
  const shuffledCards = shuffle(listOfCards);
  for (let i = 0; i < shuffledCards.length; i++) {
    deck.appendChild(shuffledCards[i]);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function addEventListenerToCards() {
  currentListOfCards.forEach(card => {
    card.addEventListener("click", displayCardSymbol);
  });
}

function displayCardSymbol() {
  let cardElement = this;

  if (firstClick) {
    firstClick = false;
    timerInterval = setInterval(setTime, 1000);
  }

  if (cardElement.classList.contains("open")) {
    //Do nothing if the card's opened already
    return;
  }

  cardElement.classList.add("open");
  cardElement.classList.add("show");

  if (listOfOpenedCards.length == 0) {
    listOfOpenedCards.push(cardElement);
  } else {
    let anotherCard = listOfOpenedCards[0];

    setTimeout(() => {
      if (cardElement.isEqualNode(anotherCard)) {
        lockCardsInOpenPosition(cardElement);
        lockCardsInOpenPosition(anotherCard);
        listOfMatchedCards.push(cardElement);
        listOfMatchedCards.push(anotherCard);

        if (allCardsMatched(listOfCards)) {
          let tempScore = moveCounter++;
          displayFinalScore(tempScore);
        }
      } else {
        hideCardSymbol(cardElement);
        hideCardSymbol(anotherCard);
      }
      listOfOpenedCards = [];
    }, 300);
  }
  moveCounter++;
  displayMoveCounterOnPage(moveCounter);
  if (moveCounter === 40) {
    stars.removeChild(stars.childNodes[0]);
  } else if (moveCounter === 50) {
    stars.removeChild(stars.childNodes[0]);
  }
}

function hideAllCards() {
  currentListOfCards.forEach(card => {
    card.classList.remove("open");
    card.classList.remove("show");
    card.classList.remove("match");
  });
}

function hideCardSymbol(cardElement) {
  cardElement.classList.remove("open");
  cardElement.classList.remove("show");
}

function lockCardsInOpenPosition(cardElement) {
  hideCardSymbol(cardElement);
  cardElement.classList.add("match");
}

function allCardsMatched() {
  return listOfMatchedCards.length == listOfCards.length;
}

function displayMoveCounterOnPage(score) {
  let moveElement = document.querySelector(".moves");
  moveElement.textContent = score;
}

function displayFinalScore(score) {
  let modelContent = document.querySelector(".modal-content");
  addScoreDetails(modelContent);
  toggleModal();
  addEventListenerToRestartBtnInModal();
  firstClick = true;
}

function addScoreDetails(modelContent) {
  let scoreDetail = document.createElement("div");
  scoreDetail.setAttribute("id", "scoreDetails");

  let timeContent = document.createElement("h1");
  timeContent.innerText = "You took " + totalSeconds + " seconds to win!";
  scoreDetail.appendChild(timeContent);
  let startsContent = document.createElement("h1");
  let starText = stars.childNodes.length > 1 ? " starts!" : " star!";
  startsContent.innerText = "You got " + stars.childNodes.length + starText;
  scoreDetail.appendChild(startsContent);
  let restartContent = document.createElement("div");
  restartContent.innerHTML = '<div class="restartInModal"><h1>Restart Game: <i class="fa fa-repeat"></i></h1></div>';
  scoreDetail.appendChild(restartContent);

  modelContent.appendChild(scoreDetail);
}

function addEventListenerToRestartBtnInModal() {
  let restartBtnInModal = document.querySelector(".restartInModal");
  restartBtnInModal.addEventListener("click", startGame);
  restartBtnInModal.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });
}

function addEventListenerToRestart() {
  let restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });
}

function toggleModal() {
  modal.classList.toggle("show-modal");
}

//From: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function setTime() {
  if (firstClick) {
    return;
  }
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}