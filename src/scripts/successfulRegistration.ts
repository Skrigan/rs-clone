export const successfulRegistrationMessage = () => {
  console.log("successful");
  setTimeout(messageTime, 1000);
};

const messageTime = () => {
  document.querySelector(".successful-registration")!.classList.add("active");
  setTimeout(() => (document.querySelector(".successful-registration")!.classList.remove("active")!), 2500);
};