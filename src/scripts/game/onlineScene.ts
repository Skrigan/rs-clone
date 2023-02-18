

import ShotView from "./ShotView";
import Utils from "./utils";
const utils = new Utils;


class OnlineScene {
  userData: any;
  mouse: any;

  constructor(userData: any, mouse: any) {
    this.userData = userData;
    this.mouse = mouse;
    // setTimeout(() => document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true), 1000);
    // console.log("click");
    console.log("userData = ", this.userData);
    // setTimeout(() => {
    //   document.querySelector("[data-scene='preparation']")?.classList.add("none");
    //   userData.opponent.root.classList.remove("none");
    // }, 2000);
    // document
  }

  update() {
    // наводка и выстрел
    const cells = this.userData.opponent.cells.flat();
    cells.forEach((cell: any) => cell.classList.remove("battlefield__item_active"));

    if (utils.isUnderPoint(this.mouse, this.userData.opponent.table)) {
      const cell = cells.find((cell: any) => utils.isUnderPoint(this.mouse, cell));
      if (cell) {
        cell.classList.add("battlefield__item_active");
        if (this.mouse.left && !this.mouse.pLeft) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);


          const shot = new ShotView(x, y);
          this.userData.opponent.addShot(shot);
        }
      }
    }
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