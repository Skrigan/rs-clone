import BattlefieldView from "./game/battlefieldView";
import ShipView from "./game/shipView";
import ShotView from "./game/ShotView";
import Mouse from "./game/mouse";
import Utils from "./game/utils";
import PreparationScene from "./game/preparationScene";
const utils = new Utils;
// type Scene = {
//   prepatation?: PreparationScene;
// }
// const shipDatas: {
//   size: number,
//   direction: string,
//   startX: number,
//   startY: number
// }[] = [
//   { size: 4, direction: "row", startX: 10, startY: 345 },
//   { size: 3, direction: "row", startX: 10, startY: 390 },
//   { size: 3, direction: "row", startX: 120, startY: 390 },
//   { size: 2, direction: "row", startX: 10, startY: 435 },
//   { size: 2, direction: "row", startX: 88, startY: 435 },
//   { size: 2, direction: "row", startX: 167, startY: 435 },
//   { size: 1, direction: "row", startX: 10, startY: 480 },
//   { size: 1, direction: "row", startX: 55, startY: 480 },
//   { size: 1, direction: "row", startX: 100, startY: 480 },
//   { size: 1, direction: "row", startX: 145, startY: 480 },
// ];

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
    this.activeScene = new PreparationScene(this.userData, this.mouse);
    requestAnimationFrame(() => this.tick());
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    if (this.activeScene) {
      this.activeScene.update();
    }

    this.mouse.tick();
  }


}

export default Game;
