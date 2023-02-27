import Ship from "./ship";
import Utils from "./utils";
const utils = new Utils;

class ShipView extends Ship {
  div: any = null;

  startX: any = null;
  startY: any = null;

  constructor(size: number, direction: string, startX: number, startY: number) {
    super(size, direction);

    const div = document.createElement("div");
    div.classList.add("ship");
    // this.div = div;
    Object.assign(this, { div, startX, startY });

    this.setDirection(direction, true);
  }


  setDirection(newDirection: any, force = false) {
    if (!force && this.direction === newDirection) {
      return false;
    }

    this.div.classList.remove(`ship_${this.direction}-${this.size}`);
    this.direction = newDirection;
    this.div.classList.add(`ship_${this.direction}-${this.size}`);

    return true;
  }

  isUnder(point: any) {
    return utils.isUnderPoint(point, this.div);
  }

  toggleDirection() {
    const newDirection = this.direction === "row" ? "column" : "row";
    this.setDirection(newDirection);
  }
}

export default ShipView;