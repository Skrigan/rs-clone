class Mouse {
  element = null;

  under = false;
  pUnder = false;

  x!: number;
  pX!: number;

  y!: number;
  pY!: number;

  left = false;
  pLeft = false;

  delta = 0;
  pDelta = 0;

  constructor(element: any) {
    this.element = element;

    const update = (e: any) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.under = true;
      this.delta = 0;
    };

    element.addEventListener("mousemove", (e: any) => {
      this.tick();
      update(e);
    });
    element.addEventListener("mouseenter", (e: any) => {
      this.tick();
      update(e);
    });
    element.addEventListener("mouseleave", (e: any) => {
      this.tick();
      update(e);
      this.under = false;
    });
    element.addEventListener("mousedown", (e: any) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = true;
      }
    });
    element.addEventListener("mouseup", (e: any) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = false;
      }
    });
    element.addEventListener("wheel", (e: any) => {
      this.tick();
      // update(e);
      this.x = e.clientX;
      this.y = e.clientY;
      this.delta = e.deltaY > 0 ? 1 : -1;
      this.under = true;
    });
  }

  tick() {
    this.pUnder = this.under;
    this.pX = this.x;
    this.pY = this.y;
    this.pLeft = this.left;
    this.pDelta = this.delta;
    this.delta = 0;
  }


}

export default Mouse;