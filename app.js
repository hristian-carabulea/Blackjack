/* index.js v2021.10.05a Hristian
- refactored the code v1: using arrays.
- refactored the code v2: using processPlayedCard function.
- refactored the code v3: unified win, lose, or tie code
- changed from points to the mighty $$$
- using parsInt() to ensure integers for adding wins and subracting losses
- add word BLACKJACK if sum for player or house is 21
*/
var playerWon = false
var houseWon = false
var gameIsADraw = false
var gameStatus = [playerWon, houseWon, gameIsADraw]

var playerCards = [], houseCards = [], playerCardsValue = [], houseCardsValue = []
var hasBlackjack 
var isAlive
var gameStarted = false
var message 
var min, max
var cardsPlayed, cardsArray, cardsValueArray
//var firstCard, secondCard, thirdCard , firstCardValue, secondCardValue, thirdCardValue
//var firstHouseCard, secondCardHouse, thirdHouseCard
//var firstHouseCardValue, secondCardHouseValue, thirdHouseCardValue
var sum, sumHouse

var playerBetEl = 0, parsedPlayerBetEl = 0
var gameScoreEl = document.getElementById("gameScore-el"), availablePlayerMoney = 1000, gameScorePlayer = 0, gameScoreHouse = 0

var messageEl, sumEl, sumHouseEl, cardsEl, cardsHouseEl, newCardEl

var imgCard1 = document.createElement("img");
var imgCard2 = document.createElement("img");
var imgCard3 = document.createElement("img");
var playerCardsImages = [imgCard1, imgCard2, imgCard3]

var imgHouseCard1 = document.createElement("img");
var imgHouseCard2 = document.createElement("img");
var imgHouseCard3 = document.createElement("img");
var houseCardsImages = [imgHouseCard1, imgHouseCard2, imgHouseCard3]

var card1Display = document.getElementById("card1Display-el"); // appendChild(img)
var card2Display = document.getElementById("card2Display-el"); // appendChild(img)
var card3Display = document.getElementById("card3Display-el"); // appendChild(img)

var card1HouseDisplay = document.getElementById("card1HouseDisplay-el"); // appendChild(img)
var card2HouseDisplay = document.getElementById("card2HouseDisplay-el"); // appendChild(img)
var card3HouseDisplay = document.getElementById("card3HouseDisplay-el"); // appendChild(img)

function savePlayerBet() { // 

    console.log("\ninside function savePlayerBet =========================")
    entryCorrect = false
    playerBetEl = document.getElementById("playerBet-el").value
    messageEl = document.getElementById("message-el");

    parsedPlayerBetEl = parseInt(playerBetEl)
    if (isNaN(parsedPlayerBetEl)) {
        message = "Enter your bet!"
        messageEl.innerText = message
    }
    else if (parsedPlayerBetEl <= 0) {
        message = "Enter a bet greater than zero!"
        messageEl.innerText = message
        console.log(message)
    }
    else if (availablePlayerMoney < parsedPlayerBetEl){
        message = "Enter a bet that fits your funds!"
        messageEl.innerText = message
        console.log(message)
    }
    else {
        entryCorrect = true
    }
    console.log("Player bet: " + parsedPlayerBetEl + ". Message: " + message)

}

