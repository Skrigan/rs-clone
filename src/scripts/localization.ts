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
};

// const allLangs = ["English", "Russian"];

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
  if(!localStorage.getItem("currentLang")) {
    localStorage.setItem("currentLang", "English");
  }

  const currentLang = localStorage.getItem("currentLang");

  for (const text in langObj) {
    const textsToTranslate = document.querySelector(".lang_" + text) as HTMLDivElement;

    if(textsToTranslate) {
      textsToTranslate.innerText = langObj[text][currentLang!];
    }

    // textsToTranslate.innerText = langObj[text][currentLang!];
  }

  const messageInput = document.querySelector(".message") as HTMLInputElement;

  const engLang = currentLang === "English";

  messageInput.placeholder = engLang ? "Add a message" : "Добавить сообщение";
}


