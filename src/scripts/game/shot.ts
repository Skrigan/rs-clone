class Shot {
  x = null;
  y = null;
  variant = null;

  constructor(x: any, y: any, variant = "miss") {
    Object.assign(this, { x, y, variant });
  }

  setVariant(variant: any) {
    this.variant = variant;
  }
} 

export default Shot;