function startGame() { // triggered by clicking on Play button

    console.log("gameStatus: " + gameStatus[0] + ", " + gameStatus[1] + ", " + gameStatus[2])

    console.log("\ninside function startGame =========================")
    savePlayerBet()
    if (entryCorrect == true && gameStarted == false) {
        initalizeVars();
        buildCardArrays();
// player first two Cards section
        if (availablePlayerMoney <= 0) {
            message = "You ran out of money!"
            gameStarted = true
            isAlive = false
            console.log(message)
            gameScoreEl.innerText = "Blackjack " + "$ " + availablePlayerMoney// + " - " + gameScoreHouse
            messageEl.innerText = message;
        }
        else {
            sum = 0
            for (count = 0; count < 2; count++) { // get first two player cards and its values
                playerCards[count] = getCard()
                console.log("player card " + count+1 + " : " + playerCards[count])
                playerCardsValue[count] = returnCardValue(playerCards[count])
                if (playerCardsValue[count] == 12 || playerCardsValue[count] == 13 || playerCardsValue[count] == 14) {
                    playerCardsValue[count] = 10;
                }
                console.log("player card " + count+1 + " value: " + playerCardsValue[count])
                playerCardsImages[count] = returnCardImage(playerCards[count]) // get card's pic
                sum += playerCardsValue[count]
            }
            if (sum > 21 && (playerCardsValue[0] == 11 || playerCardsValue[1] == 11)) { // set values of an ace to one if sum over 21
                sum = sum - 10
            }
            console.log("Sum: " + sum)
            cardsEl.innerText = "Your cards: " + playerCardsValue[0] + " + " + playerCardsValue[1] + " = " + sum;
            if (sum == 21) {
                cardsEl.innerText += " BLACKJACK"
            }
            card1Display.appendChild(playerCardsImages[0]); // display Card 1 pic
            card2Display.appendChild(playerCardsImages[1]); // display Card 1 pic

    // house first two Cards section
            sumHouse = 0
            for (count = 0; count < 2; count++) { // get first two player cards and its values
                houseCards[count] = getCard()
                console.log("house card " + count+1 + " : " + houseCards[count])
                houseCardsValue[count] = returnCardValue(houseCards[count])
                if (houseCardsValue[count] == 12 || houseCardsValue[count] == 13 || houseCardsValue[count] == 14) {
                    houseCardsValue[count] = 10;
                }
                console.log("house card " + count+1 + " value: " + houseCardsValue[count])
                houseCardsImages[count] = returnCardImage(houseCards[count]) // get card's pic
                sumHouse += houseCardsValue[count]
            }
            if (sumHouse > 21 && (houseCardsValue[0] == 11 || houseCardsValue[1] == 11)) {
                sumHouse = sumHouse - 10
            }
            console.log("Sum House: " + sumHouse)
            cardsHouseEl.innerText = "House cards: " + houseCardsValue[0] + " + " + houseCardsValue[1] + " = " + sumHouse;
            if (sumHouse == 21) {
                cardsHouseEl.innerText += " BLACKJACK"
            }
            card1HouseDisplay.appendChild(houseCardsImages[0]); // display House Card 1 pic
            card2HouseDisplay.appendChild(houseCardsImages[1]); // display HouseCard 1 pic
            
            if (sum < 21 && sumHouse < 21)  {
                message = "Want to draw a new card?"
                // gameStarted = true
                console.log(message)
                gameScoreEl.innerText = "Blackjack " + "$" + availablePlayerMoney// + " - " + gameScoreHouse
                messageEl.innerText = message;
            }
            else {
                processPlayedCards()
            }
        }
    }
} // end startGame()

function initalizeVars() {

    console.log("\ninside function initalizeVars =========================")
    gameStarted = true

    gameWon = false
    gameLost = false
    gameIsADraw = false    

    min = 0
    max = 51
    cardsPlayed = new Set()
    cardsArray = new Array();
    cardsValueArray = new Array();
    for (i=0; i<3; i++) {
        playerCardsImages[i].src = ""
        houseCardsImages[i].src = ""
    }
    playerCards = [0,0,0];
    houseCards = [0,0,0];
    playerCardsValue = [0,0,0];
    houseCardsValue = [0,0,0];
    cardsPlayed.clear(); // empty the set of previously played cards
    console.log("cardsPlayed set after being cleared: ")
    for (const x of cardsPlayed.values()) {
        console.log(x + " ")
    }
    sum = 0
    sumHouse = 0
    hasBlackjack = false
    isAlive = true
    message = ""
    cardsEl = document.getElementById("cards-el");
    sumEl = document.getElementById("sum-el");
    messageEl = document.getElementById("message-el");
    newCardEl = document.getElementById("newCard-el");
    cardsHouseEl = document.getElementById("cardsHouse-el");
    sumHouseEl = document.getElementById("sumHouse-el");
    cardsEl.innerText = " "
    messageEl.innerText = "Click on PLAY to begin";
    cardsHouseEl.innerText = " "
} // end initalizeVars()

