import * as io from "socket.io-client";
import { successfulRegistrationMessage } from "./successfulRegistration";
import path from "path";
export const baseUrl = "https://peachy-ink-production.up.railway.app";
// const baseUrl = "http://127.0.0.1:5000";
console.log(window.location.pathname);


const chatPage = document.querySelector(".chap-page");
const formPage = document.querySelector(".form-page__wrapper");

autorithCheck();

function autorithCheck() {
  if(localStorage.getItem("isAutorith") === "true") {
    formPage?.classList.add("none");
    chatPage?.classList.remove("none");
  }
}

const userData = {
  username: "",
  password: "",
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
    username: userData.username,
  };
  socket.send(JSON.stringify(payLoad));
};

createGameBtn?.addEventListener("click", createGameEvent);
const socket: io.Socket = io.connect(baseUrl);

const actualTime = new Date();

const timeString = `${actualTime.getHours()}:${actualTime.getMinutes()}`;

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
    const messageEl = document.createElement("div");
    messageEl.classList.add("chat-message");
    messageEl.innerHTML = `<div class="chat-message__username">${responce.username}<span class="chat-message__time">${timeString}</span></div><div class="chat-message__content">${responce.message}</div>`;
    chat?.appendChild(messageEl);
    break;
  }
  case "start": {
    console.log("enemyName: ", responce.enemyName);
  }
  }
});

const send = (event: Event) => {
  event.preventDefault();
  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  const payLoad = {
    method: "globalMessage",
    username: userData.username,
    message: messageInputEl.value,
  };
  socket.send(JSON.stringify(payLoad));
};
const sendBtn = document.querySelector(".submitBtn");
sendBtn?.addEventListener("click", send);

/////////////////////switch form
const formHeader = document.querySelector(".form-header") as HTMLElement;

const formSwitch = (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("login-title")) {
    document.querySelector(".login-title")?.classList.add("active");
    document.querySelector(".registration-title")?.classList.remove("active");
    document.querySelector(".registration-form")?.classList.remove("active");
    document.querySelector(".login-form")?.classList.add("active");
  }

  if (target.classList.contains("registration-title")) {
    document.querySelector(".registration-title")?.classList.add("active");
    document.querySelector(".login-title")?.classList.remove("active");
    document.querySelector(".registration-form")?.classList.add("active");
    document.querySelector(".login-form")?.classList.remove("active");
  }
};

formHeader?.addEventListener("click", formSwitch);

/////////////////////visible password
const visiblePassword = (event: Event) => {
  const target = event.target as HTMLElement;
  const parentTarget = target.parentElement as HTMLElement;
  const passwordInput =
    parentTarget.parentElement?.querySelector(".password-input");

  if (parentTarget.classList.contains("password-control")) {
    if (target.classList.contains("visible-password")) {
      target.setAttribute("src", "assets/images/password-on.svg");
      passwordInput?.setAttribute("type", "password");
    } else {
      target.setAttribute("src", "assets/images/password-off.svg");
      passwordInput?.setAttribute("type", "text");
    }
    target.classList.toggle("visible-password");
  }
};

const formContainer = document.querySelector(".form-container");
formContainer?.addEventListener("click", visiblePassword);

//////////////////////validate input
const registrationForm = document.querySelector(".registration-form");
const loginForm = document.querySelector(".login-form");

const checkLength = (...inputsArr: Array<HTMLInputElement>) => {
  for (const input of inputsArr) {
    input.value.length < 3 ? input.classList.add("error") : true;
  }
};

const checkRegistrationInputLength = () => {
  const firstPassword = registrationForm?.querySelector(
    ".first-password"
  ) as HTMLInputElement;
  const confirmPassword = registrationForm?.querySelector(
    ".confirm-password"
  ) as HTMLInputElement;
  const username = registrationForm?.querySelector(
    ".username-input"
  ) as HTMLInputElement;
  userData.username = username.value;
  userData.password = firstPassword.value;
  checkLength(firstPassword, confirmPassword, username);
};

const checkLoginInputLength = () => {
  const password = loginForm?.querySelector(
    ".password-input"
  ) as HTMLInputElement;
  const username = loginForm?.querySelector(
    ".username-input"
  ) as HTMLInputElement;
  userData.username = username.value;
  userData.password = password.value;
  checkLength(password, username);
};

const clearErrors = () => {
  const errors = document.querySelectorAll(".error");
  for (let i = 0; i < errors.length; i++) {
    errors[i].classList.remove("error");
  }
};

function checkConfirmPassword() {
  const firstPassword = registrationForm?.querySelector(
    ".first-password"
  ) as HTMLInputElement;
  const confirmPassword = registrationForm?.querySelector(
    ".confirm-password"
  ) as HTMLInputElement;

  if (firstPassword.value !== confirmPassword.value) {
    firstPassword.classList.add("error");
    confirmPassword.classList.add("error");
  }
}

function isValidEmail() {
  const emailInput = registrationForm?.querySelector(
    ".email-address__input"
  ) as HTMLInputElement;
  if (
    !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
      emailInput.value
    )
  ) {
    emailInput.classList.add("error");
  }
}

const submitInfo = (
  event: Event,
  authorizationType: string,
  form: { username: string; password: string }
) => {
  if(authorizationType === "login") {
    localStorage.setItem("isAutorith", "true");
  }

  const target = event.target as HTMLFormElement;
  const errors = target?.querySelectorAll(".error");
  if (!errors.length) {
    createUser(authorizationType, form);
    target.reset();
    const payLoad = {
      method: "autorize",
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
        username: userData.username,
        gameId: gameId,
      };
      socket.send(JSON.stringify(payLoad));
    }
  }
};

const validateRegistrationForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkConfirmPassword();
  checkRegistrationInputLength();
  isValidEmail();
  submitInfo(event, "registration", userData);
};

const validateLoginForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkLoginInputLength();
  submitInfo(event, "login", userData);
  console.log("username: ", userData.username);
};

registrationForm?.addEventListener("submit", validateRegistrationForm);
loginForm?.addEventListener("submit", validateLoginForm);

const loginPage = document.querySelector(".login-title") as HTMLDivElement;

const createUser = async (
  authorizationType: string,
  form: { username: string; password: string }
) => {
  const result = await fetch(`${baseUrl}/${authorizationType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(form),
  });
  const data = await result.json();
  if (data.message === "Пользователь успешно зарегистрирован") {
    loginPage.click();
    successfulRegistrationMessage();
    
  }
  if (data.token) {
    pageSwitch();
    data.message === "Неверный пароль" ? console.log("Неверный пароль") : false;
    return data;
  }
};

const pageSwitch = () => {
  formPage?.classList.toggle("none");
  chatPage?.classList.toggle("none");
};

