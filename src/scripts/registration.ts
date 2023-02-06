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
}

formHeader?.addEventListener("click", formSwitch);


/////////////////////visible password
const visiblePassword = (event: Event) => {
  const target = event.target as HTMLElement;
  const parentTarget = target.parentElement as HTMLElement;
  const passwordInput = parentTarget.parentElement?.querySelector(".password-input");

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
}

const formContainer = document.querySelector(".form-container");
formContainer?.addEventListener("click", visiblePassword);

//////////////////////validate
const registrationForm = document.querySelector(".registration-form");

const checkLength = (data: string) => {

}

function checkConfirmPassword(event: Event) {
  event.preventDefault()
  const firstPassword = registrationForm?.querySelector(".first-password") as HTMLInputElement;
  const confirmPassword = registrationForm?.querySelector(".confirm-password") as HTMLInputElement;

  if (firstPassword.value !== confirmPassword.value) {
    firstPassword.classList.add("error");
    confirmPassword.classList.add("error");
  }  
  return firstPassword.value === confirmPassword.value;
}

registrationForm?.addEventListener("submit", checkConfirmPassword)