function buildCardArrays() { // store cards pictures in cardsArray, and card values in cardsValueArray
    
    console.log("\ninside function buildCardArrays =========================")
    cardsArray[0] = document.createElement("img");
    cardsArray[0].src = "setOfCards52/1.png" // 1 Ace of hearts
    cardsArray[1] = document.createElement("img");
    cardsArray[1].src = "setOfCards52/2.png" // 2 of hearts
    cardsArray[2] = document.createElement("img");
    cardsArray[2].src = "setOfCards52/3.png" // 3 of hearts
    cardsArray[3] = document.createElement("img");
    cardsArray[3].src = "setOfCards52/4.png" // 4 of hearts
    cardsArray[4] = document.createElement("img");
    cardsArray[4].src = "setOfCards52/5.png" // 5 of hearts
    cardsArray[5] = document.createElement("img");
    cardsArray[5].src = "setOfCards52/6.png" // 6 of hearts
    cardsArray[6] = document.createElement("img");
    cardsArray[6].src = "setOfCards52/7.png" // 7 of hearts
    cardsArray[7] = document.createElement("img");
    cardsArray[7].src = "setOfCards52/8.png" // 8 of hearts
    cardsArray[8] = document.createElement("img");
    cardsArray[8].src = "setOfCards52/9.png" // 9 of hearts
    cardsArray[9] = document.createElement("img");
    cardsArray[9].src = "setOfCards52/10.png" // 10 of hearts
    cardsArray[10] = document.createElement("img");
    cardsArray[10].src = "setOfCards52/11.png" // 12 jack of hearts
    cardsArray[11] = document.createElement("img");
    cardsArray[11].src = "setOfCards52/12.png" // 13 queen of hearts
    cardsArray[12] = document.createElement("img");
    cardsArray[12].src = "setOfCards52/13.png" // 14 king of hearts
    cardsArray[13] = document.createElement("img");
    cardsArray[13].src = "setOfCards52/14.png" // 1 Ace of spades
    cardsArray[14] = document.createElement("img");
    cardsArray[14].src = "setOfCards52/15.png" // 2 of spades
    cardsArray[15] = document.createElement("img");
    cardsArray[15].src = "setOfCards52/16.png" // 3 of spades
    cardsArray[16] = document.createElement("img");
    cardsArray[16].src = "setOfCards52/17.png" // 4 of spades
    cardsArray[17] = document.createElement("img");
    cardsArray[17].src = "setOfCards52/18.png" // 5 of spades
    cardsArray[18] = document.createElement("img");
    cardsArray[18].src = "setOfCards52/19.png" // 6 of spades
    cardsArray[19] = document.createElement("img");
    cardsArray[19].src = "setOfCards52/20.png" // 7 of spades
    cardsArray[20] = document.createElement("img");
    cardsArray[20].src = "setOfCards52/21.png" // 8 of spades
    cardsArray[21] = document.createElement("img");
    cardsArray[21].src = "setOfCards52/22.png" // 9 of spades
    cardsArray[22] = document.createElement("img");
    cardsArray[22].src = "setOfCards52/23.png" // 10 of spades
    cardsArray[23] = document.createElement("img");
    cardsArray[23].src = "setOfCards52/24.png" // 12 jack of spades
    cardsArray[24] = document.createElement("img");
    cardsArray[24].src = "setOfCards52/25.png" // 13 queen of spades
    cardsArray[25] = document.createElement("img");
    cardsArray[25].src = "setOfCards52/26.png" // 14 king of spades
    cardsArray[26] = document.createElement("img");
    cardsArray[26].src = "setOfCards52/27.png" // 1 Ace of diamonds
    cardsArray[27] = document.createElement("img");
    cardsArray[27].src = "setOfCards52/28.png" // 2 of diamonds
    cardsArray[28] = document.createElement("img");
    cardsArray[28].src = "setOfCards52/29.png" // 3 of diamonds
    cardsArray[29] = document.createElement("img");
    cardsArray[29].src = "setOfCards52/30.png" // 4 of diamonds
    cardsArray[30] = document.createElement("img");
    cardsArray[30].src = "setOfCards52/31.png" // 5 of diamonds
    cardsArray[31] = document.createElement("img");
    cardsArray[31].src = "setOfCards52/32.png" // 6 of diamonds
    cardsArray[32] = document.createElement("img");
    cardsArray[32].src = "setOfCards52/33.png" // 7 of diamonds
    cardsArray[33] = document.createElement("img");
    cardsArray[33].src = "setOfCards52/34.png" // 8 of diamonds
    cardsArray[34] = document.createElement("img");
    cardsArray[34].src = "setOfCards52/35.png" // 9 of diamonds
    cardsArray[35] = document.createElement("img");
    cardsArray[35].src = "setOfCards52/36.png" // 10 of diamonds
    cardsArray[36] = document.createElement("img");
    cardsArray[36].src = "setOfCards52/37.png" // 12 jack of diamonds
    cardsArray[37] = document.createElement("img");
    cardsArray[37].src = "setOfCards52/38.png" // 13 queen of diamonds
    cardsArray[38] = document.createElement("img");
    cardsArray[38].src = "setOfCards52/39.png" // 14 king of diamonds
    cardsArray[39] = document.createElement("img");
    cardsArray[39].src = "setOfCards52/40.png" // 1 Ace of clubs
    cardsArray[40] = document.createElement("img");
    cardsArray[40].src = "setOfCards52/41.png" // 2 of clubs
    cardsArray[41] = document.createElement("img");
    cardsArray[41].src = "setOfCards52/42.png" // 3 of clubs
    cardsArray[42] = document.createElement("img");
    cardsArray[42].src = "setOfCards52/43.png" // 4 of clubs
    cardsArray[43] = document.createElement("img");
    cardsArray[43].src = "setOfCards52/44.png" // 5 of clubs
    cardsArray[44] = document.createElement("img");
    cardsArray[44].src = "setOfCards52/45.png" // 6 of clubs
    cardsArray[45] = document.createElement("img");
    cardsArray[45].src = "setOfCards52/46.png" // 7 of clubs
    cardsArray[46] = document.createElement("img");
    cardsArray[46].src = "setOfCards52/47.png" // 8 of clubs
    cardsArray[47] = document.createElement("img");
    cardsArray[47].src = "setOfCards52/48.png" // 9 of clubs
    cardsArray[48] = document.createElement("img");
    cardsArray[48].src = "setOfCards52/49.png" // 10 of clubs
    cardsArray[49] = document.createElement("img");
    cardsArray[49].src = "setOfCards52/50.png" // 12 jack of clubs
    cardsArray[50] = document.createElement("img");
    cardsArray[50].src = "setOfCards52/51.png" // 13 queen of clubs
    cardsArray[51] = document.createElement("img");
    cardsArray[51].src = "setOfCards52/52.png" // 14 king of clubs    

    cardsValueArray[0]  = 11;
    cardsValueArray[1]  = 2;
    cardsValueArray[2]  = 3;
    cardsValueArray[3]  = 4;
    cardsValueArray[4]  = 5;
    cardsValueArray[5]  = 6;
    cardsValueArray[6]  = 7;
    cardsValueArray[7]  = 8;
    cardsValueArray[8]  = 9;
    cardsValueArray[9]  = 10;
    cardsValueArray[10] = 12;
    cardsValueArray[11] = 13;
    cardsValueArray[12] = 14;
    cardsValueArray[13] = 11;
    cardsValueArray[14] = 2;
    cardsValueArray[15] = 3;
    cardsValueArray[16] = 4;
    cardsValueArray[17] = 5;
    cardsValueArray[18] = 6;
    cardsValueArray[19] = 7;
    cardsValueArray[20] = 8;
    cardsValueArray[21] = 9;
    cardsValueArray[22] = 10;
    cardsValueArray[23] = 12;
    cardsValueArray[24] = 13;
    cardsValueArray[25] = 14;
    cardsValueArray[26] = 11;
    cardsValueArray[27] = 2;
    cardsValueArray[28] = 3;
    cardsValueArray[29] = 4;
    cardsValueArray[30] = 5;
    cardsValueArray[31] = 6;
    cardsValueArray[32] = 7;
    cardsValueArray[33] = 8;
    cardsValueArray[34] = 9;
    cardsValueArray[35] = 10;
    cardsValueArray[36] = 12;
    cardsValueArray[37] = 13;
    cardsValueArray[38] = 14;
    cardsValueArray[39] = 11;
    cardsValueArray[40] = 2;
    cardsValueArray[41] = 3;
    cardsValueArray[42] = 4;
    cardsValueArray[43] = 5;
    cardsValueArray[44] = 6;
    cardsValueArray[45] = 7;
    cardsValueArray[46] = 8;
    cardsValueArray[47] = 9;
    cardsValueArray[48] = 10;
    cardsValueArray[49] = 12;
    cardsValueArray[50] = 13;
    cardsValueArray[51] = 14;
} // end of buildCardArrays()

