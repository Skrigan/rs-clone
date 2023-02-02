const chat = document.querySelector(".chat");
const ws = new WebSocket("rs-clone-api-production.up.railway.app:8000");

ws.onmessage = (message) => {
  const messages = JSON.parse(message.data) as Array<{name: string, message: string}>;

  messages.forEach(el => {
    const messageEl = document.createElement("div");
    messageEl.innerText = `${el.name}: ${el.message}`;
    chat?.appendChild(messageEl);
  });
};

const send = (event: Event) => {
  event.preventDefault();

  const nameInputEl = document.getElementById("name") as HTMLInputElement;
  const name = nameInputEl.value;

  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  const message = messageInputEl.value;

  ws.send(JSON.stringify({name, message}));

};

const sendBtn = document.querySelector(".submitBtn");

// const formEl = document.getElementById("messageForm");

// formEl?.addEventListener("submit", send);

sendBtn?.addEventListener("click", send);




 
