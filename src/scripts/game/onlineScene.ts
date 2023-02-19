

import ShotView from "./ShotView";
import Utils from "./utils";
const utils = new Utils;


class OnlineScene {
  userData: any;
  mouse: any;
  status = "";
  ownTurn = false;

  constructor(userData: any, mouse: any) {
    this.userData = userData;
    this.mouse = mouse;
    // setTimeout(() => document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true), 1000);
    // console.log("click");
    console.log("userData = ", this.userData);
    // setTimeout(() => {
    document.querySelector("[data-scene='preparation']")?.classList.add("none");
    userData.opponent.root.classList.remove("none");
    this.userData.socket.emit("shipSet", this.userData.player.ships.map((ship: any) => ({
      size: ship.size,
      direction: ship.direction,
      x: ship.x,
      y: ship.y,
    })));
    this.userData.socket.emit("findRandomOpponent");
    this.userData.socket.on("statusChange", (status: any) => {
      console.log("(status change), STATUS: ", status);
      this.status = status;
      // this.statusUpdate();
    });
    this.userData.socket.on("turnUpdate", (ownTurn: any) => {
      this.ownTurn = ownTurn;
      // this.statusUpdate();
    });
    this.userData.socket.on("setShots", (ownShots: any, opponentShots: any) => {
      this.userData.player.removeAllShots();

      for (const {x, y, variant} of ownShots) {
        const shot = new ShotView(x, y, variant);
        this.userData.player.addShot(shot);
      }

      this.userData.opponent.removeAllShots();

      for (const {x, y, variant} of opponentShots) {
        const shot = new ShotView(x, y, variant);
        this.userData.opponent.addShot(shot);
      }
      console.log("afterShot: ", this.userData);
    });
    // this.statusUpdate();

    // }, 2000);
    // document
  }



  update() {

    // const { mouse, opponent, player, socket } = this.app;

    const cells = this.userData.opponent.cells.flat();
    cells.forEach((x: any) => x.classList.remove("battlefield-item__active"));

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

    if (this.userData.opponent.isUnder(this.mouse)) {
      const cell = this.userData.opponent.cells
        .flat()
        .find((cell: any) => utils.isUnderPoint(this.mouse, cell));

      if (cell) {
        cell.classList.add("battlefield-item__active");

        if (this.mouse.left && !this.mouse.pLeft) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          this.userData.socket.emit("addShot", x, y);
        }
      }
    }




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