function newCard() { // processing the third card for the player

    console.log("\ninside function newCard() =========================")

    if (isAlive == true) {

        playerCards[2] = getCard()
        console.log("player third card: " + playerCards[2])
        playerCardsValue[2] = returnCardValue(playerCards[2])
        if (playerCardsValue[2] == 12 || playerCardsValue[2] == 13 || playerCardsValue[2] == 14) {
            playerCardsValue[2] = 10;
        }
        console.log("player third card value: " + playerCardsValue[2])
        playerCardsImages[2] = returnCardImage(playerCards[2])
        card3Display.appendChild(playerCardsImages[2])
        sum += playerCardsValue[2]

        if (sum > 21) { // reduce value of aces if sum over 21. Can happen for two out of three cards
            if (playerCardsValue[0] == 11) {
                sum = sum - 10
            }
            else if (playerCardsValue[1] == 11) {
                sum = sum - 10
            }
            else if (playerCardsValue[2] == 11) {
                sum = sum - 10
            }
        }
        console.log("Sum of three cards is: " + sum)
//        sumEl.innerText = "Your Sum: " + sum
        cardsEl.innerText = "Your cards: " + playerCardsValue[0] + " + " + playerCardsValue[1] + " + " + playerCardsValue[2] + " = " + sum
        if (sum == 21) {
            cardsEl.innerText += " BLACKJACK"
        }

// if sum of house cards is less than player cards (inevitable loss), house will get a third card. 
/*      */    
        if (sumHouse < sum && sum <= 21) {
            processThirdHouseCard() 
        }
    
        processPlayedCards()
        gameScoreEl.innerText = "Blackjack " + "$" + availablePlayerMoney //+ " - " + gameScoreHouse
        messageEl.innerText = message;
    }
    else if (availablePlayerMoney <= 0) {
        messageEl.innerText = "You ran out of money!"
    }
    else {
        messageEl.innerText = "Game Over - Click on PLAY";
    }
    
    isAlive = false
} // end newCard()

