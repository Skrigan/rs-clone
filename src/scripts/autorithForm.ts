import { Socket } from "engine.io-client";
import { successfulRegistrationMessage } from "./successfulRegistration";

const chatPage = document.querySelector(".chap-page") as HTMLDivElement;
const formPage = document.querySelector(".form-page__wrapper") as HTMLDivElement;

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

export const visiblePassword = (event: Event) => {
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

export const checkLength = (...inputsArr: Array<HTMLInputElement>) => {
  for (const input of inputsArr) {
    input.value.length < 3 ? input.classList.add("error") : true;
  }
};

export const checkRegistrationInputLength = (registrationForm: HTMLDivElement, userData: any) => {
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

export const checkLoginInputLength = (loginForm: HTMLDivElement, userData: any) => {
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

export const clearErrors = () => {
  const errors = document.querySelectorAll(".error");
  for (let i = 0; i < errors.length; i++) {
    errors[i].classList.remove("error");
  }
};

export function checkConfirmPassword(registrationForm: HTMLDivElement) {
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

export function isValidEmail(registrationForm: HTMLDivElement) {
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

export const createUser = async (
  authorizationType: string,
  form: { username: string; password: string }, 
  baseUrl: string,
  loginPage: HTMLDivElement,
  header: HTMLDivElement
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
    pageSwitch(formPage, chatPage, header);
    data.message === "Неверный пароль" ? console.log("Неверный пароль") : false;
    const usernameSpan = document.querySelector(".username") as HTMLSpanElement;
    usernameSpan.innerText = localStorage.getItem("isAutorith")!;
    header?.classList.remove("none");
    return data;
  }
};

export const pageSwitch = (formPage: HTMLDivElement, chatPage: HTMLDivElement, header: HTMLDivElement) => {
  formPage?.classList.toggle("none");
  chatPage?.classList.toggle("none");
  header?.classList.toggle("none");
};

export const submitInfo = (
  event: Event,
  authorizationType: string,
  form: { username: string; password: string },
  baseUrl: string, loginPage: HTMLDivElement, header: HTMLDivElement, userData: any, socket: any, gameId: string, Game: any
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



export default formSwitch;