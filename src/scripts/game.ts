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
      this.activeScene = new OnlineScene(this.userData, this.mouse);
      // console.log("click");
      console.log("activeScene = ", this.activeScene);
      this.startRandomGame();
    });

    this.activeScene = new PreparationScene(this.userData, this.mouse);
    requestAnimationFrame(() => this.tick());
    
  }

  startRandomGame() {
    document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true);
  }

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
