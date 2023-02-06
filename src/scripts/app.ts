type Message = {
  method: string;
  clientId: string;
  messages: Array<{ name: string, message: string }>
}

// const ws = new WebSocket("wss://rs-clone-api-production.up.railway.app");
const ws = new WebSocket("ws://127.0.0.1:3000");

const chat = document.querySelector(".chat")!;
const btnCreate = document.querySelector("#btnCreate")!;
const btnJoin = document.querySelector("#btnJoin")!;
const txtGameId = document.querySelector("#txtGameId") as HTMLInputElement;
const divPlayers = document.querySelector("#divPlayers")!;



let clientId: string;
let gameId: string;

// const chatCont = document.querySelector(".chat-cont")?.classList.toggle("hidden");
// const changeChatVisability = () {}


//CREATE GAME
btnCreate?.addEventListener("click", (e) => {
  const payLoad = {
    "method": "create",
    "clientId": clientId,
  }
  ws.send(JSON.stringify(payLoad));
})
btnJoin?.addEventListener("click", (e) => {
  if (!gameId) gameId = txtGameId.value;
  const payLoad = {
    "method": "join",
    "clientId": clientId,
    "gameId": gameId,
  }
  ws.send(JSON.stringify(payLoad));

})

ws.onmessage = (message) => {
  // const messages = JSON.parse(message.data) as Array<{name: string, message: string}>;
  const responce = JSON.parse(message.data) as any;
  switch (responce.method) {
    case "connect": {
      clientId = responce.clientId;
      console.log("clientId: ", clientId);
      break;
    }
    case "create": {
      gameId = responce.game.id;
      console.log("gameId: ", gameId);
      break;
    }
    case "join": {
      const game = responce.game;

      while (divPlayers?.firstChild) divPlayers?.removeChild(divPlayers.firstChild!);

      game.clients.forEach((c: any) => {
        const d = document.createElement("div");
        d.style.width = "200px";
        d.style.background = c.color;
        d.textContent = c.clientId;
        divPlayers.appendChild(d);
      })
      // console.log("gameId: ", gameId);
      break;
    }
  }
  // if (responce.method === "connect") {
  //   clientId = responce.clientId;
  //   console.log("clientId: ", clientId)
  // }
  // if ()
  // messages.forEach(el => {
  // responce.messages.forEach(el => {
  //   const messageEl = document.createElement("div");
  //   messageEl.innerText = `${el.name}: ${el.message}`;
  //   chat?.appendChild(messageEl);
  // });
};

const send = (event: Event) => {
  event.preventDefault();

  const nameInputEl = document.getElementById("name") as HTMLInputElement;
  const name = nameInputEl.value;

  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  const message = messageInputEl.value;

  ws.send(JSON.stringify({ name, message }));

};

const sendBtn = document.querySelector(".submitBtn");

// const formEl = document.getElementById("messageForm");

// formEl?.addEventListener("submit", send);

sendBtn?.addEventListener("click", send);





