const events = {
  1: () => {
    addToStoryBook([
      "You become aware of the sound of waves lapping at your feet.",
      "Images flash through your mind. Waves splashing over the bowspit...",
      "Sails high over your a head as you flip over the rail...",
      "A hand reaching out to catch (push?) you as you fall into the sea...",
      "The visions fade and all that remain are the cries of seagulls."
    ]).then(
      () => askQuestion(
        "Open your eyes?",
        [
          {
            name: "Look around.",
            result: () => runEvent(2),
          },
          {
            name: "Just a few minutes more...",
            result: () => runEvent(3),
          }
        ]
      )
    );
  },
  2: () => {
    addToStoryBook(["You see a small bottle bobbing in the waves a few feet from your toes."]).then(
      () => askQuestion(
        "A bottle?",
        [
          {
            name: "Wade in to retrieve it.",
            result: () => runEvent(4),
          },
          {
            name: "It can wait. Where am I??",
            result: () => runEvent(5),
          }
        ]
      )
    );
  },
  3: () => {
    addToStoryBook([
      "You feel the breeze tease your hair, palm fronds rustling in the breeze.",
      "The warmth of the water teasing your skin...",
      "So peaceful...",
      "...",
      "You must have fallen asleep. When you open your eyes it is dark.",
      "Clouds blot out the stars overhead. Rain is starting to fall.",
    ]).then(
      () => askQuestion(
        "Seek shelter?",
        [
          {
            name: "Amongst the growls in the vegetation.",
            result: () => runEvent(6),
          },
          {
            name: "In the wet rocks along the shore.",
            result: () => runEvent(7),
          },
          {
            name: "Keep moving down the beach.",
            result: () => runEvent(8),
          }
        ]
      )
    )
  },
  4: () => {
    removeItem(itemTypes.travellingShoes, 2);
    updateCondition(conditionTypes.hasShoes, false)
    addToStoryBook([
      "The water is at your waist before you catch the bottle.",
      "You grab it out of the water. Empty... what did you expect?",
      "You toss it away, and turn back to the shore.",
      "By the time you reach the shore, your clothes are wet and the breeze makes you shiver.",
      "Dismayed you look down and see that your shoes have been torn open by the beach rock.",
      "You take them off and leave them on the beach."
    ]).then(() => runEvent(5));

  },
  5: () => {
    addToStoryBook([
      "The bottle has clearly drifted from one of the crates that has washed on shore with you.",
      "The beach ahead of you gives way to dense jungle that rise into high hills.",
      "The beach stretches out of sight in both directions.",
      "The sun blazes down on you, and the beach shimmers in the heat.",
      "Is that someone else on the shore?",
    ]).then(
      () => askQuestion(
        "You:",
        [
          {
            name: "Head down to investigate the person.",
            result: () => runEvent(4),
          },
          {
            name: "Grab a rock and break open the cases.",
            result: () => runEvent(3),
          }
        ]
      )
    );
  },
  6: () => {
    updateCondition(conditionTypes.hunted, true);
    addToStoryBook([
      "The vegetation is dense, and shields you from the rain.",
      "And blocks out the light.",
      "The air pulsates with the sound of insects and bird.",
      "You use your hands to feel the way between trees.",
      "A twig snaps behind you.",
      "The insects and birds go silent.",
      "You hear a low sniffing getting closer.",
      "Closer.",
      "Closer.",
      "A flash of lightning sillouttes something massive moving through the forest.",
      "A crack of thunder.",
      "A roar.",
      "A flash of lightning, and...",
      "Nothing. The forest is empty.",
      "Something has your scent now."
    ])
  },
  7: () => {
    updatePlace(placeNames.oysterFarm, { status: "productive", foundPearls: false});
    addToStoryBook([
      "You find an overhanging ledge, which keeps out most of the rain.",
      "Seaspray mists your face with every crashing wave.",
      "You watch the lightning and thunder.",
      "When the rain abates, you climb down to a tide pool revealed by the falling tide.",
      "Oysters.",
      "You eat your fill, and do your best to note the place in the dark.",
    ])
  }
}



///////////////////

const addToStoryBook = (text) => {
  let storyBook = document.querySelector("#story-book");
  for (let line = 0; line < text.length; line++) {
    setTimeout(() => addLine(text[line]), line * 2000);
  }
  const addLine = (line) => {
    var newLine = document.createElement("p");
    newLine.className = "story-book-line";
    newLine.innerText = line;
    storyBook.appendChild(newLine);
    storyBook.scrollTop = storyBook.scrollHeight - storyBook.clientHeight;
  }

  return new Promise ((resolve, reject) => {
    setTimeout(resolve, text.length * 2500)
  })
}

const askQuestion = (question, options) => {
  addToStoryBook([question]).then(() => {
    let storyBook = document.querySelector("#story-book");
    let optionBar = document.createElement("div");
    for (let option of options) {
      let optionButton = document.createElement("button");
      optionButton.innerText = option.name;
      optionButton.onclick = option.result;
      optionButton.className = "option-button";
      optionBar.appendChild(optionButton);
    }
    storyBook.appendChild(optionBar);
  });
}

const runEvent = (eventId) => {
  events[eventId]();
  gameData.eventHistory[eventId] = true;
}

const giveItem = (itemName, quantity = 1) => {
  if (gameData.inventory[itemName]) gameData.inventory[itemName] += quantity;
  else gameData.inventory[itemName] = quantity;
}

const removeItem = (itemName, quantity = 1) => {
  if (gameData.inventory[itemName]) {
    gameData.inventory[itemName] -= quantity;
  }

  if (gameData.inventory[itemName] <= 0) {
    delete gameData.inventory[itemName];
  }

  console.log(gameData.inventory);
}

const updateCondition = (conditionName, conditionStatus) => {
  gameData.conditions[conditionName] = conditionStatus;
}

const updatePlace = (placeName, info) => {
  gameData.place[placeName] = info;
}

///

const itemTypes = {
  travellingClothes: "Travelling Clothes",
  travellingShoes: "Travelling Shoes",
}

const conditionTypes = {
  hasShoes: "hasShoes",
  hunted: "hunted",
}

const placeNames = {
  oysterFarm: "Oyster Farm",
}

const newGameState =  {
  conditions: {
    hasShoes: true,
  },
  eventHistory: {},
  inventory: {
    [itemTypes.travellingShoes]: 2,
    [itemTypes.travellingClothes]: 1,
  },
  places: {},
};

////

let gameData = JSON.parse(localStorage.getItem("gameData")) || newGameState;
gameData = newGameState;

window.onbeforeunload = () => {
  localStorage.setItem("gameData", JSON.stringify(gameData));
}

if (!gameData.eventHistory[1]) {
  runEvent(1);
}