class Utils {

  getRandomBetween(min: any, max: any) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  getRandomFrom(...args: any[]) {
    const index = Math.floor(Math.random() * args.length);
    return args[index];
  }

  isUnderPoint(point: any, element: any) {
    const { left, top, width, height } = element.getBoundingClientRect();
    const { x, y } = point;

    return left <= x && x <= left + width && top <= y && y <= top + height;
  }
}

export default Utils;


// function getRundomBetween(min: number, max: number) {
//   return min + Math.floor(Math.random() * (max - min + 1));
// }

// function getRandomArg(...args: any[]) {
//   return args[Math.floor(Math.random() * args.length)];
// }

// function isUnderPoint(point, element) {
//   const { left, top, width, height } = element.getBoundingClientRect();
//   const { x, y } = point;

//   return left <= x && x <= left + width && top <= y && y <= top + height;
// }