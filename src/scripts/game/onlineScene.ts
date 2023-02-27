import ShotView from "./ShotView";
import PreparationScene from "./preparationScene";

import Utils from "./utils";
const utils = new Utils;


class OnlineScene {
  userData: any;
  mouse: any;
  status = "";
  ownTurn = false;
  activeScene: any;
  startPlay: any = true;
  isRandom: any;

  constructor(userData: any, mouse: any, activeScene: any) {
    this.userData = userData;
    this.mouse = mouse;
    this.activeScene = activeScene;
    this.startRandomGame();
    //adsadsas
    // setTimeout(() => document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true), 1000);
    // console.log("click");
    // console.log("userData = ", this.userData);
    // setTimeout(() => {
    this.userData.socket.emit("shipSet", this.userData.player.ships.map((ship: any) => ({
      size: ship.size,
      direction: ship.direction,
      x: ship.x,
      y: ship.y,
    })));
    this.userData.socket.on("challengeOpponent", (key: any) => {
      console.log(key);
      // history.pushState(null, null, `/${key}`);
      window.location.hash = key;
      alert("Первый, кто перейдёт по текущей ссылке, попадёт на бой с вами");
    });
    this.userData.socket.on("statusChange", (status: any) => {
      console.log("(status change), STATUS: ", status);
      this.status = status;
      this.statusUpdate();
    });
    this.userData.socket.on("turnUpdate", (ownTurn: any) => {
      this.ownTurn = ownTurn;
      this.statusUpdate();
    });
    this.userData.socket.on("setShots", (ownShots: any, opponentShots: any) => {
      this.userData.player.removeAllShots();

      for (const { x, y, variant } of ownShots) {
        const shot = new ShotView(x, y, variant);
        this.userData.player.addShot(shot);
      }

      this.userData.opponent.removeAllShots();

      for (const { x, y, variant } of opponentShots) {
        const shot = new ShotView(x, y, variant);
        this.userData.opponent.addShot(shot);
      }
    });
    this.statusUpdate();
    // }, 2000);
    // document
  }