function pass() { /* if player does not want to get a third card, but the house's sum is less than 16 and also less than the player's sum, then house will get a third card */

    console.log("\ninside function pass() =========================")

    if (isAlive == true) {
        gameStarted = false
        if (sumHouse < sum && sum <= 21 ) { // only get a third card house if loss is inevitable
            processThirdHouseCard() 
        }
        // gameScorePlayer += 1, gameScoreHouse += 1

        processPlayedCards()

        gameScoreEl.innerText = "Blackjack " + "$" + availablePlayerMoney// + " - " + gameScoreHouse
        messageEl.innerText = message;
    }
    else if (availablePlayerMoney <= 0) {
        messageEl.innerText = "You ran out of money!"
    }
    else {
        messageEl.innerText = "Game Over - Click on PLAY";
    }    

    isAlive = false
} // end pass()

function processThirdHouseCard() {

    console.log("\ninside function processThirdHouseCard =========================")
    houseCards[2] = getCard()
    console.log("house " + 3 + " card: " + houseCards[2])
    houseCardsValue[2] = returnCardValue(houseCards[2])
    if (houseCardsValue[count] == 12 || houseCardsValue[count] == 13 || houseCardsValue[count] == 14) {
        houseCardsValue[count] = 10;
    }
    sumHouse = sumHouse + houseCardsValue[2]
    for (i=0;i<3;i++) {
        if (sumHouse > 21 && houseCardsValue[i] == 11) {
            sumHouse = sumHouse - 10
        }
    }
    console.log("third card house: " + houseCards[2])
    console.log("third card house value: " + houseCardsValue[2])
    cardsHouseEl.innerText = "House Cards: "
    cardsHouseEl.innerText = "House cards: " + houseCardsValue[0] + " + " + houseCardsValue[1] + " + " + houseCardsValue[2] + " = " + sumHouse
    if (sumHouse == 21) {
        cardsHouseEl.innerText += " BLACKJACK"
    }
    console.log("Sum of three house cards is: " + sumHouse)
    houseCardsImages[2] = returnCardImage(houseCards[2])
    card3HouseDisplay.appendChild(houseCardsImages[2]);
    isAlive = false
} // end processThirdHouseCard()

