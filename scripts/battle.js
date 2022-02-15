const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const firstPlayerPokemonName = urlParams.get("firstPlayerPokemon");
const secondPlayerPokemonName = urlParams.get("secondPlayerPokemon");
const firstPlayerData = {
  name: "Player One",
  pokemon: {},
  moves: {},
  allDrinks: [],
  health: 100,
};
const secondPlayerData = {
  name: "Player Two",
  pokemon: {},
  moves: {},
  allDrinks: [],
  health: 100,
};

//setup initial DOM elements and variables
document.getElementById("playerOneName").innerText =
  firstPlayerPokemonName[0].toUpperCase() + firstPlayerPokemonName.substring(1);
document.getElementById("playerTwoName").innerText =
  secondPlayerPokemonName[0].toUpperCase() +
  secondPlayerPokemonName.substring(1);
let leftPokemonSprite = document.getElementById("playerOneSprite");
let rightPokemonSprite = document.getElementById("playerTwoSprite");
let firstDrink = document.getElementById("drinkOne");
let secondDrink = document.getElementById("drinkTwo");
let playerOneHP = document.getElementById("playerOneHP");
let playerTwoHP = document.getElementById("playerTwoHP");
let playerOneBubbles = document.getElementById("playerOneBubbles");
let playerTwoBubbles = document.getElementById("playerTwoBubbles");
let promptMessageBox = document.querySelector(".game-prompt__message");
let promptAttacksBox = document.querySelector(".game-prompt__options");
let playerOneCups = document.getElementById("playerOneCups");
let playerTwoCups = document.getElementById("playerTwoCups");
let cup = [];
let turn = 1;
let gameOverScreen = document.querySelector(".game-over");

document
  .querySelector(".game-prompt__options")
  .addEventListener("click", () => {
    attack();
  });

const attack = () => {
  if (turn % 2 === 0) {
    playerTwoBubbles.classList.remove("battle__no-hit");
    playerTwoBubbles.classList.add("battle__hit");
    promptMessageBox.innerText = `bottoms up!`;
    cup.push(document.createElement("img"));
    cup[0].src = "../assets/drink.png";
    playerTwoCups.appendChild(cup.pop());
    setTimeout(() => {
      playerTwoBubbles.classList.remove("battle__hit");
      playerTwoBubbles.classList.add("battle__no-hit");
      let hit = Math.floor(
        firstPlayerData.pokemon.stats[1].base_stat /
          Math.ceil(Math.random() * 4)
      );
      secondPlayerData.health -= hit;
      if (secondPlayerData.health < 50) {
        playerTwoHP.classList.add("battle__hp--medium");
      }
      if (secondPlayerData.health < 25) {
        playerTwoHP.classList.add("battle__hp--low");
      }
      if (secondPlayerData.health <= 0) {
        secondPlayerData.health = 0;
        setTimeout(() => {
          gameOverScreen.style.display = "flex";
        }, 3000);
      }
      playerTwoHP.style.width = `${secondPlayerData.health}%`;
      firstPlayerData.moves = generateMoves(firstPlayerData.allDrinks);
      setTurn(secondPlayerData);
    }, 1300);
  } else {
    playerTwoBubbles.classList.remove("battle__no-hit");
    playerTwoBubbles.classList.add("battle__hit");
    promptMessageBox.innerText = `bottoms up!`;
    cup.push(document.createElement("img"));
    cup[0].src = "../assets/drink.png";
    playerOneCups.appendChild(cup.pop());
    setTimeout(() => {
      playerTwoBubbles.classList.remove("battle__hit");
      playerTwoBubbles.classList.add("battle__no-hit");
      let hit = Math.floor(
        secondPlayerData.pokemon.stats[1].base_stat /
          Math.ceil(Math.random() * 4)
      );
      firstPlayerData.health -= hit;
      if (firstPlayerData.health < 50) {
        playerOneHP.classList.add("battle__hp--medium");
      }
      if (firstPlayerData.health < 25) {
        playerOneHP.classList.add("battle__hp--low");
      }
      if (firstPlayerData.health <= 0) {
        firstPlayerData.health = 0;
        setTimeout(() => {
          gameOverScreen.style.display = "flex";
        }, 3000);
      } //need to define win
      playerOneHP.style.width = `${firstPlayerData.health}%`;
      secondPlayerData.moves = generateMoves(secondPlayerData.allDrinks);
      setTurn(firstPlayerData);
    }, 1300);
  }
};

