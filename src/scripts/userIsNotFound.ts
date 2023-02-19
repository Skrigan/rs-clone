export const userIsNotFound = () => {
  document.querySelector(".no-user")!.classList.add("active");
  setTimeout(() => (document.querySelector(".no-user")!.classList.remove("active")!), 2500);
};