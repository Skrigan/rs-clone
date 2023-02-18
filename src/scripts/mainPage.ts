import * as io from "socket.io-client";
import formSwitch from "./autorithForm";
import {
  visiblePassword,
  checkRegistrationInputLength,
  checkLoginInputLength,
  clearErrors,
  checkConfirmPassword,
  isValidEmail,
  submitInfo
} from "./autorithForm";
import headerFucntions from "./headerFunctions";

// export const baseUrl = "https://peachy-ink-production.up.railway.app";
export const baseUrl = "http://localhost:5000";

const header = document.querySelector(".header") as HTMLDivElement;

header?.classList.add("none");

// autorithCheck();  // TODO better autorithation
// function autorithCheck() {
//   if(localStorage.getItem("isAutorith")) {
//     formPage?.classList.add("none");
//     chatPage?.classList.remove("none");

//     header?.classList.remove("none");

//     const usernameSpan = document.querySelector(".username") as HTMLSpanElement;
//     usernameSpan.innerText = localStorage.getItem("isAutorith")!;
//   }
// }

import Game from "./game";
const userData = {
  username: "",
  password: "",
  player: "",
  opponent: "",
};

let gameId: string;
const createGameBtn = document.querySelector(
  ".create-game__button"
) as HTMLButtonElement;
const createGameOptions = document.querySelector(".create-game__options");

const createGameEvent = () => {
  createGameBtn?.classList.add("disabled");
  createGameBtn.disabled = true;
  const payLoad = {
    method: "create",
    // username: userName,
    username: userData.username,
  };
  socket.send(JSON.stringify(payLoad));
};

createGameBtn?.addEventListener("click", createGameEvent);
const socket: io.Socket = io.connect(baseUrl);

const setMessageTime = () => {
  const actualTime = new Date();

  let actualMinutes: number | string = actualTime.getMinutes();
  let actualHours: number | string = actualTime.getHours();

  if (actualMinutes < 10) {
    actualMinutes = "0" + actualMinutes;
  }
  if (actualHours < 10) {
    actualHours = "0" + actualHours;
  }

  return `${actualHours}:${actualMinutes}`;
};

const chat = document.querySelector(".chat");
socket.on("message", (message) => {
  const responce = JSON.parse(message);
  switch (responce.method) {
  case "create": {
    gameId = responce.gameId;
    (
        document.querySelector(".create-game__input") as HTMLInputElement
    ).value = `${window.location.href}#gameId=${gameId}`;
    createGameOptions?.classList.remove("none");
    break;
  }
  case "globalMessage": {
    if (responce.message !== "") {
      const messageEl = document.createElement("div");
      messageEl.classList.add("chat-message");
      messageEl.innerHTML = `<div class="chat-message__username">${
        responce.username
      }<span class="chat-message__time">${setMessageTime()}</span></div><div class="chat-message__content">${
        responce.message
      }</div>`;
      chat?.appendChild(messageEl);
    }
    break;
  }
  case "start": {
    console.log("enemyName: ", responce.enemyName);
  }
  }
});

const sendMessage = (event: Event) => {
  event.preventDefault();
  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  // const userName = (document.querySelector(".username") as HTMLSpanElement).innerText;
  const payLoad = {
    method: "globalMessage",
    username: userData.username,
    // username: userName,
    message: messageInputEl.value,
  };
  socket.send(JSON.stringify(payLoad));
  messageInputEl.value = "";
};
const sendBtn = document.querySelector(".submitBtn") as HTMLButtonElement;
const body = document.querySelector("body");
sendBtn?.addEventListener("click", sendMessage);
body!.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    sendBtn.click();
  }
});

/////////////////////switch form

const formHeader = document.querySelector(".form-header") as HTMLElement;
formHeader?.addEventListener("click", formSwitch);

/////////////////////visible password

const formContainer = document.querySelector(".form-container");
formContainer?.addEventListener("click", visiblePassword);

//////////////////////validate input

const registrationForm = document.querySelector(
  ".registration-form"
) as HTMLDivElement;
const loginForm = document.querySelector(".login-form") as HTMLDivElement;

const validateRegistrationForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkConfirmPassword(registrationForm);
  checkRegistrationInputLength(registrationForm, userData);
  isValidEmail(registrationForm);
  submitInfo(event, "registration", userData, baseUrl, loginPage, header, userData, socket, gameId, Game, false);

  location.reload(); // TODO do better
};

const validateLoginForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkLoginInputLength(loginForm, userData);
  submitInfo(event, "login", userData, baseUrl, loginPage, header, userData, socket, gameId, Game, true);
  console.log("username: ", userData.username);
};

registrationForm?.addEventListener("submit", validateRegistrationForm);
loginForm?.addEventListener("submit", validateLoginForm);

const loginPage = document.querySelector(".login-title") as HTMLDivElement;

headerFucntions(); // settings, user, leaders
