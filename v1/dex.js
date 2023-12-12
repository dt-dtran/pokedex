const MAX_POKEMON = 200;
const dexWrapper = document.querySelector(".dex-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemon = [];

const typeColors = {
  grass: {
    primary: "#4CC8A8",
    accent: "#5DD9BE",
  },
  fire: {
    primary: "#F56565",
    accent: "#F67676",
  },
  water: {
    primary: "#6FB4F8",
    accent: "#9CCDFD",
  },
  ice: {
    primary: "#47B6DB",
    accent: "#73C5E0",
  },
  bug: {
    primary: "#53A063",
    accent: "#79BF88",
  },
  normal: {
    primary: "#828E93",
    accent: "#ADB5BD",
  },
  flying: {
    primary: "#6472C7",
    accent: "#7D8EF9",
  },
  poison: {
    primary: "#9431D5",
    accent: "#AD5EE0",
  },
  ghost: {
    primary: "#8E7DBE",
    accent: "#A891E8",
  },
  psychic: {
    primary: "#774DF6",
    accent: "#9373F9",
  },
  fairy: {
    primary: "#FB6F92",
    accent: "#FF99B2",
  },
  dragon: {
    primary: "#2881FF",
    accent: "#6BA8FF",
  },
  electric: {
    primary: "#F6AE2D",
    accent: "#F7C160",
  },
  ground: {
    primary: "#8A7968",
    accent: "#AB947E",
  },
  rock: {
    primary: "#6B705C",
    accent: "#8A866C",
  },
  steel: {
    primary: "#677A81",
    accent: "#828E93",
  },
  fighting: {
    primary: "#F29559",
    accent: "#FBAE7C",
  },
  dark: {
    primary: "#1A1A1A",
    accent: "#272727",
  },
};

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemon = data.results;
    console.log(allPokemon);
    renderPokemon(allPokemon);
  });

async function fetchPokemonData(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return { pokemon, pokemonSpecies };
  } catch (error) {
    console.log("Pkm Data Error: ", error);
  }
}

async function renderPokemon(pokemons) {
  dexWrapper.innerHTML = "";

  for (const pokemon of pokemons) {
    const pokemonID = pokemon.url.split("/")[6];
    const pokemonData = await fetchPokemonData(pokemonID);
    let pokemonType;

    if (pokemonData) {
      const typesLength = pokemonData.pokemon.types.length;

      if (typesLength > 1) {
        pokemonType = [
          pokemonData.pokemon.types[0].type.name,
          pokemonData.pokemon.types[1].type.name,
        ];
      } else {
        pokemonType = [pokemonData.pokemon.types[0].type.name];
      }
      //   console.log(pokemonData.pokemon.name, pokemonType);
    }

    const cardStyling = getBackgroundColorType(pokemonType[0]);

    const listItem = document.createElement("div");
    listItem.classList.add("card");
    listItem.style.backgroundColor = cardStyling;
    listItem.innerHTML = `
        <div class="card-header">
            <p class="card-font-primary">${pokemon.name}</p>
            <p class="card-font-primary">#${pokemonID}</p>
        </div>
        <div class="card-body">
            <div class="card-type">
                <ul class="type-list">
                ${pokemonType
                  .map((type) => {
                    const cardAccentStyling = getAccentColorType(type);
                    return `<li style="background-color: ${cardAccentStyling}">${type}</li>`;
                  })
                  .join("")}
                </ul>
            </div>
            <div class="card-img">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${
      pokemon.name
    }" style="width: 100px; height: 100px;" />
            </div>
        </div>
        `;
    dexWrapper.appendChild(listItem);
  }
}

function getBackgroundColorType(type) {
  if (!typeColors[type]) {
    console.log("Type Color not found: ", type);

    return "#828E93";
  }
  const bgColor = typeColors[type].primary;

  return bgColor;
}

function getAccentColorType(type) {
  if (!typeColors[type]) {
    console.log("Type Accent Color not found: ", type);

    return "#ADB5BD";
  }
  const accentBgColor = typeColors[type].accent;

  return accentBgColor;
}
