// import cors from "cors";
// import express from "express";

// const app = express();

// app.use(cors());

import * as io from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const chat = document.querySelector(".chat");

(socket as any).on("message", (message: any) => {

  const messages = JSON.parse(message) as Array<{
    name: string;
    message: string;
  }>;

  messages.forEach((el) => {
    const messageEl = document.createElement("div");
    messageEl.innerText = `${el.name}: ${el.message}`;
    chat?.appendChild(messageEl);
  });
});

const send = (event: Event) => {
  event.preventDefault();

  const nameInputEl = document.getElementById("name") as HTMLInputElement;
  const name = nameInputEl.value;

  const messageInputEl = document.getElementById("message") as HTMLInputElement;
  const message = messageInputEl.value;

  socket.send(JSON.stringify({ name, message }));
};

const sendBtn = document.querySelector(".submitBtn");

sendBtn?.addEventListener("click", send);
