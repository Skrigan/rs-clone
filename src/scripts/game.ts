import BattlefieldView from "./game/battlefieldView";
import ShipView from "./game/shipView";
import Mouse from "./game/mouse";
import Utils from "./game/utils";
const utils = new Utils;
// type Scene = {
//   prepatation?: PreparationScene;
// }
const shipDatas: {
  size: number,
  direction: string,
  startX: number,
  startY: number
}[] = [
  { size: 4, direction: "row", startX: 10, startY: 345 },
  { size: 3, direction: "row", startX: 10, startY: 390 },
  { size: 3, direction: "row", startX: 120, startY: 390 },
  { size: 2, direction: "row", startX: 10, startY: 435 },
  { size: 2, direction: "row", startX: 88, startY: 435 },
  { size: 2, direction: "row", startX: 167, startY: 435 },
  { size: 1, direction: "row", startX: 10, startY: 480 },
  { size: 1, direction: "row", startX: 55, startY: 480 },
  { size: 1, direction: "row", startX: 100, startY: 480 },
  { size: 1, direction: "row", startX: 145, startY: 480 },
];

class Game {
  mouse!: Mouse;
  draggedShip: any = null;
  draggedOffsetX = 0;
  draggedOffsetY = 0;

  // player!: BattlefieldView;
  // opponent!: BattlefieldView;

  // scenes!: any;

  // constructor(scenes: any) {

  // userData: any;
  userDataCopy: any;

  constructor(userData: any) {
    this.userDataCopy = userData;
    this.userDataCopy["player"] = new BattlefieldView();
    this.userDataCopy["opponent"] = new BattlefieldView();
    this.mouse = new Mouse(document.body);
    // const player = new BattlefieldView();
    // const opponent = new BattlefieldView();
    // Object.assign(this, { player, opponent });

    document.querySelector("[data-side='player']")?.append(userData["player"].root);
    document.querySelector("[data-side='opponent']")?.append(userData["opponent"].root);

    // for (const [sceneName, SceneClass] of Object.entries(scenes)) {
    //   this.scenes[sceneName] = new SceneClass(sceneName, this);
    // }
    this.init();
    // this.start();
    requestAnimationFrame(() => this.tick());
    this.update();
    this.userDataCopy.player.randomize(ShipView);
    console.log("userDataCopy: ", this.userDataCopy.player);
    console.log("userData: ", userData.player);
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    this.update();
    // console.log(this.mouse.left, this.mouse.pLeft);

    this.mouse.tick();
  }

  init() {
    for (const { size, direction, startX, startY } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY);
      this.userDataCopy["player"].addShip(ship);
    }
  }

  // start() {
  //   this.userDataCopy.player.randomize(ShipView);
  // }

  update() {
    // const { mouse, player }
    // const
    //mouse = this.mouse
    // player = this.userDataCopy.player
    if (!this.draggedShip && this.mouse.left && !this.mouse.pLeft) {
      const ship = this.userDataCopy.player.ships.find((ship: any) => ship.isUnder(this.mouse));

      if (ship) {
        const shipRect = ship.div.getBoundingClientRect();

        this.draggedShip = ship;
        this.draggedOffsetX = this.mouse.x - shipRect.left;
        this.draggedOffsetY = this.mouse.y - shipRect.top;
      }
    }

    if(this.mouse.left && this.draggedShip) {
      const { left, top } = this.userDataCopy.player.root.getBoundingClientRect();
      const x =this.mouse.x - left - this.draggedOffsetX;
      const y = this.mouse.y - top - this.draggedOffsetY;

      this.draggedShip.div.style.left = `${x}px`;
      this.draggedShip.div.style.top = `${y}px`;
    }

    if (!this.mouse.left && this.draggedShip) {
      const ship = this.draggedShip;
      this.draggedShip = null;

      const {left, top} = ship.div.getBoundingClientRect();
      const {width, height} = this.userDataCopy.player.cells[0][0].getBoundingClientRect();


      const point = {
        x: left + width / 2,
        y: top + height / 2,
      };

      const cell = this.userDataCopy.player.cells
        .flat()
        .find((cell: any) => utils.isUnderPoint(point, cell));

      if (cell) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        this.userDataCopy.player.removeShip(ship);
        this.userDataCopy.player.addShip(ship, x, y);
      } else {
        this.userDataCopy.player.removeShip(ship);
        this.userDataCopy.player.addShip(ship);
      }
    }

    if (this.draggedShip && this.mouse.delta) {
      this.draggedShip.toggleDirection();
    }
  }

  // start() {}
}

export default Game;
