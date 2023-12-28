let currentPokemonID = null;

document.addEventListener("DOMContentLoaded", () => {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMON) {
    return (window.location.href = "./index.html");
  }

  currentPokemonID = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    if (currentPokemonID === id) {
      renderPokemonDetail(pokemon, pokemonSpecies);

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== MAX_POKEMON) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }
      //add remove right arrow when at Max

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }
    tabEvents(pokemon, pokemonSpecies);
    return true;
  } catch (err) {
    console.error("Error fetching Pokemon Data", err);
    return false;
  }
}

// navigate previous and next
async function navigatePokemon(id) {
  currentPokemonID = id;
  await loadPokemon(id);
}

// Pokemon Data
function renderPokemonDetail(pokemon, pokemonSpecies) {
  console.log("pokemon", pokemon);
  console.log("PS", pokemonSpecies);
  const { name, id, types, weight, height } = pokemon;
  const { egg_groups, gender_rate, shape, is_legendary, is_mythical } =
    pokemonSpecies;
  setBgColor(pokemon);

  // Pokemon Name
  document.querySelector("title").textContent = name;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".header-title .name").textContent = pokemon.name;

  // Pokemon ID
  document.querySelector(
    ".header-pokemon-id .card-font-primary"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  // Pokemon Type(s)
  const typeWrapper = document.querySelector(".header-type-list");

  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    const accentColor = getAccentColorType(type.name);
    createAndAppendElement(typeWrapper, "li", {
      className: ` ${type.name}`,
      textContent: type.name,
      style: `background-color: ${accentColor}`,
    });
  });

  // pokemon image
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  // About Section details
  document.querySelector("p.font-3.weight").textContent = `${weight / 10}kg`;
  document.querySelector("p.font-3.height").textContent = `${height / 10}m`;
  document.querySelector("p.font-3.shape").textContent = `${shape.name}`;

  if (egg_groups.length === 2) {
    const egg1 = egg_groups[0].name;
    const egg2 = egg_groups[1].name;
    document.querySelector("p.font-3.egg").textContent = `${egg1}, ${egg2}`;
  } else if (is_legendary) {
    document.querySelector("p.font-3.egg").textContent = "Legendary";
  } else if (is_mythical) {
    document.querySelector("p.font-3.egg").textContent = "Mythical";
  } else {
    const egg1 = egg_groups[0].name;
    document.querySelector("p.font-3.egg").textContent = `${egg1}`;
  }

  if (gender_rate === -1) {
    document.querySelector("p.font-3.gender1").textContent = "Gender Unknown";
  } else if (gender_rate === 0) {
    document.querySelector("p.font-3.gender1").textContent = "100%";

    document.querySelector("p.font-3.gender1").textContent = "100%";
    const genderWrapper = document.querySelector("div.gender");
    createAndAppendElement(genderWrapper, "img", {
      className: `gender-img`,
      src: "./assets/male-sharp.svg",
      alt: "Male Symbol",
    });
  } else if (gender_rate === 8) {
    document.querySelector("p.font-3.gender1").textContent = "100%";
    const genderWrapper = document.querySelector("div.gender");
    createAndAppendElement(genderWrapper, "img", {
      className: `gender-img`,
      src: "./assets/female-sharp.svg",
      alt: "Female Symbol",
    });
  } else {
    const female = gender_rate * 8;
    const male = 100 - female;

    document.querySelector("p.font-3.gender1").textContent = `${female}`;

    const genderWrapper = document.querySelector("div.gender");

    const fragment = document.createDocumentFragment();

    createAndAppendElement(fragment, "img", {
      className: `gender-img`,
      src: "./assets/female-sharp.svg",
      alt: "Female Symbol",
    });

    createAndAppendElement(fragment, "p", {
      className: `font-3 gender1`,
      textContent: `${male}`,
    });

    createAndAppendElement(fragment, "img", {
      className: `gender-img`,
      src: "./assets/male-sharp.svg",
      alt: "Male Symbol",
    });

    genderWrapper.appendChild(fragment);
  }
}

// function eventlisteners

function tabEvents(pokemon, pokemonSpecies) {
  const [tabAbout, tabData, tabStats, tabEvolve] = [
    "#tab-about",
    "#tab-data",
    "#tab-stats",
    "#tab-evolve",
  ].map((sel) => document.querySelector(sel));

  tabAbout.addEventListener("click", () => {
    console.log("tab about click");
  });
  tabData.addEventListener("click", () => {
    console.log("tab data click");
    renderDataTab(pokemonSpecies);
  });
  tabStats.addEventListener("click", () => {
    console.log("tab stats click");
  });
  tabEvolve.addEventListener("click", () => {
    console.log("tab evolve click");
  });
}

// tab data event

function renderDataTab(pokemonSpecies) {
  const { habitat, flavor_text_entries } = pokemonSpecies;

  document.querySelector("p.font-3.habitat").textContent = `${habitat.name}`;

  const flavorTextWrapper = document.querySelector(".entry-list");

  const fragment = document.createDocumentFragment();

  const filteredFlavorTexts = flavor_text_entries.filter(
    (obj) => obj.language.name === "en"
  );
  console.log("filered", filteredFlavorTexts);

  let uniqueChecker = [];
  let uniqueFlavorText = [];
  filteredFlavorTexts.forEach((entry) => {
    if (!uniqueChecker.includes(entry.flavor_text)) {
      uniqueChecker.push(entry.flavor_text);
      uniqueFlavorText.push(entry);
    }
  });
  console.log("unique", uniqueFlavorText);

  uniqueFlavorText.map((entry) => {
    const version = capitalizeFirstLetter(entry.version.name);
    createAndAppendElement(fragment, "li", {
      className: `font-4 entries`,
      textContent: `${version}: ${entry.flavor_text}`,
    });

    flavorTextWrapper.appendChild(fragment);
  });

  flavorTextWrapper.appendChild(fragment);
}

// styling background for header
function setBgColor(pokemon) {
  const bgColor = getBackgroundColorType(pokemon.types[0].type.name);
  const detailMainElement = document.querySelector(".detail-top");
  setElementStyles([detailMainElement], "backgroundColor", bgColor);
}
