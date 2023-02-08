// const baseUrl = "http://localhost:5000";
const baseUrl = "https://peachy-ink-production.up.railway.app";
const RegistrationForm = {
  username: "",
  password: "",
};

const LoginForm = {
  username: "",
  password: "",
};

/////////////////////switch form
const formHeader = document.querySelector(".form-header") as HTMLElement;

const formSwitch = (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("login-title")) {
    document.querySelector(".login-title")!.classList.add("active");
    document.querySelector(".registration-title")!.classList.remove("active");
    document.querySelector(".registration-form")!.classList.remove("active");
    document.querySelector(".login-form")!.classList.add("active");
  }

  if (target.classList.contains("registration-title")) {
    document.querySelector(".registration-title")!.classList.add("active");
    document.querySelector(".login-title")!.classList.remove("active");
    document.querySelector(".registration-form")!.classList.add("active");
    document.querySelector(".login-form")!.classList.remove("active");
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
  RegistrationForm.username = username.value;
  RegistrationForm.password = firstPassword.value;
  checkLength(firstPassword, confirmPassword, username);
};

const checkLoginInputLength = () => {
  const password = loginForm?.querySelector(
    ".password-input"
  ) as HTMLInputElement;
  const username = loginForm?.querySelector(
    ".username-input"
  ) as HTMLInputElement;
  LoginForm.username = username.value;
  LoginForm.password = password.value;
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

const submitInfo = (event: Event) => {
  const target = event.target as HTMLElement;
  const errors = target?.querySelectorAll(".error");
  if (!errors.length) {
    target.classList.contains("login-form") ? console.log(LoginForm) : false;
    target.classList.contains("registration-form")
      ? console.log(RegistrationForm)
      : false;
    createUser();
  }
};

const validateRegistrationForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkConfirmPassword();
  checkRegistrationInputLength();
  isValidEmail();
  submitInfo(event);
};

const validateLoginForm = (event: Event) => {
  event.preventDefault();
  clearErrors();
  checkLoginInputLength();
  submitInfo(event);
};

registrationForm?.addEventListener("submit", validateRegistrationForm);
loginForm?.addEventListener("submit", validateLoginForm);

const createUser = async () => {
  console.log(RegistrationForm);
  await fetch(`${baseUrl}/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(RegistrationForm),
  });
};
