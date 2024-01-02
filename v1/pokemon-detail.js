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
      ); // map or forEach?
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
    const genderWrapper = document.querySelector("div.gender");
    genderWrapper.innerHTML = "";
    createAndAppendElement(genderWrapper, "img", {
      className: `gender-img`,
      src: "./assets/male-sharp.svg",
      alt: "Male Symbol",
    });
  } else if (gender_rate === 8) {
    document.querySelector("p.font-3.gender1").textContent = "100%";
    const genderWrapper = document.querySelector("div.gender");
    genderWrapper.innerHTML = "";
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
    genderWrapper.innerHTML = "";

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
    renderStatsTab(pokemon);
    selectMoveVersion(pokemon);
  });
  tabEvolve.addEventListener("click", () => {
    console.log("tab evolve click");
  });
}

// tab data event
function renderDataTab(pokemonSpecies) {
  const { habitat, flavor_text_entries } = pokemonSpecies;

  document.querySelector("p.font-3.habitat").textContent = `${habitat.name}`;

  const flavorTextWrapper = document.querySelector(".entry-container");
  flavorTextWrapper.innerHTML = "";
  const fragment = document.createDocumentFragment();

  const filteredFlavorTexts = flavor_text_entries.filter(
    (obj) => obj.language.name === "en"
  );

  let uniqueChecker = [];
  let uniqueFlavorText = [];
  filteredFlavorTexts.forEach((entry) => {
    if (!uniqueChecker.includes(entry.flavor_text)) {
      uniqueChecker.push(entry.flavor_text);
      uniqueFlavorText.push(entry);
    }
  });

  uniqueFlavorText.forEach((entry) => {
    const version = capitalizeFirstLetter(entry.version.name);
    createAndAppendElement(fragment, "div", {
      className: `entry-item font-4`,
      textContent: `${version}`,
    });
    createAndAppendElement(fragment, "div", {
      className: `entry-item font-4`,
      textContent: `${entry.flavor_text}`,
    });
  });

  flavorTextWrapper.appendChild(fragment);
}

function renderStatsTab(pokemon) {
  const { stats, moves } = pokemon;
  const statsMapping = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Ded",
    speed: "Speed",
  };

  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";
  const fragment = document.createDocumentFragment();

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = createAndAppendElement(fragment, "div", {
      className: "stats-item",
    });

    createAndAppendElement(statDiv, "p", {
      className: "font-3 stats",
      textContent: statsMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "font-3",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });
  statsWrapper.appendChild(fragment);
}

// event listener for move version selection
let moveVersion = null;
let availableVersions = [];
let moves = [];
let filteredMovesData = [];

filterVersion.addEventListener("change", function () {
  moveVersion = this.value;
  const versionIndexSelected = filterVersion.selectedIndex;
  selectMoveVersion(moves);
});

// Moveset by Version
function renderMoves(filteredMovesData) {
  console.log(`renderMoves START:`);
  const moveWrapper = document.querySelector(".moves-container");

  moveWrapper.innerHTML = "";
  const fragment = document.createDocumentFragment();

  const moveTable = createAndAppendElement(fragment, "table", {
    className: "move-table font-3",
  });

  const tableHeader = createAndAppendElement(moveTable, "thead", {
    className: "table-header caption-fonts",
  });

  const tableHeaderRow = createAndAppendElement(tableHeader, "tr", {
    className: "table-header caption-3",
  });

  createAndAppendElement(tableHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Moves",
  });

  createAndAppendElement(tableHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Learned At",
  });

  createAndAppendElement(tableHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Learn Method",
  });

  const tableBody = createAndAppendElement(moveTable, "tbody", {
    className: "table-body font-3",
  });

  const otherTable = createAndAppendElement(fragment, "table", {
    className: "move-table font-3",
  });

  const otherHeader = createAndAppendElement(otherTable, "thead", {
    className: "table-header caption-fonts",
  });

  const otherHeaderRow = createAndAppendElement(otherHeader, "tr", {
    className: "table-header caption-3",
  });

  createAndAppendElement(otherHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Moves",
  });

  createAndAppendElement(otherHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Learned At",
  });

  createAndAppendElement(otherHeaderRow, "th", {
    className: "table-header caption-fonts",
    textContent: "Learn Method",
  });

  const otherBody = createAndAppendElement(otherTable, "tbody", {
    className: "table-body font-3",
  });

  const splitData = filteredMovesData.reduce(
    (result, { move, version_group_details }) => {
      const levelUp = version_group_details.find((method) => {
        return method.move_learn_method.name === "level-up";
      });

      if (levelUp) {
        result.level.push({ move, levelUp });
      } else {
        const versionOther = version_group_details[0];
        result.non.push({ move, versionOther });
      }

      return result;
    },
    { level: [], non: [] }
  );

  splitData.level.sort(
    (a, b) => a.levelUp.level_learned_at - b.levelUp.level_learned_at
  );

  splitData.level.forEach((line) => {
    const tableRow = createAndAppendElement(tableBody, "tr", {
      className: "table-row",
    });

    const moveName = createAndAppendElement(tableRow, "td", {
      className: "table-data level",
      textContent: `${line.move.name}`,
    });

    const levelLearnedData = createAndAppendElement(tableRow, "td", {
      className: "table-data level",
      textContent: `${line.levelUp.level_learned_at}`,
    });

    const learnMethodData = createAndAppendElement(tableRow, "td", {
      className: "table-date method",
      textContent: `${line.levelUp.move_learn_method.name}`,
    });
  });

  splitData.non.forEach((line) => {
    const otherRow = createAndAppendElement(otherBody, "tr", {
      className: "table-row",
    });

    const moveName = createAndAppendElement(otherRow, "td", {
      className: "table-data level",
      textContent: `${line.move.name}`,
    });

    const levelLearnedData = createAndAppendElement(otherRow, "td", {
      className: "table-data level",
      textContent: `${line.versionOther.level_learned_at}`,
    });

    const learnMethodData = createAndAppendElement(otherRow, "td", {
      className: "table-date method",
      textContent: `${line.versionOther.move_learn_method.name}`,
    });
  });

  moveWrapper.appendChild(fragment);
  console.log("renderMoves END");
}

