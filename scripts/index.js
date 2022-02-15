const formOne = document.querySelector("#player-one__form");
const formOne__input = document.querySelector("#player-one__input");
const formTwo = document.querySelector("#player-two__form");
const formTwo__input = document.querySelector("#player-two__input");
const startBattle = document.querySelector("#startBattle");
const playerOneSelectionMain = document.querySelector(
  "#player-one__character-display"
);
const playerTwoSelectionMain = document.querySelector(
  "#player-two__character-display"
);
const playerOneSelectContainer = document.querySelector("#playerOneSelect");

const playerTwoSelectContainer = document.querySelector("#playerTwoSelect");

let allPokemon = [];
let playerOneSelection = [];
let playerTwoSelection = [];

const getPokemon = () => {
  axios
    .get(`https://pokeapi.co/api/v2/pokemon?limit=256&offset=0"`)
    .then((response) => {
      const availiblePokemon = response.data.results;
      availiblePokemon.forEach((pokemon) => {
        axios
          .get(pokemon.url)
          .then((specificPokemon) => {
            allPokemon.push(specificPokemon.data);
          })
          .then(() => {
            renderPokemonOptions(playerOneSelectContainer, allPokemon);
            renderPokemonOptions(playerTwoSelectContainer, allPokemon);
            renderMainChoice(playerOneSelectionMain, playerOneSelection);
            renderMainChoice(playerTwoSelectionMain, playerTwoSelection);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Find pokemon
formOne__input.addEventListener("keyup", (e) => {
  const userInput = e.target.value.toLowerCase();
  playerOneSelection = allPokemon.filter((pokemon) => {
    return pokemon.name.includes(userInput);
  });
  playerOneOptionsRender(e);
});

formTwo__input.addEventListener("keyup", (e) => {
  playerTwoOptionsRender(e);
});

const playerOneOptionsRender = (e, clickedPokemon) => {
  const userInput = clickedPokemon || e.target.value.toLowerCase();
  playerOneSelection = allPokemon.filter((pokemons) => {
    return pokemons.name.includes(userInput);
  });
  renderPokemonOptions(
    playerOneSelectContainer,
    playerOneSelection,
    formOne__input
  );
  renderMainChoice(playerOneSelectionMain, playerOneSelection);
};

const playerTwoOptionsRender = (e, clickedPokemon) => {
  const userInput = clickedPokemon || e.target.value.toLowerCase();
  playerTwoSelection = allPokemon.filter((pokemons) => {
    return pokemons.name.includes(userInput);
  });
  console.log(playerTwoSelectContainer);
  renderPokemonOptions(
    playerTwoSelectContainer,
    playerTwoSelection,
    formTwo__input
  );
  renderMainChoice(playerTwoSelectionMain, playerTwoSelection);
};

//Pass data to another page
startBattle.addEventListener("click", (e) => {
  e.preventDefault();
  if (playerOneSelection[0] && playerTwoSelection[0]) {
    formOne.reset();
    formTwo.reset();
    window.location = `../pages/battle.html?firstPlayerPokemon=${playerOneSelection[0].name}&secondPlayerPokemon=${playerTwoSelection[0].name}`;
  }
});

const renderPokemonOptions = (playerOptionsContainer, playerOptionsArray) => {
  playerOptionsContainer.innerHTML = "";
  playerOptionsArray.forEach((pokemon) => {
    let pokemonOption = document.createElement("img");
    pokemonOption.src = pokemon.sprites.front_default;
    // player-one__option--flipped
    pokemonOption.classList.add(
      playerOptionsContainer.classList.contains("player-one__character-display")
        ? "player-one__option--flipped"
        : "player-one__option"
    );
    // pokemonOption.style.width = "50px";
    pokemonOption.addEventListener("click", () => {
      let playerToChange = playerOptionsContainer.classList.contains(
        "player-one__character-display"
      )
        ? formOne__input
        : formTwo__input;
      playerToChange.value = pokemon.name;
      playerToChange === formOne__input
        ? playerOneOptionsRender(null, pokemon.name)
        : playerTwoOptionsRender(null, pokemon.name);
    });
    playerOptionsContainer.appendChild(pokemonOption);
  });
};

const renderMainChoice = (playerMainSelection, playerPokemonOptions) => {
  playerMainSelection.innerHTML = "";
  const playerOneChoice = document.createElement("img");
  // playerOneChoice.style.width = "200px";
  playerOneChoice.classList.add(
    playerMainSelection.classList.contains("player-one__character-display")
      ? "player-one__sprite--flipped"
      : "player-one__sprite"
  );
  playerOneChoice.src = playerPokemonOptions[0]
    ? playerPokemonOptions[0].sprites.other["official-artwork"].front_default
    : "../assets/icognito.svg";
  playerOneChoice.setAttribute(
    "alt",
    `${
      playerPokemonOptions[0] ? playerPokemonOptions[0].name : "Unknown pokemon"
    }`
  );
  playerMainSelection.appendChild(playerOneChoice);
};

getPokemon();
