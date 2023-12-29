# Pokemon Pokedex

## Features

1. View a list of Pokemon
2. Type and Sprite Image to Card
3. Conditionally render Card's Background Color and Accent Color based on Pokemon's Type.
4. Search by Pokemon # or Name
5. Fragments to improve performance:

   - Used document fragment to append the collection of Pokemon Card to reduce the number of times needed to manipulate and re-render the dom.

6. Debounce to improve performance of Search
   - Used to handle input events such as Search to ensure that time-consuming tasks do not fire so often, preventing performance issues and unintended behavior in response to rapidly changing input.
     - Reducing Event Overhead
     - Optimizing Network Traffic
7. Back to Home function

## Backlog

1. View Pokemon detailed information page (information, api)
2. Fix performance of all Pokemon showing, after deleting input from search box

## Bugs

| Description                                            | Status                      |
| ------------------------------------------------------ | --------------------------- |
| If input = Not found. Delete did not reset dex to all. | Resolved, fixed switch case |

## APIs

[From PokeAPI](https://pokeapi.co/)

| Type                        | API                                                      |
| --------------------------- | -------------------------------------------------------- |
| Name and URL to Pokemon ID  | `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}` |
| Typing and Stats            | `https://pokeapi.co/api/v2/pokemon/${id}`                |
| Fun Details like egg groups | `https://pokeapi.co/api/v2/pokemon-species/${id}`        |

### Sample Json

<details>
<summary>Limit</summary>

```
{
"count": 1292,
"next": "https://pokeapi.co/api/v2/pokemon?offset=10&limit=10",
"previous": null,
"results": [
{
"name": "bulbasaur",
"url": "https://pokeapi.co/api/v2/pokemon/1/"
},
{
"name": "ivysaur",
"url": "https://pokeapi.co/api/v2/pokemon/2/"
},
{
"name": "venusaur",
"url": "https://pokeapi.co/api/v2/pokemon/3/"
},
]}
```

</details>

<details>
<summary>By ID</summary>

```
{
"abilities": [{
    "ability": {
        "name": "overgrow",
        "url": "https://pokeapi.co/api/v2/ability/65/"
        },
        "is_hidden": false,
        "slot": 1
        },
    ],
"base_experience": 142,
"height": 10,
"id": 2,
"location_area_encounters": "https://pokeapi.co/api/v2/pokemon/2/encounters",
"moves": [{
    "move": {
        "name": "leech-seed",
        "url": "https://pokeapi.co/api/v2/move/73/"
        },
    "version_group_details": [
        {
        "level_learned_at": 7,
        "move_learn_method": {
            "name": "level-up", || "egg" || "machine" || "tutor"
            "url": "https://pokeapi.co/api/v2/move-learn-method/1/"
        },
        "version_group": {
            "name": "red-blue" || "yellow || "emerald" || "diamond-pearl" || "platinum" || "heartgold-soulsilver" || "black-white" || "black-2-white-2" || "omega-ruby-alpha-sapphire" || "sun-moon" || "ultra-sun-ultra-moon" || "sword-shield" || "brilliant-diamond-and-shining-pearl"
            "url": "https://pokeapi.co/api/v2/version-group/1/"
            }
        },],}
    ],
"name": "ivysaur",
"order": 2,
"sprites": {},
"stats": [
    {
        "base_stat": 60,
        "effort": 0,
        "stat": {
        "name": "hp" || "attack" || "defense" || "special-attack" || "special-defense" || "speed",
        "url": "https://pokeapi.co/api/v2/stat/1/"
        }
    },
    ],
"types": [
    {
        "slot": 1,
        "type": {
        "name": "grass",
        "url": "https://pokeapi.co/api/v2/type/12/" }
    },
    {
        "slot": 2,
        "type": {
        "name": "poison",
        "url": "https://pokeapi.co/api/v2/type/4/"}
    }
    ],
"weight": 130
}
```

</details>

<details>
<summary>By Pokemon species ID</summary>

```
{
"base_happiness": 50,
"capture_rate": 45,
"egg_groups": [
    {
        "name": "monster",
        "url": "https://pokeapi.co/api/v2/egg-group/1/"
    },
    {
        "name": "plant",
        "url": "https://pokeapi.co/api/v2/egg-group/7/"
    }],
"evolution_chain": {
    "url": "https://pokeapi.co/api/v2/evolution-chain/1/"
    },
"evolves_from_species": {},
"flavor_text_entries": [
    {
        "flavor_text": "When the bulb on\nits back grows\nlarge, it appears\fto lose the\nability to stand\non its hind legs.",
        "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
    },
        "version": {
            "name": "red",
            "url": "https://pokeapi.co/api/v2/version/1/"
    }},
    {
        "flavor_text": "When the bulb on its back grows large, it\nappears to lose the ability to stand on\nits hind legs.",
        "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
    },
        "version": {
            "name": "leafgreen",
            "url": "https://pokeapi.co/api/v2/version/11/"
    }},
    {
        "flavor_text": "If the bud on its back starts to\nsmell sweet, it is evidence that\nthe large flower will soon bloom.",
        "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
    },
        "version": {
            "name": "soulsilver",
            "url": "https://pokeapi.co/api/v2/version/16/"
    }},
    {
        "flavor_text": "When the bud on its back starts\nswelling, a sweet aroma wafts to\nindicate the flower’s coming bloom.",
        "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
    },
        "version": {
            "name": "white-2",
            "url": "https://pokeapi.co/api/v2/version/22/"
    }},
    ],
"form_descriptions": [],
"forms_switchable": false,
"gender_rate": 1 (female leads, by 1/8),
"growth_rate": {
    "name": "medium-slow",
    "url": "https://pokeapi.co/api/v2/growth-rate/4/"
    },
"habitat": {
    "name": "grassland",
    "url": "https://pokeapi.co/api/v2/pokemon-habitat/3/"
    },
"has_gender_differences": false,
"hatch_counter": 20,
"id": 2,
"is_baby": false,
"is_legendary": false,
"is_mythical": false,
"name": "bulbasaur",
"order": 1,
"shape": {
    "name": "quadruped",
    "url": "https://pokeapi.co/api/v2/pokemon-shape/8/"
    },
"varieties": []
}

```

</details>
