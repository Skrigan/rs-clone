import { pageSwitch } from "./autorithForm";

const chatPage = document.querySelector(".chap-page") as HTMLDivElement;
const formPage = document.querySelector(
  ".form-page__wrapper"
) as HTMLDivElement;
const header = document.querySelector(".header") as HTMLDivElement;
const settings = document.querySelector(".settings");

const headerFucntions = () => {
  settings?.addEventListener("click", () =>
    settings.classList.toggle("settings-open")
  );

  const user = document.querySelector(".user");
  user?.addEventListener("click", () =>
    user.classList.toggle("user-profile--open")
  );

  const exitBtn = document.querySelector(".exit-btn");
  exitBtn?.addEventListener("click", () =>
    pageSwitch(formPage, chatPage, header)
  );

  const color = document.querySelector(".color");
  color?.addEventListener("click", () => {
    document.querySelector(".body")!.classList.toggle("dark");

    // localStorage.setItem("theme", ) TODO: save in LS
  });
};

export default headerFucntions;
