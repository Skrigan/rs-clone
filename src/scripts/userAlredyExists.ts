export const userAlredyExists = () => {
  document.querySelector(".user-exists")!.classList.add("active");
  setTimeout(() => (document.querySelector(".user-exists")!.classList.remove("active")!), 2500);
};