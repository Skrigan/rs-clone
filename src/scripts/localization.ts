const langObj: any = {
  "settings": {
    "Russian": "Настройки",
    "English": "Settings"
  },
  "leaderboard": {
    "Russian": "Лидеры",
    "English": "Leaders"
  },
  "exit": {
    "Russian": "Выйти",
    "English": "Exit"
  },
  "title": {
    "Russian": "Морской бой",
    "English": "Sea battle"
  },
  "choise1": {
    "Russian": "Случайно",
    "English": "Random"
  },
  "choise2": {
    "Russian": "С другом",
    "English": "With a friend"
  },
  "create": {
    "Russian": "Играть",
    "English": "Play"
  },
  "welcome": {
    "Russian": "Начните свое общение прямо сейчас",
    "English": "Start your conversation right now"
  },
  "random": {
    "Russian": "Играть против случайного противника",
    "English": "Play againgst a random player"
  },
  "callToFight": {
    "Russian": "Вызвать на бой",
    "English": "Call to fight"
  },
  "acceptFight": {
    "Russian": "Принять вызов",
    "English": "Accept a chellange"
  },
  "placeMyself": {
    "Russian": "Расставить вручную",
    "English": "Arrange by hand"
  },
  "placeRandom": {
    "Russian": "Расставить случайно",
    "English": "Arrage randomly"
  },
  "giveUp": {
    "Russian": "Сдаться",
    "English": "Give up"
  },
  "endGame": {
    "Russian": "Закончить игру",
    "English": "End the game"
  },
  
};

const languages = document.querySelectorAll(".language_variant");

changeLanguage();

languages.forEach(lang => {
  lang.addEventListener("click", () => {
    changeStorage(lang as HTMLLIElement);
  });
});

function changeStorage(lang: HTMLLIElement) {
  const mustLang = lang.innerText;

  localStorage.setItem("currentLang", mustLang);

  changeLanguage();
}

function changeLanguage() {
  setBtnsClasses();

  if(!localStorage.getItem("currentLang")) {
    localStorage.setItem("currentLang", "English");
  }

  const currentLang = localStorage.getItem("currentLang");

  for (const text in langObj) {
    const textsToTranslate = document.querySelector(".lang_" + text) as HTMLDivElement;

    if(textsToTranslate) {
      textsToTranslate.innerText = langObj[text][currentLang!];
    }

  }

  const messageInput = document.querySelector(".message") as HTMLInputElement;

  const engLang = currentLang === "English";

  messageInput.placeholder = engLang ? "Add a message" : "Добавить сообщение";

}

function setBtnsClasses() {
  const appButtons = document.querySelectorAll(".app-action");

  appButtons[0].classList.add("random", "lang_random");

  appButtons[1].classList.add("callToFight", "lang_callToFight");

  appButtons[2].classList.add("acceptFight", "lang_acceptFight");

  appButtons[3].classList.add("placeMyself", "lang_placeMyself");

  appButtons[4].classList.add("placeRandom", "lang_placeRandom");

  appButtons[5].classList.add("giveUp", "lang_giveUp");

  appButtons[5].classList.add("endGame", "lang_engGame");  
}