function getCard() { // return a value from the deck between 0 and 51. 52 cards.

    console.log("\ninside function getCard =========================")
    var cardNum = Math.floor(Math.random() * (max - min +1) +min);
    while (cardsPlayed.has(cardNum)) {
        cardNum = Math.floor(Math.random() * (max - min +1) +min);
        console.log("inside while loop, card drawn out of 52 is " + cardNum)
    }
    cardsPlayed.add(cardNum)
    console.log("cards played until now (stored in the set) are: " )
    for (const x of cardsPlayed.values()) {
        console.log(x + " ")
    }
    return cardNum;
} // end getCard()

function returnCardValue(cardNum) {

    console.log("\ninside function returnCardValue() =========================")
    var cardNumReturn = cardsValueArray[cardNum];
    return cardNumReturn;
} /* end function returnCardValue */

function returnCardImage(cardNum) { 

    console.log("\ninside function returnCardImage =========================")
    var card = new Image();
    card.src = cardsArray[cardNum].src; 
    return card;
} // end returnCardImage()

function processPlayedCards() {

    if ((sumHouse > 21 && sum > 21) ||
        (sum == sumHouse)) {
        message = "It is a tie"
        hasBlackjack = true
        isAlive = false
        gameStarted = false
        gameIsADraw = true
    }
    else if ((sum < 21 && sumHouse > 21) ||
             (sum > sumHouse && sum < 21) ||
             (sumHouse != 21 && sum == 21) ) {
        message = " You won!"
        hasBlackjack = true
        isAlive = false
        gameStarted = false
        availablePlayerMoney += parseInt(playerBetEl);
        gameWon = true
    }
    else if ((sum > 21 && sumHouse <= 21) ||
             (sum != 21 && sumHouse == 21) ||
             (sum < 21 && sum < sumHouse && sumHouse < 21)) {
        message = "===> You lost <===" 
        isAlive = false
        gameStarted = false
//        gameScoreHouse += 1
        availablePlayerMoney -= parseInt(playerBetEl);
        gameLost = true
    }
    else {
        message = "Status cannot be established!"
        isAlive = false
        gameStarted = false
    }
    console.log(message)
    gameScoreEl.innerText = "Blackjack " + "$" + availablePlayerMoney// + " - " + gameScoreHouse
    messageEl.innerText = message;

} // end decideWinner()