  startRandomGame() {
    document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true);
  }

  changeAppActions() {
    const appActions = document.querySelector(".app-actions") as HTMLElement;
    appActions.classList.add("app-actions_online");
    // console.log(appActions);
    // appActions.querySelector("[data-scene='preparation']")?.classList.add("none");
    appActions.querySelector("[data-type='random']")?.classList.add("none");
    appActions.querySelector("[data-type='challenge']")?.classList.add("none");
    appActions.querySelector("[data-type='takeChallenge']")?.classList.add("none");
    appActions.querySelector("[data-action='manually']")?.classList.add("none");
    appActions.querySelector("[data-action='randomize']")?.classList.add("none");
    appActions.querySelector("[data-action='gaveUp']")?.classList.remove("none");
    appActions.querySelector(".game-status")?.classList.remove("none");
    document.querySelector(".chat-wrapper")?.classList.add("none");

  }

  statusUpdate() {
    const gameStatusElement = document.querySelector(".game-status")!;
    if (this.status === "randomFinding") {
      this.changeAppActions();
      gameStatusElement.textContent = "Поиск случайного соперника";
      // console.log("Поиск случайного соперника");
    } else if (this.status === "play") {
      if (this.startPlay) {
        // document.querySelector("[data-scene='preparation']")?.classList.add("none");
        document.querySelector(".chap-page")?.classList.add("chap-page__active");
        this.userData.opponent.root.classList.remove("none");
        (document.querySelector("[data-action='gaveUp']") as HTMLButtonElement).disabled = false;
        this.startPlay = false;
        console.log("firstTry");
      }
      gameStatusElement.textContent = this.ownTurn ? "Ваш ход" : "Ход соперника";
      // console.log(this.ownTurn ? "Ваш ход" : "Ход соперника");
    } else if (this.status === "winner") {
      gameStatusElement.textContent = "Вы победили";
      this.addExitBtn();
      // console.log("Вы победили");
    } else if (this.status === "loser") {
      gameStatusElement.textContent = "Вы проиграли";
      this.addExitBtn();
      // console.log("Вы проиграли");
    } else if (this.status === "ezwin") {
      gameStatusElement.textContent = "Вы победили, противник сдался";
      this.addExitBtn();
    } else if (this.status === "gaveup") {
      gameStatusElement.textContent = "Вы сдались";
      this.addExitBtn();
    } else if (this.status === "waiting") {
      this.changeAppActions();
      gameStatusElement.textContent = "Ожидание соперника";
    }
  }

  addExitBtn() {
    //TODO: Дописать смену кнопки giveup на again !!!!!!!!!!!!!!!!!!!!
    // window.location.href.split("#")[0];
    history.pushState("", document.title, window.location.pathname);

    const gaveUpBtn = document.querySelector("[data-action='gaveUp']") as HTMLButtonElement;
    gaveUpBtn.classList.add("none");
    gaveUpBtn.disabled = true;

    const againBtn = document.querySelector("[data-action='again']") as HTMLButtonElement;
    againBtn.classList.remove("none");
    againBtn.disabled = false;
  }



  update() {
    const cells = this.userData.opponent.cells.flat();
    cells.forEach((x: any) => x.classList.remove("battlefield__item_active"));

    // if(["loser", "winner"].includes(this.status)) {
    //   document.querySelector(".game-status")!.textContent = "Вы победили, противник сдался";
    // }

    //убрать!!!!!!!!!!!!!!!!!!
    // if (this.userData.player.loser) {
    //   return;
    // }

    if (this.userData.opponent.isUnder(this.mouse)) {
      const cell = this.userData.opponent.cells
        .flat()
        .find((cell: any) => utils.isUnderPoint(this.mouse, cell));

      if (cell) {
        cell.classList.add("battlefield__item_active");

        if (this.mouse.left && !this.mouse.pLeft) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          this.userData.socket.emit("addShot", x, y);
        }
      }
    }

    // if (["loser", "winner"].includes(this.status)) {
    //   const sceneActionsBar = document.querySelector('[data-scene="online"]');

    //   const againButton = sceneActionsBar.querySelector(
    //     '[data-action="again"]'
    //   );
    //   const gaveupButton = sceneActionsBar.querySelector(
    //     '[data-action="gaveup"]'
    //   );

    //   againButton.classList.remove("hidden");
    //   gaveupButton.classList.add("hidden");
    // }

    // if (player.loser) {
    //   return;
    // }






    // наводка и выстрел
    // const cells = this.userData.opponent.cells.flat();
    // cells.forEach((cell: any) => cell.classList.remove("battlefield__item_active"));

    // if (utils.isUnderPoint(this.mouse, this.userData.opponent.table)) {
    //   const cell = cells.find((cell: any) => utils.isUnderPoint(this.mouse, cell));
    //   if (cell) {
    //     cell.classList.add("battlefield__item_active");
    //     if (this.mouse.left && !this.mouse.pLeft) {
    //       const x = parseInt(cell.dataset.x);
    //       const y = parseInt(cell.dataset.y);


    //       const shot = new ShotView(x, y);
    //       this.userData.opponent.addShot(shot);
    //     }
    //   }
    // }

  }

}
// actionsBar = null;
// status = "";

// init() {
// const actionsBar = document.querySelector('[data-scene="online"]');
// this.actionsBar = actionsBar;

// const { socket } = this.app;

// socket.on("statusChange", (status) => {
//   this.status = status;
//   this.statusUpdate();
// });

// this.statusUpdate();
// }

// start(variant) {
// const { socket } = this.app;

// socket.emit("findRandomOpponent");

// document
//   .querySelectorAll(".app-actions")
//   .forEach((element) => element.classList.add("hidden"));

// document.querySelector('[data-scene="online"]').classList.remove("hidden");

// this.statusUpdate();
// }

// statusUpdate() {
//   const statusDiv = this.actionsBar.querySelector(".battlefield-status");

//   if (!this.status) {
//     statusDiv.textContent = "";
//   } else if (this.status === "randomFinding") {
//     statusDiv.textContent = "Поиск случайного соперника";
//   }
// }


export default OnlineScene;