import BattlefieldView from "./game/battlefieldView";
import ShipView from "./game/shipView";
import ShotView from "./game/ShotView";
import Mouse from "./game/mouse";
// import Utils from "./game/utils";
import PreparationScene from "./game/preparationScene";
import OnlineScene from "./game/OnlineScene";

// const utils = new Utils;

class Game {
  mouse!: Mouse;
  userData: any;
  activeScene: any;

  constructor(userData: any) {
    this.userData = userData;
    this.userData.player = new BattlefieldView(true);
    this.userData.opponent = new BattlefieldView(false);
    this.mouse = new Mouse(document.body);
    document.querySelector("[data-side='player']")?.append(this.userData.player.root);
    document.querySelector("[data-side='opponent']")?.append(this.userData.opponent.root);
    document.querySelector("[data-type='random']")?.addEventListener("click", () => { 
      this.activeScene = new OnlineScene(this.userData, this.mouse, this.activeScene);
      // console.log("click");
      console.log("activeScene = ", this.activeScene);
      // this.startRandomGame();
    });
    (document.querySelector("[data-action='gaveUp']") as HTMLButtonElement).addEventListener("click", () => {
      this.userData.socket.emit("gaveup");
      // document.querySelector(".game-status")!.textContent = "Вы сдались";
      // this.activeScene = new PreparationScene(this.userData, this.mouse);
      // this.userData.opponent.clear();
      // this.userData.player.removeAllShots();
      // this.userData.player.ships.forEach((ship: any) => (ship.killed = false));
      // console.log("АКТИВКА: ", this.activeScene);
    });

    this.activeScene = new PreparationScene(this.userData, this.mouse);
    this.activeScene.manually();
    document.querySelector("[data-action='manually']")?.addEventListener("click", () => this.activeScene.manually());
    document.querySelector("[data-action='randomize']")?.addEventListener("click", () => this.activeScene.start());
    requestAnimationFrame(() => this.tick());
    
  }

  // startRandomGame() {
  //   document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true);
  // }

  tick() {
    requestAnimationFrame(() => this.tick());
    // console.log("aaa");
    if (this.activeScene) {
      this.activeScene.update();
    }

    this.mouse.tick();
  }


}

export default Game;