// version selection
function selectMoveVersion(pokemon) {
  if (moveVersion) {
    console.log("EVENT selectMoveVersion START");

    filteredMovesData = filterMoves(moveVersion, moves);
    if (filteredMovesData) {
      renderMoves(filteredMovesData);
    }
    console.log("EVENT selectMoveVersion END");
  } else {
    console.log("DEFAULT selectMoveVersion START");
    moves = pokemon.moves;
    availableVersions = getUniqueVersions(moves);
    displayUniqueVersions(availableVersions);
    const versionWrapper = document.getElementById("filterVersion");

    versionWrapper.selectedIndex = versionWrapper.options.length - 1;
    const defaultLatestVersion =
      versionWrapper.options[versionWrapper.selectedIndex].value;

    filteredMovesData = filterMoves(defaultLatestVersion, moves);

    if (filteredMovesData) {
      renderMoves(filteredMovesData);
    }
    console.log("DEFAULT selectMoveVersion END");
  }
}

// filter by version selection
function filterMoves(version, moves) {
  console.log("filterMoves START");
  const movesDataByVersion = moves
    .map((move) => {
      const filteredVersionGroup = move.version_group_details.filter(
        (detail) => {
          return detail.version_group.name === version;
        }
      );

      if (filteredVersionGroup.length > 0) {
        const versionMove = {
          move: {
            ...move.move,
          },
          version_group_details: filteredVersionGroup,
        };
        return versionMove;
      } else {
        return null;
      }
    })
    .filter((move) => move !== null);
  console.log("filtered END: move[0]", movesDataByVersion[0]);
  return movesDataByVersion;
}

// display version options
function displayUniqueVersions(uniqueVersions) {
  console.log("displayUniqueVersions START");
  const versionWrapper = document.getElementById("filterVersion");
  versionWrapper.innerHTML = "";
  const fragment = document.createDocumentFragment();

  uniqueVersions.forEach((version) => {
    createAndAppendElement(fragment, "option", {
      className: `version-option font-4`,
      value: version,
      textContent: `${version}`,
    });
  });
  versionWrapper.appendChild(fragment);
  console.log("displayUniqueVersions END");
}

// get unique version
function getUniqueVersions(moves) {
  console.log("getUniqueVersions START");
  const uniqueVersions = new Set();

  moves.forEach((move) => {
    move.version_group_details.map((details) => {
      const versionName = details.version_group.name;
      uniqueVersions.add(versionName);
    });
  });

  const filteredVersions = versionGroupIndex
    .filter((group) => uniqueVersions.has(group.name))
    .map((group) => group.name);

  console.log("getUniqueVersions END");
  return filteredVersions;
}

// styling background for header
function setBgColor(pokemon) {
  const bgColor = getBackgroundColorType(pokemon.types[0].type.name);
  const detailMainElement = document.querySelector(".detail-top");
  setElementStyles([detailMainElement], "backgroundColor", bgColor);
}
