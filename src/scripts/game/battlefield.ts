import Ship from "./ship";
import Utils from "./utils";
const utils = new Utils;

class Battlefield {
  ships: any[] = [];
  shots = [];

  _matrix: any = null;
  _changed = true;

  get matrix() {
    if (!this._changed) {
      this._matrix;
    }

    const matrix = [];

    for (let y = 0; y < 10; y++) {
      const row = [];

      for (let x = 0; x < 10; x++) {
        const item = {
          x,
          y,
          ship: null,
          free: true,
        };

        row.push(item);
      }

      matrix.push(row);
    }

    for (const ship of this.ships) {
      if (!ship.placed) {
        continue;
      }

      const { x, y } = ship;
      const dx = Number(ship.direction === "row");
      const dy = Number(ship.direction === "column");

      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;

        const item = matrix[cx][cy];
        item.ship = ship;
      }

      for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
        for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
          if (this.inField(x, y)) {
            const item = matrix[y][x];
            item.free = false;
          }
        }
      }
    }

    this._matrix = matrix;
    this._changed = false;
    return this._matrix;
  }

  inField(x: any, y: any) {
    const isNumber = (number: any) =>
      parseInt(number) === number && !isNaN(number) && ![Infinity, -Infinity].includes(number);

    if (!isNumber(x) || !isNumber(y)) {
      return false;
    }

    return 0 <= x && x < 10 && 0 <= y && y < 10;
  }
  //!!!!!!
  //!!!!!!!
  //!!!!!!!!!

  addShip(ship: any, x: any, y: any) {
    if (this.ships.includes(ship)) {
      return false;
    }

    this.ships.push(ship);

    if (this.inField(x, y)) {
      const dx = Number(ship.direction === "row");
      const dy = Number(ship.direction === "column");

      let placed = true;

      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;

        if (!this.inField(cx, cy)) {
          placed = false;
          break;
        }

        const item = this.matrix[cy][cx];
        if (!item.free) {
          placed = false;
          break;
        }
      }

      if (placed) {
        Object.assign(ship, { x, y });
      }
    }

    this._changed = true;
    return true;
  }

  removeShip(ship: any) {
    if (!this.ships.includes(ship)) {
      return false;
    }
    this.ships.splice(this.ships.indexOf(ship), 1);

    ship.x = null;
    ship.y = null;

    this._changed = true;
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice();

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }

  // addShot() {
  // this._changed = true;
  // }

  // removeShot() {
  //this._changed = true;
  // }

  // removeAllShots() {
  //   const shots = this.shots.slice();

  //   for (const shot of shots) {
  //     this.removeShot(shot);
  //   }

  //   return shots.length;
  // }

  randomize(ShipClass = Ship) {
    this.removeAllShips();

    for (let size = 4; size >= 1; size--) {
      for (let n = 0; n < 5 - size; n++) {
        const direction = utils.getRandomFrom("row", "column");
        const ship = new ShipClass(size, direction);

        while (!ship.placed) {
          const x = utils.getRandomBetween(0, 9);
          const y = utils.getRandomBetween(0, 9);

          this.removeShip(ship);
          this.addShip(ship, x, y); // - не тот addShip, а может и тот...
        }
      }
    }
  }
}

export default Battlefield;