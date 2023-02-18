export const incorrectPassword = () => {
  document.querySelector(".incorrect-password")!.classList.add("active");
  setTimeout(() => (document.querySelector(".incorrect-password")!.classList.remove("active")!), 2500);
  location.reload();
};