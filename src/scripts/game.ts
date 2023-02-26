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
      this.activeScene = new OnlineScene(this.userData, this.mouse, this.activeScene);
      console.log("activeScene = ", this.activeScene);
      this.userData.socket.emit("findRandomOpponent");
    });
    document.querySelector("[data-type='challenge']")?.addEventListener("click", () => {
      this.activeScene = new OnlineScene(this.userData, this.mouse, this.activeScene);
      this.userData.socket.emit("challengeOpponent");
    });
    (document.querySelector("[data-action='gaveUp']") as HTMLButtonElement).addEventListener("click", () => {
      this.userData.socket.emit("gaveup");
    });
    (document.querySelector("[data-action='again']") as HTMLButtonElement).addEventListener("click", () => {
      this.userData.opponent.clear();
      this.userData.player.removeAllShots();
      this.userData.player.ships.forEach((ship: any) => (ship.killed = false));
      this.activeScene = new PreparationScene(this.userData, this.mouse);
      console.log("АКТИВКА: ", this.activeScene);
      document.querySelector(".game-status")!.textContent = "";


      const againBtn = document.querySelector("[data-action='again']") as HTMLButtonElement;
      const randomBtn = document.querySelector("[data-type='random']") as HTMLButtonElement;
      const challengeBtn = document.querySelector("[data-type='challenge']") as HTMLButtonElement;
      const takeChallengeBtn = document.querySelector("[data-type='takeChallenge']") as HTMLButtonElement;
      const manuallyBtn = document.querySelector("[data-action='manually']") as HTMLButtonElement;
      const randomizeBtn = document.querySelector("[data-action='randomize']") as HTMLButtonElement;
      document.querySelector(".app-actions")?.classList.remove("app-actions_online");
      document.querySelector("[data-side='opponent']")?.querySelector(".battlefield")?.classList.add("none");
      document.querySelector(".chap-page")?.classList.remove("chap-page__active");
      document.querySelector(".chat-wrapper")?.classList.remove("none");
      this.userData.socket.removeAllListeners("challengeOpponent");
      this.userData.socket.removeAllListeners("statusChange");
      this.userData.socket.removeAllListeners("turnUpdate");
      this.userData.socket.removeAllListeners("setShots");
      // this.userData.socket.removeAllListeners("challengeOpponent");
      againBtn.classList.add("none");
      againBtn.disabled = true;
      randomBtn.classList.remove("none");
      randomBtn.disabled = false;
      challengeBtn.classList.remove("none");
      challengeBtn.disabled = false;
      takeChallengeBtn.classList.remove("none");
      takeChallengeBtn.disabled = false;
      manuallyBtn.classList.remove("none");
      manuallyBtn.disabled = false;
      randomizeBtn.classList.remove("none");
      randomizeBtn.disabled = false;
    });

    this.activeScene = new PreparationScene(this.userData, this.mouse);
    this.activeScene.manually();
    document.querySelector("[data-action='manually']")?.addEventListener("click", () => this.activeScene.manually());
    document.querySelector("[data-action='randomize']")?.addEventListener("click", () => this.activeScene.start());
    document.querySelector("[data-type='takeChallenge']")?.addEventListener("click", () => {
      const hash = window.location.hash;
      if (hash) {
        this.activeScene = new OnlineScene(this.userData, this.mouse, this.activeScene);
        this.userData.socket.emit("challengeOpponent", hash.slice(1));
      }
    });
    requestAnimationFrame(() => this.tick());
    // console.log("hash: ", window.location.hash);

  }

  // startRandomGame() {
  //   document.querySelectorAll(".app-action").forEach((button: any) => button.disabled = true);
  // }

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
