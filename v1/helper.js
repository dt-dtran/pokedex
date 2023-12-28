// Set MAX limit for Pokedex
const MAX_POKEMON = 151;

// Text
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Debounce
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

// Create Element
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// Style Element
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// Type Colors
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