const setTurn = (player) => {
  if (turn % 2 !== 0) {
    turn++;
    leftPokemonSprite.src = firstPlayerData.pokemon.sprites.back_default;
    rightPokemonSprite.src = secondPlayerData.pokemon.sprites.front_default;
    assignAnimation(leftPokemonSprite, firstPlayerData.health);
    assignAnimation(rightPokemonSprite, secondPlayerData.health);
    firstDrink.innerText = firstPlayerData.moves.firstMove;
    secondDrink.innerText = firstPlayerData.moves.secondMove;
    promptMessageBox.classList.remove("game-prompt__message--player-two");
    promptAttacksBox.classList.remove("game-prompt__options--player-two");
    promptMessageBox.innerText = `${firstPlayerPokemonName} choose drinks!`;
  } else {
    turn++;
    leftPokemonSprite.src = secondPlayerData.pokemon.sprites.back_default;
    rightPokemonSprite.src = firstPlayerData.pokemon.sprites.front_default;
    assignAnimation(rightPokemonSprite, firstPlayerData.health);
    assignAnimation(leftPokemonSprite, secondPlayerData.health);
    firstDrink.innerText = secondPlayerData.moves.firstMove;
    secondDrink.innerText = secondPlayerData.moves.secondMove;
    promptMessageBox.classList.add("game-prompt__message--player-two");
    promptAttacksBox.classList.add("game-prompt__options--player-two");
    promptMessageBox.innerText = `${secondPlayerPokemonName} choose drinks!`;
  }
  if (player.health <= 0) {
    promptMessageBox.innerText = `${
      player.pokemon.name[0].toUpperCase() + player.pokemon.name.substring(1)
    } passed out...!`;
  }
};

const assignAnimation = (sprite, health) => {
  sprite.classList.remove("battle__sprite--start-drinking");
  sprite.classList.remove("battle__sprite--middle-drinking");
  sprite.classList.remove("battle__sprite--late-drinking");
  if (health < 80) {
    sprite.classList.add("battle__sprite--start-drinking");
  }
  if (health < 65) {
    sprite.classList.add("battle__sprite--middle-drinking");
  }
  if (health < 35) {
    sprite.classList.add("battle__sprite--late-drinking");
  }
  if (health <= 0) {
    sprite.classList.add("battle__sprite--passed-out");
  }
};

const generateMoves = (drinkOptions) => {
  const getDrink = () => {
    return Math.floor(Math.random() * drinkOptions.length);
  };
  let firstMove = drinkOptions[getDrink()].strDrink;
  let secondMove = drinkOptions[getDrink()].strDrink;
  secondMove === firstMove
    ? (secondMove = drinkOptions[getDrink()].strDrink)
    : null;
  return { firstMove, secondMove };
};

const getDrinks = (pokemonName, playerObj) =>
  axios
    .get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${pokemonName[0]}`
    )
    .then((allDrinks) => {
      const allDrinksArray = allDrinks.data.drinks;
      playerObj.allDrinks = allDrinksArray;
      playerObj.moves = generateMoves(allDrinksArray);
    })
    .catch((err) => err);

const getPokemon = (pokemon, playerObj) =>
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then((response) => {
      playerObj.pokemon = response.data;
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

const initializaPlayers = (
  firstPlayerPokemonName,
  firstPlayer,
  secondPlayerPokemonName,
  secondPlayer
) => {
  Promise.all([
    getPokemon(firstPlayerPokemonName, firstPlayer),
    getDrinks(firstPlayerPokemonName, firstPlayer),
    getPokemon(secondPlayerPokemonName, secondPlayer),
    getDrinks(secondPlayerPokemonName, secondPlayer),
  ]).then((values) => {
    console.log("render them all", firstPlayerData, secondPlayerData);

    // initialize player display info
    setTurn();
  });
};

initializaPlayers(
  firstPlayerPokemonName,
  firstPlayerData,
  secondPlayerPokemonName,
  secondPlayerData
);

document
  .querySelector(".console__right-buttons")
  .addEventListener("click", () => {
    attack();
  });
