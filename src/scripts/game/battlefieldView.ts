import Battlefield from "./battlefield";
import Utils from "./utils";
const utils: Utils = new Utils;

class BattlefieldView extends Battlefield {
  root!: any;
  table!: Node;
  dock!: any;
  polygon!: Node;

  cells: any[] = [];

  constructor() {
    super();
    const root = document.createElement("div");
    root.classList.add("battlefield");

    const table = document.createElement("table");
    table.classList.add("battlefield__table");

    const dock = document.createElement("div");
    dock.classList.add("battlefield__dock");

    const polygon = document.createElement("div");
    polygon.classList.add("battlefield__polygon");

    Object.assign(this, { root, table, dock, polygon });
    root.append(table, dock, polygon);

    for (let y = 0; y < 10; y++) {
      const row = [];
      const tr = document.createElement("tr");
      tr.classList.add("battlefield__tr");
      tr.dataset.y = `${y}`;

      for (let x = 0; x < 10; x++) {
        const td = document.createElement("td");
        td.classList.add("battlefield__item");
        Object.assign(td.dataset, { x, y });

        tr.append(td);
        row.push(td);
      }

      table.append(tr);
      this.cells.push(row);
    }

    for (let x = 0; x < 10; x++) {
      const cell = this.cells[0][x];
      const marker = document.createElement("div");

      marker.classList.add("marker", "marker__col");
      marker.textContent = "АБВГДЕЖЗИК"[x];

      cell.append(marker);
    }

    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement("div");

      marker.classList.add("marker", "marker__row");
      marker.textContent = `${y + 1}`;

      cell.append(marker);
    }
  }

  addShip(ship: any, x: any, y: any) {
    if (!super.addShip(ship, x, y)) {
      return false;
    }
    this.dock.appendChild(ship.div);

    if (ship.placed) {
      const cell = this.cells[y][x];
      const cellRect = cell.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      ship.div.style.left = `${cellRect.left - rootRect.left}px`;
      ship.div.style.top = `${cellRect.top - rootRect.top}px`;
    } else {
      ship.setDirection("row");
      ship.div.style.left = `${ship.startX}px`;
      ship.div.style.top = `${ship.startY}px`;
    }

    return true;
  }

  removeShip(ship: any) {
    if (!super.removeShip(ship)) {
      return false;
    }

    if (Array.prototype.includes.call(this.dock.children, ship.div)) {
      ship.div.remove();
    }

    return true;
  }

  isUnder(point: any) {
    return utils.isUnderPoint(point, this.root);
  }
}

export default BattlefieldView;