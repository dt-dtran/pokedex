const dexWrapper = document.querySelector(".dex-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemon = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemon = data.results.map((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return {
        ...pokemon,
        id: parseInt(pokemonID, 10),
      };
    });
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

  const fragment = document.createDocumentFragment();

  for (const pokemon of pokemons) {
    const pokemonID = pokemon.id;
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

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonData(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });
    fragment.appendChild(listItem);
  }
  dexWrapper.appendChild(fragment);
}

const handleInput = debounce((ev) => {
  handleSearch();
}, 250);

searchInput.addEventListener("keyup", handleInput);

function handleSearch() {
  let searchTerm = "";
  searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  switch (true) {
    // If the empty, return existing array (triggering fxn)
    case searchTerm === "":
      filteredPokemons = allPokemon;
      break;
    // If the first character is not a number, assume it's a name
    case isNaN(searchTerm[0]):
      filteredPokemons = allPokemon.filter((pokemon) => {
        return pokemon.name.toLowerCase().startsWith(searchTerm);
      });
      break;
    // If the first character is a number, assume it's a number
    default:
      filteredPokemons = allPokemon.filter((pokemon) => {
        const pokemonID = pokemon.id.toString();
        return pokemonID.startsWith(searchTerm);
      });
      break;
  }

  renderPokemon(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}
