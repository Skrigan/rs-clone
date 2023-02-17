import * as io from "socket.io-client";
// import { successfulRegistrationMessage } from "./";
import { successfulRegistrationMessage } from "./successfulRegistration";
import formSwitch from "./autorithForm";
import { visiblePassword, checkRegistrationInputLength, checkLoginInputLength, clearErrors, checkConfirmPassword, isValidEmail, createUser, pageSwitch } from "./autorithForm";
// import path from "path";
export const baseUrl = "https://peachy-ink-production.up.railway.app";
// export const baseUrl = "http://localhost:5000";

const chatPage = document.querySelector(".chap-page") as HTMLDivElement;
const formPage = document.querySelector(".form-page__wrapper") as HTMLDivElement;
const header = document.querySelector(".header") as HTMLDivElement;

header?.classList.add("none");

// autorithCheck();

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
  opponent: ""
};

let gameId: string;
const createGameBtn = document.querySelector(
  ".create-game__button"
) as HTMLButtonElement;
const createGameOptions = document.querySelector(".create-game__options");

// const userName = (document.querySelector(".username") as HTMLSpanElement).innerText;

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
    if(responce.message !== "") {
      const messageEl = document.createElement("div");
      messageEl.classList.add("chat-message");
      messageEl.innerHTML = `<div class="chat-message__username">${responce.username}<span class="chat-message__time">${setMessageTime()}</span></div><div class="chat-message__content">${responce.message}</div>`;
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

const registrationForm = document.querySelector(".registration-form") as HTMLDivElement;
const loginForm = document.querySelector(".login-form") as HTMLDivElement;

const submitInfo = (
  event: Event,
  authorizationType: string,
  form: { username: string; password: string }
) => {
  if (authorizationType === "login") {
    localStorage.setItem("isAutorith", `${form.username}`);
  }

  const target = event.target as HTMLFormElement;
  const errors = target?.querySelectorAll(".error");

  if (!errors.length) {
    createUser(authorizationType, form, baseUrl, loginPage, header);
    target.reset();
    const payLoad = {
      method: "autorize",
      // username: userName,
      username: userData.username,
    };
    socket.send(JSON.stringify(payLoad));
    const hash = window.location.hash;
    if (hash) {
      const arr = hash.split("=");
      const index = arr.indexOf("#gameId");
      gameId = arr[index + 1];
      const payLoad = {
        method: "join",
        // username: userName,
        username: userData.username,
        gameId: gameId,
      };
      socket.send(JSON.stringify(payLoad));
    }
    const game = new Game(userData);
    console.log(userData);
  }
};

const validateRegistrationForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkConfirmPassword(registrationForm);
  checkRegistrationInputLength(registrationForm, userData);
  isValidEmail(registrationForm);
  submitInfo(event, "registration", userData);
};

const validateLoginForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkLoginInputLength(loginForm, userData);
  submitInfo(event, "login", userData);
  console.log("username: ", userData.username);
};

registrationForm?.addEventListener("submit", validateRegistrationForm);
loginForm?.addEventListener("submit", validateLoginForm);

const loginPage = document.querySelector(".login-title") as HTMLDivElement;

const settings = document.querySelector(".settings");
settings?.addEventListener("click", () =>
  settings.classList.toggle("settings-open")
);

const user = document.querySelector(".user");
user?.addEventListener("click", () => user.classList.toggle("user-profile--open"));

const exitBtn = document.querySelector(".exit-btn");
exitBtn?.addEventListener("click", () => pageSwitch(formPage, chatPage, header));

const color = document.querySelector(".color");
color?.addEventListener("click", () => document.querySelector(".body")!.classList.toggle("dark"));

