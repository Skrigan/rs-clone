import BattlefieldView from "./game/battlefieldView";
import ShipView from "./game/shipView";
import ShotView from "./game/ShotView";
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
  userData: any;
  // activeScene: any;

  constructor(userData: any) {
    this.userData = userData;
    this.userData.player = new BattlefieldView(true);
    this.userData.opponent = new BattlefieldView(false);
    this.mouse = new Mouse(document.body);
    document.querySelector("[data-side='player']")?.append(this.userData.player.root);
    // setTimeout(() => console.log(this.userData.player.root.getBoundingClientRect()), 50);
    document.querySelector("[data-side='opponent']")?.append(this.userData.opponent.root);
    // this.init();

    requestAnimationFrame(() => this.tick());
    // this.update();
    setTimeout(() => this.start(), 80);
    document.querySelector("[data-action='manually']")?.addEventListener("click", () => this.manually());
    document.querySelector("[data-action='randomize']")?.addEventListener("click", () => this.start());
    document.querySelector("[data-type='random']")?.addEventListener("click", () => this.startRandomGame());
    // this.start();
    // console.log(userData);
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    // if (this.activeScene) {
    //   this.activeScene.update();
    // }
    this.update();

    this.mouse.tick();
  }

  // init() {
  //   for (const { size, direction, startX, startY } of shipDatas) {
  //     const ship = new ShipView(size, direction, startX, startY);
  //     this.userData.player.addShip(ship);
  //   }
  // }

  manually() {
    this.userData.player.removeAllShips();

    for (const { size, direction, startX, startY } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY);
      this.userData.player.addShip(ship);
    }
  }

  start() {
    this.userData.player.randomize(ShipView);

    for (let i = 0; i < 10; i++) {
      const ship = this.userData.player.ships[i];

      ship.startX = shipDatas[i].startX;
      ship.startY = shipDatas[i].startY;
    }
  }

  update() {
    console.log("tick");
    if (!this.draggedShip && this.mouse.left && !this.mouse.pLeft) {
      const ship = this.userData.player.ships.find((ship: any) => ship.isUnder(this.mouse));

      if (ship) {
        const shipRect = ship.div.getBoundingClientRect();

        this.draggedShip = ship;
        this.draggedOffsetX = this.mouse.x - shipRect.left;
        this.draggedOffsetY = this.mouse.y - shipRect.top;

        ship.x = null;
        ship.y = null;
      }
    }

    if (this.mouse.left && this.draggedShip) {
      const { left, top } = this.userData.player.root.getBoundingClientRect();
      const x = this.mouse.x - left - this.draggedOffsetX;
      const y = this.mouse.y - top - this.draggedOffsetY;

      this.draggedShip.div.style.left = `${x}px`;
      this.draggedShip.div.style.top = `${y}px`;
    }

    if (!this.mouse.left && this.draggedShip) {
      const ship = this.draggedShip;
      this.draggedShip = null;

      const { left, top } = ship.div.getBoundingClientRect();
      const { width, height } = this.userData.player.cells[0][0].getBoundingClientRect();


      const point = {
        x: left + width / 2,
        y: top + height / 2,
      };

      const cell = this.userData.player.cells
        .flat()
        .find((cell: any) => utils.isUnderPoint(point, cell));

      if (cell) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        this.userData.player.removeShip(ship);
        this.userData.player.addShip(ship, x, y);
      } else {
        this.userData.player.removeShip(ship);
        this.userData.player.addShip(ship);
      }
    }

    if (this.draggedShip && this.mouse.delta) {
      this.draggedShip.toggleDirection();
    }

    if (this.userData.player.complete) {
      (document.querySelector("[data-type='random']") as HTMLButtonElement).disabled = false;
      (document.querySelector("[data-type='challenge']") as HTMLButtonElement).disabled = false;
      (document.querySelector("[data-type='takeChallenge']") as HTMLButtonElement).disabled = false;
    } else {
      (document.querySelector("[data-type='random']") as HTMLButtonElement).disabled = true;
      (document.querySelector("[data-type='challenge']") as HTMLButtonElement).disabled = true;
      (document.querySelector("[data-type='takeChallenge']") as HTMLButtonElement).disabled = true;
    }

    const cells = this.userData.opponent.cells.flat();
    cells.forEach((cell: any) => cell.classList.remove("battlefield__item_active"));

    //наводка и выстрел
    // if (utils.isUnderPoint(this.mouse, this.userData.opponent.table)) {
    //   const cell = cells.find((cell: any) => utils.isUnderPoint(this.mouse, cell));
    //   if (cell) {
    //     cell.classList.add("battlefield__item_active");
    //     if (this.mouse.left && !this.mouse.pLeft) {
    //       const x = parseInt(cell.dataset.x);
    //       const y = parseInt(cell.dataset.y);

    //       // console.log(x, y);
    //       const shot = new ShotView(x, y);
    //       this.userData.opponent.addShot(shot);

    //     }
    //   }
    // }
  }

  startRandomGame() {
    document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true);
  }

  // start() {}
}

export default Game;
