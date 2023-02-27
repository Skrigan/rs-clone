import { pageSwitch } from "./autorithForm";

const body = document.querySelector(".body");
if (localStorage.getItem("theme") === "dark") {
  body!.classList.add("dark");
  document.querySelector(".sun")!.classList.toggle("icon-invisible");
  document.querySelector(".moon")!.classList.toggle("icon-invisible");
}

// const chatPage = document.querySelector(".chap-page") as HTMLDivElement;
// const formPage = document.querySelector(
//   ".form-page__wrapper"
// ) as HTMLDivElement;
// const header = document.querySelector(".header") as HTMLDivElement;
const settings = document.querySelector(".settings");

const headerFucntions = () => {
  settings?.addEventListener("click", (e) => {
    const currentTarget = e.currentTarget as HTMLElement;

    if (!e.composedPath().includes(document.querySelector(".settings__content")!)) {
      settings!.classList.toggle("settings-open");
    }
  });

  const user = document.querySelector(".user");
  user?.addEventListener("click", () =>
    user.classList.toggle("user-profile--open")
  );

  const exitBtn = document.querySelector(".exit-btn");
  exitBtn?.addEventListener("click", () =>
    // pageSwitch(formPage, chatPage, header)
    location.reload()
  );

  const color = document.querySelector(".color");
  color?.addEventListener("click", () => {
    localStorage.setItem("theme", "dark");
    if (body?.classList.contains("dark")) {
      localStorage.removeItem("theme");
    }
    body!.classList.toggle("dark");
    document.querySelector(".sun")!.classList.toggle("icon-invisible");
    document.querySelector(".moon")!.classList.toggle("icon-invisible");
    // localStorage.setItem("theme", ) TODO: save in LS
  });

  const closeModal = (e: Event) => {
    if (!e.composedPath().includes(document.querySelector(".settings")!) && !e.composedPath().includes(document.querySelector(".user")!)) {
      settings!.classList.remove("settings-open");
      user!.classList.remove("user-profile--open");
    }
    
  };
  
  body?.addEventListener("click", (e) => closeModal(e));
};

export default headerFucntions;