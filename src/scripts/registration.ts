import * as io from "socket.io-client";
// const baseUrl = "https://peachy-ink-production.up.railway.app";
const baseUrl = "http://127.0.0.1:5000";
const userData = {
  username: "",
  password: "",
};
const createGameBtn = document.querySelector(".create-game__button") as HTMLButtonElement;
const createGameOptions = document.querySelector(".create-game__options");

const createGameEvent = (e: Event) => {
  // function createEvent() {
  //   const payLoad = {
  //     "method": "create",
  //     "clientId": clientId,
  //   }
  //   ws.send(JSON.stringify(payLoad));
  // }
  createGameBtn?.classList.add("disabled");
  createGameBtn.disabled = true;
  createGameOptions?.classList.remove("none");
  console.log("click");
};
createGameBtn?.addEventListener("click", createGameEvent);
const socket: io.Socket = io.connect(baseUrl);

const chat = document.querySelector(".chat");
socket.on("message", (message) => {
  const responce = JSON.parse(message);
  switch (responce.method) {
  // case "connect": {
  //   clientId = responce.clientId;
  //   const payLoad = {
  //     method: "connect",
  //     clientId: clientId,
  //     username: userData.username
  //   };
  //   socket.send(JSON.stringify(payLoad));
  case "globalMessage": {
    console.log(responce);
    const messageEl = document.createElement("div");
    messageEl.classList.add("chat-message");
    messageEl.innerHTML = `<div class="chat-message__username">${responce.username}<span class="chat-message__time">00:00</span></div><div class="chat-message__content">${responce.message}</div>`;
    chat?.appendChild(messageEl);
    break;
  }
    //   console.log("clientId: ", clientId);
    //   const messages = responce.messages as Array<{
    //       name: string;
    //       message: string;
    //     }>;
    //   messages.forEach((el) => {
    //     const messageEl = document.createElement("div");
    //     messageEl.classList.add("chat-message");
    //     messageEl.innerHTML = `<div class="chat-message__username">${el.name}<span class="chat-message__time">00:00</span></div><div class="chat-message__content">${el.message}</div>`;
    //     chat?.appendChild(messageEl);
    //   });
    //   break;
    // }
  }
});

const send = (event: Event) => {
  event.preventDefault();
  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  const payLoad = {
    method: "globalMessage",
    username: userData.username,
    message: messageInputEl.value
  };
  socket.send(JSON.stringify(payLoad));
};

const sendBtn = document.querySelector(".submitBtn");

sendBtn?.addEventListener("click", send);



const chatPage = document.querySelector(".chap-page");
const formPage = document.querySelector(".form-page__wrapper");

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

const submitInfo = (event: Event, authorizationType: string, form: { username: string, password: string }) => {
  const target = event.target as HTMLFormElement;
  const errors = target?.querySelectorAll(".error");
  if (!errors.length) {
    createUser(authorizationType, form);
    target.reset();
  }
  const payLoad = {
    method: "autorize",
    username: userData.username
  };
  console.log("killme");
  socket.send(JSON.stringify(payLoad));
};
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const checkInvite = () => {
//   const hash = window.location.hash;
//   if (hash) {
//     // console.log(window.location.hash.split("="));
//     const arr = hash.split("=");
//     const index = arr.indexOf("#gameId");
//     const gameId = arr[index + 1];
//   }
// };

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
  console.log(userData.username);
};

registrationForm?.addEventListener("submit", validateRegistrationForm);
loginForm?.addEventListener("submit", validateLoginForm);

const createUser = async (authorizationType: string, form: { username: string, password: string }) => {
  const result = await fetch(`${baseUrl}/${authorizationType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(form),
  });
  const data = await result.json();
  if (data.message === "Пользователь успешно зарегистрирован") pageSwitch();
  if (data.token) pageSwitch();
  data.message === "Неверный пароль" ? console.log("Неверный пароль") : false;
  return data;
};

const pageSwitch = () => {
  formPage?.classList.toggle("none");
  chatPage?.classList.toggle("none");
};
